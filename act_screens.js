// =====================
// ACT INTRO, CVD SHIFT, ACT DEBRIEF, SCENARIO SCREENS
// =====================

// Shared "big button" used across all act screens
const actBtn = { x: 0, y: 0, w: 280, h: 60 };

// ── ACT INTRO ─────────────────────────────────────────────

const ACT_DATA = [
  {
    title: "ACT 1: THE REVELATION",
    subtitle: "Deuteranopia  ·  red-green deficiency",
    colour: [200, 240, 200],
    accent: [80, 160, 80],
    body:
      "Rounds 1-2: Serve orders with normal vision.\n" +
      "You'll learn the ingredient colours at their true hues.\n\n" +
      "Round 3: Something will change.\n\n" +
      "Goal: match the customer's order to the right ingredients.",
    fact:
      "~8% of males and 0.5% of females are born with some form\n" +
      "of colour vision deficiency. Deuteranopia is the most common type.",
    btnLabel: "BEGIN SHIFT",
  },
  {
    title: "ACT 2: LEARNING TO ADAPT",
    subtitle: "Protanopia  ·  red appears dim & dark",
    colour: [255, 230, 200],
    accent: [210, 120, 50],
    body:
      "You now see through protanopic eyes. Reds appear much darker.\n\n" +
      "Rounds 1–3: Accessibility labels will appear under each ingredient\n" +
      "to help you identify colours by name.\n\n" +
      "Rounds 4–5: Labels disappear. Can you still manage?",
    fact:
      "People with CVD develop coping strategies every day:\n" +
      "reading labels, using position cues, and relying on brightness\n" +
      "rather than hue alone.",
    btnLabel: "CONTINUE SHIFT",
  },
  {
    title: "ACT 3: EVERYDAY LIFE",
    subtitle: "Tritanopia  ·  blue and green become confused",
    colour: [215, 215, 250],
    accent: [80, 100, 200],
    body:
      "The rarest form of CVD. Blue and green look very similar.\n\n" +
      "Memory is back: orders disappear after 2 seconds — memorise fast.\n\n" +
      "Watch out for real-world challenge moments between rounds.",
    fact:
      "CVD affects navigation, medication identification, food safety,\n" +
      "and many other daily tasks. Over 300 million people live with it.",
    btnLabel: "FINAL SHIFT",
  },
];

function drawActIntro() {
  const d = ACT_DATA[act - 1];
  const bg = d.colour;
  const acc = d.accent;
  const introTextYOffset = act === 1 ? 40 : 0;
  const introBodyGap = act === 1 ? 30 : 0;

  background(bg[0], bg[1], bg[2]);

  // Card
  noStroke();
  fill(255, 255, 255, 230);
  rectMode(CENTER);
  rect(width / 2, height / 2 - 20, 680, 510, 22);

  // Title
  if (titleFont) textFont(titleFont);
  fill(acc[0], acc[1], acc[2]);
  textAlign(CENTER, TOP);
  textSize(18);
  text(d.title, width / 2, height / 2 - 238 + introTextYOffset);
  if (bodyFont) textFont(bodyFont);

  // Subtitle
  fill(100, 105, 120);
  textSize(13);
  text(d.subtitle, width / 2, height / 2 - 206 + introTextYOffset);

  // Body
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textSize(14);
  textLeading(24);
  textAlign(CENTER, TOP);
  text(
    d.body,
    width / 2,
    height / 2 - 178 + introTextYOffset + introBodyGap,
    620,
  );

  // Fact box
  noStroke();
  fill(acc[0], acc[1], acc[2], 30);
  rectMode(CENTER);
  rect(
    width / 2,
    height / 2 + 88 + introTextYOffset + introBodyGap,
    620,
    76,
    12,
  );
  fill(acc[0], acc[1], acc[2]);
  textSize(11);
  textLeading(19);
  textAlign(CENTER, CENTER);
  text(
    "DID YOU KNOW?\n" + d.fact,
    width / 2,
    height / 2 + 88 + introTextYOffset + introBodyGap,
    590,
  );

  // Button
  actBtn.x = width / 2;
  actBtn.y = height / 2 + 208 + introTextYOffset + introBodyGap;
  _drawActBtn(actBtn, d.btnLabel, acc);

  cursor(isHover(actBtn) ? HAND : ARROW);
}

