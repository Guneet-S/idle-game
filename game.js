const goldElement = document.getElementById("gold-value");
const workerElement = document.getElementById("worker-value");
const gpsElement = document.getElementById("gps-value");
const mineButton = document.getElementById("mine-btn");
const buyWorkerBtn = document.getElementById("buy-worker");

// Navigation elements
const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Tab switching logic
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active classes
    navButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked button and target tab
    btn.classList.add('active');
    const targetTab = document.getElementById(btn.dataset.tab);
    if (targetTab) targetTab.classList.add('active');
    
    // Haptic feedback for tab switch
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  });
});
let gold = 0;
let workers = 0;
let goldPerSecond = 0;

function formatGold(value) {
  return Math.floor(value).toLocaleString("en-US");
}

function updateUI() {
  goldElement.textContent = formatGold(gold);
  workerElement.textContent = workers;
  goldPerSecond = workers * 1;
  gpsElement.textContent = formatGold(goldPerSecond);
  
  const workerCost = 10;
  if (gold >= workerCost) {
    buyWorkerBtn.disabled = false;
    buyWorkerBtn.innerHTML = `<span class="cost-amount">${workerCost}</span> <span class="cost-icon">💰</span>`;
  } else {
    buyWorkerBtn.disabled = true;
    buyWorkerBtn.innerHTML = `<span class="cost-amount">${workerCost}</span> <span class="cost-icon">💰</span>`;
  }
}

function createFloatingText(x, y) {
  const text = document.createElement("div");
  text.classList.add("click-effect");
  text.textContent = "+1";
  
  document.body.appendChild(text);

  const offsetX = x + (Math.random() - 0.5) * 60;
  const offsetY = y + (Math.random() - 0.5) * 60 - 20;

  text.style.left = `${offsetX}px`;
  text.style.top = `${offsetY}px`;

  setTimeout(() => {
    text.remove();
  }, 800);
}

function handleMine(e) {
  gold += 1;
  
  let x = e.clientX || (e.touches && e.touches[0].clientX);
  let y = e.clientY || (e.touches && e.touches[0].clientY);
  
  if (x === undefined || y === undefined) {
    const rect = mineButton.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  }

  createFloatingText(x, y);
  
  // Try triggering mobile vibration for physical input feel
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(10);
  }
  
  updateUI();
}

// Improved touch handling for devices
mineButton.addEventListener("pointerdown", (e) => {
  // Prevent default handling unless it's a non-primary mouse button
  if(e.pointerType === 'mouse' && e.button !== 0) return;
  e.preventDefault(); 
  handleMine(e);
});

buyWorkerBtn.addEventListener("click", () => {
  const workerCost = 10;
  if (gold < workerCost) return;
  gold -= workerCost;
  workers += 1;
  
  // Unique haptic pattern for purchases
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate([20, 30, 20]);
  }
  
  updateUI();
});

setInterval(() => {
  if (workers <= 0) return;
  gold += workers * 1;
  updateUI();
}, 1000);

// Disable context menu to prevent text selection / zoom on mobile
document.addEventListener('contextmenu', event => event.preventDefault());

updateUI();
