"use strict";

const W = 64;
const H = 64;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const gameButtons = document.getElementById("gameButtons");
const levelSelect = document.getElementById("levelSelect");
const resetButton = document.getElementById("resetButton");
const nextButton = document.getElementById("nextButton");
const titleEl = document.getElementById("title");
const objectiveEl = document.getElementById("objective");
const statusEl = document.getElementById("status");
const legendEl = document.getElementById("legend");

const C = {
  void: "#0d0f0e",
  floor: "#20251f",
  floor2: "#2b3029",
  wall: "#606861",
  wall2: "#343b38",
  player: "#55c7ff",
  altPlayer: "#ff8ad8",
  goal: "#f8d95a",
  token: "#f0a545",
  hazard: "#ef5b5b",
  safe: "#7bc96f",
  blue: "#5b7cff",
  cyan: "#64e3d0",
  purple: "#b76df2",
  orange: "#f0a545",
  white: "#f4efe2",
  black: "#101210",
  gray: "#969d95",
  dark: "#151815",
  green: "#62d26f",
  red: "#ef5b5b",
};

const MODS = [
  ["M001", "Visibility"],
  ["M002", "Failure"],
  ["M003", "Objective"],
  ["M004", "Temporal"],
  ["M005", "Resource"],
  ["M006", "Control"],
  ["M007", "Spatial address"],
  ["M008", "Scale"],
  ["M009", "Composition"],
];

const COSMETIC_CHARS = [",", "4", "5", "6", "7", "8", "9", "a", "b", "I", "J", "W", "R", "O"];

const FAMILY_LABELS = {
  1: "Direct traversal",
  2: "Maze traversal",
  3: "Passability discovery",
  4: "Topological traversal",
  5: "Layered traversal",
  6: "Coordinate-frame traversal",
  7: "Directed-edge traversal",
  8: "Forced-motion traversal",
  9: "Sliding-until-stop traversal",
  10: "Jump/dash/blink traversal",
  11: "Gravity traversal",
  12: "Hazard-routing",
  13: "Stealth traversal",
  14: "Pursuit/evasion",
  15: "Escort/follower traversal",
  16: "Multi-body shared-input traversal",
  17: "Body-selection traversal",
  18: "Simultaneous-goal traversal",
  19: "Coverage-route traversal",
  20: "Avoidance-route traversal",
  21: "Optimized-route traversal",
  22: "Detour-route traversal",
  23: "Bottleneck-route traversal",
  24: "Loop-route traversal",
  25: "Anti-loop traversal",
  26: "Push-block manipulation",
  27: "Pull/drag/tether manipulation",
  28: "Carry/drop inventory manipulation",
  29: "Tool-use manipulation",
  30: "Object-rotation manipulation",
  31: "Object-sliding manipulation",
  32: "Object-swap manipulation",
  33: "Sokoban-staging manipulation",
  34: "Blocking manipulation",
  35: "Unblocking manipulation",
  36: "Constructive placement",
  37: "Destructive placement",
  38: "Terrain transformation",
  39: "Temporary terrain manipulation",
  40: "Packing manipulation",
  41: "Tiling manipulation",
  42: "Permutation manipulation",
  43: "Sorting manipulation",
  44: "Matching manipulation",
  45: "Grouping manipulation",
  46: "Separation manipulation",
  47: "Cell selection",
  48: "Object selection",
  49: "Vertex/edge selection",
  50: "Region selection",
  51: "Ordered selection",
  52: "Path drawing",
  53: "Region fill",
  54: "Pattern reproduction",
  55: "Symbol decoding",
  56: "Word/logic panel",
  57: "Algebra panel",
  58: "Proof panel",
  59: "Graph panel",
  60: "Flow panel",
  61: "Ray alignment",
  62: "Line-of-sight play",
  63: "Field navigation",
  64: "Diffusion/spread control",
  65: "Cellular-automaton steering",
  66: "Circuit logic",
  67: "Pipe/valve logic",
  68: "Pressure/weight logic",
  69: "Wait/pass-time",
  70: "No-op/bump play",
  71: "Rhythm/cadence play",
  72: "Phase-alignment play",
  73: "Countdown pressure",
  74: "Delayed-effect play",
  75: "Turn-order choreography",
  76: "Autonomous-process steering",
  77: "Adversary-policy play",
  78: "Ally-policy play",
  79: "Collision choreography",
  80: "Reversible-cycle play",
  81: "Undo/rewind play",
  82: "Checkpoint/reset play",
  83: "Move-budget play",
  84: "Energy/charge play",
  85: "Inventory-budget play",
  86: "Risk-budget play",
  87: "Resource conversion",
  88: "Resource replenishment",
  89: "Sacrifice play",
  90: "Preservation play",
  91: "Threshold play",
  92: "Scoring play",
  93: "Satisficing play",
  94: "Exploration/fog play",
  95: "Memory play",
  96: "Probe/experiment play",
  97: "Failure-as-information play",
  98: "Information-avoidance play",
  99: "Perceptual-transform play",
  100: "Decoy-rejection play",
  101: "Micro-signal play",
  102: "Hypothesis-revision play",
  103: "Hidden-state belief play",
  104: "Mode/tool switching",
  105: "Action-addressing",
  106: "Command-targeting",
  107: "Programming/queueing",
  108: "Macro/repetition programming",
  109: "Rule-switching",
  110: "Rule-repair",
  111: "Exception handling",
  112: "True-objective discovery",
  113: "Final-step priority",
  114: "Self-reference/meta play",
  115: "Analogy-transfer play",
  116: "Representation-switch play",
  117: "Abstraction play",
  118: "Concretization play",
  119: "Exact-count satisfaction",
  120: "Local-to-global propagation",
  121: "Global-to-local forcing",
  122: "Contradiction pruning",
  123: "Case-split play",
  124: "Dominance pruning",
  125: "Canonicalization play",
  126: "Symmetry play",
  127: "Symmetry-breaking play",
  128: "Decomposition play",
  129: "Interface play",
  130: "Composition play",
};

const games = [
  { id: "L001", name: "L001 Direct", levels: MODS.map((m, i) => directLevel(i + 1, m)) },
  { id: "L002", name: "L002 Maze", levels: MODS.map((m, i) => mazeLevel(i + 1, m)) },
  { id: "L003", name: "L003 Passability", levels: MODS.map((m, i) => passabilityLevel(i + 1, m)) },
  { id: "L004", name: "L004 Topology", levels: MODS.map((m, i) => topologyLevel(i + 1, m)) },
  { id: "L005", name: "L005 Layers", levels: MODS.map((m, i) => layerLevel(i + 1, m)) },
  { id: "L006", name: "L006 Frame", levels: MODS.map((m, i) => coordinateLevel(i + 1, m)) },
  { id: "L007", name: "L007 One-way", levels: MODS.map((m, i) => directedLevel(i + 1, m)) },
  { id: "L008", name: "L008 Forced", levels: MODS.map((m, i) => forcedLevel(i + 1, m)) },
  { id: "L009", name: "L009 Slide", levels: MODS.map((m, i) => slidingLevel(i + 1, m)) },
  { id: "L010", name: "L010 Jump", levels: MODS.map((m, i) => jumpLevel(i + 1, m)) },
  { id: "L011", name: "L011 Gravity", levels: MODS.map((m, i) => gravityLevel(i + 1, m)) },
  { id: "L012", name: "L012 Hazards", levels: MODS.map((m, i) => hazardLevel(i + 1, m)) },
  { id: "L013", name: "L013 Stealth", levels: MODS.map((m, i) => stealthLevel(i + 1, m)) },
  { id: "L014", name: "L014 Pursuit", levels: MODS.map((m, i) => pursuitLevel(i + 1, m)) },
  { id: "L015", name: "L015 Escort", levels: MODS.map((m, i) => escortLevel(i + 1, m)) },
];

let gameIndex = 0;
let levelIndex = 0;
let level = null;
let state = null;

function grid(fill = ".") {
  return Array.from({ length: H }, () => Array(W).fill(fill));
}

function cloneGrid(g) {
  return g.map((row) => row.slice());
}

function inBounds(x, y) {
  return x >= 0 && x < W && y >= 0 && y < H;
}

function key(x, y) {
  return `${x},${y}`;
}

function rect(g, x1, y1, x2, y2, ch) {
  for (let y = y1; y <= y2; y += 1) {
    for (let x = x1; x <= x2; x += 1) {
      if (inBounds(x, y)) g[y][x] = ch;
    }
  }
}

function border(g) {
  rect(g, 0, 0, W - 1, 0, "#");
  rect(g, 0, H - 1, W - 1, H - 1, "#");
  rect(g, 0, 0, 0, H - 1, "#");
  rect(g, W - 1, 0, W - 1, H - 1, "#");
}

function carve(g, points, ch = ".") {
  let [x, y] = points[0];
  g[y][x] = ch;
  for (let i = 1; i < points.length; i += 1) {
    const [tx, ty] = points[i];
    while (x !== tx) {
      x += Math.sign(tx - x);
      g[y][x] = ch;
    }
    while (y !== ty) {
      y += Math.sign(ty - y);
      g[y][x] = ch;
    }
  }
}

function dot(x, y, color, size = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

function paintGrid(g) {
  const colors = {
    ".": C.floor,
    ",": C.floor2,
    "#": C.wall,
    "%": C.wall2,
    "S": C.floor,
    "G": C.goal,
    "T": C.token,
    "X": C.hazard,
    "H": C.dark,
    "F": C.safe,
    "B": C.blue,
    "C": C.cyan,
    "P": C.purple,
    "O": C.orange,
    "D": C.orange,
    "U": C.orange,
    "L": C.orange,
    "N": C.orange,
    "Z": C.white,
    "K": C.cyan,
    "E": C.hazard,
    "Q": C.green,
    "Y": C.safe,
    "M": "#b9a66a",
    "I": "#3e6f7a",
    "J": "#715282",
    "W": "#a9a15f",
    "4": "#425b42",
    "5": "#653d3d",
    "6": "#385260",
    "7": "#5f4c75",
    "8": "#70673e",
    "9": "#394c39",
    "R": C.red,
    "V": C.void,
    "1": "#384f9c",
    "2": "#7c3a9a",
    "3": "#7b682d",
    "?": C.gray,
    "!": C.hazard,
    "a": "#273c5e",
    "b": "#47315a",
  };
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      dot(x, y, colors[g[y][x]] || C.floor);
    }
  }
}

function drawPlayer(x, y, color = C.player) {
  dot(x, y, color);
  if (x + 1 < W) dot(x + 1, y, C.white);
}

function drawHudMarks(items) {
  for (const item of items || []) {
    const color = item.color || C.white;
    if (item.kind === "box") {
      ctx.strokeStyle = color;
      ctx.strokeRect(item.x + 0.5, item.y + 0.5, item.w - 1, item.h - 1);
    } else if (item.kind === "line") {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(item.x1, item.y1);
      ctx.lineTo(item.x2, item.y2);
      ctx.stroke();
    } else {
      dot(item.x, item.y, color, item.size || 1);
    }
  }
}

function baseState(def) {
  return {
    x: def.start[0],
    y: def.start[1],
    active: 0,
    actors: def.actors ? def.actors.map((a) => ({ ...a })) : null,
    goal: def.goal,
    moves: 0,
    waited: 0,
    phase: 0,
    layer: 0,
    dead: false,
    won: false,
    message: "",
    tokens: new Set((def.tokens || []).map(([x, y]) => key(x, y))),
    flags: {},
    clicked: new Set(),
    revealed: new Set(),
    budget: def.budget || null,
  };
}

function currentActor() {
  if (!state.actors) return state;
  return state.actors[state.active];
}

function setCurrentActor(x, y) {
  if (!state.actors) {
    state.x = x;
    state.y = y;
    return;
  }
  state.actors[state.active].x = x;
  state.actors[state.active].y = y;
}

function tileAt(x, y) {
  if (!inBounds(x, y)) return "#";
  if (level.getGrid) return level.getGrid(state)[y][x];
  return level.grid[y][x];
}

function defaultPassable(ch) {
  return ch !== "#" && ch !== "%" && ch !== "V";
}

function tryMove(dx, dy) {
  if (state.dead || state.won) return;
  const actor = currentActor();
  let nx = actor.x + dx;
  let ny = actor.y + dy;
  if (level.wrapX) {
    if (nx <= 0) nx = W - 2;
    if (nx >= W - 1) nx = 1;
  }
  if (level.wrapY) {
    if (ny <= 0) ny = H - 2;
    if (ny >= H - 1) ny = 1;
  }
  if (level.beforeMove) {
    const mapped = level.beforeMove(dx, dy, nx, ny, state);
    nx = mapped.x;
    ny = mapped.y;
  }
  if (!inBounds(nx, ny)) return;
  const ch = tileAt(nx, ny);
  const passable = level.canMove ? level.canMove(nx, ny, ch, state) : defaultPassable(ch);
  if (!passable) {
    if (level.onBump) level.onBump(state);
    state.message = "Blocked.";
    render();
    return;
  }
  setCurrentActor(nx, ny);
  state.moves += 1;
  if (level.afterMove) level.afterMove(nx, ny, ch, state);
  commonAfterMove(nx, ny, ch);
  render();
}

function commonAfterMove(x, y, ch) {
  if (state.budget !== null && state.moves > state.budget) {
    state.dead = true;
    state.message = "The budget is exhausted. Reset and route tighter.";
    return;
  }
  if (ch === "X" || ch === "!") {
    state.dead = true;
    state.message = "That cell is lethal. Reset and avoid the penalty.";
    return;
  }
  if (state.tokens.has(key(x, y))) {
    state.tokens.delete(key(x, y));
    state.message = "Collected.";
  }
  if (level.isWin ? level.isWin(state) : x === level.goal[0] && y === level.goal[1]) {
    state.won = true;
    state.message = "Solved.";
  }
}

function render() {
  const g = level.getGrid ? level.getGrid(state) : level.grid;
  paintGrid(g);
  if (level.render) level.render(state);
  for (const t of state.tokens) {
    const [x, y] = t.split(",").map(Number);
    dot(x, y, C.token, 2);
  }
  if (state.actors) {
    state.actors.forEach((a, i) => drawPlayer(a.x, a.y, i === state.active ? C.player : C.altPlayer));
  } else {
    drawPlayer(state.x, state.y);
  }
  drawHudMarks(level.marks);
  titleEl.textContent = `${level.id} ${levelDisplayTitle(level)}`;
  objectiveEl.textContent = level.objective;
  const bits = [];
  bits.push(`moves ${state.moves}`);
  if (state.budget !== null) bits.push(`budget ${state.budget}`);
  if (level.family === "L005") bits.push(`layer ${state.layer + 1}`);
  if (state.tokens.size) bits.push(`tokens left ${state.tokens.size}`);
  if (state.dead) bits.push("reset required");
  statusEl.textContent = state.message || bits.join(" | ");
}

function legend(items) {
  legendEl.innerHTML = "";
  for (const [name, color] of items) {
    const span = document.createElement("span");
    const swatch = document.createElement("i");
    swatch.className = "swatch";
    swatch.style.background = color;
    span.append(swatch, name);
    legendEl.append(span);
  }
}

function familyLabel(id) {
  const match = id.match(/^L(\d{3})-/);
  if (!match) return "";
  return FAMILY_LABELS[Number(match[1])] || "";
}

function levelDisplayTitle(l) {
  const label = familyLabel(l.id);
  return label ? `${label} ${l.title}` : l.title;
}

