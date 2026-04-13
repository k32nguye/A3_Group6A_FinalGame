// =====================
// ENDGAME SCREEN
// =====================

const endgameBtn = { x: 0, y: 0, w: 240, h: 58 };

function drawEndgame() {
  background(233, 246, 255);

  // Top banner
  noStroke();
  fill(255, 205, 120);
  rectMode(CORNER);
  rect(0, 0, width, 90);

  if (titleFont) textFont(titleFont);
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("SHIFT COMPLETE!", width / 2, 45);
  if (bodyFont) textFont(bodyFont);

  // Stats row
  const accuracy =
    totalServed > 0 ? round((totalCorrect / totalServed) * 100) : 0;

  let suspicionLabel = "Suspicion was HIGH";
  let suspicionSummary =
    "You finished the shift, but customers were starting to notice.";
  let suspicionAccent = [205, 95, 95];

  if (accuracy >= 85) {
    suspicionLabel = "Suspicion stayed LOW";
    suspicionSummary =
      "You blended in well and served confidently under pressure.";
    suspicionAccent = [70, 160, 90];
  } else if (accuracy >= 65) {
    suspicionLabel = "Suspicion was MODERATE";
    suspicionSummary =
      "You got through the shift, but a few mistakes drew attention.";
    suspicionAccent = [205, 145, 70];
  }

  // Shift outcome banner
  noStroke();
  fill(suspicionAccent[0], suspicionAccent[1], suspicionAccent[2], 45);
  rectMode(CENTER);
  rect(width / 2, 104, 420, 40, 12);
  fill(suspicionAccent[0], suspicionAccent[1], suspicionAccent[2]);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(suspicionLabel, width / 2, 104);
  textStyle(NORMAL);

  const statLabels = [
    { label: "Final Score", val: score },
    { label: "Accuracy", val: accuracy + "%" },
    { label: "Correct", val: totalCorrect + "/" + totalServed },
  ];

  noStroke();
  for (let i = 0; i < statLabels.length; i++) {
    const bx = width / 2 - 280 + i * 280;
    fill(255, 255, 255, 220);
    rectMode(CENTER);
    rect(bx, 148, 230, 78, 14);

    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textAlign(CENTER, CENTER);
    textSize(26);
    text(statLabels[i].val, bx, 142);
    fill(100, 105, 130);
    textSize(12);
    text(statLabels[i].label, bx, 170);
  }

  // What you learned cards
  const cards = [
    {
      act: "Act 1 · Deuteranopia",
      colour: [180, 230, 180],
      accent: [60, 150, 60],
      fact: "Red & green look similar.\n~8% of males are born with this form of CVD.",
    },
    {
      act: "Act 2 · Protanopia",
      colour: [255, 225, 195],
      accent: [200, 110, 40],
      fact: "Reds appear dark & dim.\nAccessibility labels restore independence, colour alone is not enough.",
    },
    {
      act: "Act 3 · Tritanopia",
      colour: [215, 215, 250],
      accent: [80, 100, 200],
      fact: "Blue & green become indistinguishable.\nCVD affects traffic lights, medication, food, and navigation every day.",
    },
  ];

  const cardW = (width - 100) / 3 - 14;
  const cardsYOffset = 20; // increase to move Act 1/2/3 cards lower
  for (let i = 0; i < cards.length; i++) {
    const cx = 50 + i * (cardW + 14) + cardW / 2;
    const cy = 310 + cardsYOffset;
    const bg = cards[i].colour;
    const ac = cards[i].accent;

    noStroke();
    fill(bg[0], bg[1], bg[2]);
    rectMode(CENTER);
    rect(cx, cy, cardW, 165, 14);

    fill(ac[0], ac[1], ac[2]);
    textAlign(CENTER, TOP);
    textSize(11);
    text(cards[i].act, cx, cy - 72);

    fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
    textSize(13);
    textLeading(22);
    textAlign(CENTER, TOP);
    text(cards[i].fact, cx, cy - 52, cardW - 20);
  }

  // Main message
  noStroke();
  fill(255, 255, 255, 215);
  rectMode(CENTER);
  rect(width / 2, 440, width - 80, 72, 14);

  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(14);
  textLeading(24);
  text(
    suspicionSummary +
      "\nOver 300 million people experience colour vision deficiency worldwide.",
    width / 2,
    440,
    width - 120,
  );

  // Play again button
  endgameBtn.x = width / 2;
  endgameBtn.y = 532;
  const hov = isHover(endgameBtn);
  noStroke();
  fill(hov ? 250 : 255, hov ? 190 : 205, hov ? 85 : 120);
  rectMode(CENTER);
  rect(endgameBtn.x, endgameBtn.y, endgameBtn.w, endgameBtn.h, 16);
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textAlign(CENTER, CENTER);
  textSize(15);
  text("PLAY AGAIN", endgameBtn.x, endgameBtn.y);

  cursor(hov ? HAND : ARROW);
}

function endgameMousePressed() {
  if (isHover(endgameBtn)) {
    playSound("click");
    currentScreen = "start";
  }
}
