// =====================
// GLOBAL STATE
// =====================
let currentScreen = "start";
let endingText = "";

// Act system
let act = 1; // 1, 2, or 3
let actRound = 1; // round within current act (1–5)
let globalRound = 1; // overall round number (1–15)
let debriefAct = 1; // which act's debrief is being shown

// Gameplay state
let score = 0;
let totalCorrect = 0;
let totalServed = 0;

let order = null; // { base, syrup, topping }
let orderPreviewUntil = 0;
let mixEndsAt = 0;
let phase = "MIX"; // "PREVIEW" or "MIX"
let selection = { base: null, syrup: null, topping: null };

// CVD state (controlled per act — not toggled by player)
let visionMode = "NORMAL"; // "NORMAL" or "CVD"
let cvdType = "DEUTAN"; // "DEUTAN", "PROTAN", "TRITAN"
let showLabels = false; // Act 2 accessibility mechanic

// Act 3 scenario state
let scenarioData = null;
let scenarioAnswered = false;
let scenarioCorrect = false;

// Flash feedback (correct/wrong visual cue)
let flashCol = null;
let flashUntil = 0;

// Score fly-up animations
let scoreAnims = [];

// Monster state
let monsterSwap = 0;

// Monster images (loaded in preload, start.js)
let pinkMonster, blueMonster, greenMonster, orangeMonster;
let pinkMonsterNeutral,
  blueMonsterNeutral,
  greenMonsterNeutral,
  orangeMonsterNeutral;
let mainBg;
let titleFont;
let bodyFont;
let bgmTrack;
const bgmToggleBtn = { x: 0, y: 0, w: 44, h: 44 };

// Mochi colour palette (shared across screens)
const MOCHI = {
  sky: [233, 246, 255],
  hills: [255, 210, 225],
  counterTop: [200, 245, 235],
  counterFront: [170, 230, 220],
  outline: [40, 50, 70],
  inkDark: [30, 35, 45],
  accent: [255, 205, 120],
};

// =====================
// P5 HOOKS
// =====================
function setup() {
  createCanvas(windowWidth, windowHeight);
  if (bodyFont) textFont(bodyFont);
  else textFont("Poppins");
}

function draw() {
  switch (currentScreen) {
    case "start":
      drawStart();
      break;
    case "instr":
      drawInstr();
      break;
    case "tutorial":
      drawTutorial();
      break;
    case "act_intro":
      drawActIntro();
      break;
    case "game":
      drawGame();
      break;
    case "cvd_shift":
      drawCVDShift();
      break;
    case "act_debrief":
      drawActDebrief();
      break;
    case "scenario":
      drawScenario();
      break;
    case "win":
      drawWin();
      break;
    case "lose":
      drawLose();
      break;
    case "endgame":
      drawEndgame();
      break;
  }
  drawFlash();
  drawScoreAnims();
  drawBgmToggle();
}

function mousePressed() {
  unlockAudio();
  startBgmLoop();

  _syncBgmToggleBtn();
  if (isHover(bgmToggleBtn)) {
    playSound("click");
    toggleBgm();
    return;
  }

  switch (currentScreen) {
    case "start":
      startMousePressed();
      break;
    case "instr":
      instrMousePressed();
      break;
    case "tutorial":
      tutMousePressed();
      break;
    case "act_intro":
      actIntroMousePressed();
      break;
    case "game":
      gameMousePressed();
      break;
    case "cvd_shift":
      cvdShiftMousePressed();
      break;
    case "act_debrief":
      actDebriefMousePressed();
      break;
    case "scenario":
      scenarioMousePressed();
      break;
    case "win":
      winMousePressed();
      break;
    case "lose":
      loseMousePressed();
      break;
    case "endgame":
      endgameMousePressed();
      break;
  }
}

function keyPressed() {
  unlockAudio();
  startBgmLoop();

  if (key === "m" || key === "M") {
    playSound("click");
    toggleBgm();
    return;
  }

  switch (currentScreen) {
    case "start":
      startKeyPressed();
      break;
    case "instr":
      instrKeyPressed();
      break;
    case "tutorial":
      tutKeyPressed();
      break;
    case "act_intro":
      actIntroMousePressed();
      break;
    case "game":
      gameKeyPressed();
      break;
    case "cvd_shift":
      cvdShiftMousePressed();
      break;
    case "act_debrief":
      actDebriefMousePressed();
      break;
    case "scenario":
      scenarioKeyPressed();
      break;
    case "win":
      winMousePressed();
      break;
    case "lose":
      loseMousePressed();
      break;
    case "endgame":
      endgameMousePressed();
      break;
  }
}

