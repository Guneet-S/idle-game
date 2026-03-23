const GEM_VALUES = [1, 5, 25, 125, 625, 3125];

const CONTAINERS_DEF = [
  { id: 'mine', name: 'Mine', icon: '🏭', cost: 0, input: -1, output: 0, baseSpeed: 5000 },
  { id: 'cut1', name: 'Stone Cutter', icon: '🪨', cost: 50, input: 0, output: 1, baseSpeed: 8000 },
  { id: 'cut2', name: 'Polisher', icon: '✨', cost: 250, input: 1, output: 2, baseSpeed: 12000 },
  { id: 'cut3', name: 'Precision Cut', icon: '💎', cost: 1000, input: 2, output: 3, baseSpeed: 18000 },
  { id: 'cut4', name: 'Crystal Forge', icon: '🔮', cost: 5000, input: 3, output: 4, baseSpeed: 25000 },
  { id: 'cut5', name: 'Prism Refiner', icon: '🌟', cost: 25000, input: 4, output: 5, baseSpeed: 35000 }
];

let cash = 10;
let rateHistory = [{time: Date.now(), cash}];

// Live State
let processors = CONTAINERS_DEF.map((def, i) => ({
  ...def,
  unlocked: i === 0, // Only mine is unlocked by default
  inventory: 0,
  level: 1, 
  speedLvl: 1, effLvl: 1, capLvl: 1,
  maxProgress: def.baseSpeed, progress: 0,
  currentBatch: 0,
  dom: null 
}));

const cashEl = document.getElementById("cash-value");
const rateValEl = document.getElementById("cash-rate-value");
const mineBtn = document.getElementById("manual-mine-btn");
const listEl = document.getElementById("containers-list");
const template = document.getElementById("container-template");

function initUI() {
  listEl.innerHTML = '';
  processors.forEach((p, index) => {
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector('.container-card');
    p.dom = card;
    
    // Header
    card.querySelector('.container-icon').textContent = p.icon;
    card.querySelector('.container-name').textContent = p.name;
    
    // Inventory
    if (p.input === -1) {
      card.querySelector('.inventory-box').style.display = 'none';
    }

    // Locked Overlay
    const overlay = card.querySelector('.locked-overlay');
    if (!p.unlocked) {
      card.classList.add('locked');
      overlay.querySelector('.locked-text').textContent = p.name;
      const unlockBtn = overlay.querySelector('.unlock-btn');
      unlockBtn.querySelector('span').textContent = formatCashNumber(p.cost);
      unlockBtn.onclick = () => {
        if (cash >= p.cost) {
          cash -= p.cost;
          p.unlocked = true;
          updateUIVisuals();
        }
      };
    }

    // Wiring upgrade buttons
    const speedBtn = card.querySelector('.speed-btn');
    speedBtn.onclick = () => {
      const cost = getSpeedCost(p);
      if (cash >= cost) { cash -= cost; p.speedLvl++; p.level++; p.maxProgress = Math.max(200, p.baseSpeed * Math.pow(0.85, p.speedLvl - 1)); updateUIVisuals(); }
    };
    
    const effBtn = card.querySelector('.eff-btn');
    effBtn.onclick = () => {
      const cost = getEffCost(p);
      if (cash >= cost) { cash -= cost; p.effLvl++; p.level++; updateUIVisuals(); }
    };
    
    const capBtn = card.querySelector('.cap-btn');
    capBtn.onclick = () => {
      const cost = getCapCost(p);
      if (cash >= cost) { cash -= cost; p.capLvl++; p.level++; updateUIVisuals(); }
    };

    listEl.appendChild(card);
  });
  
  updateUIVisuals();
}

function getSpeedCost(p) { return Math.floor((p.cost || 10) * Math.pow(1.5, p.speedLvl)); }
function getEffCost(p) { return Math.floor((p.cost || 10) * 2.5 * Math.pow(1.6, p.effLvl)); }
function getCapCost(p) { return Math.floor((p.cost || 10) * 5.0 * Math.pow(1.8, p.capLvl)); }

