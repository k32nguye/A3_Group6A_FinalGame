// =====================
// INGREDIENT DATA
// colorName = what the colour actually is (shown as accessibility label in Act 2)
// =====================
const TEA_BASES = [
  { id: "black", label: "Black Tea", colorName: "dark brown", c: [95, 60, 35] },
  {
    id: "milk",
    label: "Milk Tea",
    colorName: "tan / beige",
    c: [190, 150, 105],
  },
  {
    id: "green",
    label: "Green Tea",
    colorName: "olive green",
    c: [80, 155, 90],
  },
];

const SYRUPS = [
  {
    id: "straw",
    label: "Strawberry",
    colorName: "red-pink",
    c: [225, 80, 105],
  },
  {
    id: "melon",
    label: "Honeydew",
    colorName: "bright green",
    c: [105, 210, 120],
  },
  {
    id: "mango",
    label: "Mango",
    colorName: "golden yellow",
    c: [245, 175, 60],
  },
  { id: "taro", label: "Taro", colorName: "purple", c: [185, 105, 210] },
];

const TOPPINGS = [
  { id: "boba", label: "Boba", colorName: "dark brown", c: [55, 35, 25] },
  {
    id: "jelly",
    label: "Lychee Jelly",
    colorName: "pink-purple",
    c: [205, 120, 215],
  },
  { id: "pud", label: "Pudding", colorName: "pale yellow", c: [245, 215, 120] },
];

// Serve button layout
const serveBtn = { x: 0, y: 0, w: 200, h: 58 };

// =====================
// CVD SIMULATION
// =====================
function applyCVD(rgb) {
  let r = rgb[0],
    g = rgb[1],
    b = rgb[2];
  if (visionMode !== "CVD") return [r, g, b];

  if (cvdType === "DEUTAN") {
    // Greens & reds converge — most common (~5% of males)
    const rg = (r + g) / 2;
    r = lerp(r, rg, 0.82);
    g = lerp(g, rg, 0.92);
  } else if (cvdType === "PROTAN") {
    // Reds are dim and brownish — (~1% of males)
    const rg = (r + g) / 2;
    r = lerp(r, rg, 0.8) * 0.58;
    g = lerp(g, rg, 0.4);
  } else if (cvdType === "TRITAN") {
    // Blues and greens converge; yellows shift orange (~0.01%)
    const bg = (b + g) / 2;
    b = lerp(b, bg, 0.88);
    g = lerp(g, bg, 0.52);
    const yr = (r + g) / 2;
    r = lerp(r, yr, 0.22);
  }

  return [constrain(r, 0, 255), constrain(g, 0, 255), constrain(b, 0, 255)];
}

function getShownColor(rgb) {
  if (visionMode === "NORMAL") return [rgb[0], rgb[1], rgb[2]];
  return applyCVD(rgb);
}

// =====================
// MAIN GAME DRAW
// =====================
function drawGame() {
  imageMode(CORNER);
  image(orderBg, 0, 0, width, height);

  drawGameHUD();

  // Act 1 & 2: order stays visible the whole round (no memorisation needed — focus on colour ID)
  // Act 3: order shows briefly then hides (memory mechanic returns)
  if (act <= 2) {
    phase = "MIX";
  }

  if (phase === "PREVIEW") {
    drawOrderArea(true); // always show order during preview
    drawPreviewBanner();
    if (millis() > orderPreviewUntil) phase = "MIX";
  } else {
    // Acts 1 & 2: order stays visible (colour ID challenge)
    // Act 3 MIX phase: order is hidden (memory challenge)
    drawOrderArea(act !== 3);
    drawWorkArea();
  }

  // Timer auto-serve
  if (phase === "MIX") {
    const tLeft = max(0, mixEndsAt - millis());
    if (tLeft <= 0 && phase === "MIX") serveDrink();
    // Tick sound when < 3 s
    if (tLeft < 3000 && tLeft > 0 && frameCount % 60 === 0) playSound("tick");
  }
}

