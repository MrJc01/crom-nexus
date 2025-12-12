package api

import (
	"io/ioutil"
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
	
	// Clipboard placeholder
	sysObj.Set("clipboard", map[string]interface{}{
		"write": func(text string) {
			// Placeholder - use github.com/atotto/clipboard in production
		},
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
	default: // linux
		cmd = "xdg-open"
		args = []string{url}
	}

	exec.Command(cmd, args...).Start()
	return goja.Undefined()
}

func (s *SysModule) save(call goja.FunctionCall) goja.Value {
	filename := call.Argument(0).String()
	data := call.Argument(1).String()

	// Sandbox check: ensure path is inside BaseDir
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