function setLevel(gi, li) {
  gameIndex = gi;
  levelIndex = li;
  level = games[gameIndex].levels[levelIndex];
  state = level.init ? level.init() : baseState(level);
  [...gameButtons.children].forEach((btn, i) => btn.classList.toggle("active", i === gameIndex));
  levelSelect.innerHTML = "";
  games[gameIndex].levels.forEach((l, i) => {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = `${l.id} ${l.title}`;
    levelSelect.append(option);
  });
  levelSelect.value = String(levelIndex);
  legend(level.legend);
  render();
}

function buildNav() {
  games.forEach((game, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = game.id;
    btn.addEventListener("click", () => setLevel(i, 0));
    gameButtons.append(btn);
  });
}

function applyFamilyFilter() {
  const filter = typeof window !== "undefined" ? window.GAME_FAMILY_FILTER : null;
  if (!Array.isArray(filter) || filter.length === 0) return;
  const allowed = new Set(filter);
  for (let i = games.length - 1; i >= 0; i -= 1) {
    if (!allowed.has(games[i].id)) games.splice(i, 1);
  }
}

function withSolveHint(id, objective) {
  if (objective.includes("click any three resource markers")) return objective;
  if (/\([^)]*\)\s*$/.test(objective)) return objective;
  return `${objective} (${solveHint(id)})`;
}

function solveHint(id) {
  const match = id.match(/^L(\d{3})-(\d)$/);
  if (!match) return "follow the visible rule, remove the blocking condition, then move the avatar to the yellow exit";
  const family = Number(match[1]);
  const variant = Number(match[2]);
  const familyHint = solveFamilyHint(family);
  const modifierHint = solveModifierHint(variant);
  return `${familyHint}${modifierHint ? `; ${modifierHint}` : ""}`;
}

function solveModifierHint(variant) {
  return {
    1: "if a gray hidden or unknown route cell blocks you, click that cell first to reveal or confirm it",
    2: "avoid red penalty cells while carrying out the solution",
    3: "collect all orange route tokens or complete the extra objective before entering the exit",
    4: "press Space until the purple phase or timing gate opens, then cross it",
    5: "collect the orange refill before the move budget runs out, then continue to the exit",
    6: "click the blue control anchor before trying to pass the cyan control gate",
    7: "click the cyan addressed cell or marker before trying to pass through that addressed blocker",
    8: "use the whole 64x64 board and follow the long route rather than only the local area",
    9: "click the hidden route cell and press Space to open the composed timing gate",
  }[variant] || "";
}

function solveFamilyHint(family) {
  const early = {
    1: "walk the available corridor to the yellow exit",
    2: "navigate the maze corridors from start to exit",
    3: "walk only on the true passable terrain and avoid false-looking floor",
    4: "use the nonlocal topology link or portal-like adjacency, then continue to the exit",
    5: "press Space only on paired layer floor, switch layers, and continue on the active layer",
    6: "interpret the cyan frame cue and use the transformed arrow controls to follow the route",
    7: "leave orange one-way cells only in their allowed direction",
    8: "step onto conveyor or forced-motion cells and let them carry you to the next stop",
    9: "use arrows as slide commands and choose stopping points that line up with the exit",
    10: "walk onto each island and press Space to jump to the next marked landing",
    11: "move between platforms and let gravity drop you onto lower supports when needed",
    12: "route around the red hazards and use only the safe corridor",
    13: "move through shadow corridors and avoid red sightline cells",
    14: "bait the red pursuer away, keep distance, and then reach the exit",
    15: "lead the green follower close to its green goal while the player reaches the yellow exit",
  };
  if (early[family]) return early[family];

  const info = UX_FAMILIES.find(([num]) => num === family);
  const kind = info ? info[2] : "";
  if (["shared", "simul"].includes(kind)) return "move the bodies together until the player reaches yellow and the second body reaches the green target";
  if (kind === "select") return "use Space or click to select the actor that can reach the exit, then move that actor there";
  if (kind === "coverage") return "visit every orange required route marker, then enter the exit";
  if (["avoid", "antiloop"].includes(kind)) return "take a non-repeating route and do not step on forbidden or revisited cells";
  if (kind === "optimize") return "take the efficient route within the move budget";
  if (kind === "detour") return "ignore the blocked short route and use the longer detour around it";
  if (kind === "bottleneck") return "open the choke point with Space, pass through it, and continue to the exit";
  if (kind === "loop") return "step through the loop marker twice to align the state, then exit";
  if (["push", "sokoban", "blocking", "packing"].includes(kind)) return "push the tan block onto the green pad, then move to the exit";
  if (kind === "pull") return "drag the tethered tan block across the green pad, then move to the exit";
  if (["carry", "tool", "rotate", "objectslide", "swap", "unblocking", "build", "destroy", "transform", "temporary"].includes(kind)) return "click or press Space near the cyan work target to change it, then walk through the opened route to the exit";
  if (family >= 40 && family <= 46) return "click the required tan pieces in the panel to accept the arrangement, then go to the exit";
  if (kind === "pathdraw") return "click orthogonally adjacent cells to draw one continuous path from the player start to the yellow exit";
  if (family >= 47 && family <= 60) return "click the required panel symbols or cells until the panel accepts the selection, then go to the exit";
  if (family >= 61 && family <= 65) return "click or Space the process controls in the panel until the right side opens, then go to the exit";
  if (family >= 66 && family <= 68) return "click the circuit, pipe, or pressure controls in the panel until the network activates, then go to the exit";
  if (family >= 69 && family <= 82) return "use Space, bumps, or movement to advance the phase/process until the purple gate opens, then go to the exit";
  if (family >= 83 && family <= 93) return "click the resource markers in the panel until the required resource or threshold condition is met, then go to the exit";
  if (family >= 94 && family <= 103) return "click safe clue cells to reveal or confirm the rule, avoid harmful information if present, then go to the exit";
  if (family >= 104 && family <= 118) return "click rule tokens or press Space to set the needed mode/rule/program state, then go to the exit";
  if (family >= 119 && family <= 130) return "click the required constraint variables, or press Space for propagation/global update where applicable, then go to the exit";
  return "perform the family mechanic until the blocker is cleared, then move to the yellow exit";
}

function randFrom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function familyGlyph(family, offset = 0) {
  return COSMETIC_CHARS[(family * 5 + offset * 7) % COSMETIC_CHARS.length];
}

function reservePoint(reserved, x, y, radius = 0) {
  for (let yy = y - radius; yy <= y + radius; yy += 1) {
    for (let xx = x - radius; xx <= x + radius; xx += 1) {
      if (inBounds(xx, yy)) reserved.add(key(xx, yy));
    }
  }
}

function levelReservedCells(def) {
  const reserved = new Set();
  if (def.start) reservePoint(reserved, def.start[0], def.start[1], 1);
  if (def.goal) reservePoint(reserved, def.goal[0], def.goal[1], 1);
  for (const [x, y] of def.tokens || []) reservePoint(reserved, x, y, 1);
  for (const actor of def.actors || []) reservePoint(reserved, actor.x, actor.y, 1);
  for (const target of def.targets || []) {
    const [x, y] = target.split(",").map(Number);
    reservePoint(reserved, x, y, 1);
  }
  if (def.enemy) reservePoint(reserved, def.enemy.x, def.enemy.y, 1);
  if (def.follower) reservePoint(reserved, def.follower.x, def.follower.y, 1);
  return reserved;
}

function paintCosmetic(g, reserved, x, y, ch) {
  if (!inBounds(x, y)) return;
  if (reserved.has(key(x, y))) return;
  if (g[y][x] === ".") g[y][x] = ch;
}

function cosmeticLine(g, reserved, x1, y1, x2, y2, ch) {
  let x = x1;
  let y = y1;
  paintCosmetic(g, reserved, x, y, ch);
  while (x !== x2 || y !== y2) {
    if (x !== x2) x += Math.sign(x2 - x);
    if (y !== y2) y += Math.sign(y2 - y);
    paintCosmetic(g, reserved, x, y, ch);
  }
}

function cosmeticRect(g, reserved, x1, y1, x2, y2, ch) {
  for (let x = x1; x <= x2; x += 1) {
    paintCosmetic(g, reserved, x, y1, ch);
    paintCosmetic(g, reserved, x, y2, ch);
  }
  for (let y = y1; y <= y2; y += 1) {
    paintCosmetic(g, reserved, x1, y, ch);
    paintCosmetic(g, reserved, x2, y, ch);
  }
}

function addFamilySigil(g, reserved, family, variant) {
  const ch = familyGlyph(family, 4);
  const sx = 3 + ((family * 7) % 50);
  const sy = 3 + ((family * 11) % 50);
  let bits = (family * 2654435761 + variant * 1013904223) >>> 0;
  for (let y = 0; y < 6; y += 1) {
    for (let x = 0; x < 6; x += 1) {
      bits = (bits * 1664525 + 1013904223) >>> 0;
      if ((bits >>> 29) & 1) paintCosmetic(g, reserved, sx + x, sy + y, ch);
    }
  }
}

function addFamilyMotif(g, reserved, family, variant) {
  const a = familyGlyph(family, 0);
  const b = familyGlyph(family, 1);
  const c = familyGlyph(family, 2);
  const motif = family % 13;
  if (motif === 0) {
    for (let x = 4 + (family % 5); x < 61; x += 7 + (family % 4)) {
      for (let y = 3; y < 61; y += 2) paintCosmetic(g, reserved, x, y, (y + family) % 6 ? a : b);
    }
  } else if (motif === 1) {
    for (let y = 5 + (family % 4); y < 60; y += 6 + (family % 5)) {
      for (let x = 3; x < 61; x += 2) paintCosmetic(g, reserved, x, y, (x + variant) % 7 ? a : c);
    }
  } else if (motif === 2) {
    for (let d = -56; d < 64; d += 8 + (family % 5)) {
      cosmeticLine(g, reserved, Math.max(2, d), Math.max(2, -d), Math.min(61, d + 61), Math.min(61, 61 - d), a);
    }
  } else if (motif === 3) {
    const cx = 12 + ((family * 3) % 40);
    const cy = 12 + ((family * 5) % 40);
    for (let r = 4; r <= 18; r += 5) {
      for (let dx = -r; dx <= r; dx += 1) {
        paintCosmetic(g, reserved, cx + dx, cy - r, a);
        paintCosmetic(g, reserved, cx + dx, cy + r, a);
      }
      for (let dy = -r; dy <= r; dy += 1) {
        paintCosmetic(g, reserved, cx - r, cy + dy, b);
        paintCosmetic(g, reserved, cx + r, cy + dy, b);
      }
    }
  } else if (motif === 4) {
    for (let y = 4; y < 61; y += 4) {
      for (let x = 4 + ((y + family) % 5); x < 61; x += 10) paintCosmetic(g, reserved, x, y, (x + y) % 3 ? a : c);
    }
  } else if (motif === 5) {
    for (let i = 0; i < 7; i += 1) cosmeticRect(g, reserved, 4 + i * 3, 4 + i * 2, 60 - i * 2, 60 - i * 3, i % 2 ? a : b);
  } else if (motif === 6) {
    const y = 8 + ((family * 3) % 45);
    cosmeticLine(g, reserved, 3, y, 18, y + 8, a);
    cosmeticLine(g, reserved, 18, y + 8, 36, y - 4, b);
    cosmeticLine(g, reserved, 36, y - 4, 60, y + 10, c);
  } else if (motif === 7) {
    for (let x = 6; x < 59; x += 9) {
      cosmeticRect(g, reserved, x, 6 + ((x + family) % 9), Math.min(61, x + 5), 14 + ((x + family) % 9), a);
    }
  } else if (motif === 8) {
    for (let y = 5; y < 60; y += 5) {
      for (let x = 5; x < 60; x += 5) if (((x * 3 + y * 5 + family) % 11) < 4) paintCosmetic(g, reserved, x, y, a);
    }
  } else if (motif === 9) {
    let x1 = 5 + (family % 8);
    let y1 = 5 + (family % 6);
    let x2 = 58 - (family % 7);
    let y2 = 58 - (family % 5);
    while (x1 < x2 && y1 < y2) {
      cosmeticRect(g, reserved, x1, y1, x2, y2, (x1 + y1) % 2 ? a : b);
      x1 += 5;
      y1 += 4;
      x2 -= 4;
      y2 -= 5;
    }
  } else if (motif === 10) {
    for (let x = 4; x < 61; x += 4) {
      const h = 4 + ((x * family + variant) % 18);
      cosmeticLine(g, reserved, x, 58, x, Math.max(4, 58 - h), x % 8 ? a : c);
    }
  } else if (motif === 11) {
    for (let i = 0; i < 18; i += 1) {
      const x = 4 + ((family * 9 + i * 13) % 56);
      const y = 4 + ((family * 5 + i * 17) % 56);
      cosmeticRect(g, reserved, x, y, Math.min(61, x + 2 + (i % 4)), Math.min(61, y + 2 + ((i + family) % 4)), i % 2 ? a : b);
    }
  } else {
    for (let y = 3; y < 61; y += 3) {
      for (let x = 3; x < 61; x += 3) if (((x ^ y ^ family) % 9) === 0) paintCosmetic(g, reserved, x, y, (x + y) % 2 ? a : b);
    }
  }
}

function addIrrelevantClutter(g, reserved, family, variant) {
  const rnd = randFrom(family * 8191 + variant * 131);
  const count = 30 + (family % 35);
  for (let i = 0; i < count; i += 1) {
    const x = 2 + Math.floor(rnd() * 60);
    const y = 2 + Math.floor(rnd() * 60);
    const ch = familyGlyph(family, 3 + i);
    if (rnd() < 0.68) {
      paintCosmetic(g, reserved, x, y, ch);
    } else if (rnd() < 0.84) {
      cosmeticLine(g, reserved, x, y, Math.min(61, x + 2 + Math.floor(rnd() * 8)), y, ch);
    } else {
      cosmeticRect(g, reserved, x, y, Math.min(61, x + 2 + Math.floor(rnd() * 5)), Math.min(61, y + 2 + Math.floor(rnd() * 5)), ch);
    }
  }
}

function applyFamilyTemplate(id, def) {
  const match = id.match(/^L(\d{3})-(\d)$/);
  if (!match) return;
  const family = Number(match[1]);
  const variant = Number(match[2]);
  const grids = def.cosmeticGrids || (def.grid ? [def.grid] : []);
  for (let i = 0; i < grids.length; i += 1) {
    const reserved = levelReservedCells(def);
    addFamilyMotif(grids[i], reserved, family + i * 17, variant);
    addFamilySigil(grids[i], reserved, family + i * 17, variant);
    addIrrelevantClutter(grids[i], reserved, family + i * 17, variant);
  }
}

function finishLevel(id, title, short, objective, def) {
  applyFamilyTemplate(id, def);
  return {
    id,
    title,
    short,
    objective: withSolveHint(id, objective),
    family: id.slice(0, 4),
    legend: def.legend || [
      ["floor", C.floor],
      ["wall", C.wall],
      ["start", C.player],
      ["exit", C.goal],
    ],
    ...def,
  };
}

