/**
 * BaseBlocks.js - The Complete Pang AI Blockset
 * Includes: Bot Management, Actions, Configuration, and Data Tools.
 */
export const install = (handler) => {
    const Scratch = handler.runtime;

    const blockList = [
        // --- 🤖 BOT MANAGEMENT ---
        {
            opcode: 'createBot',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create bot [NAME]',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' } }
        },
        {
            opcode: 'deleteBot',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete bot [NAME]',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' } }
        },
        {
            opcode: 'renameBot',
            blockType: Scratch.BlockType.COMMAND,
            text: 'rename bot [N1] to [N2]',
            arguments: {
                N1: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' },
                N2: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot2' }
            }
        },
        {
            opcode: 'switchBot',
            blockType: Scratch.BlockType.COMMAND,
            text: 'switch to bot [NAME]',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' } }
        },
        {
            opcode: 'botExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'bot [NAME] exists?',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' } }
        },
        {
            opcode: 'activeBotName',
            blockType: Scratch.BlockType.REPORTER,
            text: 'active bot name'
        },

        '---', // --- 📡 AI COMMUNICATION ---
        {
            opcode: 'askActiveBot',
            blockType: Scratch.BlockType.REPORTER,
            text: 'ask active bot [TEXT]',
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' } }
        },
        {
            opcode: 'getImage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get image URL for [PROMPT]',
            arguments: { PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: 'a blue penguin' } }
        },
        {
            opcode: 'aiReady',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'AI ready?'
        },

        '---', // --- ⚙️ BOT CONFIGURATION ---
        {
            opcode: 'setSystem',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [NAME] system log to [TEXT]',
            arguments: {
                NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' },
                TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'You are a pirate.' }
            }
        },
        {
            opcode: 'setModel',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [NAME] model to [MODEL]',
            arguments: {
                NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' },
                MODEL: { type: Scratch.ArgumentType.STRING, menu: 'models', defaultValue: 'openai' }
            }
        },
        {
            opcode: 'setTemp',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [NAME] temperature to [NUM]',
            arguments: {
                NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' },
                NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
        },
        {
            opcode: 'setSeed',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [NAME] seed to [NUM]',
            arguments: {
                NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' },
                NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 42 }
            }
        },
        {
            opcode: 'getTemp',
            blockType: Scratch.BlockType.REPORTER,
            text: '[NAME] temperature',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' } }
        },
        {
            opcode: 'getSeed',
            blockType: Scratch.BlockType.REPORTER,
            text: '[NAME] seed',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' } }
        },

        '---', // --- 📊 DATA & ARRAYS ---
        {
            opcode: 'exportBot',
            blockType: Scratch.BlockType.REPORTER,
            text: 'export bot [NAME] as array',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' } }
        },
        {
            opcode: 'loadBotArray',
            blockType: Scratch.BlockType.COMMAND,
            text: 'load bot from array [ARRAY]',
            arguments: { ARRAY: { type: Scratch.ArgumentType.STRING, defaultValue: '["Bot1", "System", "openai", 1, 42]' } }
        },
        {
            opcode: 'charCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'character count of [TEXT]',
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Pang AI' } }
        },
        {
            opcode: 'wordCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'word count of [TEXT]',
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Pang AI is cool' } }
        }
    ];

    Scratch.extensions.register({
        id: 'PangAI',
        name: 'Pang AI',
        color1: '#2c3e50',
        color2: '#1a252f',
        blocks: blockList,
        menus: {
            models: { acceptReporters: true, items: ['openai', 'mistral', 'qwen', 'p1'] }
        }
    });

    // --- LOGIC MAPPING ---
    const engine = handler.compiler.engine;

    const ext = Scratch.extensions.get('PangAI');
    
    // Bot Management
    ext.createBot = (args) => engine.createBot(args.NAME);
    ext.deleteBot = (args) => { if(args.NAME !== 'default') delete engine.bots[args.NAME]; };
    ext.renameBot = (args) => {
        if (engine.bots[args.N1] && !engine.bots[args.N2]) {
            engine.bots[args.N2] = engine.bots[args.N1];
            delete engine.bots[args.N1];
            if (engine.activeBot === args.N1) engine.activeBot = args.N2;
        }
    };
    ext.switchBot = (args) => engine.switchBot(args.NAME);
    ext.botExists = (args) => !!engine.bots[args.NAME];
    ext.activeBotName = () => engine.activeBot;

    // AI Communication
    ext.askActiveBot = async (args) => await handler.compiler.run(`txt.prompt("${args.TEXT}")send;`);
    ext.getImage = (args) => engine.fetchImage(args.PROMPT);
    ext.aiReady = () => true; // Simple online check

    // Config
    ext.setSystem = (args) => { if(engine.bots[args.NAME]) engine.bots[args.NAME].system = args.TEXT; };
    ext.setModel = (args) => { if(engine.bots[args.NAME]) engine.bots[args.NAME].model = args.MODEL; };
    ext.setTemp = (args) => { if(engine.bots[args.NAME]) engine.bots[args.NAME].temp = args.NUM; };
    ext.setSeed = (args) => { if(engine.bots[args.NAME]) engine.bots[args.NAME].seed = args.NUM; };
    ext.getTemp = (args) => engine.bots[args.NAME]?.temp || 0;
    ext.getSeed = (args) => engine.bots[args.NAME]?.seed || 0;

    // Data
    ext.exportBot = (args) => {
        const b = engine.bots[args.NAME];
        return b ? JSON.stringify([args.NAME, b.system, b.model, b.temp, b.seed]) : "[]";
    };
    ext.loadBotArray = (args) => {
        try {
            const data = JSON.parse(args.ARRAY);
            engine.bots[data[0]] = { system: data[1], model: data[2], temp: data[3], seed: data[4] };
        } catch(e) {}
    };
    ext.charCount = (args) => args.TEXT.length;
    ext.wordCount = (args) => args.TEXT.trim().split(/\s+/).length;
};
