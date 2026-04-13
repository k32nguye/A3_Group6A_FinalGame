// =========================
// TUTORIAL
// A guided walkthrough before Act 1 begins.
// Steps: -1 Prelude, 0 Welcome, 1 The Order, 2 CVD Effect, 3 Shape Cues, 4 Practice, 5 Done
// =========================

let tutStep = 0;
let tutPracticePhase = 0; // 0=pickBase, 1=pickSyrup, 2=pickTopping, 3=serve, 4=complete
let tutSel = { base: null, syrup: null, topping: null };
let tutOrder = null;

// Card hit-boxes populated during draw
let _tutBaseCards = [];
let _tutSyrupCards = [];
let _tutTopCards = [];
let _tutServeBox = null;
let _tutPreludeStartMs = 0;
let _tutPreludeLine = 0;
let _tutPreludeChars = 0;
let _tutPreludeLastTypeMs = 0;

const _TUT_PRELUDE_LINES = [
  "You weren’t supposed to be here.",
  "Somehow… you got hired at a monster boba café.",
  "There’s just one problem:",
  "Monsters don’t see colours the way you do.",
  "Use your human vision while you can…",
  "Then learn to see the world their way.",
];

const _TUT_NEXT = { x: 0, y: 0, w: 220, h: 56 };
const _TUT_SKIP = { x: 0, y: 0, w: 160, h: 46 };

// Called by startNewGame() in main.js
function startTutorial() {
  tutStep = -1;
  tutPracticePhase = 0;
  tutSel = { base: null, syrup: null, topping: null };
  _tutPreludeStartMs = millis();
  _tutPreludeLine = 0;
  _tutPreludeChars = 0;
  _tutPreludeLastTypeMs = millis();
  // Practice order: Milk Tea + Mango + Pudding (distinct colours, easy to see in normal vision)
  tutOrder = { base: TEA_BASES[1], syrup: SYRUPS[2], topping: TOPPINGS[2] };
  _tutBaseCards = [];
  _tutSyrupCards = [];
  _tutTopCards = [];
  _tutServeBox = null;
}

// =========================
// ROUTER
// =========================
function drawTutorial() {
  // Skip button always visible on steps 0-3
  if (tutStep < 4) _drawTutSkip();
  switch (tutStep) {
    case -1:
      _drawTutPrelude();
      break;
    case 0:
      _drawTutWelcome();
      break;
    case 1:
      _drawTutOrder();
      break;
    case 2:
      _drawTutCVD();
      break;
    case 3:
      _drawTutShapes();
      break;
    case 4:
      _drawTutPractice();
      break;
    case 5:
      _drawTutDone();
      break;
  }
}

// =========================
// STEP -1: PRELUDE (TEXT ONLY)
// =========================
function _drawTutPrelude() {
  background(230, 240, 255);

  const cardW = min(width - 80, 780);
  const cx = width / 2;
  const t = millis() * 0.001;
  // Typewriter timing
  const curLineText = _TUT_PRELUDE_LINES[_tutPreludeLine] || "";
  const lineDone = _tutPreludeChars >= curLineText.length;
  if (!lineDone && millis() - _tutPreludeLastTypeMs > 26) {
    _tutPreludeChars = min(_tutPreludeChars + 1, curLineText.length);
    _tutPreludeLastTypeMs = millis();
  }

  // Floating boba/bubble ambience
  noStroke();
  for (let i = 0; i < 14; i++) {
    const speed = 18 + (i % 4) * 6;
    const bx = ((i * 137 + t * speed) % (width + 180)) - 90;
    const by = 95 + ((i * 69) % (height - 190)) + sin(t * 1.5 + i) * 14;
    const r = 14 + (i % 5) * 8;
    fill(255, 255, 255, 36);
    ellipse(bx, by, r * 2.3, r * 2.3);
    fill(180, 210, 255, 24);
    ellipse(bx + 2, by + 2, r * 1.5, r * 1.5);
  }

  // Soft glowing backdrop behind card
  fill(175, 195, 255, 28);
  ellipse(cx, height / 2 - 20, cardW + 110, height - 80);

  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  rect(
    cx,
    height / 2 - 30 + sin(frameCount * 0.04) * 2,
    cardW,
    height - 140,
    18,
  );

  // Little spark accents
  for (let i = 0; i < 3; i++) {
    const sx = cx - 280 + i * 280;
    const sy = height / 2 - 215 + sin(t * 2 + i * 0.8) * 6;
    fill(255, 220, 120, 120);
    ellipse(sx, sy, 8, 8);
    fill(255, 240, 200, 170);
    ellipse(sx, sy, 4, 4);
  }

  if (bodyFont) textFont(bodyFont);
  textAlign(CENTER, CENTER);
  const preludeBaseY = height / 2 - 120;
  for (let i = 0; i <= _tutPreludeLine; i++) {
    const fullLine = _TUT_PRELUDE_LINES[i];
    const shown =
      i < _tutPreludeLine ? fullLine : fullLine.slice(0, _tutPreludeChars);
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2], 255);
    textStyle(i === 0 ? BOLD : NORMAL);
    textSize(i === 0 ? 21 : 18);
    text(shown, cx, preludeBaseY + i * 28);
  }
  textStyle(NORMAL);

  // subtle prompt pulse
  const promptA = 95 + sin(frameCount * 0.08) * 55;
  fill(80, 100, 140, promptA);
  textSize(13);
  if (_tutPreludeLine < _TUT_PRELUDE_LINES.length - 1 || !lineDone) {
    text("Press SPACE/ENTER (or click) for next line", cx, height - 250);
  } else {
    text(
      "Story complete. Press SPACE/ENTER or click CONTINUE",
      cx,
      height - 250,
    );
    _drawTutNextBtn("CONTINUE  ->");
  }
}

