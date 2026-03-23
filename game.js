const FACTORY_TYPES = [
  { id: 'chopper', name: 'Chopper Lv1', icon: '🔪', cost: 50, inT: 0, outT: 1, baseSpeed: 1000 },
  { id: 'fryer', name: 'Fryer Lv2', icon: '🍳', cost: 250, inT: 1, outT: 2, baseSpeed: 2000 },
  { id: 'boiler', name: 'Boiler Lv3', icon: '🍲', cost: 1000, inT: 2, outT: 3, baseSpeed: 3000 },
  { id: 'kitchen', name: 'Kitchen Lv4', icon: '👨‍🍳', cost: 5000, inT: 3, outT: 4, baseSpeed: 5000 },
  { id: 'master', name: 'Master Lv5', icon: '🌟', cost: 25000, inT: 4, outT: 5, baseSpeed: 8000 }
];
const ITEM_VALS = [1, 5, 25, 125, 625, 3125];
const ITEM_ICONS = ['🌿', '🥗', '🍟', '🍲', '🥘', '🌟'];
const ITEM_TITLES = ['Raw Leek', 'Chopped Leek', 'Fried Leek', 'Leek Soup', 'Supreme Leek', 'Masterpiece'];

let cash = 50;
let rateHistory = [{time: Date.now(), cash}];
let lastRate = 0; 
let items = [];
let gid = 1;

let spawnerBaseTime = 2000;
let spawnerCost = 10;
let spawnerProgress = 0;
let spawnerLevel = 1;

// Plots
const PLOT_DISTS = [15, 55, 100, 140, 180];
let plots = PLOT_DISTS.map(idist => ({
  dist: idist,
  factoryId: null, // string
  level: 1,
  procTime: 0,
  procRem: 0,
  procOut: 0,
  dom: null
}));

const beltPath = document.getElementById("track");
const totalPathLen = beltPath.getTotalLength();
const ITEM_SPEED = 15; // units per second

const plotsLayer = document.getElementById("plots-layer");
const itemsLayer = document.getElementById("items-layer");

const buildModal = document.getElementById("build-modal");
const upgradeModal = document.getElementById("upgrade-modal");
let selectedPlotIndex = null;

function initApp() {
  document.getElementById("cash-val").textContent = cash;

  // Render price board
  const priceList = document.getElementById("price-list");
  ITEM_VALS.forEach((val, i) => {
    priceList.innerHTML += `
      <li class="price-item">
        <span class="p-name"><span class="p-icon">${ITEM_ICONS[i]}</span> ${ITEM_TITLES[i]}</span>
        <span class="p-val">🪙 ${val}</span>
      </li>
    `;
  });

  // Render Shop
  const shopList = document.getElementById("shop-list");
  FACTORY_TYPES.forEach((f) => {
    const btn = document.createElement("button");
    btn.className = "s-buy-btn";
    btn.innerHTML = `Buy $${f.cost}`;
    btn.onclick = () => buyFactory(f.id, f.cost);
    
    shopList.innerHTML += `
      <div class="shop-item">
        <div class="s-icon">${f.icon}</div>
        <div class="s-details">
          <div class="s-title">${f.name}</div>
          <div class="s-desc">Turns ${ITEM_ICONS[f.inT]} into ${ITEM_ICONS[f.outT]}</div>
        </div>
        <div id="shop-btn-box-${f.id}"></div>
      </div>
    `;
    setTimeout(() => document.getElementById(`shop-btn-box-${f.id}`).appendChild(btn), 0);
  });

  // Place plots along the path
  plots.forEach((p, idx) => {
    const pt = beltPath.getPointAtLength(p.dist);
    const div = document.createElement("div");
    div.className = "plot plot-unbuilt";
    div.style.left = pt.x + "%";
    div.style.top = pt.y + "%";
    div.onclick = () => openPlotAction(idx);
    p.dom = div;
    plotsLayer.appendChild(div);
  });

  document.getElementById("close-modal").onclick = () => buildModal.classList.add("hidden");
  document.getElementById("close-upg-modal").onclick = () => upgradeModal.classList.add("hidden");

  document.getElementById("spawner-upg-btn").onclick = () => {
    if (cash >= spawnerCost) {
      cash -= spawnerCost;
      spawnerLevel++;
      spawnerCost = Math.floor(spawnerCost * 1.5);
      spawnerBaseTime = Math.max(200, 2000 * Math.pow(0.85, spawnerLevel-1));
      document.getElementById("s-upg-cost").textContent = spawnerCost;
      document.getElementById("cash-val").textContent = cash;
    }
  };

  updateUIVisuals();
}

