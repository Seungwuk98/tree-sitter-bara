package tree_sitter_bara_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_bara "github.com/seungwuk98/tree-sitter-bara.git/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_bara.Language())
	if language == nil {
		t.Errorf("Error loading Bara grammar")
	}
}