// ── HUD ──────────────────────────────────────────────────
function drawGameHUD() {
  // Background strip
  noStroke();
  fill(255, 255, 255, 225);
  rectMode(CORNER);
  rect(0, 0, width, 68);

  const tLeft = phase === "MIX" ? max(0, mixEndsAt - millis()) : 0;
  const secs = (tLeft / 1000).toFixed(1);

  // Act / Round
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, CENTER);
  textSize(13);
  text("ACT " + act + " · Round " + actRound + "/5", 20, 24);

  // Score
  textAlign(LEFT, CENTER);
  textSize(13);
  text("Score: " + score, 20, 48);

  // Timer (centre)
  const timerColour = tLeft < 3000 ? [220, 60, 60] : [40, 50, 70];
  fill(timerColour[0], timerColour[1], timerColour[2]);
  textAlign(CENTER, CENTER);
  textSize(22);
  if (phase === "MIX") text(secs + "s", width / 2, 34);

  // CVD indicator (right)
  const cvdLabel =
    visionMode === "NORMAL"
      ? "Normal Vision"
      : cvdType === "DEUTAN"
        ? "Deuteranopia (red-green)"
        : cvdType === "PROTAN"
          ? "Protanopia (red-dim)"
          : "Tritanopia (blue-green)";

  const dotCol = visionMode === "NORMAL" ? [80, 160, 80] : [200, 80, 80];
  noStroke();
  fill(dotCol[0], dotCol[1], dotCol[2]);
  ellipse(width - 220, 34, 14, 14);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, CENTER);
  textSize(12);
  text(cvdLabel, width - 208, 34);

  // Act 2: label status indicator
  if (act === 2) {
    const lblCol = showLabels ? [60, 160, 90] : [200, 80, 80];
    fill(lblCol[0], lblCol[1], lblCol[2]);
    textSize(12);
    textAlign(RIGHT, CENTER);
    text(
      showLabels ? "Accessibility Labels: ON" : "Accessibility Labels: OFF",
      width - 16,
      52,
    );
  }
}

// ── Preview banner (Act 3 only) ───────────────────────────
function drawPreviewBanner() {
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  rect(width / 2, height / 2, 500, 80, 18);

  fill(180, 60, 60);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("MEMORISE THE ORDER!", width / 2, height / 2 - 10);

  const tLeft = max(0, orderPreviewUntil - millis());
  fill(100, 100, 130);
  textSize(13);
  text(
    "Disappears in " + (tLeft / 1000).toFixed(1) + "s",
    width / 2,
    height / 2 + 16,
  );
}

// ── Order area (customer + order bubble) ──────────────────
// showOrder: whether to render the order bubble at all (false = hide in Act 3 MIX phase)
function drawOrderArea(showOrder) {
  // Panel
  noStroke();
  fill(MOCHI.sky[0], MOCHI.sky[1], MOCHI.sky[2], 115);
  rectMode(CORNER);
  rect(20, 74, width - 40, 160, 16);

  // "Customer wants:" label
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  text("CUSTOMER WANTS:", 36, 80);
  textStyle(NORMAL);

  // Order bubble — always TRUE colours (what the customer expects)
  if (showOrder && order) {
    drawOrderBubble(40, 96);
  } else if (!showOrder) {
    fill(180, 180, 200, 160);
    textAlign(CENTER, CENTER);
    textSize(14);
    text("Order hidden - rely on your memory!", width / 2, 160);
  }

  // Customer monsters
  const xs = [150, 255, 360, 465];
  for (let i = 0; i < 4; i++) {
    const mood = i === monsterSwap ? "active" : "waiting";
    drawMochiMonster(xs[i], 220, 55, (i + monsterSwap) % 4, mood);
  }
}

function drawOrderBubble(x, y) {
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CORNER);
  rect(x, y, 530, 76, 28);
  // Tail
  triangle(x + 20, y + 76, x + 58, y + 76, x + 40, y + 112);

  const slots = [
    { label: "Base", item: order.base, px: x + 18 },
    { label: "Syrup", item: order.syrup, px: x + 192 },
    { label: "Topping", item: order.topping, px: x + 366 },
  ];

  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    // TRUE colour - no CVD filter here; this is what the customer wants
    const c = s.item.c;
    noStroke();
    fill(c[0], c[1], c[2]);
    rectMode(CORNER);
    rect(s.px, y + 12, 40, 40, 8);

    // Shape symbol (white outline) so players can use shape not just colour
    noFill();
    stroke(255, 255, 255, 210);
    strokeWeight(2);
    const sc = s.px + 20;
    const sr = y + 32;
    if (i === 0) ellipse(sc, sr, 20, 20);
    else if (i === 1) {
      push();
      translate(sc, sr);
      rotate(PI / 4);
      rectMode(CENTER);
      rect(0, 0, 16, 16);
      pop();
    } else triangle(sc, y + 16, sc - 11, y + 48, sc + 11, y + 48);
    noStroke();

    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(13);
    text(s.label, s.px + 48, y + 24);
    textStyle(NORMAL);
    fill(100, 100, 130);
    textSize(11);
    text(s.item.label, s.px + 48, y + 42);
  }
}

