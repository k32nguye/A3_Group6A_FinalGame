// =====================
// WIN SCREEN (correct order)
// =====================

function drawWin() {
  background(170, 230, 200);

  noStroke();
  fill(255, 255, 255, 230);
  rectMode(CENTER);
  rect(width / 2, height / 2 - 20, 620, 340, 22);

  // Title
  fill(40, 160, 80);
  textAlign(CENTER, CENTER);
  textSize(36);
  if (titleFont) textFont(titleFont);
  text("CORRECT!", width / 2, height / 2 - 130);
  if (bodyFont) textFont(bodyFont);

  // Score
  fill(MOCHI.inkDark[0], MOCHI.inkDark[1], MOCHI.inkDark[2]);
  textSize(18);
  text("+100 points", width / 2, height / 2 - 78);

  // Message
  fill(60, 75, 90);
  textSize(15);
  textLeading(26);
  text(endingText, width / 2, height / 2, 560);

  // Act progress hint
  const roundsLeft = 5 - actRound;
  fill(80, 130, 200);
  textSize(12);
  text(
    roundsLeft > 0
      ? roundsLeft +
          " round" +
          (roundsLeft === 1 ? "" : "s") +
          " left in Act " +
          act
      : "Act " + act + " complete!",
    width / 2,
    height / 2 + 68,
  );

  // Continue prompt
  fill(100, 140, 100);
  textSize(13);
  text("Click or press ENTER to continue", width / 2, height / 2 + 140);
}

function winMousePressed() {
  playSound("click");
  advanceAfterRound();
}
