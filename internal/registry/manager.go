package registry

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

const DefaultRegistryURL = "https://raw.githubusercontent.com/MrJc01/nexus-scripts/main/registry.json"

type RegistryEntry struct {
	URL         string `json:"url"`
	Description string `json:"description"`
}

type RegistryIndex map[string]RegistryEntry

// Resolve finds the script URL for a given entity name
func Resolve(name string, customRegistryURL string) (string, error) {
	registryURL := DefaultRegistryURL
	if customRegistryURL != "" {
		registryURL = customRegistryURL
	}

	resp, err := http.Get(registryURL)
	if err != nil {
		return "", fmt.Errorf("failed to fetch registry: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("registry returned status: %d", resp.StatusCode)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read registry body: %v", err)
	}

	var index RegistryIndex
	if err := json.Unmarshal(body, &index); err != nil {
		return "", fmt.Errorf("failed to parse registry json: %v", err)
	}

	entry, ok := index[name]
	if !ok {
		return "", fmt.Errorf("entity @%s not found in registry", name)
	}

	return entry.URL, nil
}