// =====================
// HELPERS
// =====================
function isHover(box) {
  return (
    mouseX > box.x - box.w / 2 &&
    mouseX < box.x + box.w / 2 &&
    mouseY > box.y - box.h / 2 &&
    mouseY < box.y + box.h / 2
  );
}

function triggerFlash(col) {
  flashCol = col;
  flashUntil = millis() + 350;
}

function drawFlash() {
  if (millis() < flashUntil && flashCol) {
    noStroke();
    fill(flashCol[0], flashCol[1], flashCol[2], 75);
    rectMode(CORNER);
    rect(0, 0, width, height);
  }
}

function spawnScoreAnim(val, x, y) {
  scoreAnims.push({ val, x, y, born: millis() });
}

function _syncBgmToggleBtn() {
  bgmToggleBtn.x = bgmToggleBtn.w / 2 + 20;
  bgmToggleBtn.y = height - bgmToggleBtn.h / 2 - 20;
}

function drawBgmToggle() {
  _syncBgmToggleBtn();
  const hov = isHover(bgmToggleBtn);
  const enabled = isBgmEnabled();
  const icon = enabled ? "🔊" : "🔇";

  noStroke();
  fill(255, 255, 255, hov ? 245 : 220);
  rectMode(CENTER);
  rect(bgmToggleBtn.x, bgmToggleBtn.y, bgmToggleBtn.w, bgmToggleBtn.h, 12);

  if (bodyFont) textFont(bodyFont);
  fill(enabled ? 55 : 130, enabled ? 150 : 130, enabled ? 90 : 130);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(icon, bgmToggleBtn.x, bgmToggleBtn.y + 1);
}

function drawScoreAnims() {
  for (let i = scoreAnims.length - 1; i >= 0; i--) {
    const a = scoreAnims[i];
    const age = millis() - a.born;
    if (age > 900) {
      scoreAnims.splice(i, 1);
      continue;
    }
    const alpha = map(age, 500, 900, 255, 0);
    const yOff = map(age, 0, 900, 0, -60);
    noStroke();
    fill(a.val > 0 ? 50 : 200, a.val > 0 ? 180 : 50, 80, alpha);
    textAlign(CENTER, CENTER);
    textSize(28);
    text((a.val > 0 ? "+" : "") + a.val, a.x, a.y + yOff);
  }
}

// =====================
// ACT FLOW
// =====================
function startNewGame() {
  score = 0;
  totalCorrect = 0;
  totalServed = 0;
  act = 1;
  actRound = 1;
  globalRound = 1;
  visionMode = "NORMAL";
  cvdType = "DEUTAN";
  showLabels = false;
  scenarioData = null;
  scoreAnims = [];
  startTutorial(); // sets up tutorial state (defined in tutorial.js)
  currentScreen = "tutorial";
}

// Called by win/lose screens after the player clicks to continue.
// Handles all act transitions, CVD shifts, scenarios, and the endgame.
function advanceAfterRound() {
  actRound++;
  globalRound++;

  // ── Act 1 (rounds 1–5) ──────────────────────────────────
  if (act === 1) {
    if (actRound === 3) {
      // Dramatic CVD shift before round 3
      visionMode = "CVD";
      cvdType = "DEUTAN";
      currentScreen = "cvd_shift";
      return;
    }
    if (actRound > 5) {
      debriefAct = 1;
      act = 2;
      actRound = 1;
      visionMode = "CVD";
      cvdType = "PROTAN";
      showLabels = true;
      playSound("levelup");
      currentScreen = "act_debrief";
      return;
    }
  }

  // ── Act 2 (rounds 6–10) ─────────────────────────────────
  if (act === 2) {
    // Labels help in rounds 1–3, then disappear to show the challenge
    showLabels = actRound <= 3;
    if (actRound > 5) {
      debriefAct = 2;
      act = 3;
      actRound = 1;
      visionMode = "CVD";
      cvdType = "TRITAN";
      showLabels = false;
      playSound("levelup");
      currentScreen = "act_debrief";
      return;
    }
  }

  // ── Act 3 (rounds 11–15) ────────────────────────────────
  if (act === 3) {
    if (actRound > 5) {
      playSound("levelup");
      currentScreen = "endgame";
      return;
    }
    // Scenario popups before rounds 2 and 4
    if (actRound === 2 || actRound === 4) {
      setupScenario(actRound === 2 ? "traffic" : "pills");
      playSound("scenario");
      currentScreen = "scenario";
      return;
    }
  }

  startRound();
  currentScreen = "game";
}
