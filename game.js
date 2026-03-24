/* ===== COSMIC PLASMA — GAME ENGINE ===== */

// ─── Number Formatter ───
const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
    'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'OcDc', 'NoDc', 'Vg'];

function fmt(n) {
    if (n < 0) return '-' + fmt(-n);
    if (n < 1000) return Math.floor(n).toString();
    const tier = Math.min(Math.floor(Math.log10(n) / 3), SUFFIXES.length - 1);
    const scaled = n / Math.pow(10, tier * 3);
    return (scaled < 10 ? scaled.toFixed(2) : scaled < 100 ? scaled.toFixed(1) : scaled.toFixed(0)) + SUFFIXES[tier];
}

// ─── Generator Definitions ───
const GENERATOR_DEFS = [
    { id: 'spark',      name: 'Spark',         icon: '✦',  baseCost: 10,       baseOutput: 1,         costMult: 1.12, unlockAt: 0 },
    { id: 'ember',      name: 'Ember',          icon: '🔥', baseCost: 120,      baseOutput: 5,         costMult: 1.14, unlockAt: 100 },
    { id: 'flare',      name: 'Solar Flare',    icon: '☀️', baseCost: 1400,     baseOutput: 22,        costMult: 1.15, unlockAt: 1200 },
    { id: 'arc',        name: 'Plasma Arc',     icon: '⚡', baseCost: 18000,    baseOutput: 100,       costMult: 1.16, unlockAt: 15000 },
    { id: 'fusion',     name: 'Fusion Core',    icon: '🌀', baseCost: 250000,   baseOutput: 500,       costMult: 1.17, unlockAt: 200000 },
    { id: 'nova',       name: 'Nova Burst',     icon: '💥', baseCost: 3.6e6,    baseOutput: 2800,      costMult: 1.18, unlockAt: 3e6 },
    { id: 'pulsar',     name: 'Pulsar Engine',  icon: '🌟', baseCost: 5.5e7,    baseOutput: 18000,     costMult: 1.19, unlockAt: 4.5e7 },
    { id: 'quasar',     name: 'Quasar',         icon: '🌌', baseCost: 9e8,      baseOutput: 130000,    costMult: 1.20, unlockAt: 7e8 },
    { id: 'nebula',     name: 'Nebula Forge',   icon: '🔮', baseCost: 1.5e10,   baseOutput: 1e6,       costMult: 1.21, unlockAt: 1e10 },
    { id: 'singularity',name: 'Singularity',    icon: '🕳️', baseCost: 3e11,     baseOutput: 8.5e6,     costMult: 1.22, unlockAt: 2e11 },
];

