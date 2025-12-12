package api

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/dop251/goja"
)

type SecureModule struct {
	ConfigDir string
	vm        *goja.Runtime
	key       []byte
}

func NewSecureModule(configDir string) *SecureModule {
	return &SecureModule{ConfigDir: configDir}
}

func (s *SecureModule) Register(vm *goja.Runtime, nexus *goja.Object) {
	s.vm = vm
	s.initKey()

	secObj := vm.NewObject()
	nexus.Set("secure", secObj)

	secObj.Set("set", s.set)
	secObj.Set("get", s.get)
}

func (s *SecureModule) initKey() {
	keyPath := filepath.Join(s.ConfigDir, "vault.key")
	if _, err := os.Stat(keyPath); os.IsNotExist(err) {
		// Generate new key
		key := make([]byte, 32) // AES-256
		if _, err := rand.Read(key); err != nil {
			fmt.Printf("Error generating secure key: %v\n", err)
			return
		}
		ioutil.WriteFile(keyPath, key, 0600)
		s.key = key
	} else {
		// Load existing key
		key, err := ioutil.ReadFile(keyPath)
		if err != nil {
			fmt.Printf("Error reading secure key: %v\n", err)
			return
		}
		s.key = key
	}
}

func (s *SecureModule) getVaultPath() string {
	return filepath.Join(s.ConfigDir, "vault.enc")
}

func (s *SecureModule) loadVault() map[string]string {
	vault := make(map[string]string)
	path := s.getVaultPath()

	if _, err := os.Stat(path); os.IsNotExist(err) {
		return vault
	}

	data, err := ioutil.ReadFile(path)
	if err != nil {
		return vault
	}

	json.Unmarshal(data, &vault)
	return vault
}

func (s *SecureModule) saveVault(vault map[string]string) {
	data, _ := json.MarshalIndent(vault, "", "  ")
	ioutil.WriteFile(s.getVaultPath(), data, 0600)
}

func (s *SecureModule) encrypt(plaintext string) (string, error) {
	c, err := aes.NewCipher(s.key)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(c)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)
	return hex.EncodeToString(ciphertext), nil
}

func (s *SecureModule) decrypt(ciphertextHex string) (string, error) {
	data, err := hex.DecodeString(ciphertextHex)
	if err != nil {
		return "", err
	}

	c, err := aes.NewCipher(s.key)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(c)
	if err != nil {
		return "", err
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", fmt.Errorf("ciphertext too short")
	}

	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

func (s *SecureModule) set(call goja.FunctionCall) goja.Value {
	key := call.Argument(0).String()
	value := call.Argument(1).String()

	encrypted, err := s.encrypt(value)
	if err != nil {
		panic(s.vm.ToValue("Encryption failed: " + err.Error()))
	}

	vault := s.loadVault()
	vault[key] = encrypted
	s.saveVault(vault)

	return goja.Undefined()
}

func (s *SecureModule) get(call goja.FunctionCall) goja.Value {
	key := call.Argument(0).String()

	vault := s.loadVault()
	encrypted, ok := vault[key]
	if !ok {
		return goja.Null()
	}

	decrypted, err := s.decrypt(encrypted)
	if err != nil {
		return goja.Null()
	}

	return s.vm.ToValue(decrypted)
}
