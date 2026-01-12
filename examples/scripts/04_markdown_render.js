// =====================================================
// 04_markdown_render.js - Renderização de Markdown
// Demonstra: Nexus.tui.markdown para rich text
// =====================================================

Nexus.tui.title("Renderização de Markdown");

// O markdown é renderizado com cores e formatação usando Glamour
Nexus.tui.markdown(`
# Heading 1

## Heading 2

### Heading 3

Este é um parágrafo normal com **texto em negrito** e *texto em itálico*.

---

## Citações

> Esta é uma citação em bloco (blockquote).
> Pode ter múltiplas linhas.

---

## Listas

### Lista não ordenada
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3

### Lista ordenada
1. Primeiro
2. Segundo
3. Terceiro

---

## Código

Código inline: \`console.log("hello")\`

Bloco de código:
\`\`\`javascript
function hello(name) {
    return "Hello, " + name + "!";
}
\`\`\`

---

## Links e Formatação

- Link: [GitHub](https://github.com)
- ~~Texto riscado~~
- Linha horizontal abaixo:

---

🎉 **O Nexus suporta Markdown completo no terminal!**
`);

Nexus.tui.box("✅ Markdown renderizado com sucesso!");