function _advanceTutPrelude() {
  const curLineText = _TUT_PRELUDE_LINES[_tutPreludeLine] || "";

  // If current line is still typing, finish it instantly
  if (_tutPreludeChars < curLineText.length) {
    _tutPreludeChars = curLineText.length;
    return;
  }

  // Move to next line
  if (_tutPreludeLine < _TUT_PRELUDE_LINES.length - 1) {
    _tutPreludeLine++;
    _tutPreludeChars = 0;
    _tutPreludeLastTypeMs = millis();
    return;
  }

  // All lines complete -> proceed
  tutStep = 0;
}

function tutMousePressed() {
  unlockAudio();
  // Skip button
  if (tutStep < 4 && isHover(_TUT_SKIP)) {
    playSound("click");
    currentScreen = "act_intro";
    return;
  }
  if (tutStep === -1) {
    const atLastLine = _tutPreludeLine === _TUT_PRELUDE_LINES.length - 1;
    const lineDone =
      _tutPreludeChars >= _TUT_PRELUDE_LINES[_tutPreludeLine].length;
    if (atLastLine && lineDone) {
      if (isHover(_TUT_NEXT)) {
        playSound("click");
        tutStep = 0;
      }
    } else {
      playSound("click");
      _advanceTutPrelude();
    }
    return;
  }
  if (tutStep === 4) {
    _handleTutPracticeClick();
    return;
  }
  if (tutStep === 5) {
    if (isHover(_TUT_NEXT)) {
      playSound("click");
      currentScreen = "act_intro";
    }
    return;
  }
  // Steps 0-3: next button or anywhere on card
  if (isHover(_TUT_NEXT)) {
    playSound("click");
    if (tutStep === 2) tutStep = 4;
    else tutStep++;
  }
}

function tutKeyPressed() {
  if (tutStep === -1 && (keyCode === ENTER || keyCode === 32)) {
    playSound("click");
    _advanceTutPrelude();
  } else if (tutStep === 2 && (keyCode === ENTER || keyCode === 32)) {
    playSound("click");
    tutStep = 4;
  } else if (tutStep < 4 && (keyCode === ENTER || keyCode === 32)) {
    playSound("click");
    tutStep++;
  } else if (tutStep === 5 && (keyCode === ENTER || keyCode === 32)) {
    playSound("click");
    currentScreen = "act_intro";
  }
}

// =========================
// SHARED HELPERS
// =========================
function _drawTutSkip() {
  _TUT_SKIP.x = width - 100;
  _TUT_SKIP.y = 30;
  const h = isHover(_TUT_SKIP);
  noStroke();
  fill(255, 255, 255, h ? 220 : 160);
  rectMode(CENTER);
  rect(_TUT_SKIP.x, _TUT_SKIP.y, _TUT_SKIP.w, _TUT_SKIP.h, 12);
  fill(80, 85, 100);
  textAlign(CENTER, CENTER);
  textSize(13);
  if (bodyFont) textFont(bodyFont);
  text("Skip tutorial", _TUT_SKIP.x, _TUT_SKIP.y);
  cursor(h ? HAND : ARROW);
}

function _drawTutNextBtn(label, btnYOffset = 0) {
  _TUT_NEXT.x = width / 2;
  _TUT_NEXT.y = height - 200 + btnYOffset;
  const h = isHover(_TUT_NEXT);
  noStroke();
  fill(h ? 250 : 255, h ? 190 : 205, h ? 85 : 120);
  rectMode(CENTER);
  rect(_TUT_NEXT.x, _TUT_NEXT.y, _TUT_NEXT.w, _TUT_NEXT.h, 14);
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(15);
  text(label || "NEXT  ->", _TUT_NEXT.x, _TUT_NEXT.y);
  cursor(h ? HAND : ARROW);
}

