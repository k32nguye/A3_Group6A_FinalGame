// ----------------------
// INGREDIENT DATA
// ----------------------
const TEA_BASES = [
  { id: "black", label: "Black Tea", c: [95, 60, 35] },
  { id: "milk", label: "Milk Tea", c: [190, 150, 105] },
  { id: "green", label: "Green Tea", c: [80, 155, 90] },
];

const SYRUPS = [
  { id: "straw", label: "Strawberry", c: [225, 80, 105] },
  { id: "melon", label: "Honeydew", c: [105, 210, 120] },
  { id: "mango", label: "Mango", c: [245, 175, 60] },
  { id: "taro", label: "Taro", c: [185, 105, 210] },
];

const TOPPINGS = [
  { id: "boba", label: "Boba", c: [55, 35, 25] },
  { id: "jelly", label: "Lychee Jelly", c: [205, 120, 215] },
  { id: "pud", label: "Pudding", c: [245, 215, 120] },
];

let cvdType = "DEUTAN";
const serveBtn = { x: 1500, y: 400, w: 260, h: 86 };

// ----------------------
// MOCHI STYLE COLOURS
// ----------------------
const MOCHI = {
  sky: [233, 246, 255],
  hills: [255, 210, 225],
  counterTop: [200, 245, 235],
  counterFront: [170, 230, 220],
  outline: [40, 50, 70],
  inkDark: [30, 35, 45],
  accent: [255, 205, 120],
};

// ----------------------
// DIFFICULTY FUNCTION
// ----------------------

function getMonochromeFactor() {
  // increases every round
  let factor = (round - 1) * 0.12;

  // stronger effect in CVD mode
  if (visionMode === "CVD") {
    factor += 0.2;
  }

  // cap so it never becomes fully invisible
  return constrain(factor, 0, 0.9);
}

// ----------------------
// SCREEN DRAW
// ----------------------
function drawGame() {
  background("lavender");

  // HUD
  drawMochiHUD();

  if (phase === "PREVIEW") {
    drawPreviewPhaseMochi();
    if (millis() > orderPreviewUntil) phase = "MIX";
  } else {
    drawMixPhaseMochi();
  }
}

function drawPreviewPhaseMochi() {
  // Customer row + bubble (shows order clearly)
  drawCustomerRow(false);

  // Center hint
  fill(255, 255, 255, 235);
  noStroke();
  rectMode(CENTER);
  rect(width / 2, 545, 620, 200, 22);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("MEMORIZE THE ORDER!", width / 2, 530);

  const tLeft = max(0, orderPreviewUntil - millis());
  fill("red");
  textSize(20);
  text(
    "Order disappears in " + (tLeft / 1000).toFixed(1) + "s",
    width / 2,
    570,
  );
}

function drawMixPhaseMochi() {
  // Customer row (bubble still exists but now follows vision mode feel)
  drawCustomerRow(false);

  // Counter
  drawCounter();

  // Ingredient bins (bottom)
  drawIngredientBins();

  // Serve button
  drawServeButtonMochi();

  // Auto-serve when timer ends
  const tLeft = max(0, mixEndsAt - millis());
  if (tLeft <= 0) serveDrink();
}

function drawMochiHUD() {
  const tLeft = max(0, mixEndsAt - millis());
  const secs = (tLeft / 1000).toFixed(1);

  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  rect(width / 2, 70, 950, 44, 22);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(9.8);
  text(
    "Round " +
      round +
      "  •  Score " +
      score +
      "  •  Time " +
      secs +
      "s" +
      "  •  Vision " +
      visionMode +
      " (" +
      cvdType +
      ") (V) •  C = Switch •  R = Restart",
    width / 2,
    70,
  );
}

function drawCustomerRow(showTrueOrder) {
  // row panel
  noStroke();
  fill(233, 246, 255);
  rectMode(CORNER);
  rect(30, 105, width - 60, 200, 22);

  // customers
  const xs = [190, 330, 470, 610];
  for (let i = 0; i < 4; i++) {
    const mood = i === monsterSwap ? "active" : "waiting";
    drawMochiMonster(xs[i], 240, 70, (i + monsterSwap) % 4, mood);
  }

  // order bubble
  if (phase === "PREVIEW") {
    drawOrderBubble(70, 125, order, showTrueOrder);
  }
}

function drawMochiMonster(x, y, size, idx, mood) {
  const happyMonster = [pinkMonster, blueMonster, greenMonster, orangeMonster];
  const neutralMonster = [
    pinkMonsterNeutral,
    blueMonsterNeutral,
    greenMonsterNeutral,
    orangeMonsterNeutral,
  ];

  const monsterMood = mood === "active" ? neutralMonster : happyMonster;
  const img = monsterMood[idx];
  if (!img) return;

  imageMode(CENTER);
  image(img, x, y, 150, 150);
  imageMode(CORNER);
  noStroke();
}