function directLevel(n, mod) {
  const g = grid(".");
  border(g);
  const start = [4, 8 + n * 4];
  const goal = [58, 8 + n * 4];
  g[goal[1]][goal[0]] = "G";
  const def = { grid: g, start, goal, marks: [] };
  let title = `${mod[0]} ${mod[1]}`;
  let objective = "Walk the confirmed route to the exit.";
  if (n === 1) {
    rect(g, 18, 1, 19, 62, "?");
    def.canMove = (x, y, ch, s) => ch !== "#" && (ch !== "?" || s.revealed.has(key(x, y)));
    def.onClick = (x, y, s) => {
      if (x === 18 || x === 19) s.revealed.add(key(x, y));
      s.message = "Clicked cells reveal whether the pale band is real floor.";
    };
    objective = "Click the pale band to reveal the floor bridge, then walk through it.";
  } else if (n === 2) {
    for (let x = 12; x < 56; x += 5) g[start[1] - 2][x] = "X";
    addHazardBlocks(g, [start, goal], 1);
    objective = "The direct lane contains a family-specific red tripwire pattern; read its shape, step around it, then return to the exit line.";
  } else if (n === 3) {
    def.tokens = [[18, start[1] - 5], [34, start[1] + 5], [50, start[1] - 5]];
    def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && s.tokens.size === 0;
    objective = "Leave the straight lane to collect the three orange markers before entering the exit.";
  } else if (n === 4) {
    g[goal[1]][goal[0]] = "P";
    def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && s.phase === 2;
    def.onSpace = (_x, _y, s) => {
      s.phase = (s.phase + 1) % 4;
      s.waited += 1;
      s.message = `Exit phase ${s.phase}; enter on phase 2.`;
    };
    def.render = (s) => dot(goal[0], goal[1], s.phase === 2 ? C.goal : C.purple, 2);
    objective = "Use Space to advance the exit phase; enter only when it turns yellow.";
  } else if (n === 5) {
    def.budget = 50;
    rect(g, 28, start[1] + 4, 30, start[1] + 4, "T");
    def.afterMove = (x, y, ch, s) => {
      if (ch === "T") {
        s.budget += 24;
        g[y][x] = ".";
        s.message = "Budget replenished.";
      }
    };
    objective = "The straight route is underfunded; detour to the orange refill, then reach the exit.";
  } else if (n === 6) {
    def.actors = [{ x: 4, y: start[1] + 10 }, { x: start[0], y: start[1] }];
    def.start = [start[0], start[1]];
    def.goal = goal;
    def.onClick = (x, y, s) => {
      const idx = s.actors.findIndex((a) => Math.abs(a.x - x) <= 2 && Math.abs(a.y - y) <= 2);
      if (idx >= 0) {
        s.active = idx;
        s.message = `Active body ${idx + 1}.`;
      }
    };
    def.isWin = (s) => s.actors[1].x === goal[0] && s.actors[1].y === goal[1];
    objective = "Click the upper avatar to make it active, then walk it to the exit.";
  } else if (n === 7) {
    const target = [30, start[1]];
    g[target[1]][target[0]] = "C";
    def.canMove = (x, y, ch, s) => ch !== "#" && (x < 40 || s.clicked.has(key(...target)));
    def.onClick = (x, y, s) => {
      if (x === target[0] && y === target[1]) {
        s.clicked.add(key(x, y));
        s.message = "The addressed cell confirms the second half of the route.";
      }
    };
    objective = "Click the cyan route address, then walk through the right half.";
  } else if (n === 8) {
    rect(g, 1, 1, 62, 62, "%");
    carve(g, [[4, 60], [58, 60], [58, 8], [20, 8], [20, 42], [50, 42], [50, 14]], ".");
    def.start = [4, 60];
    def.goal = [50, 14];
    g[14][50] = "G";
    objective = "Use the whole 64x64 field: follow the long marked route and do not search locally.";
  } else {
    rect(g, 1, 1, 62, 62, ".");
    rect(g, 20, 2, 42, 50, "X");
    carve(g, [[start[0], start[1]], [58, start[1]], [58, 56], [45, 56]], ".");
    def.goal = [45, 56];
    g[50][45] = "?";
    g[53][45] = "P";
    g[56][45] = "G";
    def.canMove = (x, y, ch, s) => {
      if (ch === "?") return s.revealed.has(key(x, y));
      if (ch === "P") return Boolean(s.flags.composedGate);
      return defaultPassable(ch);
    };
    def.onClick = (x, y, s) => {
      if (x === 45 && y === 50) {
        s.revealed.add(key(x, y));
        s.message = "The hidden part of the composed route is confirmed.";
      }
    };
    def.onSpace = (_x, _y, s) => {
      s.flags.composedGate = true;
      s.message = "The phase part of the composed route is open.";
    };
    def.isWin = (s) => s.x === def.goal[0] && s.y === def.goal[1] && s.revealed.has(key(45, 50)) && s.flags.composedGate;
    objective = "Resolve the composed route: click the hidden vertical cell, press Space for the phase gate, then exit.";
  }
  return finishLevel(`L001-${n}`, title, mod[1], objective, def);
}

function makeMaze(seed = 0) {
  const g = grid("#");
  for (let y = 2; y < 62; y += 4) {
    if ((y + seed) % 8 === 2) {
      carve(g, [[2, y], [61, y]], ".");
      carve(g, [[61, y], [61, Math.min(60, y + 4)]], ".");
    } else {
      carve(g, [[61, y], [2, y]], ".");
      carve(g, [[2, y], [2, Math.min(60, y + 4)]], ".");
    }
  }
  for (let x = 8 + (seed % 5); x < 58; x += 11) {
    for (let y = 6; y < 58; y += 12) {
      carve(g, [[x, y], [x, y + 5], [x + 5, y + 5]], ".");
    }
  }
  border(g);
  return g;
}

function mazeLevel(n, mod) {
  const g = makeMaze(n);
  const start = [2, 2];
  const goal = [61, 58];
  g[start[1]][start[0]] = ".";
  g[goal[1]][goal[0]] = "G";
  const def = { grid: g, start, goal };
  const objective = [
    "Probe the dim corridors; clicked fog cells reveal safe maze floor.",
    "Thread the maze without stepping into red penalty branches.",
    "Collect all orange side-room markers before exiting the maze.",
    "Use Space to wait until the purple timing door turns yellow.",
    "Solve the maze within the budget; orange pockets refund moves.",
    "Click the correct avatar before navigating the maze.",
    "Click the cyan edge-address to open the corridor it labels.",
    "Use landmarks to plan across the full 64x64 maze.",
    "Reject the red decoy maze and use the true gray corridor system.",
  ][n - 1];
  if (n === 1) {
    for (let y = 2; y < 61; y += 8) for (let x = 10; x < 58; x += 10) if (g[y][x] === ".") g[y][x] = "?";
    def.canMove = (x, y, ch, s) => ch !== "#" && (ch !== "?" || s.revealed.has(key(x, y)));
    def.onClick = (x, y, s) => {
      if (tileAt(x, y) === "?") s.revealed.add(key(x, y));
      s.message = "Fog cell checked.";
    };
  } else if (n === 2) {
    for (let y = 6; y < 58; y += 10) g[y][Math.min(61, 12 + y)] = "X";
    carve(g, [[29, 2], [29, 4], [31, 4], [31, 2]], ".");
    carve(g, [[2, 29], [4, 29], [4, 31], [2, 31]], ".");
    g[2][30] = "X";
    g[30][2] = "X";
    addHazardBlocks(g, [[2, 2], [61, 2], [61, 58]], 2);
  } else if (n === 3) {
    def.tokens = [[20, 10], [52, 22], [18, 42]];
    def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && s.tokens.size === 0;
  } else if (n === 4) {
    g[42][61] = "P";
    def.canMove = (x, y, ch, s) => ch !== "#" && (ch !== "P" || s.phase === 1);
    def.onSpace = (_x, _y, s) => {
      s.phase = 1 - s.phase;
      s.message = s.phase ? "Timing door open." : "Timing door closed.";
    };
    def.render = (s) => dot(61, 42, s.phase ? C.goal : C.purple, 2);
  } else if (n === 5) {
    def.budget = 100;
    g[30][55] = "T";
    def.afterMove = (x, y, _ch, s) => {
      if (x === 55 && y === 30 && !s.flags.refill) {
        s.flags.refill = true;
        s.budget += 160;
        g[y][x] = ".";
        s.message = "Maze budget refilled.";
      }
    };
  } else if (n === 6) {
    def.actors = [{ x: 40, y: 10 }, { x: start[0], y: start[1] }];
    def.onClick = (x, y, s) => {
      const idx = s.actors.findIndex((a) => Math.abs(a.x - x) <= 2 && Math.abs(a.y - y) <= 2);
      if (idx >= 0) s.active = idx;
    };
    def.isWin = (s) => s.actors[1].x === goal[0] && s.actors[1].y === goal[1];
  } else if (n === 7) {
    rect(g, 48, 42, 50, 42, "%");
    g[42][61] = "%";
    g[58][40] = "%";
    def.onClick = (x, y, s) => {
      if (x >= 48 && x <= 50 && y === 42) {
        s.flags.edge = true;
        s.message = "Edge address accepted.";
      }
    };
    def.canMove = (x, y, ch, s) => ch !== "#" && (ch !== "%" || s.flags.edge);
  } else if (n === 9) {
    for (let y = 5; y < 55; y += 5) g[y][32] = "X";
    g[2][30] = "?";
    g[30][2] = "?";
    g[42][61] = "P";
    g[58][40] = "P";
    def.canMove = (x, y, ch, s) => {
      if (ch === "?") return s.revealed.has(key(x, y));
      if (ch === "P") return Boolean(s.flags.composedGate);
      return ch !== "#";
    };
    def.onClick = (x, y, s) => {
      if (x === 30 && y === 2) {
        s.revealed.add(key(x, y));
        s.message = "The hidden maze segment is confirmed.";
      }
      if (x === 2 && y === 30) {
        s.revealed.add(key(x, y));
        s.message = "The hidden maze segment is confirmed.";
      }
    };
    def.onSpace = (_x, _y, s) => {
      s.flags.composedGate = true;
      s.message = "The maze phase segment is open.";
    };
  }
  return finishLevel(`L002-${n}`, `${mod[0]} ${mod[1]}`, mod[1], objective, def);
}

function passabilityLevel(n, mod) {
  const g = grid("V");
  border(g);
  const start = [5, 54];
  const goal = [58, 8];
  for (let y = 10; y < 58; y += 8) carve(g, [[8, y], [55, y]], n % 2 ? "," : "H");
  carve(g, [[5, 54], [18, 54], [18, 42], [34, 42], [34, 24], [58, 24], [58, 8]], "F");
  g[goal[1]][goal[0]] = "G";
  const def = {
    grid: g,
    start,
    goal,
    canMove: (x, y, ch, s) => {
      if (ch === "V" || ch === "#") return false;
      if (ch === "H") return Boolean(s.flags.holesSafe);
      if (ch === "?") return s.revealed.has(key(x, y));
      return true;
    },
    legend: [["true floor", C.safe], ["false floor", C.dark], ["void", C.void], ["exit", C.goal]],
  };
  const objective = [
    "Click unknown tiles to learn which apparent floor is real, then walk only on true floor.",
    "Avoid red false floors; stepping on them loses.",
    "Collect samples from each true-floor type before exiting.",
    "Use Space to toggle when temporary-looking floor is solid.",
    "Use the move budget to test as little terrain as possible.",
    "Click the lower probe-body, test terrain, then return control to the traveler.",
    "Click the cyan terrain class label before that class becomes passable.",
    "Plan across the whole field of mixed floor, void, and false trails.",
    "Ignore the decorative passable-looking loop; the true floor is the narrow green path.",
  ][n - 1];
  if (n === 1) {
    for (const [x, y] of [[18, 42], [34, 42], [34, 24]]) g[y][x] = "?";
    def.onClick = (x, y, s) => {
      if (tileAt(x, y) === "?") s.revealed.add(key(x, y));
    };
  } else if (n === 2) {
    for (let x = 20; x < 56; x += 6) g[40][x] = "X";
    addHazardBlocks(g, [[5, 54], [18, 54], [18, 42], [34, 42], [34, 24], [58, 24], [58, 8]], 3);
  } else if (n === 3) {
    def.tokens = [[18, 54], [34, 42], [58, 24]];
    def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && s.tokens.size === 0;
  } else if (n === 4) {
    for (let x = 36; x < 56; x += 2) g[24][x] = "P";
    def.canMove = (x, y, ch, s) => ch !== "V" && ch !== "#" && (ch !== "P" || s.phase === 1);
    def.onSpace = (_x, _y, s) => {
      s.phase = 1 - s.phase;
      s.message = s.phase ? "Purple floor is solid." : "Purple floor is mist.";
    };
  } else if (n === 5) {
    def.budget = 110;
  } else if (n === 6) {
    def.actors = [{ x: start[0], y: start[1] }, { x: 10, y: 10 }];
    def.onClick = (x, y, s) => {
      const idx = s.actors.findIndex((a) => Math.abs(a.x - x) <= 2 && Math.abs(a.y - y) <= 2);
      if (idx >= 0) s.active = idx;
    };
  } else if (n === 7) {
    g[12][12] = "C";
    for (let y = 25; y < 42; y += 1) g[y][34] = "H";
    def.onClick = (x, y, s) => {
      if (x === 12 && y === 12) {
        s.flags.holesSafe = true;
        s.message = "Dark floor class accepted as real.";
      }
    };
  } else if (n === 8) {
    for (let y = 2; y < 62; y += 6) for (let x = 2; x < 62; x += 6) g[y][x] = y % 12 ? "H" : ",";
  } else if (n === 9) {
    rect(g, 38, 28, 55, 52, "H");
    carve(g, [[5, 54], [18, 54], [18, 42], [34, 42], [34, 24], [58, 24], [58, 8]], "F");
  }
  return finishLevel(`L003-${n}`, `${mod[0]} ${mod[1]}`, mod[1], objective, def);
}