function _drawTutStepDots(total, current) {
  const dotR = 6;
  const gap = 20;
  const startX = width / 2 - ((total - 1) * gap) / 2;
  for (let i = 0; i < total; i++) {
    noStroke();
    fill(
      i === current ? MOCHI.inkDark[0] : 180,
      i === current ? MOCHI.inkDark[1] : 180,
      i === current ? MOCHI.inkDark[2] : 180,
    );
    ellipse(
      startX + i * gap,
      height - 18,
      dotR * (i === current ? 2 : 1.2),
      dotR * (i === current ? 2 : 1.2),
    );
  }
}

function _tutCard(cardH) {
  // Returns card top y; draws centered white card
  const cardW = min(width - 80, 780);
  const cardY = 80;
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CORNER);
  rect(width / 2 - cardW / 2, cardY, cardW, cardH, 18);
  return cardY;
}

function _tutCardTitle(label, cardY, accent) {
  if (titleFont) textFont(titleFont);
  fill(accent[0], accent[1], accent[2]);
  textAlign(CENTER, TOP);
  textSize(17);
  text(label, width / 2, cardY + 22);
  if (bodyFont) textFont(bodyFont);
}

// =========================
// STEP 0: WELCOME
// =========================
function _drawTutWelcome() {
  background(230, 240, 255);

  const cardW = min(width - 80, 780);
  const cx = width / 2;
  const bodyW = cardW - 60;
  const bodyX = cx - bodyW / 2;
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  rect(cx, height / 2 - 30, cardW, height - 140, 18);

  if (titleFont) textFont(titleFont);
  fill(80, 120, 200);
  textAlign(CENTER, CENTER);
  textSize(25);
  text("COLOUR CONFUSION BOBA BAR", cx, height / 2 - 185);
  if (bodyFont) textFont(bodyFont);

  fill(43, 67, 186);
  textSize(14);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  text("A game about seeing the world differently", cx, height / 2 - 150);

  // Three act preview icons
  const acts = [
    { label: "Act 1", desc: "Experience\nDeuteranopia", col: [180, 220, 180] },
    {
      label: "Act 2",
      desc: "Learn to adapt\nwith labels",
      col: [255, 220, 185],
    },
    { label: "Act 3", desc: "Everyday\nchallenges", col: [210, 210, 250] },
  ];
  for (let i = 0; i < acts.length; i++) {
    const bx = cx - 220 + i * 220;
    noStroke();
    fill(acts[i].col[0], acts[i].col[1], acts[i].col[2]);
    rectMode(CENTER);
    rect(bx, height / 2 - 50, 190, 110, 14);
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(14);
    text(acts[i].label, bx, height / 2 - 80);
    textStyle(NORMAL);
    textSize(13);
    textLeading(21);
    text(acts[i].desc, bx, height / 2 - 40);
  }

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(20);
  textLeading(24);
  text(
    "You run a bubble tea cafe for mochi monster customers.",
    cx,
    height / 2 + 54,
  );
  textStyle(BOLD);
  text("Objective:", cx, height / 2 + 100);
  textStyle(NORMAL);
  text("Make the drinks right and try not to stand out!", cx, height / 2 + 126);

  _drawTutNextBtn("START TUTORIAL  ->");
  _drawTutStepDots(5, 0);
}

