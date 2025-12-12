package api

import (
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/dop251/goja"
)

type DOMModule struct{}

func NewDOMModule() *DOMModule {
	return &DOMModule{}
}

func (d *DOMModule) Register(vm *goja.Runtime, nexus *goja.Object) {
	domObj := vm.NewObject()
	nexus.Set("dom", domObj)

	domObj.Set("parse", d.parse)
}

func (d *DOMModule) parse(call goja.FunctionCall) goja.Value {
	htmlStr := call.Argument(0).String()
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(htmlStr))
	if err != nil {
		panic(err)
	}

	// Wrapper object for Document
	docWrapper := map[string]interface{}{
		"select": func(call2 goja.FunctionCall) goja.Value {
			selector := call2.Argument(0).String()
			selection := doc.Find(selector)

			// Map selection to array of objects
			var results []map[string]interface{}
			selection.Each(func(i int, s *goquery.Selection) {
				el := map[string]interface{}{
					"text": func() string { return s.Text() },
					"html": func() string { h, _ := s.Html(); return h },
					"attr": func(name string) string { val, _ := s.Attr(name); return val },
				}
				results = append(results, el)
			})

			return call.Runtime().ToValue(results)
		},
	}

	return call.Runtime().ToValue(docWrapper)
}