function topologyLevel(n, mod) {
  const g = grid("#");
  border(g);
  const start = [5, 5];
  const goal = [58, 58];
  carve(g, [[5, 5], [28, 5]], ".");
  carve(g, [[40, 58], [58, 58]], ".");
  g[goal[1]][goal[0]] = "G";
  const links = new Map();
  const addLink = (a, b) => {
    links.set(key(...a), b);
    links.set(key(...b), a);
    g[a[1]][a[0]] = "P";
    g[b[1]][b[0]] = "P";
  };
  addLink([28, 5], [40, 58]);
  const def = {
    grid: g,
    start,
    goal,
    afterMove: (x, y, _ch, s) => {
      const dest = links.get(key(x, y));
      if (dest && (n !== 1 || s.revealed.has(key(x, y)))) {
        setCurrentActor(dest[0], dest[1]);
        s.message = "Nonlocal adjacency used.";
      }
    },
    legend: [["floor", C.floor], ["wall", C.wall], ["topology link", C.purple], ["exit", C.goal]],
  };
  const objective = [
    "Click the purple node to reveal that it is adjacent to the far node.",
    "Use the link while avoiding red wrong-link cells.",
    "Collect both topology anchors before exiting.",
    "Use Space to open the link only on the correct phase.",
    "Use the nonlocal jump to stay within the move budget.",
    "Click the correct body, then use the topology link.",
    "Click the cyan graph endpoint to address the nonlocal edge.",
    "Read the whole 64x64 field as a sparse graph, not a walking map.",
    "Reject the visible dead-end route and use the nonlocal edge.",
  ][n - 1];
  if (n === 1) {
    def.onClick = (x, y, s) => {
      const k = key(x, y);
      if (links.has(k)) {
        s.revealed.add(k);
        const actor = currentActor();
        const dest = links.get(key(actor.x, actor.y));
        if (dest && s.revealed.has(key(actor.x, actor.y))) setCurrentActor(dest[0], dest[1]);
      }
    };
  } else if (n === 2) {
    addHazardBlocks(g, [[5, 5], [28, 5]], 4);
    g[32][32] = "X";
  } else if (n === 3) {
    def.tokens = [[28, 5], [40, 58]];
    def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && s.tokens.size === 0;
  } else if (n === 4) {
    def.afterMove = (x, y, _ch, s) => {
      const dest = links.get(key(x, y));
      if (dest && s.phase === 1) setCurrentActor(dest[0], dest[1]);
    };
    def.onSpace = (_x, _y, s) => {
      s.phase = 1 - s.phase;
      s.message = s.phase ? "Topology link open." : "Topology link closed.";
      const actor = currentActor();
      const dest = links.get(key(actor.x, actor.y));
      if (dest && s.phase === 1) setCurrentActor(dest[0], dest[1]);
    };
  } else if (n === 5) {
    def.budget = 35;
    carve(g, [[17, 5], [17, 7], [19, 7], [19, 5]], ".");
    g[7][17] = "T";
    mergeAfterMove(def, (x, y, _ch, s) => {
      if (x === 17 && y === 7 && !s.flags.topologyRefill) {
        s.flags.topologyRefill = true;
        s.budget += 24;
        g[y][x] = ".";
        s.message = "Topology budget refilled.";
      }
    });
  } else if (n === 6) {
    g[50][8] = ".";
    def.actors = [{ x: 8, y: 50 }, { x: start[0], y: start[1] }];
    def.onClick = (x, y, s) => {
      const idx = s.actors.findIndex((a) => Math.abs(a.x - x) <= 2 && Math.abs(a.y - y) <= 2);
      if (idx >= 0) s.active = idx;
    };
    def.isWin = (s) => s.actors[1].x === goal[0] && s.actors[1].y === goal[1];
  } else if (n === 7) {
    g[28][4] = "C";
    def.afterMove = (x, y, _ch, s) => {
      const dest = links.get(key(x, y));
      if (dest && s.flags.edge) setCurrentActor(dest[0], dest[1]);
    };
    def.onClick = (x, y, s) => {
      if (x === 28 && y === 4) {
        s.flags.edge = true;
        const actor = currentActor();
        const dest = links.get(key(actor.x, actor.y));
        if (dest) setCurrentActor(dest[0], dest[1]);
      }
    };
  } else if (n === 8) {
    addLink([4, 48], [50, 12]);
    carve(g, [[20, 5], [20, 20]], ".");
    def.tokens = [[20, 20]];
    def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && s.tokens.size === 0;
  } else if (n === 9) {
    carve(g, [[5, 5], [28, 5], [28, 45]], ".");
    g[28][45] = "X";
    g[5][18] = "?";
    g[5][24] = "P";
    def.canMove = (x, y, ch, s) => {
      if (ch === "?") return s.revealed.has(key(x, y));
      if (ch === "P") return Boolean(s.flags.composedGate);
      return defaultPassable(ch);
    };
    def.onClick = (x, y, s) => {
      if (x === 18 && y === 5) {
        s.revealed.add(key(x, y));
        s.message = "The hidden topology segment is confirmed.";
      }
    };
    def.onSpace = (_x, _y, s) => {
      s.flags.composedGate = true;
      s.message = "The topology phase segment is open.";
    };
  }
  return finishLevel(`L004-${n}`, `${mod[0]} ${mod[1]}`, mod[1], objective, def);
}

function layerLevel(n, mod) {
  const a = grid("#");
  const b = grid("#");
  border(a);
  border(b);
  const start = [4, 60];
  const goal = [58, 4];
  carve(a, [[4, 60], [20, 60], [20, 35], [36, 35]], ".");
  carve(b, [[36, 35], [36, 16], [58, 16], [58, 4]], ".");
  a[35][36] = "B";
  b[35][36] = "B";
  b[goal[1]][goal[0]] = "G";
  const def = {
    start,
    goal,
    cosmeticGrids: [a, b],
    getGrid: (s) => (s.layer === 0 ? a : b),
    canMove: (_x, _y, ch) => ch !== "#",
    onSpace: (_x, _y, s) => {
      const next = 1 - s.layer;
      const actor = currentActor();
      const targetGrid = next === 0 ? a : b;
      if (targetGrid[actor.y][actor.x] === "#") {
        s.message = "No matching floor on the other layer here.";
        return;
      }
      s.layer = next;
      s.message = `Layer ${s.layer + 1}.`;
    },
    legend: [["layer 1 floor", C.floor], ["layer 2 floor", C.floor2], ["sync tile", C.blue], ["exit", C.goal]],
  };
  const objective = [
    "Reveal which sync cells exist on both layers, then switch layers with Space.",
    "Avoid red cells that are safe on one layer but lethal on the other.",
    "Collect layer tokens on both planes before exiting.",
    "Switch layers only when the phase door is open.",
    "Budget moves and layer switches to reach the exit.",
    "Click the active traveler before changing layers.",
    "Click the cyan layer address before the matching plane accepts movement.",
    "Use the full 64x64 map as two interleaved planes.",
    "Reject the decoy plane route; switch only at the true sync tile.",
  ][n - 1];
  if (n === 1) {
    a[35][36] = "?";
    b[35][36] = "?";
    def.canMove = (x, y, ch, s) => ch !== "#" && (ch !== "?" || s.revealed.has(key(x, y)));
    def.onClick = (x, y, s) => {
      if (x === 36 && y === 35) s.revealed.add(key(x, y));
    };
  } else if (n === 2) {
    addHazardBlocks(a, [[4, 60], [20, 60], [20, 35], [36, 35]], 5);
    addHazardBlocks(b, [[36, 35], [36, 16], [58, 16], [58, 4]], 22);
  } else if (n === 3) {
    def.tokens = [[20, 50], [36, 30], [58, 16]];
    def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && s.layer === 1 && s.tokens.size === 0;
  } else if (n === 4) {
    def.onSpace = (_x, _y, s) => {
      s.phase = (s.phase + 1) % 3;
      if (s.phase === 2) {
        const next = 1 - s.layer;
        const actor = currentActor();
        const targetGrid = next === 0 ? a : b;
        if (targetGrid[actor.y][actor.x] !== "#") {
          s.layer = next;
          s.message = `Switched to layer ${s.layer + 1}.`;
        } else {
          s.message = "Phase is right, but this cell has no paired floor.";
        }
      } else {
        s.message = `Phase ${s.phase}; switch resolves on phase 2.`;
      }
    };
  } else if (n === 5) {
    def.budget = 96;
  } else if (n === 6) {
    def.actors = [{ x: start[0], y: start[1] }, { x: 8, y: 8 }];
    def.onClick = (x, y, s) => {
      const idx = s.actors.findIndex((actor) => Math.abs(actor.x - x) <= 2 && Math.abs(actor.y - y) <= 2);
      if (idx >= 0) s.active = idx;
    };
  } else if (n === 7) {
    a[34][36] = "C";
    b[34][36] = "C";
    def.canMove = (x, y, ch, s) => ch !== "#" && (ch !== "B" || s.flags.layerAddress);
    def.onClick = (x, y, s) => {
      if (x === 36 && y === 34) s.flags.layerAddress = true;
    };
  } else if (n === 8) {
    carve(a, [[4, 60], [4, 10], [32, 10], [32, 35]], ".");
    carve(b, [[36, 35], [60, 35], [60, 4], [58, 4]], ".");
  } else if (n === 9) {
    carve(a, [[4, 60], [50, 60], [50, 45]], ".");
    a[45][50] = "X";
  }
  def.render = (s) => {
    if (s.layer === 1) {
      ctx.globalAlpha = 0.25;
      paintGrid(a);
      ctx.globalAlpha = 1;
    }
  };
  return finishLevel(`L005-${n}`, `${mod[0]} ${mod[1]}`, mod[1], objective, def);
}

function arena(route, fill = "#") {
  const g = grid(fill);
  border(g);
  carve(g, route, ".");
  return g;
}

function expandedPath(points) {
  const cells = [];
  let [x, y] = points[0];
  cells.push([x, y]);
  for (let i = 1; i < points.length; i += 1) {
    const [tx, ty] = points[i];
    while (x !== tx) {
      x += Math.sign(tx - x);
      cells.push([x, y]);
    }
    while (y !== ty) {
      y += Math.sign(ty - y);
      cells.push([x, y]);
    }
  }
  return cells;
}

function routeCell(route, fraction) {
  const cells = expandedPath(route);
  const idx = Math.max(2, Math.min(cells.length - 3, Math.floor(cells.length * fraction)));
  return cells[idx];
}