// =========================
// STEP 1: THE ORDER BUBBLE
// =========================
function _drawTutOrder() {
  background(233, 246, 255);

  const cardW = min(width - 80, 780);
  const cx = width / 2;
  const cardY = _tutCard(height - 120);
  const orderYOffset = 150; // increase to move this whole section lower
  const bodyW = cardW - 60;
  const bodyX = cx - bodyW / 2;

  _tutCardTitle("THE CUSTOMER'S ORDER", cardY + orderYOffset, [60, 130, 200]);

  // Draw an example order bubble (normal colours)
  const sampleOrder = {
    base: TEA_BASES[2],
    syrup: SYRUPS[0],
    topping: TOPPINGS[1],
  };
  const bubbleX = cx - 260;
  const bubbleY = cardY + 70 + orderYOffset;

  // White speech bubble
  noStroke();
  fill(248, 248, 255);
  rectMode(CORNER);
  rect(bubbleX, bubbleY, 520, 72, 28);
  triangle(
    bubbleX + 24,
    bubbleY + 72,
    bubbleX + 60,
    bubbleY + 72,
    bubbleX + 42,
    bubbleY + 110,
  );

  // Slots
  const slots = [
    { label: "Base", item: sampleOrder.base, px: bubbleX + 22 },
    { label: "Syrup", item: sampleOrder.syrup, px: bubbleX + 192 },
    { label: "Topping", item: sampleOrder.topping, px: bubbleX + 362 },
  ];
  for (let i = 0; i < slots.length; i++) {
    const c = slots[i].item.c;
    noStroke();
    fill(c[0], c[1], c[2]);
    rectMode(CORNER);
    rect(slots[i].px, bubbleY + 14, 36, 36, 8);

    // Shape indicator
    noFill();
    stroke(255, 255, 255, 200);
    strokeWeight(2);
    const sc = slots[i].px + 18;
    const sr = bubbleY + 32;
    if (i === 0) ellipse(sc, sr, 18, 18);
    else if (i === 1) {
      push();
      translate(sc, sr);
      rotate(PI / 4);
      rectMode(CENTER);
      rect(0, 0, 14, 14);
      pop();
    } else
      triangle(sc, bubbleY + 18, sc - 10, bubbleY + 46, sc + 10, bubbleY + 46);
    noStroke();

    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(13);
    text(slots[i].label, slots[i].px + 44, bubbleY + 24);
    textStyle(NORMAL);
    fill(100, 100, 130);
    textSize(11);
    text(slots[i].item.label, slots[i].px + 44, bubbleY + 42);
  }

  // Clear callouts for "True colours" and "Shape cues"
  // const leftCallout = { x: bubbleX + 130, y: bubbleY - 36, w: 220, h: 58 };
  // const rightCallout = { x: bubbleX + 390, y: bubbleY - 36, w: 250, h: 74 };

  // noStroke();
  // fill(230, 243, 255);
  // rectMode(CENTER);
  // rect(leftCallout.x, leftCallout.y, leftCallout.w, leftCallout.h, 12);
  // rect(rightCallout.x, rightCallout.y, rightCallout.w, rightCallout.h, 12);

  // fill(55, 125, 190);
  // textAlign(CENTER, CENTER);
  // textSize(12);
  // textLeading(17);
  // text(
  //   "True colours = exactly\nwhat the customer wants",
  //   leftCallout.x,
  //   leftCallout.y,
  // );
  // text(
  //   "Shape = category\n(circle = base, diamond = syrup,\ntriangle = topping)",
  //   rightCallout.x,
  //   rightCallout.y,
  // );

  // // Pointer lines from callouts to the order bubble
  // stroke(60, 130, 200, 190);
  // strokeWeight(2);
  // line(
  //   leftCallout.x,
  //   leftCallout.y + leftCallout.h / 2,
  //   bubbleX + 50,
  //   bubbleY + 6,
  // );
  // line(
  //   rightCallout.x,
  //   rightCallout.y + rightCallout.h / 2,
  //   bubbleX + 395,
  //   bubbleY + 10,
  // );
  // noStroke();

  // Explanation below
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, TOP);
  textSize(14);
  textLeading(24);
  text(
    "When a customer places an order, their speech bubble shows what they want\n" +
      "using TRUE colours. This is always shown in the order area at the top of the screen.\n\n" +
      "Each coloured square also has a shape symbol to help you identify the category.\n" +
      "Tip: if colours look close, compare shape and brightness first.",
    bodyX,
    cardY + 210 + orderYOffset,
    bodyW,
  );

  _drawTutNextBtn("NEXT  ->");
  _drawTutStepDots(5, 1);
}