function drawOrderBubble(x, y, ord, showTrueOrder) {
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CORNER);
  rect(x, y, 550, 60, 30);

  // bubble tail
  triangle(x + 30, y + 60, x + 70, y + 60, x + 96, y + 120);

  const slots = [
    { label: "Base", item: ord.base, px: x + 18 },
    { label: "Syrup", item: ord.syrup, px: x + 138 },
    { label: "Top", item: ord.topping, px: x + 258 },
  ];
  if (round >= 3) {
    slots.push({ label: "Straw", item: ord.straw, px: x + 378 });
  }

  for (let i = 0; i < slots.length; i++) {
    let col = slots[i].item.c;

    // When previewing, show true colours. During mixing, show what player sees.
    if (showTrueOrder) col = getShownColor(col);

    drawIngredientIcon(slots[i].px, y, col, slots[i].label);
  }
}

function drawIngredientIcon(x, y, col, label) {
  fill(col[0], col[1], col[2]);
  ellipse(x + 26, y + 30, 30, 30);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, CENTER);
  textSize(12);
  text(label, x + 46, y + 30);
}

function drawCounter() {
  // counter top
  noStroke();
  fill(MOCHI.counterTop[0], MOCHI.counterTop[1], MOCHI.counterTop[2]);
  rectMode(CORNER);
  rect(30, 320, width - 60, 160, 22);

  // counter front
  fill(MOCHI.counterFront[0], MOCHI.counterFront[1], MOCHI.counterFront[2]);
  rect(30, 410, width - 60, 280, 22);

  // cup in the middle
  drawCupMochi(width / 2, 390);
}

function drawCupMochi(cx, cy) {
  const baseC = selection.base ? selection.base.c : [230, 230, 230];
  const syrupC = selection.syrup ? selection.syrup.c : [240, 240, 240];
  const topC = selection.topping ? selection.topping.c : [220, 220, 220];
  const strawC = selection.straw ? selection.straw.c : [200, 200, 200];

  // straw
  stroke(strawC[0], strawC[1], strawC[2]);
  strokeWeight(10);
  strokeCap(SQUARE);
  line(width / 2, cy - 120, width / 2, cy + 68);
  noStroke();

  stroke(MOCHI.outline[0], MOCHI.outline[1], MOCHI.outline[2]);
  strokeWeight(4);
  fill(255, 255, 255, 220);
  rectMode(CENTER);
  rect(cx, cy, 130, 170, 22);

  noStroke();
  fill(baseC[0], baseC[1], baseC[2], 200);
  rect(cx, cy + 48, 112, 60, 16);

  fill(syrupC[0], syrupC[1], syrupC[2], 190);
  rect(cx, cy - 5, 112, 47, 16);

  fill(topC[0], topC[1], topC[2], 180);
  rect(cx, cy - 48, 112, 40, 16);

  // pearls
  if (selection.topping && selection.topping.id === "boba") {
    fill(30, 30, 30, 120);
    for (let i = 0; i < 6; i++) {
      ellipse(cx - 45 + i * 18, cy + 62 + (i % 2) * 6, 12, 12);
    }
  }
}

function drawIngredientBins() {
  const y = 560;
  drawBinColumn("TEA", TEA_BASES, 130, y, "base");
  drawBinColumn("SYRUP", SYRUPS, 330, y, "syrup");
  drawBinColumn("TOPPING", TOPPINGS, 530, y, "topping");
  if (round >= 3) {
    drawBinColumn("STRAW", STRAWS, 730, y, "straw");
  }
}

function drawBinColumn(title, list, x, y, slotKey) {
  fill(255, 255, 255, 220);
  rectMode(CORNER);
  rect(x - 20, y - 50, 190, 230, 18);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, TOP);
  textSize(14);
  text(title, x + 75, y - 34);

  for (let i = 0; i < list.length; i++) {
    const card = { x: x + 75, y: y + i * 49, w: 190, h: 44 };
    const hover = isHover(card);
    const chosen = selection[slotKey] && selection[slotKey].id === list[i].id;

    list[i]._card = card;

    // drink selection
    rectMode(CORNER);
    noStroke();
    if (chosen) fill(180, 220, 255, 230);
    else fill(255, 255, 255, hover ? 235 : 195);
    rect(x - 20, card.y - card.h / 2, card.w, card.h);

    // colours
    const shown = getShownColor(list[i].c);
    fill(shown[0], shown[1], shown[2]);
    ellipse(x, y + i * 49, 22, 22);

    // text
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(list[i].label, x + 20, y + i * 49);
  }
}

function drawServeButtonMochi() {
  const enabled =
    selection.base &&
    selection.syrup &&
    selection.topping &&
    (round < 3 || selection.straw);
  const hover = isHover(serveBtn);

  rectMode(CENTER);
  noStroke();

  if (!enabled) fill("lightgrey");
  else if (hover) fill(250, 190, 85);
  else fill(255, 205, 120);

  rect(serveBtn.x, serveBtn.y, serveBtn.w, serveBtn.h, 22);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(22);
  text("SERVE", serveBtn.x, serveBtn.y);

  cursor(enabled && hover ? HAND : ARROW);
}

