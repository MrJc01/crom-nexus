package config

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

// Config represents ~/.nexus/config.json
type Config struct {
	Entities map[string]string `json:"entities"` // name -> filename
}

type Manager struct {
	HomeDir   string
	ConfigDir string
	Config    *Config
}

func NewManager() (*Manager, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}
	configDir := filepath.Join(home, ".nexus")
	scriptsDir := filepath.Join(configDir, "scripts")

	// Ensure dirs exist
	os.MkdirAll(scriptsDir, 0755)

	m := &Manager{
		HomeDir:   home,
		ConfigDir: configDir,
		Config: &Config{
			Entities: make(map[string]string),
		},
	}

	m.load()
	return m, nil
}

func (m *Manager) load() {
	path := filepath.Join(m.ConfigDir, "config.json")
	data, err := ioutil.ReadFile(path)
	if err == nil {
		json.Unmarshal(data, m.Config)
	}
}

func (m *Manager) Save() error {
	path := filepath.Join(m.ConfigDir, "config.json")
	data, _ := json.MarshalIndent(m.Config, "", "  ")
	return ioutil.WriteFile(path, data, 0644)
}

func (m *Manager) AddEntity(name string, scriptName string) {
	m.Config.Entities[name] = scriptName
	m.Save()
}

func (m *Manager) RemoveEntity(name string) {
	delete(m.Config.Entities, name)
	m.Save()
}

func (m *Manager) GetScriptPath(name string) (string, bool) {
	filename, ok := m.Config.Entities[name]
	if !ok {
		return "", false
	}
	return filepath.Join(m.ConfigDir, "scripts", filename), true
}

func (m *Manager) InstallScript(name string, content string) error {
	filename := name + ".js"
	path := filepath.Join(m.ConfigDir, "scripts", filename)
	err := ioutil.WriteFile(path, []byte(content), 0644)
	if err != nil {
		return err
	}
	m.AddEntity(name, filename)
	return nil
}
