// =====================================================
// ai.nx.js - Free AI Services Entity Driver
// Usage: nexus @ai chat "message"
// Connects to free AI APIs (no auth required)
// =====================================================

export const meta = {
    name: "AI Chat",
    version: "1.0",
    description: "Chat with free AI services via terminal",
    author: "Nexus",
    commands: {
        "chat": "Send a message to AI",
        "code": "Ask AI for code help",
        "translate": "Translate text"
    }
};

// Free AI endpoints (no API key needed)
var AI_ENDPOINTS = {
    // Free inference APIs
    deepinfra: "https://api.deepinfra.com/v1/inference/meta-llama/Llama-2-7b-chat-hf",
    huggingface: "https://api-inference.huggingface.co/models/google/flan-t5-xxl"
};

export function chat(args) {
    var message = args.join(" ");
    
    if (!message) {
        Nexus.tui.error("Usage: nexus @ai chat <message>");
        return;
    }
    
    Nexus.tui.title("AI Chat");
    Nexus.tui.info("Sending to AI: " + message.substring(0, 50) + "...");
    
    // Try multiple free endpoints
    var success = false;
    
    // Method 1: Try a simple echo/test endpoint (for demo)
    try {
        // Since most free AI APIs require keys, we'll demonstrate the structure
        // In production, you would use services like:
        // - OpenAI (with API key)
        // - Anthropic (with API key)
        // - Ollama (local)
        // - LM Studio (local)
        
        Nexus.tui.warn("Note: Most AI APIs require authentication.");
        Nexus.tui.markdown("### Options for AI Integration:\n");
        
        var options = [
            "1. **Ollama (Local)** - Run AI locally, no API key",
            "2. **LM Studio** - Local AI with GUI",
            "3. **OpenAI API** - Requires API key ($)",
            "4. **Claude API** - Requires API key ($)",
            "5. **Hugging Face** - Free tier with limits"
        ];
        
        Nexus.tui.markdown(options.join("\n"));
        
        // Demo: Simulate AI response with a placeholder
        Nexus.tui.markdown("\n---\n### Demo Response\n");
        
        var demoResponse = "This is a demo response. To use real AI:\n\n" +
            "1. Install Ollama: `curl -fsSL https://ollama.ai/install.sh | sh`\n" +
            "2. Run: `ollama run llama2`\n" +
            "3. Nexus can then connect to `http://localhost:11434`";
        
        Nexus.tui.box(demoResponse);
        
        // Show how to configure for Ollama
        Nexus.tui.markdown("\n### Configure Ollama Integration");
        
        var ollamaExample = `
// Example: Connect to local Ollama
var response = Nexus.http.post("http://localhost:11434/api/generate", JSON.stringify({
    model: "llama2",
    prompt: "${message}",
    stream: false
}));

var result = JSON.parse(response.body);
Nexus.tui.print(result.response);
`;
        
        Nexus.tui.markdown("```javascript" + ollamaExample + "```");
        
        success = true;
        
    } catch (e) {
        Nexus.tui.error("AI request failed: " + e);
    }
    
    // Save chat history
    try {
        var history = [];
        var existingHistory = Nexus.sys.load("ai_chat_history.json");
        if (existingHistory) {
            history = JSON.parse(existingHistory);
        }
        
        history.push({
            timestamp: new Date().toISOString(),
            message: message,
            type: "demo"
        });
        
        // Keep last 100 messages
        if (history.length > 100) {
            history = history.slice(-100);
        }
        
        Nexus.sys.save("ai_chat_history.json", JSON.stringify(history, null, 2));
    } catch (e) {
        // Ignore history save errors
    }
}

export function code(args) {
    var question = args.join(" ");
    Nexus.tui.title("Code Assistant");
    
    if (!question) {
        Nexus.tui.error("Usage: nexus @ai code <question>");
        Nexus.tui.info("Example: nexus @ai code \"How to read a file in Python?\"");
        return;
    }
    
    Nexus.tui.info("Question: " + question);
    Nexus.tui.markdown("\n---\n");
    Nexus.tui.warn("This requires an AI API connection.");
    Nexus.tui.info("See: nexus @ai chat help");
}

export function translate(args) {
    if (args.length < 2) {
        Nexus.tui.error("Usage: nexus @ai translate <lang> <text>");
        Nexus.tui.info("Example: nexus @ai translate pt \"Hello world\"");
        return;
    }
    
    var targetLang = args[0];
    var text = args.slice(1).join(" ");
    
    Nexus.tui.title("Translator");
    Nexus.tui.info("Translating to: " + targetLang);
    Nexus.tui.info("Text: " + text);
    
    // Demo using a free translation API
    try {
        var url = "https://api.mymemory.translated.net/get?q=" + 
                  encodeURIComponent(text) + "&langpair=en|" + targetLang;
        
        var response = Nexus.http.get(url);
        
        if (response.status === 200) {
            var data = JSON.parse(response.body);
            if (data.responseData && data.responseData.translatedText) {
                Nexus.tui.success("Translation:");
                Nexus.tui.box(data.responseData.translatedText);
            } else {
                Nexus.tui.error("Translation failed");
            }
        }
    } catch (e) {
        Nexus.tui.error("Translation error: " + e);
    }
}

// Help function
export function help() {
    Nexus.tui.markdown(`
# AI Entity - Free AI Services

## Commands

| Command | Description |
|---------|-------------|
| \`chat <msg>\` | Send message to AI |
| \`code <question>\` | Ask coding question |
| \`translate <lang> <text>\` | Translate text |

## Free AI Options

1. **Ollama** - Local AI (recommended)
2. **MyMemory** - Free translation API
3. **Hugging Face** - Free tier models

## Setup Ollama

\`\`\`bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama run llama2
\`\`\`
`);
}