// =========================
// STEP 2: CVD EFFECT
// =========================
function _drawTutCVD() {
  background(245, 235, 255);

  const cardW = min(width - 80, 780);
  const cx = width / 2;
  const cardY = _tutCard(height - 140);
  const cvdYOffset = 100; // increase to move this section lower
  const bodyW = cardW - 60;
  const bodyX = cx - bodyW / 2;

  _tutCardTitle("SPECIAL GLASSES", cardY + cvdYOffset, [150, 60, 200]);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, TOP);
  textSize(14);
  textLeading(23);
  const paraY = cardY + 58 + cvdYOffset;
  const lineH = 23;

  textStyle(NORMAL);
  text(
    "You've got a pair of special glasses!\n\n" +
      "They translate what monsters see into colours you understand.",
    bodyX,
    paraY,
    bodyW,
  );

  textStyle(BOLD);
  text(
    "They don’t last long before they need to cool down.",
    bodyX,
    paraY + lineH * 3,
    bodyW,
  );

  textStyle(NORMAL);
  text(
    "Use them to learn each order then try to match it even without them.",
    bodyX,
    paraY + lineH * 4,
    bodyW,
  );

  // Side by side comparison: human colours -> monster-seen colours
  const pairs = [
    { label: "Strawberry\n(Red-Pink)", c: [225, 80, 105] },
    { label: "Honeydew\n(Bright Green)", c: [105, 210, 120] },
    { label: "Mango\n(Golden Yellow)", c: [245, 175, 60] },
  ];

  const visualGap = 90; // extra space so visual does not overlap paragraph text
  const pairY = cardY + 138 + cvdYOffset + visualGap;

  // Headers (structured chips to avoid floating/misaligned text)
  const leftHeadX = cx - 120;
  const rightHeadX = cx + 120;
  const headY = pairY - 24;
  noStroke();
  fill(220, 245, 220, 210);
  rectMode(CENTER);
  rect(leftHeadX, headY, 200, 28, 10);
  fill(255, 220, 220, 210);
  rect(rightHeadX, headY, 210, 28, 10);

  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(12);
  fill(45, 120, 45);
  text("Glasses ON", leftHeadX, headY);
  fill(165, 45, 45);
  text("Cooldown", rightHeadX, headY);
  textStyle(NORMAL);

  // Rows: left (human) -> right (monster sees)
  const leftSwatchX = cx - 145;
  const rightSwatchX = cx + 145;
  const rowStartY = pairY + 16;
  const rowGap = 78;

  for (let i = 0; i < pairs.length; i++) {
    const rowY = rowStartY + i * rowGap;
    const c = pairs[i].c;
    const cvd = _tutSimDeutan(c);

    // Human colour box (left)
    fill(c[0], c[1], c[2]);
    rectMode(CENTER);
    rect(leftSwatchX, rowY, 52, 52, 8);

    // Arrow (centered exactly between both swatches)
    const arrowStartX = leftSwatchX + 34;
    const arrowEndX = rightSwatchX - 34;
    stroke(140, 140, 160);
    strokeWeight(3);
    line(arrowStartX, rowY, arrowEndX, rowY);
    noStroke();
    fill(140, 140, 160);
    triangle(arrowEndX, rowY, arrowEndX - 9, rowY - 6, arrowEndX - 9, rowY + 6);

    // Monster-seen colour box (right)
    fill(cvd[0], cvd[1], cvd[2]);
    rect(rightSwatchX, rowY, 52, 52, 8);

    // Ingredient label for each row
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, CENTER);
    textSize(12);
    textLeading(17);
    text(pairs[i].label, leftSwatchX + 40, rowY);
  }

  _drawTutNextBtn("PRACTICE ROUND  ->", 45);
  _drawTutStepDots(5, 2);
}

// =========================
// STEP 3: SHAPE CUES
// =========================
function _drawTutShapes() {
  background(240, 255, 240);

  const cardW = min(width - 80, 780);
  const cx = width / 2;
  const cardY = _tutCard(height - 140);
  const shapeYOffset = 14;
  const bodyW = cardW - 60;
  const bodyX = cx - bodyW / 2;

  _tutCardTitle(
    "READ SHAPES & BRIGHTNESS",
    cardY + shapeYOffset,
    [60, 140, 60],
  );

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, TOP);
  textSize(14);
  textLeading(23);
  text(
    "When colours get confusing, use shape, brightness, and position first.\n" +
      "Each ingredient category has its own shape cue, so you can still build the right drink.",
    bodyX,
    cardY + 55 + shapeYOffset,
    bodyW,
  );

  // Shape legend cards
  const shapes = [
    {
      key: "base",
      name: "Tea Base",
      shape: "circle",
      col: [190, 150, 105],
      desc: "Round circles\nidentify tea bases",
    },
    {
      key: "syrup",
      name: "Syrup",
      shape: "diamond",
      col: [225, 80, 105],
      desc: "Diamond shapes\nidentify syrups",
    },
    {
      key: "topping",
      name: "Topping",
      shape: "triangle",
      col: [245, 215, 120],
      desc: "Triangles\nidentify toppings",
    },
  ];

  const cardBlockY = cardY + 144 + shapeYOffset;

  for (let i = 0; i < shapes.length; i++) {
    const bx = cx - 230 + i * 230;
    noStroke();
    fill(245, 248, 255);
    rectMode(CENTER);
    rect(bx, cardBlockY + 50, 200, 145, 14);

    // Coloured swatch with shape
    const c = shapes[i].col;
    fill(c[0], c[1], c[2]);
    rect(bx, cardBlockY + 6, 56, 56, 8);

    // White shape outline on swatch
    noFill();
    stroke(255, 255, 255, 220);
    strokeWeight(2.5);
    if (shapes[i].shape === "circle") {
      ellipse(bx, cardBlockY + 6, 26, 26);
    } else if (shapes[i].shape === "diamond") {
      push();
      translate(bx, cardBlockY + 6);
      rotate(PI / 4);
      rectMode(CENTER);
      rect(0, 0, 20, 20);
      pop();
    } else {
      triangle(
        bx,
        cardBlockY - 8,
        bx - 12,
        cardBlockY + 18,
        bx + 12,
        cardBlockY + 18,
      );
    }
    noStroke();

    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textStyle(BOLD);
    textSize(14);
    textAlign(CENTER, TOP);
    text(shapes[i].name, bx, cardBlockY + 42);
    textStyle(NORMAL);
    textSize(13);
    textLeading(20);
    text(shapes[i].desc, bx, cardBlockY + 64);
  }

  // Brightness tip
  noStroke();
  fill(220, 240, 220, 200);
  rectMode(CENTER);
  rect(cx, cardBlockY + 182, cardW - 60, 58, 12);
  fill(40, 100, 40);
  textAlign(CENTER, CENTER);
  textSize(13);
  textLeading(21);
  text(
    "Tip: Even when colours look similar, BRIGHTNESS differs.\n" +
      "Dark brown (Boba) vs pale yellow (Pudding) are easy to tell apart by lightness alone.",
    cx - (cardW - 90) / 2,
    cardBlockY + 182,
    cardW - 90,
  );

  _drawTutNextBtn("PRACTICE ROUND  ->");
  _drawTutStepDots(5, 3);
}

