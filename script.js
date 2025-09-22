const GRID_SIZE = 6;
const START_TIME = 90;
const BASE_TIME_BONUS = 2;
const SIGIL_TIME_BONUS = 5;
const TARGET_FRAGMENT_TOTAL = 180;
const COMBO_WINDOW = 4000; // milliseconds

const RUNES = [
  { type: "aether", symbol: "Δ", name: "Aether" },
  { type: "cipher", symbol: "◈", name: "Cipher" },
  { type: "pulse", symbol: "✶", name: "Pulse" },
  { type: "glyph", symbol: "⟡", name: "Glyph" },
];

const VERSE_SNIPPETS = [
  "Verse I: Circuits of starlight seek their keeper.",
  "Verse II: The lexicon hums with waiting secrets.",
  "Verse III: Every rune whispers of forgotten gateways.",
  "Verse IV: Archivists chart destiny in luminous ink.",
  "Verse V: Glimmering sigils braid the strands of time.",
  "Verse VI: Aether streams through crystalline shelves.",
  "Verse VII: Ciphered hymns echo beyond the veil.",
  "Verse VIII: Pulse runes quicken the sleeping archive.",
  "Verse IX: Glyph lattices realign our fractured codex.",
  "Verse X: The Obscura awaits its final illumination.",
];

const gridElement = document.getElementById("grid");
const gridOverlay = document.getElementById("gridOverlay");
const startButton = document.getElementById("startButton");
const modalStartButton = document.getElementById("modalStartButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const playAgainButton = document.getElementById("playAgainButton");
const titleModal = document.getElementById("titleModal");
const gameOverModal = document.getElementById("gameOverModal");
const timeRemainingDisplay = document.getElementById("timeRemaining");
const scoreDisplay = document.getElementById("scoreDisplay");
const versesDisplay = document.getElementById("versesDisplay");
const sigilDisplay = document.getElementById("sigilDisplay");
const comboDisplay = document.getElementById("comboDisplay");
const progressFill = document.getElementById("progressFill");
const verseDisplay = document.getElementById("verseDisplay");
const finalScoreDisplay = document.getElementById("finalScore");
const finalVersesDisplay = document.getElementById("finalVerses");
const highScoreDisplay = document.getElementById("highScore");

let grid = [];
let timeRemaining = START_TIME;
let score = 0;
let versesBound = 0;
let fragmentsBound = 0;
let sigilCount = 0;
let comboCount = 1;
let lastMatchTimestamp = 0;
let state = "idle"; // idle | running | paused | ended
let storedHighScore = 0;
let lastVerseIndex = -1;

function init() {
  createGridStructure();
  attachEventListeners();
  loadHighScore();
  showModal(titleModal);
  showOverlay("Tap Start Ritual to begin.");
  updateHUD();
  requestAnimationFrame(gameLoop);
}

function createGridStructure() {
  gridElement.innerHTML = "";
  grid = new Array(GRID_SIZE)
    .fill(null)
    .map(() => new Array(GRID_SIZE).fill(null));

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("role", "button");
      cell.setAttribute("tabindex", "0");
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.addEventListener("click", handleCellClick);
      cell.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCellClick(event);
        }
      });
      gridElement.append(cell);
      const rune = randomRune();
      grid[row][col] = { rune: rune.type, sigil: false, element: cell };
      updateCellAppearance(row, col);
    }
  }
}

function attachEventListeners() {
  startButton.addEventListener("click", () => startGame());
  modalStartButton.addEventListener("click", () => {
    hideModal(titleModal);
    startGame();
  });
  pauseButton.addEventListener("click", togglePause);
  restartButton.addEventListener("click", () => restartGame());
  playAgainButton.addEventListener("click", () => {
    hideModal(gameOverModal);
    startGame();
  });
}

function startGame() {
  hideModal(titleModal);
  state = "running";
  score = 0;
  versesBound = 0;
  sigilCount = 0;
  fragmentsBound = 0;
  comboCount = 1;
  lastMatchTimestamp = 0;
  timeRemaining = START_TIME;
  previousTimestamp = 0;
  updateHUD();
  progressFill.style.width = "0%";
  verseDisplay.textContent = "Verse unbound. The Codex stirs...";
  resetGridRunes();
  hideOverlay();
  hideModal(gameOverModal);
  pauseButton.textContent = "Pause";
  updateControlStates();
}

function resetGridRunes() {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const rune = randomRune();
      const cell = grid[row][col];
      cell.rune = rune.type;
      cell.sigil = false;
      updateCellAppearance(row, col);
    }
  }
}