function carvePocket(g, route, fraction, preferred = 1) {
  const [x, y] = routeCell(route, fraction);
  const path = new Set(expandedPath(route).map(([px, py]) => key(px, py)));
  const options = [[0, preferred], [preferred, 0], [0, -preferred], [-preferred, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
  let tx = x;
  let ty = y;
  for (const [dx, dy] of options) {
    const cx = x + dx;
    const cy = y + dy;
    if (inBounds(cx, cy) && !path.has(key(cx, cy))) {
      tx = cx;
      ty = cy;
      break;
    }
  }
  g[y][x] = ".";
  g[ty][tx] = ".";
  return [tx, ty];
}

function mergeCanMove(def, test) {
  const oldCanMove = def.canMove;
  def.canMove = (x, y, ch, s) => {
    const base = oldCanMove ? oldCanMove(x, y, ch, s) : defaultPassable(ch);
    return base && test(x, y, ch, s);
  };
}

function mergeClick(def, action) {
  const oldClick = def.onClick;
  def.onClick = (x, y, s) => {
    action(x, y, s);
    if (oldClick) oldClick(x, y, s);
  };
}

function mergeSpace(def, action) {
  const oldSpace = def.onSpace;
  def.onSpace = (x, y, s) => {
    action(x, y, s);
    if (oldSpace) oldSpace(x, y, s);
  };
}

function mergeAfterMove(def, action) {
  const oldAfterMove = def.afterMove;
  def.afterMove = (x, y, ch, s) => {
    if (oldAfterMove) oldAfterMove(x, y, ch, s);
    action(x, y, ch, s);
  };
}

function mergeWin(def, requirement) {
  const oldWin = def.isWin;
  def.isWin = (s) => {
    const base = oldWin
      ? oldWin(s)
      : s.actors
        ? s.actors.some((actor) => actor.x === def.goal[0] && actor.y === def.goal[1])
        : s.x === def.goal[0] && s.y === def.goal[1];
    return base && requirement(s);
  };
}

function safeHazardCell(g, x, y) {
  if (!inBounds(x, y)) return false;
  return [".", ",", "F", "H", "Y", "Z"].includes(g[y][x]);
}

function setHazard(g, x, y) {
  if (safeHazardCell(g, x, y)) g[y][x] = "X";
}

function hazardAnchor(g, route, family, protectedCells = new Set(), span = 1) {
  const cells = expandedPath(route);
  const candidates = [];
  for (let i = 4 + span; i < cells.length - 5 - span; i += 1) {
    const [x, y] = cells[i];
    const [px, py] = cells[i - 2];
    const [nx, ny] = cells[i + 2];
    if (x < 4 || x > 59 || y < 4 || y > 59) continue;
    let clearSpan = true;
    for (let j = i - span - 1; j <= i + span + 1; j += 1) {
      const [rx, ry] = cells[j] || [];
      if (!inBounds(rx, ry) || protectedCells.has(key(rx, ry))) clearSpan = false;
      if (j >= i - span && j <= i + span && !safeHazardCell(g, rx, ry)) clearSpan = false;
    }
    if (!clearSpan) continue;
    if (py === y && ny === y) candidates.push({ i, horizontal: true });
    if (px === x && nx === x) candidates.push({ i, horizontal: false });
  }
  if (!candidates.length) {
    return null;
  }
  return { cells, ...candidates[(family * 11) % candidates.length] };
}

function addHazardBypass(g, route, family = 0, protectedCells = new Set()) {
  const span = 1 + (family % 3);
  const anchor = hazardAnchor(g, route, family, protectedCells, span);
  if (!anchor) return false;
  const { cells, i, horizontal } = anchor;
  const before = cells[Math.max(0, i - span - 1)];
  const after = cells[Math.min(cells.length - 1, i + span + 1)];
  const center = cells[i];
  const normalSign = ((family + center[0] + center[1]) % 2 ? 1 : -1);
  const maxDepth = horizontal
    ? Math.min(center[1] - 2, H - 3 - center[1])
    : Math.min(center[0] - 2, W - 3 - center[0]);
  const depth = Math.max(2, Math.min(7, 2 + (family % 6), maxDepth));
  const actualSign = horizontal
    ? (center[1] + normalSign * depth > 1 && center[1] + normalSign * depth < H - 2 ? normalSign : -normalSign)
    : (center[0] + normalSign * depth > 1 && center[0] + normalSign * depth < W - 2 ? normalSign : -normalSign);
  const t = ([x, y]) => (horizontal ? x : y);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const make = (tv, nv) => horizontal
    ? [clamp(tv, 2, W - 3), clamp(center[1] + actualSign * nv, 2, H - 3)]
    : [clamp(center[0] + actualSign * nv, 2, W - 3), clamp(tv, 2, H - 3)];
  const tBefore = t(before);
  const tAfter = t(after);
  const tCenter = t(center);
  const tMid = Math.round((tBefore + tAfter) / 2);
  const dir = Math.sign(tAfter - tBefore) || 1;
  const style = family % 10;
  let bypass;
  if (style === 0) {
    bypass = [before, make(tBefore, depth), make(tAfter, depth), after];
  } else if (style === 1) {
    bypass = [before, make(tBefore, depth), make(tCenter, depth), make(tCenter, depth + 2), make(tAfter, depth + 2), after];
  } else if (style === 2) {
    bypass = [before, make(tBefore, depth + 1), make(tMid, depth + 1), make(tMid, depth + 4), make(tAfter, depth + 4), after];
  } else if (style === 3) {
    bypass = [before, make(tBefore, depth), make(tBefore + dir * 2, depth + 3), make(tAfter - dir * 2, depth + 3), make(tAfter, depth), after];
  } else if (style === 4) {
    bypass = [before, make(tBefore, depth + 3), make(tCenter - dir * 3, depth + 3), make(tCenter - dir * 3, depth), make(tCenter + dir * 3, depth), make(tCenter + dir * 3, depth + 3), make(tAfter, depth + 3), after];
  } else if (style === 5) {
    bypass = [before, make(tBefore, depth), make(tMid - dir * 2, depth), make(tMid - dir * 2, depth + 2), make(tMid + dir * 2, depth + 2), make(tMid + dir * 2, depth), make(tAfter, depth), after];
  } else if (style === 6) {
    bypass = [before, make(tBefore, depth + 2), make(tBefore + dir * 4, depth + 2), make(tBefore + dir * 4, depth), make(tAfter - dir * 4, depth), make(tAfter - dir * 4, depth + 2), make(tAfter, depth + 2), after];
  } else if (style === 7) {
    bypass = [before, make(tBefore, depth), make(tCenter, depth), make(tCenter, depth + 4), make(tCenter + dir * 5, depth + 4), make(tCenter + dir * 5, depth + 1), make(tAfter, depth + 1), after];
  } else if (style === 8) {
    bypass = [before, make(tBefore, depth + 1), make(tBefore + dir * 3, depth + 1), make(tBefore + dir * 3, depth + 4), make(tAfter - dir * 3, depth + 4), make(tAfter - dir * 3, depth + 1), make(tAfter, depth + 1), after];
  } else {
    bypass = [before, make(tBefore, depth), make(tCenter - dir * 4, depth), make(tCenter - dir * 4, depth + 2), make(tCenter, depth + 2), make(tCenter, depth + 5), make(tCenter + dir * 4, depth + 5), make(tCenter + dir * 4, depth), make(tAfter, depth), after];
  }
  const bypassCells = expandedPath(bypass);
  const bypassKeys = new Set(bypassCells.map(([x, y]) => key(x, y)));
  const routeKeys = new Set(cells.map(([x, y]) => key(x, y)));
  const routeHazards = [];
  for (let j = i - span; j <= i + span; j += 1) {
    if (cells[j]) routeHazards.push(cells[j]);
  }
  const routeHazardKeys = new Set(routeHazards.map(([x, y]) => key(x, y)));
  for (const [x, y] of bypassCells) {
    const k = key(x, y);
    if (!routeHazardKeys.has(k) && (g[y][x] === "X" || g[y][x] === "!")) return false;
  }
  carve(g, bypass, ".");
  for (const [x, y] of routeHazards) setHazard(g, x, y);
  for (const [x, y] of routeHazards) protectedCells.add(key(x, y));
  for (const [x, y] of bypassCells) protectedCells.add(key(x, y));
  const rnd = randFrom(family * 4241 + 17);
  const decoyCount = 1 + (family % 7);
  let placed = 0;
  let attempts = 0;
  while (placed < decoyCount && attempts < 80) {
    attempts += 1;
    const dx = Math.floor(rnd() * 17) - 8;
    const dy = Math.floor(rnd() * 17) - 8;
    const x = center[0] + dx;
    const y = center[1] + dy;
    const k = key(x, y);
    if (bypassKeys.has(k) || routeKeys.has(k)) continue;
    if (!safeHazardCell(g, x, y)) continue;
    setHazard(g, x, y);
    placed += 1;
  }
  return true;
}

function addHazardBlocks(g, route, family = 0) {
  const protectedCells = new Set();
  const routeCells = expandedPath(route);
  const desired = 4 + (family % 5);
  for (const [x, y] of routeCells.slice(0, 3)) protectedCells.add(key(x, y));
  for (const [x, y] of routeCells.slice(-3)) protectedCells.add(key(x, y));
  let placed = 0;
  for (let attempt = 0; attempt < desired * 12 && placed < desired; attempt += 1) {
    if (addHazardBypass(g, route, family + attempt * 37, protectedCells)) placed += 1;
  }
  if (placed < 2) placed += addSparseHazardClusters(g, route, family, protectedCells);
  repairHazardConnectivity(g, route[0], route[route.length - 1]);
  return placed;
}

function addSparseHazardClusters(g, route, family, protectedCells) {
  const offsets = [
    [[-1, -1], [-1, 0], [0, -1]],
    [[1, -1], [1, 0], [0, -1], [2, 0]],
    [[-1, 1], [0, 1], [1, 1]],
    [[-2, 0], [-1, 0], [1, 1], [2, 1]],
    [[0, -2], [0, -1], [1, 1], [1, 2]],
  ];
  let placed = 0;
  for (let i = 1; i < route.length - 1; i += 1) {
    const [cx, cy] = route[i];
    const cluster = offsets[(family + i) % offsets.length];
    let clusterPlaced = false;
    for (const [dx, dy] of cluster) {
      const x = cx + dx;
      const y = cy + dy;
      if (protectedCells.has(key(x, y)) || !safeHazardCell(g, x, y)) continue;
      setHazard(g, x, y);
      protectedCells.add(key(x, y));
      clusterPlaced = true;
    }
    if (clusterPlaced) placed += 1;
  }
  return placed;
}

function repairHazardConnectivity(g, start, goal) {
  const cellCost = (x, y) => {
    if (!inBounds(x, y)) return Infinity;
    const ch = g[y][x];
    if (ch === "#" || ch === "%" || ch === "V" || ch === "!") return Infinity;
    return ch === "X" ? 1 : 0;
  };
  const startKey = key(start[0], start[1]);
  const dist = new Map([[startKey, 0]]);
  const prev = new Map();
  const q = [[start[0], start[1]]];
  while (q.length) {
    q.sort((a, b) => dist.get(key(a[0], a[1])) - dist.get(key(b[0], b[1])));
    const [x, y] = q.shift();
    if (x === goal[0] && y === goal[1]) break;
    const base = dist.get(key(x, y));
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      const cost = cellCost(nx, ny);
      if (cost === Infinity) continue;
      const nk = key(nx, ny);
      const nd = base + cost;
      if (!dist.has(nk) || nd < dist.get(nk)) {
        dist.set(nk, nd);
        prev.set(nk, key(x, y));
        q.push([nx, ny]);
      }
    }
  }
  const goalKey = key(goal[0], goal[1]);
  if (!dist.has(goalKey)) return false;
  let k = goalKey;
  while (k !== startKey) {
    const [x, y] = k.split(",").map(Number);
    if (g[y][x] === "X") g[y][x] = ".";
    k = prev.get(k);
    if (!k) break;
  }
  return true;
}

function addModifierFeatures(def, g, n, route, goal, family = 0) {
  if (n === 1) {
    const [x, y] = routeCell(route, 0.32);
    g[y][x] = "?";
    mergeCanMove(def, (tx, ty, ch, s) => ch !== "?" || s.revealed.has(key(tx, ty)));
    mergeClick(def, (x2, y2, s) => {
      if (x2 === x && y2 === y) {
        s.revealed.add(key(x2, y2));
        s.message = "The hidden passage is confirmed.";
      }
    });
  } else if (n === 2) {
    addHazardBlocks(g, route, family);
  } else if (n === 3) {
    const tokens = [carvePocket(g, route, 0.24, -1), carvePocket(g, route, 0.48, 1), carvePocket(g, route, 0.72, -1)];
    def.tokens = [...(def.tokens || []), ...tokens];
    mergeWin(def, (s) => s.tokens.size === 0);
  } else if (n === 4) {
    const [x, y] = routeCell(route, 0.52);
    g[y][x] = "P";
    mergeCanMove(def, (_tx, _ty, ch, s) => ch !== "P" || s.flags.modPhaseOpen);
    mergeSpace(def, (_x2, _y2, s) => {
      s.phase = 1 - s.phase;
      s.flags.modPhaseOpen = !s.flags.modPhaseOpen;
      s.message = s.flags.modPhaseOpen ? "Timing cell is open." : "Timing cell is closed.";
    });
  } else if (n === 5) {
    const routeLen = expandedPath(route).length;
    const refill = carvePocket(g, route, 0.56, 1);
    g[refill[1]][refill[0]] = "T";
    def.budget = Math.max(20, routeLen - 10);
    mergeAfterMove(def, (x, y, _ch, s) => {
      if (x === refill[0] && y === refill[1] && !s.flags.modRefill) {
        s.flags.modRefill = true;
        s.budget += 30;
        g[y][x] = ".";
        s.message = "Resource refill collected.";
      }
    });
  } else if (n === 6) {
    const [gx, gy] = routeCell(route, 0.38);
    const anchor = carvePocket(g, route, 0.18, -1);
    g[gy][gx] = "C";
    g[anchor[1]][anchor[0]] = "B";
    mergeCanMove(def, (_tx, _ty, ch, s) => ch !== "C" || s.flags.modControl);
    mergeClick(def, (x, y, s) => {
      if (Math.abs(x - anchor[0]) <= 1 && Math.abs(y - anchor[1]) <= 1) {
        s.flags.modControl = true;
        s.message = "Control anchor selected.";
      }
    });
  } else if (n === 7) {
    const [x, y] = routeCell(route, 0.42);
    const marker = carvePocket(g, route, 0.78, 1);
    g[y][x] = "C";
    g[marker[1]][marker[0]] = "K";
    mergeCanMove(def, (_tx, _ty, ch, s) => ch !== "C" || s.flags.address);
    mergeClick(def, (x2, y2, s) => {
      if (Math.abs(x2 - marker[0]) <= 1 && Math.abs(y2 - marker[1]) <= 1) {
        s.flags.address = true;
        s.message = "Spatial address accepted.";
      }
    });
  } else if (n === 8) {
    const far = [W - 6, H - 6];
    carve(g, [routeCell(route, 0.62), [far[0], far[1]]], ".");
    g[far[1]][far[0]] = "T";
    def.tokens = [...(def.tokens || []), far];
    mergeWin(def, (s) => s.tokens.size === 0);
    for (let y = 6; y < 60; y += 9) carve(g, [[4, y], [60, y]], y % 18 ? "," : ".");
  } else if (n === 9) {
    const [hx, hy] = routeCell(route, 0.28);
    const [px, py] = routeCell(route, 0.64);
    g[hy][hx] = "?";
    g[py][px] = "P";
    mergeCanMove(def, (tx, ty, ch, s) => {
      if (ch === "?") return s.revealed.has(key(tx, ty));
      if (ch === "P") return s.flags.modPhaseOpen;
      return true;
    });
    mergeClick(def, (x, y, s) => {
      if (x === hx && y === hy) {
        s.revealed.add(key(x, y));
        s.message = "First composition condition revealed.";
      }
    });
    mergeSpace(def, (_x, _y, s) => {
      s.flags.modPhaseOpen = true;
      s.message = "Second composition condition opened.";
    });
    for (let y = 12; y < 52; y += 8) if (g[y][32] === "#") g[y][32] = "X";
  }
}

function coordinateLevel(n, mod) {
  const route = [[6, 56], [22, 56], [22, 36], [44, 36], [44, 16], [58, 16]];
  const g = arena(route);
  const start = route[0];
  const goal = route[route.length - 1];
  g[goal[1]][goal[0]] = "G";
  const transforms = [
    (dx, dy) => [dy, -dx],
    (dx, dy) => [-dx, dy],
    (dx, dy) => [dy, dx],
    (dx, dy, s) => (s.phase ? [-dy, dx] : [dx, dy]),
    (dx, dy) => [dx, dy],
    (dx, dy, s) => (s.active === 1 ? [-dx, -dy] : [dx, dy]),
    (dx, dy) => [dy, -dx],
    (dx, dy) => [dx, dy],
    (dx, dy, s) => (s.moves % 2 ? [-dy, dx] : [dx, dy]),
  ];
  const def = {
    grid: g,
    start,
    goal,
    beforeMove: (dx, dy, _nx, _ny, s) => {
      const actor = currentActor();
      const [mx, my] = transforms[n - 1](dx, dy, s);
      return { x: actor.x + mx, y: actor.y + my };
    },
    legend: [["floor", C.floor], ["wall", C.wall], ["frame cue", C.cyan], ["exit", C.goal]],
  };
  def.marks = [{ x: 3, y: 3, color: C.cyan, size: 4 }];
  addModifierFeatures(def, g, n, route, goal, 6);
  return finishLevel(`L006-${n}`, `${mod[0]} ${mod[1]}`, mod[1], "Read the control-frame cue and route with transformed arrows.", def);
}

function directedLevel(n, mod) {
  const route = [[4, 50], [18, 50], [18, 34], [36, 34], [36, 18], [58, 18]];
  const g = arena(route);
  const dirs = { D: [1, 0], L: [-1, 0], N: [0, -1], U: [0, 1] };
  for (let i = 1; i < route.length - 1; i += 1) {
    const [x, y] = route[i];
    const [nx, ny] = route[i + 1];
    g[y][x] = nx > x ? "D" : nx < x ? "L" : ny > y ? "U" : "N";
  }
  const start = route[0];
  const goal = route[route.length - 1];
  g[goal[1]][goal[0]] = "G";
  const def = {
    grid: g,
    start,
    goal,
    canMove: (x, y, ch, s) => {
      if (!defaultPassable(ch)) return false;
      const actor = currentActor();
      const here = tileAt(actor.x, actor.y);
      if (!dirs[here]) return true;
      const [dx, dy] = dirs[here];
      return x - actor.x === dx && y - actor.y === dy;
    },
    legend: [["floor", C.floor], ["one-way cell", C.orange], ["wall", C.wall], ["exit", C.goal]],
  };
  addModifierFeatures(def, g, n, route, goal, 7);
  return finishLevel(`L007-${n}`, `${mod[0]} ${mod[1]}`, mod[1], "Follow one-way passages; leaving an orange cell works only in its indicated direction.", def);
}

function forcedLevel(n, mod) {
  const route = [[5, 48], [20, 48], [20, 28], [44, 28], [44, 12], [58, 12]];
  const g = arena(route);
  for (let x = 10; x < 20; x += 1) g[48][x] = "D";
  for (let y = 38; y > 28; y -= 1) g[y][20] = "N";
  for (let x = 28; x < 44; x += 1) g[28][x] = "D";
  const start = route[0];
  const goal = route[route.length - 1];
  g[goal[1]][goal[0]] = "G";
  const push = { D: [1, 0], L: [-1, 0], N: [0, -1], U: [0, 1] };
  const def = {
    grid: g,
    start,
    goal,
    afterMove: (_x, _y, _ch, s) => {
      let guard = 0;
      while (guard < 30) {
        const actor = currentActor();
        const p = push[tileAt(actor.x, actor.y)];
        if (!p) break;
        const nx = actor.x + p[0];
        const ny = actor.y + p[1];
        if (!defaultPassable(tileAt(nx, ny))) break;
        setCurrentActor(nx, ny);
        guard += 1;
      }
      const actor = currentActor();
      if (actor.x === goal[0] && actor.y === goal[1]) s.won = true;
    },
    legend: [["floor", C.floor], ["conveyor", C.orange], ["wall", C.wall], ["exit", C.goal]],
  };
  addModifierFeatures(def, g, n, route, goal, 8);
  return finishLevel(`L008-${n}`, `${mod[0]} ${mod[1]}`, mod[1], "Step onto forced-motion cells and let them carry you to the next controllable stop.", def);
}

function slidingLevel(n, mod) {
  const g = grid("#");
  border(g);
  rect(g, 4, 8, 58, 56, ".");
  for (let x = 10; x < 54; x += 8) rect(g, x, 12, x + 1, 52, "#");
  for (let y = 16; y < 50; y += 10) rect(g, 6, y, 56, y + 1, "#");
  const stops = [[6, 54], [22, 54], [22, 34], [38, 34], [38, 14], [56, 14]];
  for (const [x, y] of stops) g[y][x] = "Z";
  const start = stops[0];
  const goal = stops[stops.length - 1];
  g[goal[1]][goal[0]] = "G";
  const def = {
    grid: g,
    start,
    goal,
    beforeMove: (dx, dy, _nx, _ny) => {
      const actor = currentActor();
      let x = actor.x;
      let y = actor.y;
      while (defaultPassable(tileAt(x + dx, y + dy))) {
        x += dx;
        y += dy;
        if (tileAt(x, y) === "Z" || tileAt(x, y) === "G" || tileAt(x, y) === "X") break;
      }
      return { x, y };
    },
    legend: [["ice", C.floor], ["stop", C.white], ["wall", C.wall], ["exit", C.goal]],
  };
  addModifierFeatures(def, g, n, stops, goal, 9);
  return finishLevel(`L009-${n}`, `${mod[0]} ${mod[1]}`, mod[1], "Each arrow slides until a stop, wall, hazard, or exit; choose stopping points deliberately.", def);
}

function jumpLevel(n, mod) {
  const g = grid("#");
  border(g);
  const route = [[5, 32], [16, 32], [28, 32], [40, 32], [52, 32], [58, 32]];
  for (const [x, y] of route) rect(g, x - 1, y - 1, x + 1, y + 1, ".");
  const start = route[0];
  const goal = route[route.length - 1];
  g[goal[1]][goal[0]] = "G";
  const def = {
    grid: g,
    start,
    goal,
    onSpace: (_x, _y, s) => {
      const actor = currentActor();
      const next = route.find(([x, y]) => x > actor.x && Math.abs(y - actor.y) <= 2);
      if (next) {
        setCurrentActor(next[0], next[1]);
        s.moves += 1;
        s.message = "Jumped to the next island.";
        commonAfterMove(next[0], next[1], tileAt(next[0], next[1]));
      }
    },
    legend: [["island", C.floor], ["gap", C.wall], ["jump target", C.cyan], ["exit", C.goal]],
  };
  for (const [x, y] of route.slice(1, -1)) g[y][x] = "K";
  addModifierFeatures(def, g, n, route, goal, 10);
  return finishLevel(`L010-${n}`, `${mod[0]} ${mod[1]}`, mod[1], "Walk on islands and press Space to jump across gaps to the next marked landing.", def);
}

function gravityLevel(n, mod) {
  const g = grid("V");
  border(g);
  for (let x = 3; x < 61; x += 1) g[60][x] = "#";
  rect(g, 5, 52, 18, 53, ".");
  rect(g, 18, 42, 32, 43, ".");
  rect(g, 32, 30, 46, 31, ".");
  rect(g, 46, 18, 59, 19, ".");
  const start = [6, 52];
  const goal = [58, 17];
  g[goal[1]][goal[0]] = "G";
  const def = {
    grid: g,
    start,
    goal,
    canMove: (x, y, ch) => ch !== "#",
    afterMove: (_x, _y, _ch, s) => {
      const actor = currentActor();
      while (tileAt(actor.x, actor.y + 1) === "V") {
        actor.y += 1;
        if (actor.y >= 62) break;
      }
      if (actor.x === goal[0] && actor.y === goal[1]) s.won = true;
    },
    legend: [["platform", C.floor], ["void", C.void], ["support", C.wall], ["exit", C.goal]],
  };
  addModifierFeatures(def, g, n, [[6, 52], [18, 42], [32, 30], [46, 18], goal], goal, 11);
  return finishLevel(`L011-${n}`, `${mod[0]} ${mod[1]}`, mod[1], "Use platforms and falling behavior; unsupported movement drops the avatar to the next support.", def);
}

function hazardLevel(n, mod) {
  const route = [[4, 58], [18, 58], [18, 42], [38, 42], [38, 24], [58, 24], [58, 6]];
  const g = arena(route);
  for (let y = 8; y < 58; y += 6) for (let x = 10; x < 58; x += 9) g[y][x] = "X";
  const start = route[0];
  const goal = route[route.length - 1];
  g[goal[1]][goal[0]] = "G";
  const def = {
    grid: g,
    start,
    goal,
    legend: [["safe route", C.floor], ["hazard", C.hazard], ["wall", C.wall], ["exit", C.goal]],
  };
  addModifierFeatures(def, g, n, route, goal, 12);
  return finishLevel(`L012-${n}`, `${mod[0]} ${mod[1]}`, mod[1], "Route through the field while avoiding lethal red cells and their tempting shortcuts.", def);
}

function stealthLevel(n, mod) {
  const route = [[5, 56], [20, 56], [20, 40], [42, 40], [42, 20], [58, 20]];
  const g = arena(route);
  const guards = [[16, 40, 1, 0], [34, 20, 0, 1], [48, 40, -1, 0]];
  for (const [gx, gy, dx, dy] of guards) {
    g[gy][gx] = "E";
    for (let i = 1; i <= 8; i += 1) {
      const x = gx + dx * i;
      const y = gy + dy * i;
      if (inBounds(x, y) && g[y][x] !== "#") g[y][x] = "!";
    }
  }
  const start = route[0];
  const goal = route[route.length - 1];
  g[goal[1]][goal[0]] = "G";
  const def = {
    grid: g,
    start,
    goal,
    legend: [["shadow", C.floor], ["sightline", C.hazard], ["guard", C.hazard], ["exit", C.goal]],
  };
  addModifierFeatures(def, g, n, route, goal, 13);
  return finishLevel(`L013-${n}`, `${mod[0]} ${mod[1]}`, mod[1], "Move between shadow corridors while avoiding guard sightlines.", def);
}

function pursuitLevel(n, mod) {
  const route = [[4, 56], [30, 56], [30, 36], [52, 36], [52, 10], [60, 10]];
  const g = arena(route);
  const start = route[0];
  const goal = route[route.length - 1];
  g[goal[1]][goal[0]] = "G";
  const def = {
    grid: g,
    start,
    goal,
    enemy: { x: 10, y: 56 },
    afterMove: (_x, _y, _ch, s) => {
      if (!s.enemy) s.enemy = { ...def.enemy };
      const actor = currentActor();
      const dx = Math.sign(actor.x - s.enemy.x);
      const dy = Math.sign(actor.y - s.enemy.y);
      const options = Math.abs(actor.x - s.enemy.x) > Math.abs(actor.y - s.enemy.y) ? [[dx, 0], [0, dy]] : [[0, dy], [dx, 0]];
      for (const [mx, my] of options) {
        if (defaultPassable(tileAt(s.enemy.x + mx, s.enemy.y + my))) {
          s.enemy.x += mx;
          s.enemy.y += my;
          break;
        }
      }
      if (s.enemy.x === actor.x && s.enemy.y === actor.y) {
        s.dead = true;
        s.message = "Caught. Reset and bait the pursuer differently.";
      }
    },
    render: (s) => {
      if (!s.enemy) s.enemy = { ...def.enemy };
      dot(s.enemy.x, s.enemy.y, C.hazard, 2);
    },
    init: () => ({ ...baseState(def), enemy: { ...def.enemy } }),
    legend: [["floor", C.floor], ["pursuer", C.hazard], ["wall", C.wall], ["exit", C.goal]],
  };
  addModifierFeatures(def, g, n, route, goal, 14);
  return finishLevel(`L014-${n}`, `${mod[0]} ${mod[1]}`, mod[1], "Bait the hostile actor through corridors while keeping enough distance to reach the exit.", def);
}

function escortLevel(n, mod) {
  const route = [[5, 54], [20, 54], [20, 34], [40, 34], [40, 14], [58, 14]];
  const g = arena(route);
  const start = route[0];
  const goal = route[route.length - 1];
  const escortGoal = [56, 16];
  g[goal[1]][goal[0]] = "G";
  g[escortGoal[1]][escortGoal[0]] = "Q";
  const def = {
    grid: g,
    start,
    goal,
    follower: { x: 3, y: 54 },
    afterMove: (_x, _y, _ch, s) => {
      if (!s.follower) s.follower = { ...def.follower };
      const actor = currentActor();
      const dx = Math.sign(actor.x - s.follower.x);
      const dy = Math.sign(actor.y - s.follower.y);
      const move = Math.abs(actor.x - s.follower.x) > Math.abs(actor.y - s.follower.y) ? [dx, 0] : [0, dy];
      if (defaultPassable(tileAt(s.follower.x + move[0], s.follower.y + move[1]))) {
        s.follower.x += move[0];
        s.follower.y += move[1];
      }
    },
    isWin: (s) => s.x === goal[0] && s.y === goal[1] && s.follower && Math.abs(s.follower.x - escortGoal[0]) + Math.abs(s.follower.y - escortGoal[1]) <= 3,
    render: (s) => {
      if (!s.follower) s.follower = { ...def.follower };
      dot(s.follower.x, s.follower.y, C.green, 2);
    },
    init: () => ({ ...baseState(def), follower: { ...def.follower } }),
    legend: [["floor", C.floor], ["escort", C.green], ["escort goal", C.green], ["exit", C.goal]],
  };
  addModifierFeatures(def, g, n, route, goal, 15);
  return finishLevel(`L015-${n}`, `${mod[0]} ${mod[1]}`, mod[1], "Guide the follower safely; the player and escort must finish near their matching goals.", def);
}

const UX_FAMILIES = [
  [16, "Multi-body", "shared", "Move several bodies with each arrow; all bodies must land on their matching goal marks."],
  [17, "Body select", "select", "Use Space or clicks to change which actor receives arrow input."],
  [18, "Simultaneous", "simul", "Bring multiple bodies onto target cells at the same time."],
  [19, "Coverage", "coverage", "Cover the required route cells before entering the exit."],
  [20, "Avoidance", "avoid", "Reach the exit without touching forbidden cells or revisiting marked cells."],
  [21, "Optimize", "optimize", "Choose the efficient route; wandering exhausts the score budget."],
  [22, "Detour", "detour", "The apparent straight route fails; use the long detour around it."],
  [23, "Bottleneck", "bottleneck", "Pass through the single choke point only after satisfying its timing or state."],
  [24, "Loop", "loop", "Use the loop deliberately to align state before exiting."],
  [25, "Anti-loop", "antiloop", "Every revisit is punished; solve with a self-avoiding route."],
  [26, "Push block", "push", "Push the movable block into position, then walk through the opened lane."],
  [27, "Pull tether", "pull", "Drag the tethered block behind you and use it as the moving key."],
  [28, "Carry drop", "carry", "Pick up, carry, and drop the item on its target before exiting."],
  [29, "Tool use", "tool", "Use Space with the current tool to alter the obstacle ahead."],
  [30, "Rotate", "rotate", "Rotate the directional object until it points the traversable way."],
  [31, "Object slide", "objectslide", "Slide the object until it stops on the receiving pad."],
  [32, "Swap", "swap", "Swap the avatar with marked cells to cross otherwise blocked space."],
  [33, "Sokoban", "sokoban", "Stage the box through intermediate parking cells before final placement."],
  [34, "Blocking", "blocking", "Place a block to stop a moving hazard or flow."],
  [35, "Unblocking", "unblocking", "Remove the obstructing block without destroying the needed route."],
  [36, "Build", "build", "Build missing floor cells across the gap."],
  [37, "Destroy", "destroy", "Destroy selected walls to carve a legal path."],
  [38, "Transform", "transform", "Transform terrain classes so the path becomes walkable."],
  [39, "Temporary", "temporary", "Cross temporary terrain that vanishes after use."],
  [40, "Packing", "packing", "Pack objects into the bay without blocking the final corridor."],
  [41, "Tiling", "tiling", "Place shapes so the target area is exactly tiled."],
  [42, "Permutation", "permutation", "Rearrange pieces into the required order."],
  [43, "Sorting", "sorting", "Sort the pieces by their visible rule."],
  [44, "Matching", "matching", "Match objects to their corresponding destinations."],
  [45, "Grouping", "grouping", "Bring compatible objects together."],
  [46, "Separation", "separation", "Keep incompatible objects apart while opening the route."],
  [47, "Cells", "cellselect", "Click the cells satisfying the condition."],
  [48, "Objects", "objectselect", "Click whole objects rather than isolated pixels."],
  [49, "Edges", "edgeselect", "Click vertices or edges, not cells."],
  [50, "Regions", "regionselect", "Select the correct connected region."],
  [51, "Ordered", "ordered", "Click targets in the required sequence."],
  [52, "Path draw", "pathdraw", "Click a continuous path connecting start to exit."],
  [53, "Region fill", "fill", "Flood-fill the correct region."],
  [54, "Pattern", "pattern", "Reproduce the target pattern on the board."],
  [55, "Symbols", "symbol", "Decode symbols and select the matching action."],
  [56, "Words", "word", "Manipulate word labels as logic objects."],
  [57, "Algebra", "algebra", "Set numeric cells to satisfy the equation."],
  [58, "Proof", "proof", "Select the proof steps in valid order."],
  [59, "Graph", "graph", "Edit graph nodes and edges to make the exit reachable."],
  [60, "Flow", "flow", "Route flow from source to sink before exiting."],
  [61, "Rays", "ray", "Align reflectors so the ray reaches the receiver."],
  [62, "Sight", "sight", "Manipulate line of sight to reveal or protect the route."],
  [63, "Field", "field", "Read the gradient field and move along safe potential."],
  [64, "Spread", "spread", "Contain spreading danger before it reaches the corridor."],
  [65, "Automaton", "automaton", "Shape local update rules until a stable path appears."],
  [66, "Circuit", "circuit", "Connect switches, wires, and relays until the signal reaches the receiver."],
  [67, "Pipe valves", "pipe", "Rotate valves and open channels so flow reaches the sink."],
  [68, "Pressure", "pressure", "Move weight onto plates and balance the pressure system."],
  [69, "Wait", "wait", "Use Space to pass time until the route becomes valid."],
  [70, "Bump", "bump", "Intentionally bump blocked cells to advance hidden timing."],
  [71, "Rhythm", "rhythm", "Act only on the marked cadence beats."],
  [72, "Phase align", "phasealign", "Align phase indicators before crossing the barrier."],
  [73, "Countdown", "countdown", "Reach safety before the countdown consumes the route."],
  [74, "Delayed", "delayed", "Queue an effect and wait for it to resolve later."],
  [75, "Turn order", "turnorder", "Arrange movement and updates so checks resolve in the winning order."],
  [76, "Autonomous", "autonomous", "Steer a non-player process indirectly while it evolves."],
  [77, "Adversary", "adversary", "Predict the hostile policy and exploit its response."],
  [78, "Ally policy", "allypolicy", "Use a friendly policy that follows, mirrors, or assists."],
  [79, "Collision", "collision", "Choreograph collisions so bodies merge, block, or bounce correctly."],
  [80, "Reversible", "reversible", "Cycle reversible toggles until the state lines up."],
  [81, "Undo", "undo", "Use reset-like rollback as part of the intended solution."],
  [82, "Checkpoint", "checkpoint", "Lock in progress at checkpoints while preserving useful state."],
  [83, "Move budget", "movebudget", "Solve under a strict action budget."],
  [84, "Energy", "energy", "Spend and recharge energy to cross the field."],
  [85, "Inventory", "inventory", "Allocate limited keys, tools, or edits."],
  [86, "Risk", "risk", "Spend only a limited amount of exposure or danger."],
  [87, "Conversion", "conversion", "Trade one scarce resource for another at the right moment."],
  [88, "Replenish", "replenish", "Visit refill stations to keep the route possible."],
  [89, "Sacrifice", "sacrifice", "Spend or destroy a useful object to win."],
  [90, "Preserve", "preserve", "Protect a needed object or option until the end."],
  [91, "Threshold", "threshold", "Make a meter hit the exact required value."],
  [92, "Scoring", "scoring", "Optimize the score rule before exiting."],
  [93, "Satisficing", "satisficing", "Reach the sufficient threshold and ignore perfection."],
  [94, "Explore", "explore", "Reveal hidden map or rule information by probing."],
  [95, "Memory", "memory", "Remember information after it disappears."],
  [96, "Experiment", "experiment", "Probe actions to distinguish rule hypotheses."],
  [97, "Failure info", "failureinfo", "Use rejected attempts as information for the successful path."],
  [98, "Avoid info", "avoidinfo", "Avoid revealing harmful information."],
  [99, "Perceptual", "perceptual", "Mentally transform the display before acting."],
  [100, "Decoys", "decoy", "Reject target-like decoys and use the real route."],
  [101, "Micro signal", "microsignal", "Watch small visual pulses to choose the action."],
  [102, "Hypothesis", "hypothesis", "Revise the inferred rule after feedback."],
  [103, "Belief", "belief", "Reason about hidden state before committing."],
  [104, "Mode switch", "modeswitch", "Switch modes or tools at the right time."],
  [105, "Addressing", "addressing", "Make the same action target the correct entity."],
  [106, "Command target", "commandtarget", "Click a target cell, then apply Space or arrows to it."],
  [107, "Queue", "queue", "Record a future action sequence and execute it."],
  [108, "Macro", "macro", "Create a repeated command pattern."],
  [109, "Rule switch", "ruleswitch", "Change the active rule before crossing."],
  [110, "Rule repair", "rulerepair", "Repair or compensate for a rule violation."],
  [111, "Exception", "exception", "Use a special case that overrides the general rule."],
  [112, "True objective", "trueobjective", "Discover and satisfy the actual win condition."],
  [113, "Final priority", "finalpriority", "Win because the final check resolves before the loss check."],
  [114, "Self reference", "selfreference", "Use the level's own presentation or history as state."],
  [115, "Analogy", "analogy", "Transfer a rule from one region to another."],
  [116, "Representation", "representation", "Operate on the graph or table behind the surface map."],
  [117, "Abstraction", "abstraction", "Ignore irrelevant detail and solve the quotient problem."],
  [118, "Concretize", "concretize", "Instantiate an abstract plan at exact cells."],
  [119, "Exact count", "exactcount", "Satisfy an exact count or parity constraint."],
  [120, "Propagation", "propagation", "Let local forced moves propagate to determine the board."],
  [121, "Global force", "globalforce", "Use a global invariant to force a local action."],
  [122, "Contradiction", "contradiction", "Reject branches that lead to contradiction."],
  [123, "Case split", "casesplit", "Test a small set of cases and choose the survivor."],
  [124, "Dominance", "dominance", "Discard dominated states and keep the superior route."],
  [125, "Canonical", "canonical", "Normalize equivalent states before acting."],
  [126, "Symmetry", "symmetry", "Use mirror or rotational symmetry to complete both sides."],
  [127, "Break symmetry", "breaksymmetry", "Choose an anchor to remove ambiguity."],
  [128, "Decompose", "decompose", "Solve independent rooms or lanes and combine them."],
  [129, "Interface", "interface", "Coordinate subproblems through a shared boundary or resource."],
  [130, "Composition", "composition", "Combine multiple primitives in sequence or parallel."],
];

function uxGames() {
  return UX_FAMILIES.map(([num, name, kind, objective]) => ({
    id: `L${String(num).padStart(3, "0")}`,
    name: `L${String(num).padStart(3, "0")} ${name}`,
    levels: MODS.map((m, i) => uxFamilyLevel(num, name, kind, objective, i + 1, m)),
  }));
}

function uxBaseMap(seed = 0) {
  const g = grid("#");
  border(g);
  const y = 10 + (seed % 7) * 6;
  const route = [[4, y], [18, y], [18, 52], [38, 52], [38, 18], [58, 18]];
  carve(g, route, ".");
  return { g, route, start: route[0], goal: route[route.length - 1] };
}

function addPanel(g, x1 = 8, y1 = 8, w = 48, h = 42) {
  rect(g, x1, y1, x1 + w, y1 + h, ".");
  rect(g, x1, y1, x1 + w, y1, "#");
  rect(g, x1, y1 + h, x1 + w, y1 + h, "#");
  rect(g, x1, y1, x1, y1 + h, "#");
  rect(g, x1 + w, y1, x1 + w, y1 + h, "#");
}

function completeOnClick(def, targets, message = "Accepted.") {
  def.targets = targets.map(([x, y]) => key(x, y));
  def.onClick = (x, y, s) => {
    const k = key(x, y);
    if (def.targets.includes(k)) {
      s.clicked.add(k);
      s.message = message;
    }
  };
  def.isWin = (s) => s.x === def.goal[0] && s.y === def.goal[1] && def.targets.every((t) => s.clicked.has(t));
}

function drawablePathCell(ch) {
  return !["#", "%", "V", "X", "!"].includes(ch);
}

function clickedPathComplete(def, s) {
  const startKey = key(...def.start);
  const goalKey = key(...def.goal);
  const drawn = new Set(s.clicked);
  drawn.add(startKey);
  drawn.add(goalKey);
  const q = [def.start];
  const seen = new Set([startKey]);
  for (let i = 0; i < q.length; i += 1) {
    const [x, y] = q[i];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      const k = key(nx, ny);
      if (seen.has(k) || !drawn.has(k) || !inBounds(nx, ny) || !drawablePathCell(def.grid[ny][nx])) continue;
      seen.add(k);
      q.push([nx, ny]);
    }
  }
  return seen.has(goalKey) && (def.pathRequired || []).every((required) => seen.has(required));
}