// =========================
// STEP 4: INTERACTIVE PRACTICE
// =========================
function _drawTutPractice() {
  if (!tutOrder) return;

  background(233, 246, 255);

  // Top bar
  noStroke();
  fill(255, 255, 255, 220);
  rectMode(CORNER);
  rect(0, 0, width, 62);
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, CENTER);
  textSize(14);
  text("PRACTICE SHIFT  -  Normal Vision", 20, 31);
  fill(80, 130, 200);
  textAlign(RIGHT, CENTER);
  textSize(13);
  text("No CVD filter yet - just learn the controls", width - 20, 31);

  // Order area
  noStroke();
  fill(MOCHI.sky[0], MOCHI.sky[1], MOCHI.sky[2]);
  rectMode(CORNER);
  rect(20, 68, width - 40, 166, 14);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, TOP);
  textSize(12);
  text("CUSTOMER WANTS:", 36, 76);

  // Order bubble (true colours - tutorial uses normal vision)
  const bx = 40,
    by = 90;
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CORNER);
  rect(bx, by, 520, 72, 28);
  triangle(bx + 24, by + 72, bx + 60, by + 72, bx + 42, by + 110);

  const tutSlots = [
    { label: "Base", item: tutOrder.base, px: bx + 22 },
    { label: "Syrup", item: tutOrder.syrup, px: bx + 192 },
    { label: "Topping", item: tutOrder.topping, px: bx + 362 },
  ];
  for (let i = 0; i < tutSlots.length; i++) {
    const c = tutSlots[i].item.c;
    noStroke();
    fill(c[0], c[1], c[2]);
    rectMode(CORNER);
    rect(tutSlots[i].px, by + 14, 36, 36, 8);
    noFill();
    stroke(255, 255, 255, 200);
    strokeWeight(2);
    const sc = tutSlots[i].px + 18;
    const sr = by + 32;
    if (i === 0) ellipse(sc, sr, 18, 18);
    else if (i === 1) {
      push();
      translate(sc, sr);
      rotate(PI / 4);
      rectMode(CENTER);
      rect(0, 0, 14, 14);
      pop();
    } else triangle(sc, by + 18, sc - 10, by + 46, sc + 10, by + 46);
    noStroke();
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, CENTER);
    textSize(11);
    text(tutSlots[i].label, tutSlots[i].px + 44, by + 32);
  }

  // Counter surface
  noStroke();
  fill(MOCHI.counterTop[0], MOCHI.counterTop[1], MOCHI.counterTop[2]);
  rectMode(CORNER);
  rect(20, 242, width - 40, 110, 14);
  fill(MOCHI.counterFront[0], MOCHI.counterFront[1], MOCHI.counterFront[2]);
  rect(20, 324, width - 40, height - 324, 14);

  // "What you see:" label
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, TOP);
  textSize(12);
  text("WHAT YOU SEE (normal vision - no CVD yet):", 36, 250);

  // Ingredient bins
  const binGap = 210;
  const startX = 40;
  const binY = 356;
  _tutBaseCards = _drawTutBinCol("TEA BASE", TEA_BASES, startX, binY, "base");
  _tutSyrupCards = _drawTutBinCol(
    "SYRUP",
    SYRUPS,
    startX + binGap,
    binY,
    "syrup",
  );
  _tutTopCards = _drawTutBinCol(
    "TOPPING",
    TOPPINGS,
    startX + binGap * 2,
    binY,
    "topping",
  );

  // Cup preview
  _drawTutCup();

  // Serve button
  const servX = width - 130;
  const servY = height - 75;
  _tutServeBox = { x: servX, y: servY, w: 200, h: 56 };
  const serveReady = tutSel.base && tutSel.syrup && tutSel.topping;
  const servHov = isHover(_tutServeBox);
  noStroke();
  fill(
    serveReady ? (servHov ? 250 : 255) : 190,
    serveReady ? (servHov ? 190 : 205) : 190,
    serveReady ? (servHov ? 85 : 120) : 200,
  );
  rectMode(CENTER);
  rect(servX, servY, 200, 56, 14);
  fill(
    serveReady ? MOCHI.inkDark[0] : 120,
    serveReady ? MOCHI.inkDark[1] : 120,
    serveReady ? MOCHI.inkDark[2] : 130,
  );
  textAlign(CENTER, CENTER);
  textSize(16);
  text("SERVE  /", servX, servY);

  // Glowing coach overlay
  _drawTutCoachOverlay();
}