// ─── Upgrade Definitions ───
const UPGRADE_DEFS = [
    { id: 'click1',   name: 'Focused Tap',        icon: '👆', desc: 'Click power x2',                cost: 100,      effect: () => { game.clickMultiplier *= 2; }, req: () => game.stats.totalClicks >= 10 },
    { id: 'click2',   name: 'Charged Fingers',     icon: '⚡', desc: 'Click power x3',                cost: 5000,     effect: () => { game.clickMultiplier *= 3; }, req: () => game.stats.totalClicks >= 100 },
    { id: 'click3',   name: 'Plasma Fist',         icon: '👊', desc: 'Click power x5',                cost: 500000,   effect: () => { game.clickMultiplier *= 5; }, req: () => game.stats.totalClicks >= 500 },
    { id: 'gen1',     name: 'Spark Overcharge',     icon: '✦',  desc: 'Sparks produce 3x',             cost: 500,      effect: () => { game.genMultipliers.spark *= 3; }, req: () => getGenCount('spark') >= 10 },
    { id: 'gen2',     name: 'Ember Catalyst',       icon: '🔥', desc: 'Embers produce 3x',              cost: 6000,     effect: () => { game.genMultipliers.ember *= 3; }, req: () => getGenCount('ember') >= 10 },
    { id: 'gen3',     name: 'Flare Amplifier',      icon: '☀️', desc: 'Solar Flares produce 3x',        cost: 70000,    effect: () => { game.genMultipliers.flare *= 3; }, req: () => getGenCount('flare') >= 10 },
    { id: 'gen4',     name: 'Arc Intensifier',      icon: '⚡', desc: 'Plasma Arcs produce 3x',         cost: 900000,   effect: () => { game.genMultipliers.arc *= 3; }, req: () => getGenCount('arc') >= 10 },
    { id: 'gen5',     name: 'Fusion Optimizer',     icon: '🌀', desc: 'Fusion Cores produce 3x',        cost: 1.2e7,    effect: () => { game.genMultipliers.fusion *= 3; }, req: () => getGenCount('fusion') >= 10 },
    { id: 'gen6',     name: 'Nova Capacitor',       icon: '💥', desc: 'Nova Bursts produce 3x',         cost: 1.8e8,    effect: () => { game.genMultipliers.nova *= 3; }, req: () => getGenCount('nova') >= 10 },
    { id: 'gen7',     name: 'Pulsar Regulator',     icon: '🌟', desc: 'Pulsar Engines produce 3x',      cost: 2.8e9,    effect: () => { game.genMultipliers.pulsar *= 3; }, req: () => getGenCount('pulsar') >= 10 },
    { id: 'gen8',     name: 'Quasar Condenser',     icon: '🌌', desc: 'Quasars produce 3x',             cost: 4.5e10,   effect: () => { game.genMultipliers.quasar *= 3; }, req: () => getGenCount('quasar') >= 10 },
    { id: 'all1',     name: 'Cosmic Resonance',     icon: '🪐', desc: 'All generators produce 2x',      cost: 1e7,      effect: () => { game.globalGenMultiplier *= 2; }, req: () => game.stats.totalPlasma >= 5e6 },
    { id: 'all2',     name: 'Dimensional Flux',     icon: '🌊', desc: 'All generators produce 3x',      cost: 1e9,      effect: () => { game.globalGenMultiplier *= 3; }, req: () => game.stats.totalPlasma >= 5e8 },
    { id: 'all3',     name: 'Infinite Echo',        icon: '♾️', desc: 'All generators produce 5x',      cost: 1e12,     effect: () => { game.globalGenMultiplier *= 5; }, req: () => game.stats.totalPlasma >= 5e11 },
    { id: 'click4',   name: 'Quantum Touch',        icon: '🫴', desc: 'Clicks give 1% of your /sec',    cost: 1e8,      effect: () => { game.clickPercentOfRate = 0.01; }, req: () => game.stats.totalClicks >= 2000 },
];

// ─── Shard Upgrade Definitions (permanent, persist through prestige) ───
const SHARD_UPGRADE_DEFS = [
    { id: 'shardClick',   name: 'Stellar Touch',    icon: '✋', desc: 'x2 click power per level',  baseCost: 2,  costMult: 2,  maxLvl: 10, effect: (lvl) => Math.pow(2, lvl) },
    { id: 'shardGen',     name: 'Cosmic Flow',       icon: '🌊', desc: 'x1.5 all production per lvl', baseCost: 3,  costMult: 2.5, maxLvl: 15, effect: (lvl) => Math.pow(1.5, lvl) },
    { id: 'shardStart',   name: 'Head Start',        icon: '🚀', desc: 'Start with 10^lvl plasma',   baseCost: 5,  costMult: 3,   maxLvl: 8,  effect: (lvl) => Math.pow(10, lvl) },
    { id: 'shardPrestige', name: 'Shard Magnet',     icon: '🧲', desc: '+25% prestige shards/lvl',   baseCost: 10, costMult: 3,   maxLvl: 10, effect: (lvl) => 1 + 0.25 * lvl },
    { id: 'shardAuto',    name: 'Auto Clicker',      icon: '🤖', desc: '1 auto-click/sec per lvl',    baseCost: 4,  costMult: 2,   maxLvl: 20, effect: (lvl) => lvl },
];

// ─── Game State ───
function createFreshState() {
    const gens = {};
    GENERATOR_DEFS.forEach(g => gens[g.id] = 0);
    const genMults = {};
    GENERATOR_DEFS.forEach(g => genMults[g.id] = 1);
    return {
        plasma: 0,
        totalPlasmaThisRun: 0,
        clickMultiplier: 1,
        clickPercentOfRate: 0,
        globalGenMultiplier: 1,
        generators: gens,
        genMultipliers: genMults,
        upgrades: [],
        // Prestige
        cosmicShards: 0,
        totalShardsEarned: 0,
        prestigeCount: 0,
        shardUpgrades: {},
        // Stats
        stats: {
            totalPlasma: 0,
            totalClicks: 0,
            clickPlasma: 0,
            genPlasma: 0,
            startTime: Date.now(),
        },
    };
}