function updateUIVisuals() {
  cashEl.textContent = formatCashNumber(Math.floor(cash));
  
  processors.forEach((p) => {
    const card = p.dom;
    if (!card) return;
    
    // Unlock UI
    const overlay = card.querySelector('.locked-overlay');
    if (p.unlocked) {
      card.classList.remove('locked');
      overlay.style.display = 'none';
    } else {
      card.classList.add('locked');
      overlay.style.display = 'flex';
      const unlockBtn = overlay.querySelector('.unlock-btn');
      if (cash >= p.cost) unlockBtn.classList.remove('disabled');
      else unlockBtn.classList.add('disabled');
    }
    
    card.querySelector('.level-val').textContent = p.level;
    if (p.input !== -1) card.querySelector('.inv-amount').textContent = p.inventory;
    
    const sCost = getSpeedCost(p);
    const eCost = getEffCost(p);
    const cCost = getCapCost(p);
    
    const sBtn = card.querySelector('.speed-btn');
    sBtn.querySelector('.upg-cost').textContent = '$' + formatCashNumber(sCost);
    sBtn.querySelector('.upg-eff').textContent = (p.maxProgress / 1000).toFixed(1) + 's';
    if (cash >= sCost) sBtn.classList.remove('disabled'); else sBtn.classList.add('disabled');
    
    const eBtn = card.querySelector('.eff-btn');
    eBtn.querySelector('.upg-cost').textContent = '$' + formatCashNumber(eCost);
    eBtn.querySelector('.upg-eff').textContent = ((p.effLvl - 1) * 5) + '%';
    if (cash >= eCost && p.effLvl <= 20) eBtn.classList.remove('disabled'); else eBtn.classList.add('disabled');
    
    const cBtn = card.querySelector('.cap-btn');
    cBtn.querySelector('.upg-cost').textContent = '$' + formatCashNumber(cCost);
    cBtn.querySelector('.upg-eff').textContent = p.capLvl + 'x';
    if (cash >= cCost) cBtn.classList.remove('disabled'); else cBtn.classList.add('disabled');
  });
}

function formatCashNumber(val) {
  if (val >= 1000000) return (val/1000000).toFixed(2) + "M";
  if (val >= 1000) return (val/1000).toFixed(1) + "k";
  return Math.floor(val);
}

// Manual Mining
mineBtn.onclick = () => {
  if (processors[1] && processors[1].unlocked) { processors[1].inventory++; } else { cash += GEM_VALUES[0]; }
  updateUIVisuals();
  if(window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
};

let lastTime = performance.now();
function gameLoop() {
  const now = performance.now();
  const dt = now - lastTime;
  lastTime = now;
  
  let uiDirty = false;

  for (let i = 0; i < processors.length; i++) {
    const p = processors[i];
    if (!p.unlocked) continue;
    
    // Attempt to start a batch if idle
    if (p.currentBatch === 0) {
       if (p.input === -1) {
          p.currentBatch = p.capLvl; // Spawner constantly spawns its capacity
       } else if (p.inventory > 0) {
          p.currentBatch = Math.min(p.inventory, p.capLvl);
          p.inventory -= p.currentBatch;
       }
    }
    
    if (p.currentBatch > 0) {
      p.progress += dt;
      
      const pb = p.dom.querySelector('.progress-fill');
      const pText = p.dom.querySelector('.progress-text');
      if (pb) {
        pb.style.width = Math.min(100, (p.progress / p.maxProgress) * 100) + '%';
        pText.textContent = `Processing ${p.currentBatch}...`;
      }
      
      if (p.progress >= p.maxProgress) {
        p.progress -= p.maxProgress; 
        
        let outputNum = p.currentBatch;
        p.currentBatch = 0; // Batch complete
        
        // Efficiency Rolls
        const effChance = (p.effLvl - 1) * 0.05;
        let extra = 0;
        for(let j=0; j<outputNum; j++){ if(Math.random() < effChance) extra++; }
        outputNum += extra;
        
        const nextProcessor = (i + 1 < processors.length) ? processors[i+1] : null;
        if (nextProcessor && nextProcessor.unlocked) {
          nextProcessor.inventory += outputNum;
        } else {
          cash += GEM_VALUES[p.output] * outputNum; // Auto sell
        }
        uiDirty = true;
      }
    } else {
       p.progress = 0;
       const pb = p.dom.querySelector('.progress-fill');
       const pText = p.dom.querySelector('.progress-text');
       if (pb) { pb.style.width = '0%'; pText.textContent = 'Waiting...'; }
    }
  }

  if (uiDirty) updateUIVisuals();
  requestAnimationFrame(gameLoop);
}

setInterval(() => {
  const now = Date.now();
  rateHistory.push({time: now, cash: cash});
  rateHistory = rateHistory.filter(h => now - h.time <= 5000); 
  
  if (rateHistory.length >= 2) {
    const timeDiff = (now - rateHistory[0].time) / 1000;
    const diffCash = rateHistory[rateHistory.length-1].cash - rateHistory[0].cash;
    const rate = Math.max(0, diffCash / timeDiff);
    rateValEl.textContent = "$" + formatCashNumber(rate);
  }
  updateUIVisuals();
}, 500);

initUI();
gameLoop();