function _drawTutBinCol(title, list, x, y, slotKey) {
  const colW = 190;
  noStroke();
  fill(255, 255, 255, 210);
  rectMode(CORNER);
  rect(x, y - 28, colW, 34 + list.length * 52, 14);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(11);
  text(title, x + colW / 2, y - 12);

  const cards = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const cardY = y + i * 52;
    const card = { x: x + colW / 2, y: cardY + 22, w: colW, h: 46 };
    const hover = isHover(card);
    const chosen = tutSel[slotKey] && tutSel[slotKey].id === item.id;

    noStroke();
    if (chosen) fill(150, 210, 255, 230);
    else if (hover) fill(235, 245, 255, 230);
    else fill(255, 255, 255, 190);
    rectMode(CORNER);
    rect(x, cardY, colW, 46, 10);

    if (chosen) {
      stroke(80, 160, 230);
      strokeWeight(2);
      noFill();
      rect(x, cardY, colW, 46, 10);
      noStroke();
    }

    // Normal colour swatch + shape symbol
    const c = item.c;
    fill(c[0], c[1], c[2]);
    rect(x + 8, cardY + 8, 28, 28, 6);

    noFill();
    stroke(255, 255, 255, 200);
    strokeWeight(2);
    const sx = x + 22,
      sy = cardY + 22;
    if (slotKey === "base") ellipse(sx, sy, 14, 14);
    else if (slotKey === "syrup") {
      push();
      translate(sx, sy);
      rotate(PI / 4);
      rectMode(CENTER);
      rect(0, 0, 11, 11);
      pop();
    } else triangle(sx, cardY + 10, sx - 8, cardY + 30, sx + 8, cardY + 30);
    noStroke();

    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(item.label, x + 44, cardY + 22);
    if (chosen) {
      fill(80, 160, 230);
      textAlign(RIGHT, CENTER);
      textSize(14);
      text("v", x + colW - 8, cardY + 22);
    }

    cards.push({ card, item });
    cursor(hover ? HAND : ARROW);
  }
  return cards;
}

function _drawTutCup() {
  const cx = width - 300;
  const cy = 320;
  const baseC = tutSel.base ? tutSel.base.c : [230, 230, 230];
  const syrupC = tutSel.syrup ? tutSel.syrup.c : [240, 240, 240];
  const topC = tutSel.topping ? tutSel.topping.c : [220, 220, 220];

  stroke(MOCHI.outline[0], MOCHI.outline[1], MOCHI.outline[2]);
  strokeWeight(3);
  fill(255, 255, 255, 200);
  rectMode(CENTER);
  rect(cx, cy, 110, 150, 18);
  noStroke();

  fill(baseC[0], baseC[1], baseC[2], 200);
  rect(cx, cy + 42, 96, 50, 12);
  fill(syrupC[0], syrupC[1], syrupC[2], 190);
  rect(cx, cy - 4, 96, 40, 12);
  fill(topC[0], topC[1], topC[2], 180);
  rect(cx, cy - 44, 96, 36, 12);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, TOP);
  textSize(10);
  text("your drink", cx, cy + 84);
}

// Highlight the active area with a pulsing glow border + instruction tooltip
function _drawTutCoachOverlay() {
  const pulse = sin(frameCount * 0.08) * 0.5 + 0.5;
  const glowA = 120 + pulse * 135;

  const messages = [
    "Click any Tea Base to select it",
    "Click any Syrup to select it",
    "Click any Topping to select it",
    "All three selected! Now click SERVE",
    "",
  ];

  const targets = [
    { x: 40, y: 330, w: 190, h: height - 360 }, // base column area
    { x: 250, y: 330, w: 190, h: height - 360 }, // syrup column area
    { x: 460, y: 330, w: 190, h: height - 360 }, // topping column area
    { x: width - 230, y: height - 103, w: 200, h: 56 }, // serve button
    null,
  ];

  if (tutPracticePhase >= 4) return; // complete - no overlay needed

  const msg = messages[tutPracticePhase];
  const tgt = targets[tutPracticePhase];
  if (!tgt || !msg) return;

  // Glow border
  noFill();
  stroke(255, 200, 50, glowA);
  strokeWeight(4);
  rectMode(CORNER);
  rect(tgt.x - 4, tgt.y - 4, tgt.w + 8, tgt.h + 8, 14);

  // Second glow ring
  stroke(255, 200, 50, glowA * 0.4);
  strokeWeight(8);
  rect(tgt.x - 10, tgt.y - 10, tgt.w + 20, tgt.h + 20, 18);
  noStroke();

  // Instruction tooltip
  const tipX = min(tgt.x + tgt.w / 2, width - 180);
  const tipY = max(tgt.y - 52, 70);
  noStroke();
  fill(40, 40, 60, 220);
  rectMode(CENTER);
  rect(tipX, tipY, 280, 44, 10);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(msg, tipX, tipY);

  // Arrow
  fill(40, 40, 60, 220);
  triangle(tipX - 10, tipY + 22, tipX + 10, tipY + 22, tipX, tgt.y - 6);
}

