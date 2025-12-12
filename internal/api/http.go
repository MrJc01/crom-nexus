package api

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"time"

	"github.com/dop251/goja"
)

// HTTPModule wraps net/http for the Script
type HTTPModule struct {
	Client *http.Client
}

// NewHTTPModule creates a client with cookie support
func NewHTTPModule() *HTTPModule {
	jar, _ := cookiejar.New(nil)
	return &HTTPModule{
		Client: &http.Client{
			Jar:     jar,
			Timeout: 30 * time.Second,
		},
	}
}

// Register injects `Nexus.http`
func (h *HTTPModule) Register(vm *goja.Runtime, nexus *goja.Object) {
	httpObj := vm.NewObject()
	nexus.Set("http", httpObj)

	httpObj.Set("request", h.request)
	httpObj.Set("get", h.get)
	httpObj.Set("post", h.post)
}

func (h *HTTPModule) request(call goja.FunctionCall) goja.Value {
	// Args: { method, url, headers, body }
	opts := call.Argument(0).Export().(map[string]interface{})

	method := opts["method"].(string)
	url := opts["url"].(string)

	var bodyReader *bytes.Reader
	if body, ok := opts["body"]; ok {
		bodyReader = bytes.NewReader([]byte(body.(string)))
	} else {
		bodyReader = bytes.NewReader([]byte{})
	}

	req, _ := http.NewRequest(method, url, bodyReader)
	req.Header.Set("User-Agent", "Nexus/1.0 (Compatible; Golang)")

	if headers, ok := opts["headers"].(map[string]interface{}); ok {
		for k, v := range headers {
			req.Header.Set(k, v.(string))
		}
	}

	resp, err := h.Client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	bodyBytes, _ := ioutil.ReadAll(resp.Body)
	
	result := map[string]interface{}{
		"status": resp.StatusCode,
		"body":   string(bodyBytes),
	}

	return call.Runtime().ToValue(result)
}

func (h *HTTPModule) get(call goja.FunctionCall) goja.Value {
	url := call.Argument(0).String()
	// Reuse request logic by constructing map
	opts := map[string]interface{}{
		"method": "GET",
		"url":    url,
	}
	// Note: In a real implementation we would refactor to share internal logic efficiently
	// For MVP, we simply call the Go internal logic of request (if we separated it) or just use http.Get here
	
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", "Nexus/1.0 (Compatible; Golang)")
	
	resp, err := h.Client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)
	
	return call.Runtime().ToValue(map[string]interface{}{
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
	
	resp, err := h.Client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)
	
	return call.Runtime().ToValue(map[string]interface{}{
		"status": resp.StatusCode,
		"body":   string(bodyBytes),
	})
}