// ----------------------
// INPUT HANDLERS
// ----------------------
function gameMousePressed() {
  if (phase !== "MIX") return;

  checkPick("base", TEA_BASES);
  checkPick("syrup", SYRUPS);
  checkPick("topping", TOPPINGS);
  checkPick("straw", STRAWS);

  const enabled =
    selection.base &&
    selection.syrup &&
    selection.topping &&
    (round < 3 || selection.straw);
  if (enabled && isHover(serveBtn)) serveDrink();
}

function gameKeyPressed() {
  if (key === "v" || key === "V") {
    visionMode = visionMode === "NORMAL" ? "CVD" : "NORMAL";
  }

  if (key === "r" || key === "R") {
    currentScreen = "start";
  }

  if (keyCode === ENTER) {
    if (
      phase === "MIX" &&
      selection.base &&
      selection.syrup &&
      selection.topping
    ) {
      serveDrink();
    }
  }

  // switch CVD type
  if (key === "c" || key === "C") {
    if (cvdType === "DEUTAN") cvdType = "PROTAN";
    else if (cvdType === "PROTAN") cvdType = "TRITAN";
    else cvdType = "DEUTAN";
  }
}

function checkPick(slotKey, list) {
  for (let i = 0; i < list.length; i++) {
    const card = list[i]._card;
    if (card && isHover(card)) {
      selection[slotKey] = list[i];
      return;
    }
  }
}

let monsterSwap = 0;

// ----------------------
// ROUND LOGIC
// ----------------------
function startRound() {
  order = {
    base: random(TEA_BASES),
    syrup: random(SYRUPS),
    topping: random(TOPPINGS),
    straw: round >= 3 ? random(STRAWS) : null,
  };

  monsterSwap = floor(random(4));

  selection.base = null;
  selection.syrup = null;
  selection.topping = null;
  selection.straw = null;

  orderPreviewUntil = millis() + 2000;
  phase = "PREVIEW";

  let timeLimit = 10000 - (round - 1) * 400;
  timeLimit = max(1800, timeLimit);

  mixEndsAt = orderPreviewUntil + timeLimit;
}

function serveDrink() {
  const ok =
    selection.base &&
    selection.syrup &&
    selection.topping &&
    selection.straw &&
    selection.base.id === order.base.id &&
    selection.syrup.id === order.syrup.id &&
    selection.topping.id === order.topping.id &&
    (round < 3 || selection.straw.id === order.straw.id);

  if (ok) {
    score += 100;
    endingText = "Perfect boba!\nCustomer tips you $2.";
    currentScreen = "win";
  } else {
    score = max(0, score - 30);
    endingText =
      'MYSTERY BOBA CREATED.\nCustomer: "' +
      random([
        "Why is it... savory?",
        "This tastes like tax season.",
        "Honeydew? More like honey-don't.",
        "My boba is spiritually confused.",
        "It’s giving ‘oops’.",
      ]) +
      '"';
    currentScreen = "lose";
  }
}

// In CVD mode, compress red & green closer → harder to tell some choices apart.
// choose which deficiency you want to simulate

function getMonochromeFactor() {
  // if NORMAL → no fade at all
  if (visionMode === "NORMAL") return 0;

  let factor = (round - 1) * 0.1;

  return constrain(factor, 0, 0.92);
}

function applyCVD(rgb) {
  let r = rgb[0];
  let g = rgb[1];
  let b = rgb[2];

  if (visionMode !== "CVD") {
    return [r, g, b];
  }

  if (cvdType === "DEUTAN") {
    // greens shift toward red
    let rg = (r + g) / 2;
    r = lerp(r, rg, 0.5);
    g = lerp(g, rg, 0.8);
  } else if (cvdType === "PROTAN") {
    // reds shift toward green and look less bright
    let rg = (r + g) / 2;
    r = lerp(r, rg, 0.8);
    g = lerp(g, rg, 0.4);
    r *= 0.6;
  } else if (cvdType === "TRITAN") {
    // blue-green confusion, plus some yellow-red confusion
    let bg = (b + g) / 2;
    b = lerp(b, bg, 0.85);
    g = lerp(g, bg, 0.5);

    let yr = (r + g) / 2;
    r = lerp(r, yr, 0.25);
  }

  return [constrain(r, 0, 255), constrain(g, 0, 255), constrain(b, 0, 255)];
}

function getShownColor(rgb) {
  let r = rgb[0];
  let g = rgb[1];
  let b = rgb[2];

  // IF NORMAL → return original colour immediately
  if (visionMode === "NORMAL") {
    return [r, g, b];
  }

  let cvd = applyCVD(rgb);

  // grayscale fade after CVD shift
  let gray = 0.299 * cvd[0] + 0.587 * cvd[1] + 0.114 * cvd[2];
  let mono = getMonochromeFactor();

  return [
    lerp(cvd[0], gray, mono),
    lerp(cvd[1], gray, mono),
    lerp(cvd[2], gray, mono),
  ];
}

//straw

const STRAWS = [
  { id: "dark", label: "Classic", c: [40, 50, 70] },
  { id: "red", label: "Red", c: [220, 60, 60] },
  { id: "pink", label: "Pink", c: [240, 130, 170] },
  { id: "yellow", label: "Yellow", c: [245, 210, 60] },
  { id: "green", label: "Green", c: [80, 180, 100] },
];