// ── Work area: bins + cup + serve button ──────────────────
function drawWorkArea() {
  // Counter surface
  noStroke();
  fill(MOCHI.counterTop[0], MOCHI.counterTop[1], MOCHI.counterTop[2], 145);
  rectMode(CORNER);
  rect(20, 270, width - 40, 95, 14);

  // "What you see:" label
  fill(visionMode === "CVD" ? [180, 60, 60] : [40, 50, 70]);
  textAlign(LEFT, TOP);
  textSize(11);
  text(
    visionMode === "CVD"
      ? "WHAT YOU SEE (through " + cvdType + " CVD):"
      : "WHAT YOU SEE (normal vision):",
    36,
    276,
  );

  // Ingredient bins
  drawIngredientBins();

  // Cup preview
  drawCupMochi();

  // Serve button
  serveBtn.x = width - 130;
  serveBtn.y = height - 80;
  drawServeButton();
}

// ── Ingredient bins ───────────────────────────────────────
function drawIngredientBins() {
  const binGap = 210;
  const startX = 40;
  const y = 390;

  drawBinColumn("TEA BASE", TEA_BASES, startX, y, "base");
  drawBinColumn("SYRUP", SYRUPS, startX + binGap, y, "syrup");
  drawBinColumn("TOPPING", TOPPINGS, startX + binGap * 2, y, "topping");
}

function drawBinColumn(title, list, x, y, slotKey) {
  const colW = 190;

  // Column background
  noStroke();
  fill(255, 255, 255, 210);
  rectMode(CORNER);
  rect(x, y - 30, colW, 36 + list.length * 52, 14);

  // Column title
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(11);
  text(title, x + colW / 2, y - 12);

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const cardY = y + i * 52;
    const card = { x: x + colW / 2, y: cardY + 22, w: colW, h: 46 };
    const hover = isHover(card);
    const chosen = selection[slotKey] && selection[slotKey].id === item.id;

    item._card = card;

    // Card background
    noStroke();
    if (chosen) fill(150, 210, 255, 230);
    else if (hover) fill(235, 245, 255, 230);
    else fill(255, 255, 255, 190);
    rectMode(CORNER);
    rect(x, cardY, colW, 46, 10);

    // Chosen checkmark border
    if (chosen) {
      stroke(80, 160, 230);
      strokeWeight(2);
      noFill();
      rect(x, cardY, colW, 46, 10);
      noStroke();
    }

    // CVD-filtered colour swatch
    const shown = getShownColor(item.c);
    noStroke();
    fill(shown[0], shown[1], shown[2]);
    rectMode(CORNER);
    rect(x + 8, cardY + 8, 28, 28, 6);

    // Ingredient name
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(item.label, x + 44, cardY + 18);

    // Act 2 accessibility label: actual colour name shown under swatch
    if (showLabels) {
      fill(60, 130, 200);
      textSize(9.5);
      text("≈ " + item.colorName, x + 44, cardY + 33);
    }

    // Chosen checkmark icon
    if (chosen) {
      fill(80, 160, 230);
      textAlign(RIGHT, CENTER);
      textSize(16);
      text("✓", x + colW - 8, cardY + 22);
    }

    cursor(hover ? HAND : ARROW);
  }
}

// ── Drink cup preview ─────────────────────────────────────
function drawCupMochi() {
  const cx = width - 300;
  const cy = 355;

  const baseC = selection.base
    ? getShownColor(selection.base.c)
    : [230, 230, 230];
  const syrupC = selection.syrup
    ? getShownColor(selection.syrup.c)
    : [240, 240, 240];
  const topC = selection.topping
    ? getShownColor(selection.topping.c)
    : [220, 220, 220];

  // Cup outline
  stroke(MOCHI.outline[0], MOCHI.outline[1], MOCHI.outline[2]);
  strokeWeight(3);
  fill(255, 255, 255, 200);
  rectMode(CENTER);
  rect(cx, cy, 110, 150, 18);
  noStroke();

  // Liquid layers
  fill(baseC[0], baseC[1], baseC[2], 200);
  rectMode(CENTER);
  rect(cx, cy + 42, 96, 50, 12);

  fill(syrupC[0], syrupC[1], syrupC[2], 190);
  rect(cx, cy - 4, 96, 40, 12);

  fill(topC[0], topC[1], topC[2], 180);
  rect(cx, cy - 44, 96, 36, 12);

  // Boba pearls
  if (selection.topping && selection.topping.id === "boba") {
    fill(30, 30, 30, 140);
    noStroke();
    for (let i = 0; i < 5; i++) {
      ellipse(cx - 35 + i * 18, cy + 55 + (i % 2) * 7, 12, 12);
    }
  }

  // Cup label
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, TOP);
  textSize(10);
  text("your drink", cx, cy + 84);
}

