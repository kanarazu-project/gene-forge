/**
 * Gene-Forge v7.0 Debug Panel
 * Ctrl+Shift+D で表示/非表示切替
 */

const DebugPanel = {
    visible: false,
    panel: null,
    logs: [],
    maxLogs: 50,

    init() {
        this.createPanel();
        this.hookErrors();
        this.hookConsole();
        this.addKeyboardShortcut();
        this.refresh();
        console.log('[DebugPanel] Initialized - Press Ctrl+Shift+D to toggle');
    },

    createPanel() {
        // タッチ用フローティングボタン
        const fab = document.createElement('div');
        fab.id = 'debug-fab';
        fab.innerHTML = '🔧';
        fab.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: #222;
            color: #0f0;
            border: 2px solid #0f0;
            border-radius: 50%;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99998;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,255,0,0.3);
        `;
        fab.addEventListener('click', () => this.toggle());
        document.body.appendChild(fab);

        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML = `
            <style>
                #debug-panel {
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    right: 10px;
                    max-height: 80vh;
                    background: rgba(0,0,0,0.95);
                    color: #0f0;
                    font-family: monospace;
                    font-size: 12px;
                    padding: 12px;
                    border-radius: 8px;
                    z-index: 99999;
                    overflow-y: auto;
                    display: none;
                    border: 1px solid #0f0;
                }
                #debug-panel.visible { display: block; }
                #debug-panel h3 { margin: 0 0 8px; color: #0ff; font-size: 13px; }
                #debug-panel .section { margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #333; }
                #debug-panel .ok { color: #0f0; }
                #debug-panel .err { color: #f00; }
                #debug-panel .warn { color: #ff0; }
                #debug-panel .log-entry { padding: 2px 0; border-bottom: 1px solid #222; word-break: break-all; }
                #debug-panel .log-error { color: #f66; }
                #debug-panel .log-warn { color: #ff0; }
                #debug-panel .log-info { color: #6cf; }
                #debug-panel button { background: #333; color: #fff; border: 1px solid #666; padding: 4px 8px; margin: 2px; cursor: pointer; font-size: 10px; }
                #debug-panel button:hover { background: #555; }
                #debug-panel .close-btn { position: absolute; top: 5px; right: 10px; background: #600; }
            </style>
            <button class="close-btn" onclick="DebugPanel.toggle()">✕</button>
            <h3>🔧 Gene-Forge Debug Panel</h3>
            <div class="section" id="debug-status"></div>
            <div class="section" id="debug-versions"></div>
            <div class="section">
                <strong>Actions:</strong><br>
                <button onclick="DebugPanel.testGeneticsEngine()">Test GeneticsEngine</button>
                <button onclick="DebugPanel.testBreeding()">Test Breeding</button>
                <button onclick="DebugPanel.clearLogs()">Clear Logs</button>
                <button onclick="DebugPanel.refresh()">Refresh</button>
            </div>
            <div class="section">
                <strong>Console Logs:</strong>
                <div id="debug-logs"></div>
            </div>
        `;
        document.body.appendChild(panel);
        this.panel = panel;
    },

    toggle() {
        this.visible = !this.visible;
        this.panel.classList.toggle('visible', this.visible);
        if (this.visible) this.refresh();
    },

    refresh() {
        this.updateStatus();
        this.updateVersions();
        this.renderLogs();
    },

    updateStatus() {
        const checks = [
            ['GeneticsEngine', typeof GeneticsEngine !== 'undefined'],
            ['LINKAGE_GROUPS', typeof LINKAGE_GROUPS !== 'undefined'],
            ['LOCI_MASTER', typeof LOCI_MASTER !== 'undefined'],
            ['COLOR_MASTER', typeof COLOR_MASTER !== 'undefined'],
            ['COLOR_LABELS', typeof COLOR_LABELS !== 'undefined'],
            ['BreedingEngine', typeof BreedingEngine !== 'undefined'],
            ['BirdDB', typeof BirdDB !== 'undefined'],
            ['Pedigree', typeof Pedigree !== 'undefined'],
            ['Planner', typeof Planner !== 'undefined'],
            ['Family', typeof Family !== 'undefined'],
        ];

        const html = '<strong>Object Status:</strong><br>' + checks.map(([name, ok]) =>
            `<span class="${ok ? 'ok' : 'err'}">${ok ? '✓' : '✗'} ${name}</span>`
        ).join('<br>');

        document.getElementById('debug-status').innerHTML = html;
    },

    updateVersions() {
        const versions = [];
        try { versions.push(`GeneticsEngine: ${GeneticsEngine?.VERSION || 'N/A'}`); } catch(e) { versions.push('GeneticsEngine: ERROR'); }
        try { versions.push(`BreedingEngine: ${BreedingEngine?.VERSION || 'N/A'}`); } catch(e) { versions.push('BreedingEngine: ERROR'); }
        try { versions.push(`BirdDB: ${BirdDB?.VERSION || 'N/A'}`); } catch(e) { versions.push('BirdDB: ERROR'); }

        let linkageInfo = 'N/A';
        try {
            if (typeof LINKAGE_GROUPS !== 'undefined') {
                linkageInfo = Object.keys(LINKAGE_GROUPS).join(', ');
            }
        } catch(e) { linkageInfo = 'ERROR'; }
        versions.push(`LINKAGE_GROUPS: ${linkageInfo}`);

        document.getElementById('debug-versions').innerHTML =
            '<strong>Versions:</strong><br>' + versions.map(v => `  ${v}`).join('<br>');
    },

    hookErrors() {
        window.addEventListener('error', (e) => {
            this.addLog('error', `${e.message} at ${e.filename}:${e.lineno}:${e.colno}`);
        });
        window.addEventListener('unhandledrejection', (e) => {
            this.addLog('error', `Unhandled Promise: ${e.reason}`);
        });
    },

    hookConsole() {
        const origError = console.error;
        const origWarn = console.warn;
        const origLog = console.log;

        console.error = (...args) => {
            this.addLog('error', args.map(a => this.stringify(a)).join(' '));
            origError.apply(console, args);
        };
        console.warn = (...args) => {
            this.addLog('warn', args.map(a => this.stringify(a)).join(' '));
            origWarn.apply(console, args);
        };
        console.log = (...args) => {
            this.addLog('info', args.map(a => this.stringify(a)).join(' '));
            origLog.apply(console, args);
        };
    },

    stringify(obj) {
        if (typeof obj === 'string') return obj;
        try {
            return JSON.stringify(obj, null, 0).substring(0, 200);
        } catch(e) {
            return String(obj);
        }
    },

    addLog(type, message) {
        const time = new Date().toLocaleTimeString();
        this.logs.unshift({ time, type, message });
        if (this.logs.length > this.maxLogs) this.logs.pop();
        if (this.visible) this.renderLogs();
    },

    renderLogs() {
        const container = document.getElementById('debug-logs');
        if (!container) return;
        container.innerHTML = this.logs.map(log =>
            `<div class="log-entry log-${log.type}">[${log.time}] ${log.message}</div>`
        ).join('');
    },

    clearLogs() {
        this.logs = [];
        this.renderLogs();
    },

    addKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
            }
        });
    },

    testGeneticsEngine() {
        try {
            if (typeof GeneticsEngine === 'undefined') {
                this.addLog('error', 'GeneticsEngine is undefined!');
                return;
            }
            const testGeno = { cinnamon: '+cin', ino: '+ino', opaline: '++' };
            const haps = GeneticsEngine.genotypeToHaplotypes(testGeno, 'male', 'cis');
            this.addLog('info', `genotypeToHaplotypes OK: ${JSON.stringify(haps.Z_chromosome?.haplotypes?.length)} haplotypes`);

            const gametes = GeneticsEngine.calculateGameteFrequencies(haps.Z_chromosome, 'Z_chromosome');
            this.addLog('info', `calculateGameteFrequencies OK: ${gametes.length} gametes`);
        } catch(e) {
            this.addLog('error', `GeneticsEngine test failed: ${e.message}`);
        }
    },

    testBreeding() {
        try {
            if (typeof BreedingEngine === 'undefined') {
                this.addLog('error', 'BreedingEngine is undefined!');
                return;
            }
            this.addLog('info', `BreedingEngine.useLinkage = ${BreedingEngine.useLinkage}`);
            this.addLog('info', `BreedingEngine.VERSION = ${BreedingEngine.VERSION}`);
        } catch(e) {
            this.addLog('error', `BreedingEngine test failed: ${e.message}`);
        }
    }
};

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => DebugPanel.init());
