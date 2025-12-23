// i.js - PenguinMod AI bridge
class AIHandler {
  constructor() {
    this.ai = new FreeAIForAll();
  }

  // Returns a JSON response for text
  async getText({ prompt, model, seed, temperature, maxTokens }) {
    try {
      const config = { model, seed, temperature, maxTokens };
      const response = await this.ai.chat(prompt, config);
      return { success: true, type: "text", response };
    } catch (err) {
      return { success: false, type: "text", error: err.message };
    }
  }

  // Returns a JSON response for image
  async getImage({ prompt, model, seed, width = 1024, height = 1024 }) {
    try {
      const config = { model, seed, width, height };
      const imageUrl = await this.ai.generateImage(prompt, config);
      return { success: true, type: "image", url: imageUrl };
    } catch (err) {
      return { success: false, type: "image", error: err.message };
    }
  }
}

// Global instance
window.ai = new AIHandler();

// Example for PenguinMod: 
// ai.getText({ prompt: "Hello", model: "openai", seed: 123, temperature: 0.7, maxTokens: 500 })
// ai.getImage({ prompt: "Cosmic horror", model: "llama", seed: 42 })