// ── Serve button ──────────────────────────────────────────
function drawServeButton() {
  const ready = selection.base && selection.syrup && selection.topping;
  const hover = isHover(serveBtn);

  rectMode(CENTER);
  noStroke();
  if (!ready) fill(190, 190, 200);
  else if (hover) fill(250, 190, 85);
  else fill(255, 205, 120);

  rect(serveBtn.x, serveBtn.y, serveBtn.w, serveBtn.h, 16);

  fill(
    ready ? MOCHI.inkDark[0] : 120,
    ready ? MOCHI.inkDark[1] : 120,
    ready ? MOCHI.inkDark[2] : 130,
  );
  textAlign(CENTER, CENTER);
  textSize(18);
  text("SERVE ✓", serveBtn.x, serveBtn.y);

  if (ready) cursor(hover ? HAND : ARROW);
}

// ── Monster drawing ───────────────────────────────────────
function drawMochiMonster(x, y, size, idx, mood) {
  const happyList = [pinkMonster, blueMonster, greenMonster, orangeMonster];
  const neutralList = [
    pinkMonsterNeutral,
    blueMonsterNeutral,
    greenMonsterNeutral,
    orangeMonsterNeutral,
  ];
  const img = (mood === "active" ? neutralList : happyList)[idx];
  if (!img) return;
  imageMode(CENTER);
  image(img, x, y, size * 2, size * 2);
  imageMode(CORNER);
}

// =====================
// INPUT HANDLERS
// =====================
function gameMousePressed() {
  if (phase !== "MIX") return;

  checkPick("base", TEA_BASES);
  checkPick("syrup", SYRUPS);
  checkPick("topping", TOPPINGS);

  const ready = selection.base && selection.syrup && selection.topping;
  if (ready && isHover(serveBtn)) {
    playSound("click");
    serveDrink();
  }
}

function gameKeyPressed() {
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
  if (key === "r" || key === "R") currentScreen = "start";
}

function checkPick(slotKey, list) {
  for (const item of list) {
    if (item._card && isHover(item._card)) {
      if (!selection[slotKey] || selection[slotKey].id !== item.id) {
        playSound("click");
        selection[slotKey] = item;
      }
      return;
    }
  }
}

// =====================
// ROUND LOGIC
// =====================
function startRound() {
  order = {
    base: random(TEA_BASES),
    syrup: random(SYRUPS),
    topping: random(TOPPINGS),
  };

  monsterSwap = floor(random(4));

  selection.base = null;
  selection.syrup = null;
  selection.topping = null;

  if (act === 3) {
    // Memory mechanic: 2 sec preview then hide
    const previewMs = 2200;
    const timeLimit = max(7000, 12000 - (actRound - 1) * 900);
    orderPreviewUntil = millis() + previewMs;
    mixEndsAt = orderPreviewUntil + timeLimit;
    phase = "PREVIEW";
  } else {
    // Acts 1 & 2: order always visible; time limit decreases each actRound
    const timeLimit = max(8000, 14000 - (actRound - 1) * 1000);
    orderPreviewUntil = millis();
    mixEndsAt = millis() + timeLimit;
    phase = "MIX";
  }
}

function serveDrink() {
  // Guard: don't double-fire
  if (currentScreen !== "game") return;

  totalServed++;

  const ok =
    selection.base &&
    selection.base.id === order.base.id &&
    selection.syrup &&
    selection.syrup.id === order.syrup.id &&
    selection.topping &&
    selection.topping.id === order.topping.id;

  if (ok) {
    totalCorrect++;
    score += 100;
    triggerFlash([50, 200, 100]);
    spawnScoreAnim(100, width / 2, height / 2);
    playSound("correct");

    endingText = _correctMessage();
    currentScreen = "win";
  } else {
    score = max(0, score - 30);
    triggerFlash([220, 80, 80]);
    spawnScoreAnim(-30, width / 2, height / 2);
    playSound("wrong");

    endingText = _wrongMessage();
    currentScreen = "lose";
  }
}

function _correctMessage() {
  const msgs = [
    "Perfect order! The customer tips you.",
    "Nailed it! +100 points.",
    "Exactly right! Great work.",
    "Spot on! Customer is thrilled.",
    "100% match! Keep it up.",
  ];
  return random(msgs);
}

function _wrongMessage() {
  if (!selection.base || !selection.syrup || !selection.topping) {
    return "Time's up! You didn't serve in time.";
  }
  // Show what was wrong
  const parts = [];
  if (selection.base.id !== order.base.id)
    parts.push("Base should be " + order.base.label);
  if (selection.syrup.id !== order.syrup.id)
    parts.push("Syrup should be " + order.syrup.label);
  if (selection.topping.id !== order.topping.id)
    parts.push("Topping should be " + order.topping.label);
  return "Wrong order!\n" + parts.join(" · ");
}