let game = createFreshState();

// ─── Helpers ───
function getGenCount(id) { return game.generators[id] || 0; }

function getGenCost(def) {
    return Math.ceil(def.baseCost * Math.pow(def.costMult, game.generators[def.id]));
}

function getGenOutput(def) {
    const shardGenMult = getShardEffect('shardGen');
    const shardBonus = 1 + game.cosmicShards * 0.05; // base 5% per shard
    return def.baseOutput * (game.genMultipliers[def.id] || 1) * game.globalGenMultiplier * shardBonus * shardGenMult;
}

function getTotalRate() {
    let rate = 0;
    GENERATOR_DEFS.forEach(def => {
        rate += getGenOutput(def) * game.generators[def.id];
    });
    return rate;
}

function getClickPower() {
    const shardClickMult = getShardEffect('shardClick');
    let base = game.clickMultiplier * shardClickMult;
    const shardBonus = 1 + game.cosmicShards * 0.05;
    base *= shardBonus;
    if (game.clickPercentOfRate > 0) {
        base += getTotalRate() * game.clickPercentOfRate;
    }
    return Math.max(1, base);
}

function getPrestigeShardsEarned() {
    const shardPrestigeMult = getShardEffect('shardPrestige');
    return Math.floor(Math.sqrt(game.totalPlasmaThisRun / 1e6) * shardPrestigeMult);
}

function getShardUpgradeCost(def) {
    const lvl = game.shardUpgrades[def.id] || 0;
    return Math.ceil(def.baseCost * Math.pow(def.costMult, lvl));
}

function getShardEffect(id) {
    const def = SHARD_UPGRADE_DEFS.find(d => d.id === id);
    if (!def) return 1;
    const lvl = game.shardUpgrades[def.id] || 0;
    return def.effect(lvl);
}

// ─── Click Handler ───
function handleClick(e) {
    const power = getClickPower();
    game.plasma += power;
    game.totalPlasmaThisRun += power;
    game.stats.totalPlasma += power;
    game.stats.totalClicks++;
    game.stats.clickPlasma += power;
    spawnClickText(power);
    updateUI();
}

function spawnClickText(amount) {
    const btn = document.getElementById('plasma-click-btn');
    const rect = btn.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'click-float';
    el.textContent = '+' + fmt(amount);
    el.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 40) + 'px';
    el.style.top = (rect.top - 5) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
}

// ─── Buy Generator ───
function buyGenerator(id) {
    const def = GENERATOR_DEFS.find(g => g.id === id);
    const cost = getGenCost(def);
    if (game.plasma >= cost) {
        game.plasma -= cost;
        game.generators[def.id]++;
        updateUI();
    }
}

// Buy max generators
function buyMaxGenerator(id) {
    const def = GENERATOR_DEFS.find(g => g.id === id);
    let bought = 0;
    while (true) {
        const cost = getGenCost(def);
        if (game.plasma >= cost) {
            game.plasma -= cost;
            game.generators[def.id]++;
            bought++;
        } else break;
    }
    if (bought > 0) updateUI();
}

// ─── Buy Upgrade ───
function buyUpgrade(id) {
    const def = UPGRADE_DEFS.find(u => u.id === id);
    if (!def || game.upgrades.includes(id)) return;
    if (game.plasma >= def.cost) {
        game.plasma -= def.cost;
        game.upgrades.push(id);
        def.effect();
        showToast(`Purchased: ${def.name}`);
        updateUI();
    }
}

// ─── Buy Shard Upgrade ───
function buyShardUpgrade(id) {
    const def = SHARD_UPGRADE_DEFS.find(u => u.id === id);
    if (!def) return;
    const lvl = game.shardUpgrades[def.id] || 0;
    if (lvl >= def.maxLvl) return;
    const cost = getShardUpgradeCost(def);
    if (game.cosmicShards >= cost) {
        game.cosmicShards -= cost;
        game.shardUpgrades[def.id] = lvl + 1;
        showToast(`Shard Upgrade: ${def.name} → Lv.${lvl + 1}`);
        updateUI();
    }
}

