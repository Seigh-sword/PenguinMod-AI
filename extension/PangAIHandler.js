import { PangCompiler } from './syntax.js';

export class PangAIHandler {
    constructor(Scratch) {
        this.runtime = Scratch;
        this.compiler = new PangCompiler();
        this.baseUrl = "https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/refs/heads/main/extension/";
        this.icon = "https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/refs/heads/main/assets/PangAI-Icon.png";
    }

    async boot() {
        // Load the BaseBlocks.js file which contains all 20+ blocks
        await this.loadBlockFile(`${this.baseUrl}blocks/BaseBlocks.js`);
        
        // Start a loop to check if AI is online (for Hat Blocks)
        this.startStatusLoop();
    }

    async loadBlockFile(url) {
        try {
            const module = await import(url);
            if (module.install) module.install(this);
        } catch (e) {
            console.error("PangAI: Failed to load blocks from", url, e);
        }
    }

    startStatusLoop() {
        setInterval(() => {
            const isReady = this.compiler.engine.isReady();
            // This triggers the hat blocks in PenguinMod
            this.runtime.startHats('PangAI_whenStatusChanges', {
                status: isReady ? 'connected' : 'disconnected'
            });
        }, 5000); // Check every 5 seconds
    }
}