function openPlotAction(idx) {
  selectedPlotIndex = idx;
  const p = plots[idx];
  if (!p.factoryId) {
    buildModal.classList.remove("hidden");
    // Update button states
    FACTORY_TYPES.forEach(f => {
      const btn = document.querySelector(`#shop-btn-box-${f.id} button`);
      if(btn) {
         if(cash >= f.cost) btn.classList.remove('disabled');
         else btn.classList.add('disabled');
      }
    });
  } else {
    // Open upgrade modal
    const fac = FACTORY_TYPES.find(f => f.id === p.factoryId);
    document.getElementById("fac-name").textContent = fac.name;
    
    // In later updates we can allow Speed Upgrades on these
    const upgCost = Math.floor(fac.cost * p.level);
    document.getElementById("fac-upg-cost").textContent = upgCost;
    
    const sellValue = Math.floor((fac.cost + (p.level>1 ? fac.cost*(p.level-1) : 0)) * 0.5);
    
    document.getElementById("fac-speed").textContent = (p.procTime / 1000).toFixed(1) + "s";
    
    const upgBtn = document.getElementById("fac-upg-btn");
    upgBtn.onclick = () => {
      if(cash >= upgCost) {
        cash -= upgCost;
        p.level++;
        p.procTime = fac.baseSpeed * Math.pow(0.8, p.level - 1);
        upgradeModal.classList.add("hidden");
        updateUIVisuals();
      }
    };
    if (cash >= upgCost) upgBtn.classList.remove('disabled');
    else upgBtn.classList.add('disabled');

    document.getElementById("fac-sell-btn").onclick = () => {
       cash += sellValue;
       p.factoryId = null;
       p.procRem = 0;
       p.level = 1;
       upgradeModal.classList.add("hidden");
       updateUIVisuals();
    };

    upgradeModal.classList.remove("hidden");
  }
}

function buyFactory(id, cost) {
  if (cash >= cost && selectedPlotIndex !== null) {
    cash -= cost;
    const p = plots[selectedPlotIndex];
    p.factoryId = id;
    const fac = FACTORY_TYPES.find(f => f.id === id);
    p.procTime = fac.baseSpeed;
    buildModal.classList.add("hidden");
    updateUIVisuals();
  }
}

function updateUIVisuals() {
  document.getElementById("cash-val").textContent = cash;
  
  plots.forEach(p => {
    if (p.factoryId) {
       const fac = FACTORY_TYPES.find(f => f.id === p.factoryId);
       p.dom.className = "plot plot-built";
       p.dom.innerHTML = `
         <div class="plot-lvl">Lvl ${p.level}</div>
         <div class="plot-icon">${fac.icon}</div>
         <div class="plot-prog"><div class="plot-prog-fill"></div></div>
       `;
    } else {
       p.dom.className = "plot plot-unbuilt";
       p.dom.innerHTML = `
         <div class="plot-icon">🔨</div>
         <div class="plot-lbl-buy">Build<br><span>Spot</span></div>
       `;
    }
  });

  const btn = document.getElementById("spawner-upg-btn");
  if(cash >= spawnerCost) { btn.style.opacity = '1'; } else { btn.style.opacity = '0.5'; }
}

let lastTime = performance.now();
function gameLoop() {
  const now = performance.now();
  const dt = now - lastTime;
  lastTime = now;
  
  // Spawner 
  spawnerProgress += dt;
  if(spawnerProgress >= spawnerBaseTime) {
     spawnerProgress -= spawnerBaseTime;
     items.push({ id: gid++, type: 0, dist: 0, dom: null });
  }
  document.getElementById("spawner-fill").style.width = Math.min(100, (spawnerProgress/spawnerBaseTime)*100) + '%';

  // Processors
  plots.forEach(p => {
    if(p.procRem > 0) {
       p.procRem -= dt;
       if(p.dom.querySelector('.plot-prog-fill')) {
         p.dom.querySelector('.plot-prog-fill').style.width = Math.min(100, 100 - (p.procRem / p.procTime * 100)) + '%';
       }
       if(p.procRem <= 0) {
         items.push({ id: gid++, type: p.procOut, dist: p.dist + 2, dom: null });
         if(p.dom.querySelector('.plot-prog-fill')) p.dom.querySelector('.plot-prog-fill').style.width = '0%';
       }
    }
  });

  // Items movement
  const speedScale = ITEM_SPEED * (dt / 1000);
  items.forEach(item => {
    item.dist += speedScale;

    // Check Catchers (Factories)
    plots.forEach(p => {
       if (Math.abs(item.dist - p.dist) < 1.0 && p.factoryId && p.procRem <= 0) {
          const fac = FACTORY_TYPES.find(f => f.id === p.factoryId);
          if (fac.inT === item.type) {
             item.dead = true;
             p.procRem = p.procTime;
             p.procOut = fac.outT;
          }
       }
    });

    if (item.dist >= totalPathLen) {
       item.dead = true;
       cash += ITEM_VALS[item.type];
    }
  });

  items = items.filter(i => {
    if(i.dead && i.dom) i.dom.remove();
    return !i.dead;
  });

  items.forEach(i => {
    if (!i.dom) {
      i.dom = document.createElement("div");
      i.dom.className = "belt-item";
      i.dom.textContent = ITEM_ICONS[i.type];
      itemsLayer.appendChild(i.dom);
    }
    const pt = beltPath.getPointAtLength(i.dist);
    i.dom.style.left = pt.x + "%";
    i.dom.style.top = pt.y + "%";
  });

  document.getElementById("cash-val").textContent = cash;
  requestAnimationFrame(gameLoop);
}

setInterval(() => {
  const now = Date.now();
  rateHistory.push({time: now, cash: cash});
  rateHistory = rateHistory.filter(h => now - h.time <= 5000); 
  
  if (rateHistory.length >= 2) {
    const timeDiff = (now - rateHistory[0].time) / 1000;
    const diffCash = rateHistory[rateHistory.length-1].cash - rateHistory[0].cash;
    lastRate = Math.max(0, diffCash / timeDiff);
    document.getElementById("rev-val").textContent = Math.floor(lastRate);
  }
}, 500);

initApp();
requestAnimationFrame(gameLoop);