function restartGame() {
  hideModal(gameOverModal);
  hideModal(titleModal);
  state = "running";
  score = 0;
  versesBound = 0;
  sigilCount = 0;
  fragmentsBound = 0;
  comboCount = 1;
  lastMatchTimestamp = 0;
  timeRemaining = START_TIME;
  previousTimestamp = 0;
  updateHUD();
  progressFill.style.width = "0%";
  verseDisplay.textContent = "Verse unbound. The Codex stirs...";
  resetGridRunes();
  hideOverlay();
  pauseButton.textContent = "Pause";
  updateControlStates();
}

function togglePause() {
  if (state === "running") {
    state = "paused";
    showOverlay("Ritual paused. Resume to continue binding.");
    pauseButton.textContent = "Resume";
    previousTimestamp = 0;
  } else if (state === "paused") {
    state = "running";
    previousTimestamp = 0;
    hideOverlay();
    pauseButton.textContent = "Pause";
  }
  updateControlStates();
}

function randomRune() {
  return RUNES[Math.floor(Math.random() * RUNES.length)];
}

function handleCellClick(event) {
  if (state !== "running") {
    return;
  }

  const target = event.currentTarget;
  const row = Number(target.dataset.row);
  const col = Number(target.dataset.col);
  const cell = grid[row][col];

  if (!cell || !cell.rune) {
    return;
  }

  const cluster = findCluster(row, col, cell.rune);
  if (cluster.length < 3) {
    target.classList.add("flash");
    setTimeout(() => target.classList.remove("flash"), 300);
    return;
  }

  resolveCluster(cluster);
}

