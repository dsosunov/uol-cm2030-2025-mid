/*
 * ============================================================================
 * COMMENTARY (500 words)
 * ============================================================================
 *
 * [TODO: Add your 500-word commentary here explaining your approach, design
 * decisions, challenges faced, and how you implemented the game mechanics.]
 *
 * This snooker game implements the core mechanics of the sport using p5.js
 * for rendering and Matter.js for physics simulation. The project demonstrates
 * understanding of:
 *
 * 1. Physics simulation and collision detection
 * 2. Game state management
 * 3. User input handling
 * 4. Visual rendering and animation
 *
 * [Continue with your detailed commentary about the implementation...]
 *
 * ============================================================================
 */

// Matter.js module aliases
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

// Physics engine and world
let engine;
let world;

// Game objects
let cueBall;
let balls = []; // All balls (reds + colours + cue)
let redBalls = [];
let colourBalls = [];

// Table physics objects
let cushions = [];
let pockets = [];

// Game state
const GameMode = Object.freeze({
  STANDARD: 1,
  RANDOM_REDS_CLUSTER: 2,
  PRACTICE_REDS: 3,
});
let currentMode = GameMode.STANDARD;

// Cue / interaction state
let isAiming = false;
let cueAimAngle = 0;
let cuePower = 0;

// Cue ball insertion state (must be interactive and restricted to the D)
let isPlacingCueBall = true;
let cueBallGhostPos = null;

// Animation / feedback state
const ballTrails = new Map(); // ball -> [{x,y,alpha}, ...]
let cueImpactEffects = []; // e.g. [{x,y,ageMs}, ...]
let pocketEntryEffects = []; // e.g. [{ball,ageMs}, ...]

// Canvas dimensions
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 700;

// Table specification (derived from requirements)
// Real snooker table ratio: 12ft x 6ft => width = length/2
const TABLE_LENGTH = 1000; // TODO: tune to fit canvas while staying centered
const TABLE_WIDTH = TABLE_LENGTH / 2;
const BALL_DIAMETER = TABLE_WIDTH / 36;
const POCKET_DIAMETER = 1.5 * BALL_DIAMETER;

// Table layout (computed each init)
let table = {
  x: 0,
  y: 0,
  length: TABLE_LENGTH,
  width: TABLE_WIDTH,
  // D-zone / baulk line geometry
  baulkLineX: 0,
  dCenterX: 0,
  dCenterY: 0,
  dRadius: TABLE_WIDTH / 6,
};

/**
 * p5.js setup function - runs once at start
 */
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  // Initialize Matter.js physics engine
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 0; // No gravity for top-down view

  // Initialize game objects
  initializeGame();
}

/**
 * p5.js draw function - runs continuously
 */
function draw() {
  background(34, 139, 34); // Green snooker table color

  // Update physics engine
  Engine.update(engine);

  // TODO: Apply gentle rolling resistance / damping so balls come to rest
  updateBallTrails();
  checkPocketedBalls();
  updateEffects();

  // Render game objects
  renderTable();
  renderBalls();
  renderCue();
  renderEffects();
}

/**
 * Initialize game objects and setup
 */
function initializeGame() {
  // TODO: Clear previous Matter world bodies if re-initializing

  computeTableLayout();

  // Physics: cushions/boundaries must exist and have different physics from balls
  createCushions();
  createPockets();

  // Balls must be stored in arrays
  redBalls = [];
  colourBalls = [];
  balls = [];

  // Cue ball MUST be inserted by interaction and only within the D
  cueBall = null;
  isPlacingCueBall = true;

  // Coloured balls must exist in ALL modes
  placeColouredBalls();

  // Mode-specific reds
  setMode(currentMode);
}

function computeTableLayout() {
  // Draw the table centered on the canvas
  table.length = TABLE_LENGTH;
  table.width = TABLE_WIDTH;
  table.x = (width - table.length) / 2;
  table.y = (height - table.width) / 2;

  // TODO: Use snooker reference for accurate baulk line position
  table.baulkLineX = table.x + table.length * 0.2;
  table.dCenterX = table.baulkLineX;
  table.dCenterY = table.y + table.width / 2;
  table.dRadius = table.width / 6;
}

