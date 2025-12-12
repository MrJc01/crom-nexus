package api

import (
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"

	"github.com/dop251/goja"
)

type SysModule struct {
	BaseDir string
	vm      *goja.Runtime
}

func NewSysModule(baseDir string) *SysModule {
	return &SysModule{BaseDir: baseDir}
}

func (s *SysModule) Register(vm *goja.Runtime, nexus *goja.Object) {
	s.vm = vm
	sysObj := vm.NewObject()
	nexus.Set("sys", sysObj)

	sysObj.Set("open", s.open)
	sysObj.Set("save", s.save)
	sysObj.Set("load", s.load)
	sysObj.Set("exists", s.exists)
	sysObj.Set("listDir", s.listDir)
	sysObj.Set("mkdir", s.mkdir)
	sysObj.Set("remove", s.remove)
	sysObj.Set("env", s.env)
	sysObj.Set("download", s.download)

	// Clipboard placeholder
	sysObj.Set("clipboard", map[string]interface{}{
		"write": func(text string) {},
	})
}

func (s *SysModule) open(call goja.FunctionCall) goja.Value {
	url := call.Argument(0).String()
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start", url}
	case "darwin":
		cmd = "open"
		args = []string{url}
	default:
		cmd = "xdg-open"
		args = []string{url}
	}

	exec.Command(cmd, args...).Start()
	return goja.Undefined()
}

func (s *SysModule) save(call goja.FunctionCall) goja.Value {
	filename := call.Argument(0).String()
	data := call.Argument(1).String()
	path := filepath.Join(s.BaseDir, filename)
	ioutil.WriteFile(path, []byte(data), 0644)
	return goja.Undefined()
}

func (s *SysModule) load(call goja.FunctionCall) goja.Value {
	filename := call.Argument(0).String()
	path := filepath.Join(s.BaseDir, filename)
	content, err := ioutil.ReadFile(path)
	if err != nil {
		return goja.Null()
	}
	return s.vm.ToValue(string(content))
}

func (s *SysModule) exists(call goja.FunctionCall) goja.Value {
	filename := call.Argument(0).String()
	path := filepath.Join(s.BaseDir, filename)
	_, err := os.Stat(path)
	return s.vm.ToValue(err == nil)
}

func (s *SysModule) listDir(call goja.FunctionCall) goja.Value {
	dirname := call.Argument(0).String()
	if dirname == "" {
		dirname = "."
	}
	path := filepath.Join(s.BaseDir, dirname)

	files, err := ioutil.ReadDir(path)
	if err != nil {
		return s.vm.ToValue([]interface{}{})
	}

	var result []map[string]interface{}
	for _, f := range files {
		result = append(result, map[string]interface{}{
			"name":  f.Name(),
			"isDir": f.IsDir(),
			"size":  f.Size(),
		})
	}
	return s.vm.ToValue(result)
}

func (s *SysModule) mkdir(call goja.FunctionCall) goja.Value {
	dirname := call.Argument(0).String()
	path := filepath.Join(s.BaseDir, dirname)
	err := os.MkdirAll(path, 0755)
	return s.vm.ToValue(err == nil)
}

func (s *SysModule) remove(call goja.FunctionCall) goja.Value {
	filename := call.Argument(0).String()
	path := filepath.Join(s.BaseDir, filename)
	err := os.Remove(path)
	return s.vm.ToValue(err == nil)
}

func (s *SysModule) env(call goja.FunctionCall) goja.Value {
	key := call.Argument(0).String()
	return s.vm.ToValue(os.Getenv(key))
}

func (s *SysModule) download(call goja.FunctionCall) goja.Value {
	url := call.Argument(0).String()
	filename := call.Argument(1).String()

	// Ensure downloads directory exists
	downloadDir := filepath.Join(s.BaseDir, "downloads")
	os.MkdirAll(downloadDir, 0755)

	path := filepath.Join(downloadDir, filename)

	resp, err := http.Get(url)
	if err != nil {
		return s.vm.ToValue(false)
	}
	defer resp.Body.Close()

	out, err := os.Create(path)
	if err != nil {
		return s.vm.ToValue(false)
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return s.vm.ToValue(err == nil)
}
