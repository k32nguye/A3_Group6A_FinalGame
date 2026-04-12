// =====================
// LOSE SCREEN (wrong order or time-out)
// =====================

function drawLose() {
  background(255, 180, 170);

  noStroke();
  fill(255, 255, 255, 230);
  rectMode(CENTER);
  rect(width / 2, height / 2 - 20, 640, 360, 22);

  // Title
  fill(200, 60, 60);
  textAlign(CENTER, CENTER);
  textSize(34);
  if (titleFont) textFont(titleFont);
  text("WRONG ORDER", width / 2, height / 2 - 140);
  if (bodyFont) textFont(bodyFont);

  // Penalty
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textSize(16);
  text("-30 points", width / 2, height / 2 - 92);

  // What went wrong
  fill(60, 65, 80);
  textSize(14);
  textLeading(24);
  text(endingText, width / 2, height / 2, 580);

  // CVD tip
  const tip =
    cvdType === "DEUTAN"
      ? "Tip: Under deuteranopia, reds and greens look very similar in brightness."
      : cvdType === "PROTAN"
        ? "Tip: Under protanopia, reds appear dark — check the colour labels if available."
        : "Tip: Under tritanopia, blue and green are nearly identical. Look for other cues.";

  noStroke();
  fill(255, 220, 160, 180);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 82, 580, 48, 12);
  fill(100, 70, 20);
  textSize(12);
  text(tip, width / 2, height / 2 + 82, 540);

  // Continue prompt
  fill(160, 80, 80);
  textSize(13);
  text("Click or press ENTER to continue", width / 2, height / 2 + 148);
}

function loseMousePressed() {
  playSound("click");
  advanceAfterRound();
}