function actIntroMousePressed() {
  if (isHover(actBtn) || keyCode === ENTER || keyCode === 32) {
    playSound("click");
    startRound();
    currentScreen = "game";
  }
}

// ── CVD SHIFT (Act 1, before round 3) ─────────────────────

function drawCVDShift() {
  background(30, 30, 40);

  // Dramatic title
  fill(220, 80, 80);
  textAlign(CENTER, CENTER);
  if (titleFont) textFont(titleFont);
  textSize(26);
  text("SOMETHING HAS CHANGED", width / 2, height / 2 - 220);
  if (titleFont) textFont("sans-serif");

  // Explanation text
  fill(220, 220, 230);
  textSize(15);
  textLeading(26);
  textAlign(CENTER, CENTER);
  text(
    "From this point on, you’ll see colours through a Deuteranopia perspective.\n" +
      "Red and green shades may look much more similar.\n\n" +
      "The next customers will order the same ingredients,\n" +
      "but can you still identify the right colours?",
    width / 2,
    height / 2 - 95,
    620,
  );

  // Side-by-side comparison strip
  const colours = [
    { label: "Strawberry", c: [225, 80, 105] },
    { label: "Honeydew", c: [105, 210, 120] },
    { label: "Green Tea", c: [80, 155, 90] },
    { label: "Mango", c: [245, 175, 60] },
  ];

  const stripY = height / 2 + 40;
  const swW = 120;
  const gap = 14;
  const totalW =
    colours.length * (swW * 2 + gap + 10) + (colours.length - 1) * 20;
  let sx = width / 2 - totalW / 2;

  // Section headers
  noStroke();
  fill(180, 220, 180);
  textSize(12);
  textAlign(CENTER, TOP);
  text("ORDER (true colour)", sx + swW / 2, stripY - 28);
  fill(220, 130, 130);
  text("YOUR VIEW", sx + swW + gap + swW / 2, stripY - 28);

  for (const col of colours) {
    const cvd = applyCVD(col.c);

    // Before swatch
    noStroke();
    fill(col.c[0], col.c[1], col.c[2]);
    rectMode(CORNER);
    rect(sx, stripY, swW, 52, 8);

    // After swatch
    fill(cvd[0], cvd[1], cvd[2]);
    rect(sx + swW + gap, stripY, swW, 52, 8);

    // Arrow
    fill(200, 200, 220);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("→", sx + swW + gap / 2, stripY + 26);

    // Label
    fill(200, 200, 220);
    textSize(11);
    textAlign(CENTER, TOP);
    text(col.label, sx + swW + gap / 2, stripY + 58);

    sx += swW * 2 + gap + 30;
  }

  // Practical hint so players know how to match ingredients
  fill(220, 220, 235);
  textAlign(CENTER, TOP);
  textSize(12);
  textLeading(18);
  text(
    "How to match orders: compare with the true-colour order bubble, then use shape symbols\n" +
      "to confirm category when colours look similar (circle = base, diamond = syrup, triangle = topping).",
    width / 2,
    stripY + 80,
    650,
  );

  // Continue button
  actBtn.x = width / 2;
  actBtn.y = height / 2 + 210;
  _drawActBtn(actBtn, "I UNDERSTAND, CONTINUE", [180, 80, 80]);

  cursor(isHover(actBtn) ? HAND : ARROW);
}

function cvdShiftMousePressed() {
  if (isHover(actBtn) || keyCode === ENTER) {
    playSound("click");
    startRound();
    currentScreen = "game";
  }
}

// ── ACT DEBRIEF ───────────────────────────────────────────

