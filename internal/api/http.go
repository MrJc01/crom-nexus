package api

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"time"

	"github.com/dop251/goja"
)

// HTTPModule wraps net/http for the Script
type HTTPModule struct {
	Client  *http.Client
	vm      *goja.Runtime
	Timeout time.Duration
	Retries int
}

// NewHTTPModule creates a client with cookie support
func NewHTTPModule() *HTTPModule {
	jar, _ := cookiejar.New(nil)
	return &HTTPModule{
		Client: &http.Client{
			Jar:     jar,
			Timeout: 30 * time.Second,
		},
		Timeout: 30 * time.Second,
		Retries: 3,
	}
}

// Register injects `Nexus.http`
func (h *HTTPModule) Register(vm *goja.Runtime, nexus *goja.Object) {
	h.vm = vm
	httpObj := vm.NewObject()
	nexus.Set("http", httpObj)

	httpObj.Set("request", h.request)
	httpObj.Set("get", h.get)
	httpObj.Set("post", h.post)
	httpObj.Set("setTimeout", h.setTimeout)
	httpObj.Set("setRetries", h.setRetries)
}

// setTimeout configures request timeout
func (h *HTTPModule) setTimeout(call goja.FunctionCall) goja.Value {
	ms := call.Argument(0).ToInteger()
	h.Timeout = time.Duration(ms) * time.Millisecond
	h.Client.Timeout = h.Timeout
	return goja.Undefined()
}

// setRetries configures retry count
func (h *HTTPModule) setRetries(call goja.FunctionCall) goja.Value {
	h.Retries = int(call.Argument(0).ToInteger())
	return goja.Undefined()
}

// doWithRetry executes request with retry logic
func (h *HTTPModule) doWithRetry(req *http.Request) (*http.Response, error) {
	var resp *http.Response
	var err error

	for i := 0; i <= h.Retries; i++ {
		resp, err = h.Client.Do(req)
		if err == nil {
			return resp, nil
		}
		if i < h.Retries {
			time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
		}
	}
	return nil, fmt.Errorf("failed after %d retries: %v", h.Retries, err)
}

func (h *HTTPModule) request(call goja.FunctionCall) goja.Value {
	opts := call.Argument(0).Export().(map[string]interface{})
	method := opts["method"].(string)
	url := opts["url"].(string)

	var bodyReader *bytes.Reader
	if body, ok := opts["body"]; ok {
		bodyReader = bytes.NewReader([]byte(body.(string)))
	} else {
		bodyReader = bytes.NewReader([]byte{})
	}

	// Check for custom timeout
	if timeout, ok := opts["timeout"]; ok {
		if ms, ok := timeout.(int64); ok {
			h.Client.Timeout = time.Duration(ms) * time.Millisecond
		}
	}

	req, _ := http.NewRequest(method, url, bodyReader)
	req.Header.Set("User-Agent", "Nexus/1.0 (Compatible; Golang)")

	if headers, ok := opts["headers"].(map[string]interface{}); ok {
		for k, v := range headers {
			req.Header.Set(k, v.(string))
		}
	}

	resp, err := h.doWithRetry(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	return h.vm.ToValue(map[string]interface{}{
		"status": resp.StatusCode,
		"body":   string(bodyBytes),
	})
}

func (h *HTTPModule) get(call goja.FunctionCall) goja.Value {
	url := call.Argument(0).String()

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", "Nexus/1.0 (Compatible; Golang)")

	resp, err := h.doWithRetry(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	return h.vm.ToValue(map[string]interface{}{
		"status": resp.StatusCode,
		"body":   string(bodyBytes),
	})
}

func (h *HTTPModule) post(call goja.FunctionCall) goja.Value {
	url := call.Argument(0).String()
	data := call.Argument(1).String()

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer([]byte(data)))
	req.Header.Set("User-Agent", "Nexus/1.0 (Compatible; Golang)")
	req.Header.Set("Content-Type", "application/json")

	resp, err := h.doWithRetry(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	return h.vm.ToValue(map[string]interface{}{
		"status": resp.StatusCode,
		"body":   string(bodyBytes),
	})
}