function setMode(mode) {
  currentMode = mode;

  // TODO: Remove existing reds from world when switching modes
  redBalls = [];

  if (mode === GameMode.STANDARD) {
    // TODO: Mode 1: standard full layout for reds + colours (reds triangle, colours on spots)
    createRedsStandard();
  } else if (mode === GameMode.RANDOM_REDS_CLUSTER) {
    // TODO: Mode 2: reds only in random positions in clusters (nested loops + random)
    createRedsRandomClusters();
  } else if (mode === GameMode.PRACTICE_REDS) {
    // TODO: Mode 3: practice mode (reds only), colours still present
    createRedsPractice();
  }
}

/**
 * Render the snooker table
 */
function renderTable() {
  // TODO: Draw table outline / wooden border
  // TODO: Draw cloth area (play surface) using table.x/y/length/width
  // TODO: Draw pockets using POCKET_DIAMETER and pocket centers
  // TODO: Draw table markings: baulk line, D semicircle, centre line/spots (more accurate = higher marks)
}

/**
 * Render all balls
 */
function renderBalls() {
  // TODO: Draw all balls with proper colours (cue, reds, and 6 colours)
  // TODO: Use Matter body positions for rendering
  // TODO: Draw ball trail effect (fading) based on stored trail points
}

function renderCue() {
  // TODO: Draw the cue and allow user to rotate/position it to strike the cue ball
  // TODO: Use combination of mouse + key interaction for top marks
  // TODO: Avoid “elastic band” behaviour; cue should feel like a rigid stick
}

function createCushions() {
  // TODO: Create static boundary bodies with cushion-specific restitution/friction
  // NOTE: Cushion physics should differ from ball physics
}

function createPockets() {
  // TODO: Define 6 pockets (corners + middles) and store centers in pockets[]
  // TODO: Optionally add sensor bodies or use distance checks for potting
}

function placeColouredBalls() {
  // TODO: Place yellow/green/brown/blue/pink/black on correct spots per snooker rules
  // TODO: Ensure these are present in modes 1–3
}

function createRedsStandard() {
  // TODO: Place 15 reds in triangle near the pink spot
}

function createRedsRandomClusters() {
  // TODO: Use nested loops + random() to create multiple clusters of reds
  // TODO: Ensure reds don’t overlap and remain within cushion bounds
}

function createRedsPractice() {
  // TODO: Place a small set of reds in a practice arrangement (e.g., line/arc)
}

function updateBallTrails() {
  // TODO: Record recent positions per moving ball and fade over time
}

function updateEffects() {
  // TODO: Age out cueImpactEffects and pocketEntryEffects
}

function renderEffects() {
  // TODO: Cue impact feedback: flash or emanating circles at impact point
  // TODO: Pocket entry animation: shrink/fade the ball or animate the pocket
}

function checkPocketedBalls() {
  // TODO: Detect ball entering a pocket (distance to pocket center <= POCKET_DIAMETER/2)
  // TODO: Trigger pocket entry animation and remove/disable the ball’s body
}

function isPointInDZone(x, y) {
  // Cue ball can only be inserted inside the D (semi-circle in baulk area)
  // TODO: Enforce the correct side of the baulk line (inside D only)
  const dx = x - table.dCenterX;
  const dy = y - table.dCenterY;
  return dx * dx + dy * dy <= table.dRadius * table.dRadius;
}

/**
 * Handle mouse press events
 */
function mousePressed() {
  // TODO: If cue ball not placed, begin placement (restricted to D)
  // TODO: Otherwise start aiming cue (set isAiming true)
}

/**
 * Handle mouse release events
 */
function mouseReleased() {
  // TODO: If placing cue ball, place only if inside D (interactive insertion requirement)
  // TODO: If aiming, apply impulse/force to cue ball via Matter.Body (strike)
  // TODO: Spawn a short-lived cue impact effect at cue ball position
}

function mouseMoved() {
  // TODO: Update cueBallGhostPos while placing; clamp to D-zone
}

function keyPressed() {
  // Table modes (keys 1–3)
  if (key === "1") setMode(GameMode.STANDARD);
  if (key === "2") setMode(GameMode.RANDOM_REDS_CLUSTER);
  if (key === "3") setMode(GameMode.PRACTICE_REDS);

  // TODO: Add cue control keys (fine rotation/power) to complement mouse
}