// ─── Prestige ───
function doPrestige() {
    const shardsEarned = getPrestigeShardsEarned();
    if (shardsEarned <= 0) return;
    if (!confirm(`Prestige for ${fmt(shardsEarned)} Cosmic Shards? All generators, upgrades, and plasma will reset.`)) return;

    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'prestige-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 1100);

    // Keep persistent stuff
    const shards = game.cosmicShards + shardsEarned;
    const totalShards = game.totalShardsEarned + shardsEarned;
    const pCount = game.prestigeCount + 1;
    const shardUpgs = { ...game.shardUpgrades };
    const totalPlasmaAll = game.stats.totalPlasma;
    const totalClicks = game.stats.totalClicks;
    const startTime = game.stats.startTime;

    // Reset
    game = createFreshState();
    game.cosmicShards = shards;
    game.totalShardsEarned = totalShards;
    game.prestigeCount = pCount;
    game.shardUpgrades = shardUpgs;
    game.stats.totalPlasma = totalPlasmaAll;
    game.stats.totalClicks = totalClicks;
    game.stats.startTime = startTime;

    // Head Start bonus
    const headStart = getShardEffect('shardStart');
    if (headStart > 1) {
        game.plasma = headStart;
        game.totalPlasmaThisRun = headStart;
    }

    showToast(`✨ Prestiged! +${fmt(shardsEarned)} Cosmic Shards`);
    renderAll();
    updateUI();
    saveGame();
}

// ─── Tab System ───
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
}

