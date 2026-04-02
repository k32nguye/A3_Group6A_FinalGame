function drawWin() {
  background(170, 230, 220);
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  rect(width / 2, height / 2, 650, 420, 26);

  fill(40, 45, 60);
  textAlign(CENTER, CENTER);
  textSize(45);
  text("ORDER SLAYED", width / 2, 360);

  fill(70, 75, 90);
  textSize(20);
  text(endingText, width / 2, height / 2);

  fill("green");
  textSize(14);
  text("Click or press ENTER for next customer.", width / 2, 600);
}

function winMousePressed() {
  round += 1;
  startRound();
  currentScreen = "game";
}

function winKeyPressed() {
  if (keyCode === ENTER) {
    round += 1;
    startRound();
    currentScreen = "game";
  }
}
