// =====================
// INSTRUCTIONS / CVD EXPLAINER SCREEN
// Visual side-by-side comparison of Normal vs CVD vision
// =====================

const instrBackBtn = { x: 0, y: 0, w: 220, h: 54, label: "BACK" };

// Colour pairs used in the visual comparison demo
const DEMO_COLOURS = [
  { name: "Red", rgb: [220, 60, 60] },
  { name: "Green", rgb: [60, 180, 80] },
  { name: "Blue", rgb: [70, 120, 220] },
  { name: "Yellow", rgb: [240, 200, 50] },
  { name: "Purple", rgb: [170, 80, 210] },
  { name: "Orange", rgb: [240, 140, 50] },
];

function drawInstr() {
  background(233, 246, 255);

  // Title panel
  noStroke();
  fill(255, 255, 255, 220);
  rectMode(CORNER);
  rect(0, 0, width, 80);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, CENTER);
  textSize(22);
  if (titleFont) textFont(titleFont);
  text("COLOUR VISION DEFICIENCY", 40, 40);
  if (bodyFont) textFont(bodyFont);

  // Back button
  instrBackBtn.x = width - 140;
  instrBackBtn.y = 40;
  _drawSmallBtn(instrBackBtn);
  cursor(isHover(instrBackBtn) ? HAND : ARROW);

  // ── Section 1: What is CVD? ─────────────────────────────
  const col1 = 40;
  const col2 = width / 2 + 20;
  let y = 105;

  // Description box
  noStroke();
  fill(255, 255, 255, 210);
  rectMode(CORNER);
  rect(col1, y, width - 80, 100, 14);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, TOP);
  textSize(13);
  textLeading(22);
  text(
    "Colour Vision Deficiency (CVD) affects how people perceive colour. It is not the same as\n" +
      "being colour blind — most people with CVD can see colour, but struggle to distinguish\n" +
      "certain hues. About 8% of males and 0.5% of females are born with some form of CVD.",
    col1 + 16,
    y + 14,
    width - 112,
    90,
  );

  // ── Section 2: Side-by-side colour comparison ───────────
  y = 225;

  // Panel backgrounds
  noStroke();
  fill(255, 255, 255, 210);
  rectMode(CORNER);
  rect(col1, y, width / 2 - 60, 330, 14);
  rect(col2, y, width / 2 - 60, 330, 14);

  // Section headers
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, TOP);
  textSize(15);
  text("Normal Vision", col1 + (width / 2 - 60) / 2, y + 14);
  text("Through CVD Eyes", col2 + (width / 2 - 60) / 2, y + 14);

  // CVD sub-labels
  textSize(11);
  fill(100, 100, 130);
  text("(what most people see)", col1 + (width / 2 - 60) / 2, y + 36);
  text("Deuteranopia (red-green)", col2 + (width / 2 - 60) / 2, y + 36);

  // Colour swatches
  const swatchSize = 34;
  const swatchGap = 50;
  const startY = y + 70;

  for (let i = 0; i < DEMO_COLOURS.length; i++) {
    const sx = startY + i * swatchGap;
    const c = DEMO_COLOURS[i].rgb;
    const cvd = _simulateDEUTAN(c);

    // Normal swatch (left panel)
    const lx = col1 + 30 + (width / 2 - 60) / 2 - swatchSize / 2;
    noStroke();
    fill(c[0], c[1], c[2]);
    rectMode(CORNER);
    rect(lx, sx, swatchSize, swatchSize, 6);
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(DEMO_COLOURS[i].name, lx + swatchSize + 10, sx + swatchSize / 2);

    // CVD swatch (right panel)
    const rx = col2 + 30 + (width / 2 - 60) / 2 - swatchSize / 2;
    noStroke();
    fill(cvd[0], cvd[1], cvd[2]);
    rect(rx, sx, swatchSize, swatchSize, 6);
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, CENTER);
    textSize(12);
    text("looks similar", rx + swatchSize + 10, sx + swatchSize / 2);
  }

  // ── Section 3: The three types ──────────────────────────
  y = 580;
  noStroke();
  fill(255, 255, 255, 210);
  rectMode(CORNER);
  rect(col1, y, width - 80, 105, 14);

  const types = [
    {
      name: "Deuteranopia",
      desc: "Red & green look similar",
      pct: "~5% of males",
      col: [100, 160, 80],
    },
    {
      name: "Protanopia",
      desc: "Reds appear dark, dull",
      pct: "~1% of males",
      col: [160, 100, 80],
    },
    {
      name: "Tritanopia",
      desc: "Blue & green become confused",
      pct: "~0.01% of people",
      col: [80, 120, 200],
    },
  ];

  for (let i = 0; i < types.length; i++) {
    const tx = col1 + 20 + i * ((width - 80) / 3);
    fill(types[i].col[0], types[i].col[1], types[i].col[2], 60);
    rect(tx, y + 10, (width - 80) / 3 - 14, 85, 10);

    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(LEFT, TOP);
    textSize(12);
    text(types[i].name, tx + 10, y + 18);
    textSize(11);
    fill(70, 75, 90);
    text(types[i].desc, tx + 10, y + 36);
    text(types[i].pct, tx + 10, y + 54);
  }

  // ── How to Play summary ─────────────────────────────────
  y = 704;
  noStroke();
  fill(255, 205, 120, 200);
  rectMode(CORNER);
  rect(col1, y, width - 80, 58, 14);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, CENTER);
  textSize(12);
  textLeading(20);
  text(
    "HOW TO PLAY:  The customer order shows TRUE colours.  Your ingredient bins show what a CVD person sees.\n" +
      "Match the order to the right ingredients — and experience what 300 million people navigate every day.",
    col1 + 16,
    y + 28,
    width - 112,
  );
}

function instrMousePressed() {
  if (isHover(instrBackBtn)) {
    playSound("click");
    currentScreen = "start";
  }
}

function instrKeyPressed() {
  if (keyCode === ESCAPE || keyCode === ENTER) currentScreen = "start";
}

// ── Internal helpers ──────────────────────────────────────

function _drawSmallBtn(btn) {
  rectMode(CENTER);
  const hov = isHover(btn);
  noStroke();
  fill(hov ? 250 : 255, hov ? 190 : 205, hov ? 85 : 120);
  rect(btn.x, btn.y, btn.w, btn.h, 14);
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(13);
  text(btn.label, btn.x, btn.y);
}

// Lightweight DEUTAN simulation for display (not the full CVD pipeline)
function _simulateDEUTAN(rgb) {
  let r = rgb[0],
    g = rgb[1],
    b = rgb[2];
  const rg = (r + g) / 2;
  r = lerp(r, rg, 0.82);
  g = lerp(g, rg, 0.92);
  return [constrain(r, 0, 255), constrain(g, 0, 255), b];
}