function pathDrawRoute(n) {
  const routes = [
    [[4, 56], [14, 56], [14, 20], [30, 20], [30, 44], [48, 44], [48, 10], [58, 10]],
    [[5, 50], [22, 50], [22, 12], [42, 12], [42, 36], [56, 36], [56, 8]],
    [[4, 58], [12, 58], [12, 42], [28, 42], [28, 18], [46, 18], [46, 6], [58, 6]],
    [[6, 8], [18, 8], [18, 30], [10, 30], [10, 52], [38, 52], [38, 18], [58, 18]],
    [[4, 34], [20, 34], [20, 56], [50, 56], [50, 28], [36, 28], [36, 8], [58, 8]],
    [[5, 12], [12, 12], [12, 48], [26, 48], [26, 22], [44, 22], [44, 54], [58, 54]],
    [[4, 44], [16, 44], [16, 14], [34, 14], [34, 34], [52, 34], [52, 12], [58, 12]],
    [[5, 6], [24, 6], [24, 26], [8, 26], [8, 58], [44, 58], [44, 40], [58, 40]],
    [[4, 52], [18, 52], [18, 8], [30, 8], [30, 30], [46, 30], [46, 14], [58, 14]],
  ];
  return routes[n - 1] || routes[0];
}

function uxFamilyLevel(num, name, kind, objective, n, mod) {
  const id = `L${String(num).padStart(3, "0")}-${n}`;
  const base = uxBaseMap(num + n);
  const g = base.g;
  const route = base.route;
  let start = base.start;
  let goal = base.goal;
  let def = {
    grid: g,
    start,
    goal,
    legend: [["floor", C.floor], ["wall", C.wall], ["active", C.player], ["exit", C.goal]],
  };
  const familyColor = [C.cyan, C.purple, C.orange, C.green, C.blue][num % 5];
  def.marks = [{ kind: "box", x: 2 + (num % 12), y: 2 + (n % 10), w: 6, h: 6, color: familyColor }];

  const actorAtGoal = (s) => {
    if (s.actors) return s.actors.some((actor) => actor.x === goal[0] && actor.y === goal[1]);
    return s.x === goal[0] && s.y === goal[1];
  };
  const done = () => {
    def.isWin = (s) => actorAtGoal(s) && Boolean(s.flags.done);
  };

  if (kind === "shared" || kind === "simul") {
    def.actors = [{ x: start[0], y: start[1] }, { x: start[0], y: start[1] + 3 }];
    g[start[1] + 3][start[0]] = ".";
    g[goal[1]][goal[0]] = "G";
    g[goal[1] + 3][goal[0] - 4] = "Q";
    def.beforeMove = (dx, dy) => {
      const actor = currentActor();
      state.flags.lastDelta = [dx, dy];
      return { x: actor.x + dx, y: actor.y + dy };
    };
    def.afterMove = (_x, _y, _ch, s) => {
      const [dx, dy] = s.flags.lastDelta || [0, 0];
      const other = s.actors[1];
      const nx = other.x + (kind === "shared" ? dx : -dx);
      const ny = other.y + dy;
      if (defaultPassable(tileAt(nx, ny))) {
        other.x = nx;
        other.y = ny;
      }
    };
    def.isWin = (s) => s.actors[0].x === goal[0] && s.actors[0].y === goal[1] && Math.abs(s.actors[1].x - (goal[0] - 4)) + Math.abs(s.actors[1].y - (goal[1] + 3)) <= 2;
    def.legend = [["body A", C.player], ["body B", C.altPlayer], ["target", C.green], ["exit", C.goal]];
  } else if (kind === "select") {
    def.actors = [{ x: start[0], y: start[1] }, { x: 10, y: 56 }, { x: 54, y: 50 }];
    carve(g, [[10, 56], [40, 56], [40, 18], goal], ".");
    def.onSpace = (_x, _y, s) => {
      s.active = (s.active + 1) % s.actors.length;
      s.message = `Selected body ${s.active + 1}.`;
    };
    def.onClick = (x, y, s) => {
      const idx = s.actors.findIndex((a) => Math.abs(a.x - x) <= 2 && Math.abs(a.y - y) <= 2);
      if (idx >= 0) s.active = idx;
    };
    def.isWin = (s) => s.actors.some((a) => a.x === goal[0] && a.y === goal[1]);
  } else if (["coverage", "avoid", "optimize", "detour", "bottleneck", "loop", "antiloop"].includes(kind)) {
    if (kind === "coverage") def.tokens = [[18, route[0][1]], [18, 52], [38, 52], [38, 18]];
    if (kind === "avoid" || kind === "antiloop") {
      def.afterMove = (x, y, _ch, s) => {
        const k = key(x, y);
        if (s.flags.visited && s.flags.visited.has(k)) {
          s.dead = true;
          s.message = "Revisit forbidden.";
        }
        if (!s.flags.visited) s.flags.visited = new Set();
        s.flags.visited.add(k);
      };
    }
    if (kind === "optimize") def.budget = 110;
    if (kind === "detour") {
      rect(g, 16, route[0][1] - 1, 20, route[0][1] + 1, "#");
      carve(g, [[start[0], start[1]], [4, 60], [52, 60], [52, 18], goal], ".");
    }
    if (kind === "bottleneck") {
      g[52][38] = "P";
      def.canMove = (x, y, ch, s) => defaultPassable(ch) && (ch !== "P" || s.phase === 1);
      def.onSpace = (_x, _y, s) => {
        s.phase = 1 - s.phase;
        s.message = s.phase ? "Bottleneck open." : "Bottleneck closed.";
      };
    }
    if (kind === "loop") {
      g[52][28] = "T";
      def.afterMove = (x, y, _ch, s) => {
        if (x === 28 && y === 52) s.flags.loop = (s.flags.loop || 0) + 1;
      };
      def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && (s.flags.loop || 0) >= 2;
    }
    def.legend = [["route", C.floor], ["constraint", C.orange], ["hazard", C.hazard], ["exit", C.goal]];
  } else if (["push", "sokoban", "blocking", "packing"].includes(kind)) {
    const box = { x: 24, y: 52 };
    const pad = [36, 52];
    g[box.y][box.x] = "M";
    g[pad[1]][pad[0]] = "Q";
    def.canMove = (x, y, ch) => {
      if (ch !== "M") return defaultPassable(ch);
      const actor = currentActor();
      const dx = Math.sign(x - actor.x);
      const dy = Math.sign(y - actor.y);
      const nx = x + dx;
      const ny = y + dy;
      if (!defaultPassable(tileAt(nx, ny))) return false;
      g[ny][nx] = "M";
      g[y][x] = ".";
      return true;
    };
    def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && g[pad[1]][pad[0]] === "M";
    def.legend = [["floor", C.floor], ["movable block", C.gray], ["pad", C.green], ["exit", C.goal]];
  } else if (kind === "pull") {
    const pad = [28, 52];
    const gate = [38, 52];
    def.follower = { x: start[0] - 2, y: start[1] };
    g[start[1]][start[0] - 2] = ".";
    g[pad[1]][pad[0]] = "Q";
    g[gate[1]][gate[0]] = "C";
    def.canMove = (x, y, ch, s) => defaultPassable(ch) && (ch !== "C" || s.flags.tetherPad);
    def.beforeMove = (dx, dy) => {
      const actor = currentActor();
      state.flags.prev = [actor.x, actor.y];
      return { x: actor.x + dx, y: actor.y + dy };
    };
    def.afterMove = (_x, _y, _ch, s) => {
      if (s.flags.prev) {
        s.follower.x = s.flags.prev[0];
        s.follower.y = s.flags.prev[1];
      }
      if (Math.abs(s.follower.x - pad[0]) + Math.abs(s.follower.y - pad[1]) <= 1) {
        s.flags.tetherPad = true;
        g[gate[1]][gate[0]] = ".";
      }
    };
    def.render = (s) => dot(s.follower.x, s.follower.y, C.gray, 2);
    def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && Boolean(s.flags.tetherPad);
    def.init = () => ({ ...baseState(def), follower: { ...def.follower } });
  } else if (["carry", "tool", "rotate", "objectslide", "swap", "unblocking", "build", "destroy", "transform", "temporary"].includes(kind)) {
    g[24][38] = kind === "temporary" ? "Y" : "C";
    def.canMove = (x, y, ch, s) => defaultPassable(ch) && (ch !== "C" || s.flags.done) && (ch !== "Y" || !s.clicked.has(key(x, y)));
    def.onSpace = (x, y, s) => {
      s.flags.done = true;
      if (kind === "temporary") s.clicked.add(key(x, y));
      s.message = `${name} action applied.`;
    };
    def.onClick = (x, y, s) => {
      if (Math.abs(x - 38) < 8 && Math.abs(y - 24) < 8) {
        s.flags.done = true;
        g[24][38] = ".";
        s.message = `${name} target changed.`;
      }
    };
    done();
    def.legend = [["floor", C.floor], ["work target", C.cyan], ["changed", C.safe], ["exit", C.goal]];
  } else if (num >= 40 && num <= 46) {
    const targets = [[16, 16], [24, 24], [32, 16], [40, 24]];
    addPanel(g);
    for (const [x, y] of targets) g[y][x] = "M";
    completeOnClick(def, targets.slice(0, kind === "separation" ? 2 : 3), `${name} arrangement accepted.`);
    def.legend = [["panel", C.floor], ["piece", C.gray], ["selected", C.player], ["exit", C.goal]];
  } else if (num >= 47 && num <= 60) {
    addPanel(g, 7, 7, 50, 44);
    const targets = [[14, 14], [22, 20], [30, 14], [38, 20], [46, 14]];
    targets.forEach(([x, y], i) => {
      g[y][x] = String(4 + (i % 6));
    });
    if (kind === "ordered" || kind === "proof") {
      def.order = targets.map(([x, y]) => key(x, y));
      def.onClick = (x, y, s) => {
        if (key(x, y) === def.order[s.clicked.size]) {
          s.clicked.add(key(x, y));
          s.message = "Next step accepted.";
        }
      };
      def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && s.clicked.size === def.order.length;
    } else if (kind === "pathdraw") {
      for (let y = 0; y < H; y += 1) {
        for (let x = 0; x < W; x += 1) g[y][x] = ".";
      }
      border(g);
      const drawRoute = pathDrawRoute(n);
      start = drawRoute[0];
      goal = drawRoute[drawRoute.length - 1];
      def.start = start;
      def.goal = goal;
      def.pathRequired = [];
      rect(g, 10 + (n % 5), 15, 12 + (n % 5), 55, "#");
      rect(g, 24, 6 + (n % 7), 26, 46, "#");
      rect(g, 39, 12, 41, 60 - (n % 9), "#");
      rect(g, 5, 24 + (n % 6), 55, 25 + (n % 6), "#");
      rect(g, 18, 40 - (n % 5), 61, 41 - (n % 5), "#");
      carve(g, drawRoute, ".");
      if (n === 1) {
        for (const [x, y] of [routeCell(drawRoute, 0.28), routeCell(drawRoute, 0.56), routeCell(drawRoute, 0.78)]) g[y][x] = "?";
      } else if (n === 2) {
        addHazardBlocks(g, drawRoute, 52);
      } else if (n === 3) {
        const required = [routeCell(drawRoute, 0.22), routeCell(drawRoute, 0.5), routeCell(drawRoute, 0.76)];
        def.tokens = required;
        def.pathRequired = required.map(([x, y]) => key(x, y));
        for (const [x, y] of required) g[y][x] = "T";
      } else if (n === 4) {
        const required = [routeCell(drawRoute, 0.35), routeCell(drawRoute, 0.66)];
        def.pathRequired = required.map(([x, y]) => key(x, y));
        for (const [x, y] of required) g[y][x] = "P";
      } else if (n === 5) {
        const required = [routeCell(drawRoute, 0.42), routeCell(drawRoute, 0.74)];
        def.pathRequired = required.map(([x, y]) => key(x, y));
        for (const [x, y] of required) g[y][x] = "O";
      } else if (n === 6) {
        const required = [routeCell(drawRoute, 0.48)];
        def.pathRequired = required.map(([x, y]) => key(x, y));
        g[required[0][1]][required[0][0]] = "B";
      } else if (n === 7) {
        const required = [routeCell(drawRoute, 0.62)];
        def.pathRequired = required.map(([x, y]) => key(x, y));
        g[required[0][1]][required[0][0]] = "K";
      } else if (n === 8) {
        const required = [routeCell(drawRoute, 0.18), routeCell(drawRoute, 0.84)];
        def.pathRequired = required.map(([x, y]) => key(x, y));
        for (const [x, y] of required) g[y][x] = "W";
      } else if (n === 9) {
        const hidden = routeCell(drawRoute, 0.34);
        const phase = routeCell(drawRoute, 0.72);
        def.pathRequired = [key(...hidden), key(...phase)];
        g[hidden[1]][hidden[0]] = "?";
        g[phase[1]][phase[0]] = "P";
      }
      g[start[1]][start[0]] = ".";
      g[goal[1]][goal[0]] = "G";
      def.canMove = () => false;
      def.onSpace = (_x, _y, s) => {
        s.message = "Arrows and Space do not solve this family; click a continuous path.";
      };
      def.onClick = (x, y, s) => {
        if (s.dead || s.won || !inBounds(x, y)) return;
        const ch = g[y][x];
        if (ch === "X" || ch === "!") {
          s.dead = true;
          s.message = "The drawn path touched a lethal cell.";
          return;
        }
        if (!drawablePathCell(ch)) {
          s.message = "That cell cannot be part of the drawn path.";
          return;
        }
        const k = key(x, y);
        s.clicked.add(k);
        if (s.tokens.has(k)) s.tokens.delete(k);
        if (k !== key(...def.goal)) g[y][x] = "C";
        if (clickedPathComplete(def, s)) {
          s.won = true;
          s.message = "Solved.";
        } else {
          s.message = "Path segment added.";
        }
      };
      def.isWin = (s) => s.won || clickedPathComplete(def, s);
      def.legend = [["drawable floor", C.floor], ["drawn path", C.cyan], ["blocked cell", C.wall], ["required point", C.token], ["exit", C.goal]];
    } else if (kind === "fill") {
      def.onClick = (x, y, s) => {
        if (x > 10 && x < 30 && y > 10 && y < 30) {
          rect(g, 11, 11, 29, 29, "C");
          s.flags.done = true;
        }
      };
      done();
    } else {
      completeOnClick(def, targets.slice(0, 3), `${name} selection accepted.`);
    }
    def.legend = [["panel", C.floor], ["symbol/object", C.blue], ["mark", C.cyan], ["exit", C.goal]];
  } else if (num >= 61 && num <= 65) {
    addPanel(g, 6, 8, 52, 38);
    if (kind === "ray") {
      rect(g, 12, 26, 52, 26, "W");
      g[26][20] = "M";
      def.onClick = (x, y, s) => {
        if (Math.abs(x - 20) < 3 && Math.abs(y - 26) < 3) {
          g[26][20] = "C";
          s.flags.done = true;
        }
      };
    } else if (kind === "sight") {
      rect(g, 18, 18, 48, 18, "!");
      g[18][32] = "M";
      def.onClick = (x, y, s) => {
        if (x === 32 && y === 18) {
          g[18][32] = "#";
          s.flags.done = true;
        }
      };
    } else if (kind === "field") {
      for (let i = 0; i < 20; i += 1) g[10 + i][10 + i] = String(4 + (i % 6));
      def.onClick = (x, y, s) => {
        if (x >= 10 && y >= 10 && x === y) s.flags.done = true;
      };
    } else if (kind === "spread") {
      rect(g, 12, 22, 40, 24, "X");
      def.onClick = (x, y, s) => {
        if (x >= 40 && x <= 45 && y >= 22 && y <= 24) {
          rect(g, 40, 22, 45, 24, "#");
          s.flags.done = true;
        }
      };
    } else {
      for (let y = 14; y < 34; y += 4) for (let x = 14; x < 50; x += 4) g[y][x] = (x + y) % 8 ? "4" : "5";
      def.onSpace = (_x, _y, s) => {
        s.phase += 1;
        if (s.phase >= 3) s.flags.done = true;
        s.message = `Automaton step ${s.phase}.`;
      };
    }
    def.canMove = (x, y, ch, s) => defaultPassable(ch) && (x < 46 || s.flags.done);
    done();
    def.legend = [["process field", C.floor], ["active process", C.hazard], ["control", C.cyan], ["exit", C.goal]];
  } else if (num >= 66 && num <= 68) {
    addPanel(g, 6, 8, 52, 38);
    const controls = [[14, 18], [26, 26], [38, 18], [50, 26]];
    controls.forEach(([x, y], i) => {
      g[y][x] = i % 2 ? "O" : "C";
      if (kind === "pipe") {
        rect(g, Math.min(x, 50), y, Math.min(x + 8, 54), y, "W");
      } else if (kind === "pressure") {
        g[y + 4][x] = "M";
      } else {
        rect(g, x, y + 2, Math.min(x + 8, 54), y + 2, "W");
      }
    });
    completeOnClick(def, controls.slice(0, kind === "pressure" ? 2 : 3), `${name} network energized.`);
    def.canMove = (x, y, ch, s) => defaultPassable(ch) && (x < 46 || def.targets.every((t) => s.clicked.has(t)));
    def.legend = [["network", C.floor], ["wire/pipe", C.white], ["control", C.cyan], ["exit", C.goal]];
  } else if (num >= 69 && num <= 82) {
    addPanel(g, 7, 7, 50, 44);
    const targetPhase = 2 + (num % 3);
    g[24][42] = "P";
    def.canMove = (x, y, ch, s) => defaultPassable(ch) && (ch !== "P" || s.flags.done);
    def.onSpace = (_x, _y, s) => {
      s.phase += 1;
      s.message = `${name} phase ${s.phase}.`;
      if (["wait", "rhythm", "phasealign", "delayed", "turnorder", "reversible", "undo", "checkpoint"].includes(kind) && s.phase >= targetPhase) {
        s.flags.done = true;
        g[24][42] = ".";
      }
      if (kind === "countdown" && s.phase > 6) {
        s.dead = true;
        s.message = "The countdown expired.";
      }
    };
    if (kind === "bump") {
      def.onBump = (s) => {
        s.phase += 1;
        if (s.phase >= 3) {
          s.flags.done = true;
          g[24][42] = ".";
        }
      };
    } else if (["autonomous", "adversary", "allypolicy", "collision"].includes(kind)) {
      def.afterMove = (_x, _y, _ch, s) => {
        s.phase += 1;
        if (s.phase >= targetPhase) {
          s.flags.done = true;
          g[24][42] = ".";
        }
      };
      def.marks.push({ x: 22 + (num % 20), y: 32, color: kind === "adversary" ? C.hazard : C.green, size: 3 });
    }
    done();
    def.legend = [["timeline", C.floor], ["phase gate", C.purple], ["process", C.orange], ["exit", C.goal]];
  } else if (num >= 83 && num <= 93) {
    addPanel(g, 8, 8, 48, 40);
    def.budget = kind === "movebudget" ? 85 : null;
    def.energy = 0;
    const resources = [[16, 18], [26, 28], [36, 18], [46, 28]];
    resources.forEach(([x, y], i) => {
      g[y][x] = i % 2 ? "T" : "M";
    });
    def.onClick = (x, y, s) => {
      const hit = resources.find(([rx, ry]) => Math.abs(rx - x) <= 1 && Math.abs(ry - y) <= 1);
      if (hit) {
        s.clicked.add(key(...hit));
        s.flags.resource = (s.flags.resource || 0) + (kind === "sacrifice" ? -1 : 1);
        s.message = `${name} resource ${s.flags.resource}.`;
      }
      if (["energy", "inventory", "risk", "conversion", "replenish", "sacrifice", "preserve", "threshold", "scoring", "satisficing"].includes(kind)) {
        const needed = kind === "threshold" ? 3 : kind === "satisficing" ? 2 : 1;
        if ((s.flags.resource || 0) >= needed || (kind === "sacrifice" && s.clicked.size >= 1)) s.flags.done = true;
      }
    };
    def.canMove = (x, y, ch, s) => defaultPassable(ch) && (x < 46 || s.flags.done);
    done();
    def.legend = [["economy field", C.floor], ["resource", C.token], ["meter", C.gray], ["exit", C.goal]];
  } else if (num >= 94 && num <= 103) {
    addPanel(g, 6, 8, 52, 38);
    const clues = [[14, 16], [24, 24], [34, 16], [44, 24], [52, 16]];
    clues.forEach(([x, y], i) => {
      g[y][x] = kind === "decoy" && i < 3 ? "X" : "?";
    });
    def.onClick = (x, y, s) => {
      const hit = clues.find(([cx, cy]) => Math.abs(cx - x) <= 1 && Math.abs(cy - y) <= 1);
      if (!hit) return;
      const k = key(...hit);
      if (kind === "avoidinfo" && g[hit[1]][hit[0]] === "?") {
        s.dead = true;
        s.message = "That information was harmful.";
        return;
      }
      s.clicked.add(k);
      g[hit[1]][hit[0]] = "C";
      if (kind === "failureinfo") s.message = "The rejection revealed the useful rule.";
      if (s.clicked.size >= (kind === "memory" ? 2 : 1)) s.flags.done = true;
    };
    def.canMove = (x, y, ch, s) => defaultPassable(ch) && (x < 46 || s.flags.done);
    done();
    def.legend = [["unknown", C.gray], ["clue", C.cyan], ["decoy/risk", C.hazard], ["exit", C.goal]];
  } else if (num >= 104 && num <= 118) {
    addPanel(g, 7, 7, 50, 44);
    const controls = [[14, 15], [24, 25], [34, 15], [44, 25], [52, 15]];
    controls.forEach(([x, y], i) => {
      g[y][x] = String(4 + (i % 6));
    });
    def.mode = 0;
    def.queue = [];
    def.onSpace = (_x, _y, s) => {
      s.phase += 1;
      s.flags.mode = ((s.flags.mode || 0) + 1) % 3;
      if (["modeswitch", "ruleswitch", "rulerepair", "exception", "finalpriority"].includes(kind) && s.phase >= 2) s.flags.done = true;
      if (kind === "queue" || kind === "macro") {
        s.flags.program = (s.flags.program || 0) + 1;
        if (s.flags.program >= 3) s.flags.done = true;
      }
      s.message = `${name} mode ${s.flags.mode || 0}.`;
    };
    def.onClick = (x, y, s) => {
      const hit = controls.find(([cx, cy]) => Math.abs(cx - x) <= 1 && Math.abs(cy - y) <= 1);
      if (hit) {
        s.clicked.add(key(...hit));
        if (["addressing", "commandtarget", "trueobjective", "selfreference", "analogy", "representation", "abstraction", "concretize"].includes(kind)) s.flags.done = true;
      }
    };
    def.canMove = (x, y, ch, s) => defaultPassable(ch) && (x < 46 || s.flags.done);
    done();
    def.legend = [["mode panel", C.floor], ["rule token", C.blue], ["selected", C.cyan], ["exit", C.goal]];
  } else if (num >= 119 && num <= 130) {
    addPanel(g, 6, 8, 52, 42);
    const nodes = [[14, 16], [22, 24], [30, 16], [38, 24], [46, 16], [52, 28]];
    nodes.forEach(([x, y], i) => {
      g[y][x] = String(4 + (i % 6));
    });
    def.required = kind === "exactcount" ? 3 : kind === "casesplit" ? 2 : 4;
    def.onClick = (x, y, s) => {
      const hit = nodes.find(([cx, cy]) => Math.abs(cx - x) <= 1 && Math.abs(cy - y) <= 1);
      if (!hit) return;
      const k = key(...hit);
      if (kind === "contradiction" && s.clicked.size === 2) {
        s.message = "Contradiction pruned; choose another branch.";
        return;
      }
      s.clicked.add(k);
      if (["propagation", "globalforce", "canonical", "symmetry", "decompose", "interface", "composition"].includes(kind) && s.clicked.size >= 1) {
        nodes.forEach(([nx, ny], i) => {
          if (i % 2 === s.clicked.size % 2) g[ny][nx] = "C";
        });
      }
      if (s.clicked.size >= def.required || ["dominance", "breaksymmetry"].includes(kind)) s.flags.done = true;
    };
    def.onSpace = (_x, _y, s) => {
      if (["propagation", "globalforce", "symmetry", "composition"].includes(kind)) {
        s.flags.done = true;
        s.message = `${name} accepted by global update.`;
      }
    };
    def.canMove = (x, y, ch, s) => defaultPassable(ch) && (x < 46 || s.flags.done);
    done();
    def.legend = [["constraint panel", C.floor], ["variable", C.blue], ["forced", C.cyan], ["exit", C.goal]];
  }

  if (num >= 41 && kind !== "pathdraw") carve(g, route, ".");
  if (!def.isWin) def.isWin = (s) => s.x === goal[0] && s.y === goal[1] && s.tokens.size === 0;
  if (n >= 1 && n <= 9 && kind !== "pathdraw") {
    addModifierFeatures(def, g, n, route, goal, num);
  }
  g[goal[1]][goal[0]] = "G";
  const objectiveText = num === 91 ? `${objective} ${thresholdSolveHint(n)}` : objective;
  return finishLevel(id, `${mod[0]} ${mod[1]}`, mod[1], objectiveText, def);
}

