// Variables (titleFont, pinkMonster, etc., mainBg) are declared in main.js
const playBtn = { x: 0, y: 500, w: 280, h: 86, label: "START GAME" };
const instrBtn = { x: 0, y: 620, w: 280, h: 86, label: "INSTRUCTIONS" };

function preload() {
  titleFont = loadFont("assets/fonts/PressStart2P-Regular.ttf");
  bodyFont = "Poppins";
  bgmTrack = loadSound("assets/bgm.mp3");

  // monsters
  pinkMonster = loadImage("assets/pinkmonsterhappy.png");
  pinkMonsterNeutral = loadImage("assets/pinkmonsterneutral.png");
  blueMonster = loadImage("assets/bluemonster.png");
  blueMonsterNeutral = loadImage("assets/bluemonsterneutral.png");
  greenMonster = loadImage("assets/greenmonster.png");
  greenMonsterNeutral = loadImage("assets/greenmonsterneutral.png");
  orangeMonster = loadImage("assets/orangemonster.png");
  orangeMonsterNeutral = loadImage("assets/orangemonsterneutral.png");

  mainBg = loadImage("assets/mainbackground.jpeg");
  orderBg = loadImage("assets/orderbg.jpeg");
}

function drawStart() {
  // Set button centres first so hover detection works on frame 1
  playBtn.x = width / 2;
  instrBtn.x = width / 2;

  imageMode(CORNER);
  image(mainBg, 0, 0, width, height);
  noStroke();
  if (titleFont) textFont(titleFont);

  // Buttons
  drawMenuButton(playBtn, true);

  cursor(isHover(playBtn) ? HAND : ARROW);

  // monsters on counter
  drawMonsterLineDecor();
}

function startMousePressed() {
  if (isHover(playBtn)) {
    playSound("click");
    startNewGame();
  } else if (isHover(instrBtn)) {
    playSound("click");
    currentScreen = "instr";
  }
}

function startKeyPressed() {
  if (keyCode === ENTER) {
    playSound("click");
    startNewGame();
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

// startNewShift replaced by startNewGame() in main.js

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
  const spacing = 140;
  const centerX = width / 2;
  const xs = [
    centerX - spacing * 1.5,
    centerX - spacing * 0.5,
    centerX + spacing * 0.5,
    centerX + spacing * 1.5,
  ];
  for (let i = 0; i < 4; i++) {
    drawMochiMonster(xs[i], 720, 70, i, "waiting");
  }
}