function _handleTutPracticeClick() {
  if (tutPracticePhase === 0) {
    for (const c of _tutBaseCards) {
      if (isHover(c.card)) {
        tutSel.base = c.item;
        playSound("click");
        tutPracticePhase = 1;
        return;
      }
    }
  } else if (tutPracticePhase === 1) {
    for (const c of _tutSyrupCards) {
      if (isHover(c.card)) {
        tutSel.syrup = c.item;
        playSound("click");
        tutPracticePhase = 2;
        return;
      }
    }
  } else if (tutPracticePhase === 2) {
    for (const c of _tutTopCards) {
      if (isHover(c.card)) {
        tutSel.topping = c.item;
        playSound("click");
        tutPracticePhase = 3;
        return;
      }
    }
  } else if (tutPracticePhase === 3) {
    if (_tutServeBox && isHover(_tutServeBox)) {
      playSound("correct");
      tutPracticePhase = 4;
      tutStep = 5;
    }
  }
}

// =========================
// STEP 5: DONE
// =========================
function _drawTutDone() {
  background(200, 240, 215);

  const cardW = min(width - 80, 780);
  const cx = width / 2;
  const bodyW = cardW - 80;
  const doneTextYOffset = -20; // more negative = move all final-screen text up
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  rect(cx, height / 2 - 20, cardW, height - 130, 18);

  if (titleFont) textFont(titleFont);
  fill(50, 150, 80);
  textAlign(CENTER, CENTER);
  textSize(22);
  text("GREAT WORK!", cx, height / 2 - 180 + doneTextYOffset);
  if (bodyFont) textFont(bodyFont);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, TOP);
  textSize(15);
  textLeading(26);
  text(
    "You know how to play. Here is what to remember:",
    cx,
    height / 2 - 142 + doneTextYOffset,
    bodyW,
  );

  const tips = [
    {
      icon: "->",
      text: "The order bubble always shows the customer's TRUE colours",
    },
    {
      icon: "->",
      text: "Your ingredient bins are filtered through CVD - things will look different",
    },
    {
      icon: "->",
      text: "Use shape symbols (circle/diamond/triangle) to identify categories",
    },
    {
      icon: "->",
      text: "Use brightness and labels when colours are hard to tell apart",
    },
    {
      icon: "->",
      text: "Good luck!",
    },
  ];

  for (let i = 0; i < tips.length; i++) {
    const ty = height / 2 - 68 + i * 56 + doneTextYOffset;
    const isFinalTip = i === tips.length - 1;
    noStroke();
    if (isFinalTip) fill(255, 236, 180, 230);
    else fill(240, 255, 240);
    rectMode(CENTER);
    rect(cx, ty, cardW - 60, 46, isFinalTip ? 14 : 10);

    if (isFinalTip) {
      fill(130, 85, 20);
      textStyle(BOLD);
      textSize(17);
    } else {
      fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
      textStyle(NORMAL);
      textSize(12);
    }
    textAlign(CENTER, CENTER);
    text(tips[i].text, cx, ty);
  }
  textStyle(NORMAL);

  _TUT_NEXT.x = cx;
  _TUT_NEXT.y = height - 170;
  const h = isHover(_TUT_NEXT);
  noStroke();
  fill(h ? 250 : 255, h ? 190 : 205, h ? 85 : 120);
  rectMode(CENTER);
  rect(_TUT_NEXT.x, _TUT_NEXT.y, 260, 56, 14);
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(15);
  text("BEGIN SHIFT  ->", _TUT_NEXT.x, _TUT_NEXT.y);
  cursor(h ? HAND : ARROW);
}

// =========================
// INTERNAL: Lightweight DEUTAN for display
// =========================
function _tutSimDeutan(rgb) {
  let r = rgb[0],
    g = rgb[1],
    b = rgb[2];
  const rg = (r + g) / 2;
  r = lerp(r, rg, 0.82);
  g = lerp(g, rg, 0.92);
  return [constrain(r, 0, 255), constrain(g, 0, 255), b];
}