function thresholdSolveHint(n) {
  const base = "click any three resource markers in the panel at roughly (16,18), (26,28), (36,18), and (46,28) so the meter reaches 3, then walk to the exit";
  const hints = {
    1: `(${base}; also click the hidden route cell at about (18,52) before crossing it)`,
    2: `(${base}; avoid the red penalty cell while walking)`,
    3: `(${base}; also collect the three orange route tokens before exiting)`,
    4: `(${base}; press Space to open the purple phase gate before crossing it)`,
    5: `(${base}; take a reasonably direct route so the move budget does not run out)`,
    6: `(click the actor you want to control if needed, then ${base})`,
    7: `(click the cyan addressed route cell first, then ${base})`,
    8: `(${base}; use the long 64x64 route and ignore decorative side bands)`,
    9: `(${base}; ignore red decoy hazards and keep to the safe route)`,
  };
  return hints[n] || `(${base})`;
}

function handleClick(event) {
  const rectBox = canvas.getBoundingClientRect();
  const x = Math.floor(((event.clientX - rectBox.left) / rectBox.width) * W);
  const y = Math.floor(((event.clientY - rectBox.top) / rectBox.height) * H);
  if (level.onClick && inBounds(x, y)) {
    level.onClick(x, y, state);
    render();
  }
}

document.addEventListener("keydown", (event) => {
  const dirs = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
  };
  if (dirs[event.key]) {
    event.preventDefault();
    tryMove(...dirs[event.key]);
  } else if (event.key === " ") {
    event.preventDefault();
    if (level.onSpace && !state.dead && !state.won) {
      level.onSpace(currentActor().x, currentActor().y, state);
      render();
    }
  }
});

canvas.addEventListener("click", handleClick);
levelSelect.addEventListener("change", () => setLevel(gameIndex, Number(levelSelect.value)));
resetButton.addEventListener("click", () => setLevel(gameIndex, levelIndex));
nextButton.addEventListener("click", () => {
  const nextLevel = (levelIndex + 1) % games[gameIndex].levels.length;
  setLevel(gameIndex, nextLevel);
});

games.push(...uxGames());
applyFamilyFilter();
buildNav();
setLevel(0, 0);
