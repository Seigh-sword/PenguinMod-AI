/**
 * PangAIHandler.js - The Core Linker
 * Loads the syntax and injects community blocks from GitHub.
 */

export class PangAIHandler {
    constructor(Scratch) {
        this.Scratch = Scratch;
        this.baseUrl = "https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/refs/heads/main/extension/";
        this.syntax = null;
    }

    async boot() {
        console.log("PangAI: Connecting to GitHub...");
        
        // 1. Load the Syntax Engine
        try {
            const syntaxModule = await import(`${this.baseUrl}syntax.js`);
            this.syntax = new syntaxModule.PangCompiler();
            console.log("PangAI: Syntax Engine Loaded.");
        } catch (e) {
            console.error("PangAI: Failed to load Syntax.", e);
        }

        // 2. Load Base Blocks and Community Blocks
        // In the future, you can fetch a list from your SyntaxHelper.json
        await this.loadBlockFile(`${this.baseUrl}blocks/BaseBlocks.js`);
    }

    async loadBlockFile(url) {
        try {
            const blockModule = await import(url);
            if (blockModule.install) {
                blockModule.install(this);
            }
        } catch (e) {
            console.error(`PangAI: Could not load block file at ${url}`, e);
        }
    }
}