// ─── Render Generator Cards ───
function renderGenerators() {
    const container = document.getElementById('generators-list');
    container.innerHTML = '';
    GENERATOR_DEFS.forEach(def => {
        const isLocked = game.stats.totalPlasma < def.unlockAt && game.generators[def.id] === 0;
        const cost = getGenCost(def);
        const output = getGenOutput(def);
        const count = game.generators[def.id];

        const card = document.createElement('div');
        card.className = 'generator-card' + (isLocked ? ' locked' : '');
        card.innerHTML = `
            <div class="gen-icon">${def.icon}</div>
            <div class="gen-info">
                <div class="gen-name">${isLocked ? '???' : def.name}</div>
                <div class="gen-details">${isLocked ? `Unlocks at ${fmt(def.unlockAt)} total plasma` : `Each: ${fmt(output)}/s`}</div>
                <div class="gen-output">${isLocked ? '' : `Total: ${fmt(output * count)}/s`}</div>
            </div>
            <div class="gen-buy-section">
                <span class="gen-count" id="gen-count-${def.id}">${count}</span>
                <button class="gen-buy-btn" id="gen-buy-${def.id}" 
                    onclick="buyGenerator('${def.id}')"
                    ondblclick="buyMaxGenerator('${def.id}')"
                    ${game.plasma < cost || isLocked ? 'disabled' : ''}>
                    ${fmt(cost)}
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ─── Render Upgrade Cards ───
function renderUpgrades() {
    const container = document.getElementById('upgrades-list');
    container.innerHTML = '';
    UPGRADE_DEFS.forEach(def => {
        const owned = game.upgrades.includes(def.id);
        const visible = owned || def.req();
        if (!visible) return;

        const card = document.createElement('div');
        card.className = 'upgrade-card' + (owned ? ' purchased' : '');
        card.innerHTML = `
            <div class="upg-icon">${def.icon}</div>
            <div class="upg-info">
                <div class="upg-name">${def.name}</div>
                <div class="upg-desc">${def.desc}</div>
            </div>
            ${owned ? '<span style="color:var(--accent-green);font-family:var(--font-display);font-size:0.7rem;">OWNED</span>' :
                `<button class="upg-buy-btn" onclick="buyUpgrade('${def.id}')" ${game.plasma < def.cost ? 'disabled' : ''}>${fmt(def.cost)}</button>`}
        `;
        container.appendChild(card);
    });

    if (container.children.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:30px;">Keep playing to unlock upgrades…</p>';
    }
}

// ─── Render Shard Upgrades ───
function renderShardUpgrades() {
    const container = document.getElementById('shard-upgrades-list');
    container.innerHTML = '';
    SHARD_UPGRADE_DEFS.forEach(def => {
        const lvl = game.shardUpgrades[def.id] || 0;
        const maxed = lvl >= def.maxLvl;
        const cost = getShardUpgradeCost(def);

        const card = document.createElement('div');
        card.className = 'shard-card' + (maxed ? ' maxed' : '');
        card.innerHTML = `
            <div class="shard-icon">${def.icon}</div>
            <div class="shard-info">
                <div class="shard-name">${def.name}</div>
                <div class="shard-desc">${def.desc}</div>
                <div class="shard-level">Lv. ${lvl} / ${def.maxLvl}</div>
            </div>
            ${maxed ? '<span style="color:var(--accent-green);font-family:var(--font-display);font-size:0.7rem;">MAX</span>' :
                `<button class="shard-buy-btn" onclick="buyShardUpgrade('${def.id}')" ${game.cosmicShards < cost ? 'disabled' : ''}>💎 ${cost}</button>`}
        `;
        container.appendChild(card);
    });
}

// ─── Update UI (numbers only, no DOM rebuild) ───
function updateUI() {
    // Plasma display
    document.getElementById('plasma-amount').textContent = fmt(game.plasma);
    const rate = getTotalRate();
    document.getElementById('plasma-rate').textContent = fmt(rate) + ' / sec';
    document.getElementById('click-power-display').textContent = fmt(getClickPower());

    // Header badges
    document.getElementById('shard-count').textContent = fmt(game.cosmicShards);
    document.getElementById('prestige-level').textContent = game.prestigeCount;
    const totalMult = (1 + game.cosmicShards * 0.05) * game.globalGenMultiplier * getShardEffect('shardGen');
    document.getElementById('multiplier-display').textContent = 'x' + totalMult.toFixed(2);

    // Generator buy buttons
    GENERATOR_DEFS.forEach(def => {
        const cost = getGenCost(def);
        const btn = document.getElementById('gen-buy-' + def.id);
        const countEl = document.getElementById('gen-count-' + def.id);
        if (btn) {
            btn.disabled = game.plasma < cost;
            btn.textContent = fmt(cost);
        }
        if (countEl) countEl.textContent = game.generators[def.id];
    });

    // Prestige preview
    const shardsEarned = getPrestigeShardsEarned();
    document.getElementById('prestige-shards-preview').textContent = fmt(shardsEarned);
    document.getElementById('prestige-shards-total').textContent = fmt(game.cosmicShards + shardsEarned);
    const newShards = game.cosmicShards + shardsEarned;
    const newMult = (1 + newShards * 0.05);
    document.getElementById('prestige-new-mult').textContent = 'x' + newMult.toFixed(2);
    document.getElementById('prestige-btn').disabled = shardsEarned <= 0;

    // Stats
    document.getElementById('stat-total-plasma').textContent = fmt(game.stats.totalPlasma);
    document.getElementById('stat-total-clicks').textContent = fmt(game.stats.totalClicks);
    document.getElementById('stat-click-plasma').textContent = fmt(game.stats.clickPlasma);
    document.getElementById('stat-gen-plasma').textContent = fmt(game.stats.genPlasma);
    document.getElementById('stat-prestiges').textContent = game.prestigeCount;
    document.getElementById('stat-total-shards').textContent = fmt(game.totalShardsEarned);
    document.getElementById('stat-multiplier').textContent = 'x' + totalMult.toFixed(2);

    const elapsed = Math.floor((Date.now() - game.stats.startTime) / 1000);
    const hrs = Math.floor(elapsed / 3600);
    const mins = Math.floor((elapsed % 3600) / 60);
    const secs = elapsed % 60;
    document.getElementById('stat-playtime').textContent =
        hrs > 0 ? `${hrs}h ${mins}m ${secs}s` : mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function renderAll() {
    renderGenerators();
    renderUpgrades();
    renderShardUpgrades();
    updateUI();
}

// ─── Game Loop ───
let lastTick = Date.now();

function tick() {
    const now = Date.now();
    const dt = (now - lastTick) / 1000;
    lastTick = now;

    // Generator production
    const rate = getTotalRate();
    const produced = rate * dt;
    if (produced > 0) {
        game.plasma += produced;
        game.totalPlasmaThisRun += produced;
        game.stats.totalPlasma += produced;
        game.stats.genPlasma += produced;
    }

    // Auto-clicker from shard upgrade
    const autoClicks = getShardEffect('shardAuto');
    if (autoClicks > 0) {
        const power = getClickPower() * autoClicks * dt;
        game.plasma += power;
        game.totalPlasmaThisRun += power;
        game.stats.totalPlasma += power;
        game.stats.clickPlasma += power;
    }

    updateUI();
}

// Re-render generators/upgrades less frequently
let slowTickCounter = 0;
function slowTick() {
    slowTickCounter++;
    if (slowTickCounter % 5 === 0) {
        renderGenerators();
        renderUpgrades();
        renderShardUpgrades();
    }
}

// ─── Toast Notifications ───
function showToast(msg) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// ─── Save / Load ───
function saveGame() {
    const data = {
        plasma: game.plasma,
        totalPlasmaThisRun: game.totalPlasmaThisRun,
        clickMultiplier: game.clickMultiplier,
        clickPercentOfRate: game.clickPercentOfRate,
        globalGenMultiplier: game.globalGenMultiplier,
        generators: game.generators,
        genMultipliers: game.genMultipliers,
        upgrades: game.upgrades,
        cosmicShards: game.cosmicShards,
        totalShardsEarned: game.totalShardsEarned,
        prestigeCount: game.prestigeCount,
        shardUpgrades: game.shardUpgrades,
        stats: game.stats,
        savedAt: Date.now(),
    };
    localStorage.setItem('cosmicPlasma_save', JSON.stringify(data));
}

function loadGame() {
    const raw = localStorage.getItem('cosmicPlasma_save');
    if (!raw) return false;
    try {
        const data = JSON.parse(raw);
        game = createFreshState();
        // Merge saved data
        Object.keys(data).forEach(key => {
            if (key === 'generators' || key === 'genMultipliers' || key === 'stats' || key === 'shardUpgrades') {
                Object.assign(game[key], data[key]);
            } else if (key !== 'savedAt') {
                game[key] = data[key];
            }
        });

        // Re-apply upgrades effects
        const owned = [...game.upgrades];
        game.upgrades = [];
        game.clickMultiplier = 1;
        game.clickPercentOfRate = 0;
        game.globalGenMultiplier = 1;
        GENERATOR_DEFS.forEach(g => game.genMultipliers[g.id] = 1);
        owned.forEach(id => {
            const def = UPGRADE_DEFS.find(u => u.id === id);
            if (def) {
                game.upgrades.push(id);
                def.effect();
            }
        });

        // Offline production
        if (data.savedAt) {
            const offlineSecs = (Date.now() - data.savedAt) / 1000;
            if (offlineSecs > 2) {
                const rate = getTotalRate();
                const offlinePlasma = rate * offlineSecs * 0.5; // 50% offline efficiency
                if (offlinePlasma > 0) {
                    game.plasma += offlinePlasma;
                    game.stats.totalPlasma += offlinePlasma;
                    game.stats.genPlasma += offlinePlasma;
                    setTimeout(() => showToast(`⏰ Offline: +${fmt(offlinePlasma)} plasma (${Math.floor(offlineSecs)}s)`), 500);
                }
            }
        }
        return true;
    } catch (e) {
        console.error('Failed to load save:', e);
        return false;
    }
}

function hardReset() {
    if (!confirm('This will DELETE ALL progress permanently. Are you sure?')) return;
    if (!confirm('Really? This cannot be undone!')) return;
    localStorage.removeItem('cosmicPlasma_save');
    game = createFreshState();
    renderAll();
    showToast('🗑️ Game reset.');
}

// ─── Particle Background ───
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.4 + 0.1,
            hue: Math.random() * 60 + 240, // purples & blues
        });
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
            ctx.fill();

            // Glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha * 0.15})`;
            ctx.fill();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ─── Init ───
function init() {
    loadGame();
    renderAll();
    initParticles();

    // Fast tick: 50ms (20fps game logic)
    setInterval(tick, 50);
    // Slow tick: 1s (re-render cards)
    setInterval(slowTick, 1000);
    // Auto-save every 30s
    setInterval(saveGame, 30000);
}

init();
