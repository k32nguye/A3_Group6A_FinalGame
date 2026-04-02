const backBtn = { y: 710, w: 260, h: 86, label: "BACK" };

function drawInstr() {
  background("lavender");
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  rect(width / 2, 360, 680, 520, 26);

  fill(40, 45, 60);
  textAlign(CENTER, TOP);
  textSize(40);
  text("HOW TO PLAY", width / 2, 180);

  fill(70, 75, 90);
  textSize(11.5);
  textLeading(28);
  textAlign(CENTER, TOP);

  text(
    "You run a bubble tea counter for mochi monsters.\n\n" +
      "Mechanic 1: Memory\n" +
      "1. Once the order appears briefly, memorize the colours.\n\n" +
      "2. Choose 1 Tea Base, 1 Syrup, 1 Topping\n" +
      "3. Click SERVE before time runs out\n\n" +
      "Keys:\n" +
      "R = restart (back to title)\n" +
      "V = toggle vision mode (Normal/CVD)",
    width / 2,
    270,
  );

  // Button
  drawInstrButton(backBtn);
  backBtn.x = width / 2;
  cursor(isHover(backBtn) ? HAND : ARROW);
}

function instrMousePressed() {
  if (isHover(backBtn)) currentScreen = "start";
}

function drawInstrButton(btn) {
  rectMode(CENTER);
  const hover = isHover(btn);

  noStroke();
  if (hover) fill(250, 190, 85);
  else fill(255, 205, 120);

  rect(btn.x, btn.y, btn.w, btn.h, 22);

  fill(40, 45, 60);
  textAlign(CENTER, CENTER);
  textSize(22);
  text(btn.label, btn.x, btn.y);
}
