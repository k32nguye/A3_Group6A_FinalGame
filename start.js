const playBtn = { y: 500, w: 280, h: 86, label: "START SHIFT" };
const instrBtn = { y: 620, w: 280, h: 86, label: "INSTRUCTIONS" };

let titleFont;
let pinkMonster;
let blueMonster;
let greenMonster;
let orangeMonster;
let pinkMonsterNeutral;
let blueMonsterNeutral;
let greenMonsterNeutral;
let orangeMonsterNeutral;

function preload() {
  titleFont = loadFont("assets/fonts/PressStart2P-Regular.ttf");

  // monsters
  pinkMonster = loadImage("assets/pinkmonsterhappy.png");
  pinkMonsterNeutral = loadImage("assets/pinkmonsterneutral.png");
  blueMonster = loadImage("assets/bluemonster.png");
  blueMonsterNeutral = loadImage("assets/bluemonsterneutral.png");
  greenMonster = loadImage("assets/greenmonster.png");
  greenMonsterNeutral = loadImage("assets/greenmonsterneutral.png");
  orangeMonster = loadImage("assets/orangemonster.png");
  orangeMonsterNeutral = loadImage("assets/orangemonsterneutral.png");
}

function drawStart() {
  drawMochiSky();
  // Big title sign
  noStroke();
  fill(255, 255, 255);
  rectMode(CENTER);
  rect(width / 2, 180, 640, 140, 26);

  fill(40, 45, 60);
  textAlign(CENTER, CENTER);
  textSize(44);
  textFont(titleFont);
  text("BOBA BAR", width / 2, 170);

  textSize(18);
  fill(70, 75, 90);
  text("Monster Mayhem", width / 2, 210);

  // Buttons
  drawMenuButton(playBtn, true);
  playBtn.x = width / 2;
  drawMenuButton(instrBtn, false);
  instrBtn.x = width / 2;

  cursor(isHover(playBtn) || isHover(instrBtn) ? HAND : ARROW);

  // Cute monsters on counter
  drawMonsterLineDecor();
}

function startMousePressed() {
  if (isHover(playBtn)) {
    startNewShift();
    currentScreen = "game";
  } else if (isHover(instrBtn)) {
    currentScreen = "instr";
  }
}

function startKeyPressed() {
  if (keyCode === ENTER) {
    startNewShift();
    currentScreen = "game";
  }
  if (key === "i" || key === "I") currentScreen = "instr";
}

function drawMenuButton(btn, primary) {
  rectMode(CENTER);
  const hover = isHover(btn);

  noStroke();
  if (primary) {
    if (hover) fill(250, 190, 85);
    else fill(255, 205, 120);
  } else {
    if (hover) fill(247, 245, 242);
    else fill(255, 255, 255);
  }

  rect(btn.x, btn.y, btn.w, btn.h, 22);

  fill(40, 45, 60);
  textAlign(CENTER, CENTER);
  textSize(22);
  text(btn.label, btn.x, btn.y);
}

function startNewShift() {
  score = 0;
  round = 1;
  visionMode = "CVD";
  startRound();
}

function drawMochiSky() {
  background(233, 246, 255);

  noStroke();
  fill(255, 210, 225);
  ellipse(170, 180, 340, 340);
  ellipse(560, 170, 550, 550);

  fill(255, 255, 255, 200);
  ellipse(90, 78, 60, 60);
  fill(255, 255, 255);
  ellipse(120, 70, 35, 35);
  fill(255, 255, 255, 200);
  ellipse(700, 50, 90, 90);
  fill(255, 255, 255);
  ellipse(660, 75, 50, 50);

  // Counter base strip
  fill(170, 230, 220);
  rectMode(CORNER);
  rect(0, 710, width, 110);
}

function drawMonsterLineDecor() {
  const xs = [170, 310, 450, 590];
  for (let i = 0; i < 4; i++) {
    drawMochiMonster(xs[i], 720, 70, i, "waiting");
  }
}