const DEBRIEF_DATA = [
  {
    title: "DEBRIEF: DEUTERANOPIA",
    colour: [200, 240, 200],
    accent: [60, 150, 60],
    points: [
      "You experienced deuteranopia which isthe most common form of CVD.",
      "Red and green became much harder to tell apart, often looking similarly brownish.",
      "~8% of males navigate this every day: traffic lights, maps, food labels.",
      "Next: protanopia, where reds appear very dark and dim.",
    ],
  },
  {
    title: "DEBRIEF: PROTANOPIA",
    colour: [255, 230, 200],
    accent: [200, 110, 40],
    points: [
      "Protanopia makes reds appear dark brown or near-black.",
      "Accessibility labels helped you identify ingredients by name.",
      "When labels disappeared, the challenge returned immediately.",
      "This is why colour-coded systems without text labels exclude CVD users.",
    ],
  },
];

function drawActDebrief() {
  const d = DEBRIEF_DATA[debriefAct - 1];
  const bg = d.colour;
  const ac = d.accent;

  background(bg[0], bg[1], bg[2]);

  // Card
  noStroke();
  fill(255, 255, 255, 230);
  rectMode(CENTER);
  rect(width / 2, height / 2 - 20, 660, 470, 22);

  // Title
  if (titleFont) textFont(titleFont);
  fill(ac[0], ac[1], ac[2]);
  textAlign(CENTER, TOP);
  textSize(17);
  text(d.title, width / 2, height / 2 - 226);
  if (titleFont) textFont("sans-serif");

  // Bullet points
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textSize(14);
  textLeading(28);
  textAlign(LEFT, TOP);
  for (let i = 0; i < d.points.length; i++) {
    const py = height / 2 - 180 + i * 70;
    noStroke();
    fill(ac[0], ac[1], ac[2], 40);
    rectMode(CORNER);
    rect(width / 2 - 300, py - 6, 600, 56, 10);
    fill(ac[0], ac[1], ac[2]);
    textSize(18);
    text("•", width / 2 - 284, py + 16);
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textSize(13);
    text(d.points[i], width / 2 - 260, py + 4, 540);
  }

  // Button
  const nextLabel = debriefAct === 1 ? "ON TO ACT 2 →" : "ON TO ACT 3 →";
  actBtn.x = width / 2;
  actBtn.y = height / 2 + 200;
  _drawActBtn(actBtn, nextLabel, ac);

  cursor(isHover(actBtn) ? HAND : ARROW);
}

function actDebriefMousePressed() {
  if (isHover(actBtn) || keyCode === ENTER) {
    playSound("click");
    currentScreen = "act_intro";
  }
}

// ── SCENARIO (Act 3 mini-challenges) ──────────────────────

function setupScenario(type) {
  scenarioAnswered = false;
  scenarioCorrect = false;

  if (type === "traffic") {
    scenarioData = {
      type: "traffic",
      question: "Which traffic light means GO?",
      options: [
        { label: "Top", c: [220, 50, 50], correct: false },
        { label: "Middle", c: [230, 180, 40], correct: false },
        { label: "Bottom", c: [50, 180, 80], correct: true },
      ],
      fact: "People with CVD often rely on POSITION (not colour) to read traffic lights.\nGreen is always at the bottom — a design choice that helps CVD users.",
    };
  } else {
    scenarioData = {
      type: "pills",
      question: "Take the BLUE pill for your headache. Which one?",
      options: [
        { label: "A", c: [80, 120, 220], correct: true }, // blue
        { label: "B", c: [80, 190, 120], correct: false }, // green
        { label: "C", c: [230, 90, 90], correct: false }, // red
      ],
      fact: "Under tritanopia, blue and green look almost identical.\nMany CVD users rely on shape, packaging text, and position — not pill colour.\nThis is why medication design must never use colour alone.",
    };
  }
}