function findCluster(startRow, startCol, runeType) {
  const visited = new Set();
  const cluster = [];
  const stack = [{ row: startRow, col: startCol }];

  while (stack.length > 0) {
    const { row, col } = stack.pop();
    const key = `${row},${col}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (
      row < 0 ||
      row >= GRID_SIZE ||
      col < 0 ||
      col >= GRID_SIZE ||
      !grid[row][col] ||
      grid[row][col].rune !== runeType
    ) {
      continue;
    }

    cluster.push({ row, col });

    stack.push({ row: row + 1, col });
    stack.push({ row: row - 1, col });
    stack.push({ row, col: col + 1 });
    stack.push({ row, col: col - 1 });
  }

  return cluster;
}

function resolveCluster(cluster) {
  const originalSize = cluster.length;
  const { cells: resolvedCluster, sigilActivated } = expandClusterWithSigil(cluster);
  const now = performance.now();
  if (lastMatchTimestamp && now - lastMatchTimestamp <= COMBO_WINDOW) {
    comboCount += 1;
  } else {
    comboCount = 1;
  }
  lastMatchTimestamp = now;

  const multiplier = comboCount;
  const baseScore = resolvedCluster.length * 10;
  const gainedScore = baseScore * multiplier;
  score += gainedScore;
  versesBound += 1;
  fragmentsBound += resolvedCluster.length;

  let timeBonus = BASE_TIME_BONUS;
  let unleashedSigil = false;

  if (originalSize >= 5) {
    sigilCount += 1;
    timeBonus += SIGIL_TIME_BONUS;
    unleashedSigil = true;
  }

  timeRemaining = Math.min(timeRemaining + timeBonus, START_TIME + 45);

  resolvedCluster.forEach(({ row, col }) => {
    const cell = grid[row][col];
    if (cell) {
      cell.element.classList.add("flash");
      cell.rune = null;
      cell.sigil = false;
      updateCellAppearance(row, col);
    }
  });

  collapseColumns();

  if (unleashedSigil) {
    spawnSigil();
  }

  updateHUD();
  revealVerse();

  if (unleashedSigil) {
    showTemporaryOverlay("Sigil spark surges! +5s", 1500);
  } else if (sigilActivated) {
    showTemporaryOverlay("Sigil detonation! Row purged.", 1200);
  }
}

function expandClusterWithSigil(cluster) {
  const expanded = new Map();
  let activated = false;

  cluster.forEach(({ row, col }) => {
    expanded.set(`${row}:${col}`, { row, col });
  });

  cluster.forEach(({ row, col }) => {
    const cell = grid[row][col];
    if (cell && cell.sigil) {
      activated = true;
      for (let c = 0; c < GRID_SIZE; c += 1) {
        const key = `${row}:${c}`;
        if (!expanded.has(key)) {
          expanded.set(key, { row, col: c });
        }
      }
    }
  });

  return { cells: Array.from(expanded.values()), sigilActivated: activated };
}

function spawnSigil() {
  const candidates = [];
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const cell = grid[row][col];
      if (cell && cell.rune && !cell.sigil) {
        candidates.push({ row, col });
      }
    }
  }

  if (!candidates.length) {
    return;
  }

  const choice = candidates[Math.floor(Math.random() * candidates.length)];
  const cell = grid[choice.row][choice.col];
  cell.sigil = true;
  updateCellAppearance(choice.row, choice.col);
}

function collapseColumns() {
  for (let col = 0; col < GRID_SIZE; col += 1) {
    const filled = [];
    for (let row = GRID_SIZE - 1; row >= 0; row -= 1) {
      const cell = grid[row][col];
      if (cell && cell.rune) {
        filled.push({ rune: cell.rune, sigil: cell.sigil });
      }
    }

    let index = 0;
    for (let row = GRID_SIZE - 1; row >= 0; row -= 1) {
      const occupant = filled[index];
      if (occupant) {
        setCell(row, col, occupant.rune, occupant.sigil);
        index += 1;
      } else {
        const rune = randomRune();
        setCell(row, col, rune.type, false);
      }
    }
  }
}

function setCell(row, col, rune, sigil) {
  const cell = grid[row][col];
  cell.rune = rune;
  cell.sigil = sigil;
  updateCellAppearance(row, col);
}

function updateCellAppearance(row, col) {
  const cell = grid[row][col];
  const element = cell.element;
  if (!cell.rune) {
    element.dataset.rune = "void";
    element.textContent = "";
    element.classList.remove("sigil");
    return;
  }

  const runeData = RUNES.find((r) => r.type === cell.rune);
  element.dataset.rune = runeData.type;
  element.textContent = runeData.symbol;
  element.classList.toggle("sigil", Boolean(cell.sigil));
  requestAnimationFrame(() => element.classList.remove("flash"));
}

function revealVerse() {
  let index = Math.floor(Math.random() * VERSE_SNIPPETS.length);
  if (index === lastVerseIndex) {
    index = (index + 3) % VERSE_SNIPPETS.length;
  }
  lastVerseIndex = index;
  verseDisplay.textContent = VERSE_SNIPPETS[index];
}

function updateHUD() {
  timeRemainingDisplay.textContent = timeRemaining.toFixed(1);
  scoreDisplay.textContent = score.toLocaleString();
  versesDisplay.textContent = versesBound.toString();
  sigilDisplay.textContent = sigilCount.toString();
  comboDisplay.textContent = `x${comboCount}`;
  const progress = Math.min(100, Math.round((fragmentsBound / TARGET_FRAGMENT_TOTAL) * 100));
  progressFill.style.width = `${progress}%`;
}

function showOverlay(message) {
  gridOverlay.textContent = message;
  gridOverlay.classList.remove("hidden");
}

function hideOverlay() {
  gridOverlay.classList.add("hidden");
}

function showTemporaryOverlay(message, duration) {
  showOverlay(message);
  setTimeout(() => {
    if (state === "running") {
      hideOverlay();
    }
  }, duration);
}

function gameLoop(timestamp) {
  if (state === "running") {
    const delta = getDeltaTime(timestamp);
    if (delta > 0) {
      timeRemaining = Math.max(timeRemaining - delta, 0);
      if (timeRemaining === 0) {
        endGame();
      }
      const now = performance.now();
      if (comboCount > 1 && lastMatchTimestamp && now - lastMatchTimestamp > COMBO_WINDOW) {
        comboCount = 1;
      }
      updateHUD();
    }
  }
  requestAnimationFrame(gameLoop);
}

let previousTimestamp = 0;
function getDeltaTime(timestamp) {
  if (!previousTimestamp) {
    previousTimestamp = timestamp;
    return 0;
  }
  const delta = (timestamp - previousTimestamp) / 1000;
  previousTimestamp = timestamp;
  return delta;
}

function endGame() {
  state = "ended";
  updateControlStates();
  showOverlay("Chronometer depleted. The Codex falls silent.");
  pauseButton.textContent = "Pause";

  finalScoreDisplay.textContent = score.toLocaleString();
  finalVersesDisplay.textContent = versesBound.toString();
  const highScore = updateHighScore();
  highScoreDisplay.textContent = highScore.toLocaleString();
  showModal(gameOverModal);
}

function updateControlStates() {
  if (state === "running") {
    startButton.disabled = true;
    pauseButton.disabled = false;
  } else if (state === "paused") {
    startButton.disabled = true;
    pauseButton.disabled = false;
  } else {
    startButton.disabled = false;
    pauseButton.disabled = true;
  }
}

function showModal(modal) {
  modal.classList.remove("hidden");
}

function hideModal(modal) {
  modal.classList.add("hidden");
}

function loadHighScore() {
  try {
    const value = localStorage.getItem("codex_highscore");
    storedHighScore = value ? Number(value) : 0;
  } catch (error) {
    storedHighScore = 0;
  }
}

function updateHighScore() {
  if (score > storedHighScore) {
    storedHighScore = score;
    try {
      localStorage.setItem("codex_highscore", String(storedHighScore));
    } catch (error) {
      // ignore storage errors
    }
  }
  return storedHighScore;
}

window.addEventListener("load", init);