function drawScenario() {
  if (!scenarioData) return;

  background(240, 235, 255);

  // Header
  noStroke();
  fill(255, 255, 255, 220);
  rectMode(CORNER);
  rect(0, 0, width, 76);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(LEFT, CENTER);
  textSize(12);
  text("ACT 3 — REAL WORLD CHALLENGE", 24, 38, width * 0.62, 24);

  fill(80, 100, 200);
  textAlign(RIGHT, CENTER);
  textSize(12);
  text("Tritanopia is active", width - 24 - width * 0.32, 38, width * 0.32, 24);

  // Question
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, TOP);
  textSize(20);
  const qW = width - 80;
  text(scenarioData.question, (width - qW) / 2, 110, qW);

  // Draw options
  const opts = scenarioData.options;
  const optW = 130;
  const optH = scenarioData.type === "traffic" ? 200 : 130;
  const spacing = 200;
  const startX = width / 2 - ((opts.length - 1) * spacing) / 2;

  for (let i = 0; i < opts.length; i++) {
    const ox = startX + i * spacing;
    const oy = 200;

    opts[i]._box = { x: ox, y: oy + optH / 2, w: optW, h: optH };

    const hovering = !scenarioAnswered && isHover(opts[i]._box);
    const cvdCol = applyCVD(opts[i].c);

    if (scenarioData.type === "traffic") {
      // Traffic light column for this option
      noStroke();
      fill(30, 30, 30);
      rectMode(CENTER);
      rect(ox, oy + optH / 2, 70, optH, 12);

      const lightY = [oy + 30, oy + optH / 2, oy + optH - 30];
      for (let j = 0; j < 3; j++) {
        const isActive = j === i;
        if (isActive) fill(cvdCol[0], cvdCol[1], cvdCol[2]);
        else fill(40, 40, 40);
        ellipse(ox, lightY[j], 46, 46);
      }
    } else {
      // Pill shape
      noStroke();
      if (scenarioAnswered && opts[i].correct) {
        stroke(60, 200, 80);
        strokeWeight(4);
      } else if (scenarioAnswered && !opts[i].correct) {
        stroke(200, 80, 80);
        strokeWeight(3);
      } else if (hovering) {
        stroke(100, 130, 220);
        strokeWeight(3);
      }
      fill(cvdCol[0], cvdCol[1], cvdCol[2]);
      rectMode(CENTER);
      rect(ox, oy + optH / 2, optW - 20, optH - 30, (optH - 30) / 2);
      noStroke();
    }

    // Option label
    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(CENTER, TOP);
    textSize(13);
    text(opts[i].label, ox, oy + optH + 10);

    cursor(!scenarioAnswered && hovering ? HAND : ARROW);
  }

  // Answered state
  if (scenarioAnswered) {
    // Result message
    noStroke();
    fill(255, 255, 255, 230);
    rectMode(CENTER);
    rect(width / 2, height / 2 + 110, 660, 120, 16);

    fill(scenarioCorrect ? [40, 160, 80] : [200, 80, 80]);
    textAlign(CENTER, TOP);
    textSize(15);
    text(
      scenarioCorrect ? "Correct!" : "Not quite!",
      width / 2,
      height / 2 + 58,
    );

    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textSize(12);
    textLeading(20);
    text(scenarioData.fact, width / 2, height / 2 + 82, 620);

    // Continue button
    actBtn.x = width / 2;
    actBtn.y = height / 2 + 210;
    _drawActBtn(actBtn, "CONTINUE →", [80, 100, 200]);
    cursor(isHover(actBtn) ? HAND : ARROW);
  }
}

function scenarioMousePressed() {
  if (!scenarioData) return;

  if (scenarioAnswered) {
    if (isHover(actBtn)) {
      playSound("click");
      startRound();
      currentScreen = "game";
    }
    return;
  }

  for (const opt of scenarioData.options) {
    if (opt._box && isHover(opt._box)) {
      scenarioAnswered = true;
      scenarioCorrect = opt.correct;
      playSound(opt.correct ? "correct" : "wrong");
      return;
    }
  }
}

function scenarioKeyPressed() {
  if (keyCode === ENTER && scenarioAnswered) {
    playSound("click");
    startRound();
    currentScreen = "game";
  }
}

// ── Shared button helper ──────────────────────────────────
function _drawActBtn(btn, label, accent) {
  rectMode(CENTER);
  const hov = isHover(btn);
  noStroke();
  fill(
    hov ? accent[0] * 0.9 : accent[0],
    hov ? accent[1] * 0.9 : accent[1],
    hov ? accent[2] * 0.9 : accent[2],
  );
  rect(btn.x, btn.y, btn.w, btn.h, 16);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(label, btn.x, btn.y);
}
