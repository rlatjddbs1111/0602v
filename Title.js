function drawTitleScreen() {
  background(30, 144, 255);
  fill(255); textAlign(CENTER, CENTER);
  
  textSize(42); text("진리를 찾아서", width / 2, height / 2 - 160);
  
  textSize(14); fill(230, 245, 255);
  let introText = 
    "게임 방법\n" +
    "1. 캠퍼스 건물을 탐색하여 자소 힌트 아이템을 획득하세요.\n" +
    "2. 학생회관(폰)에서 2글자 단어를 입력해 정답을 추리합니다.\n\n"
  text(introText, width / 2, height / 2 - 30);

  let btnW = UI_CONFIG.TITLE_BTN.w;
  let btnH = UI_CONFIG.TITLE_BTN.h;
  let btnX = width / 2 - btnW / 2;
  
  stroke(255); strokeWeight(1); noFill();
  rect(btnX, height / 2 + UI_CONFIG.TITLE_BTN.offset1, btnW, btnH, 10);
  noStroke(); fill(255); textSize(18);
  text("새 게임 시작", width / 2, height / 2 + UI_CONFIG.TITLE_BTN.offset1 + 20);
  
  if (localStorage.getItem("ssu_word_game_save")) {
    stroke(255); noFill();
    rect(btnX, height / 2 + UI_CONFIG.TITLE_BTN.offset2, btnW, btnH, 10);
    noStroke(); fill(255);
    text("이어서 하기", width / 2, height / 2 + UI_CONFIG.TITLE_BTN.offset2 + 20);
  }
}

function handleTitleClick(mx, my) {
  let btnW = UI_CONFIG.TITLE_BTN.w;
  let btnH = UI_CONFIG.TITLE_BTN.h;
  let btnX = width / 2 - btnW / 2;
  
  let newGameY = height / 2 + UI_CONFIG.TITLE_BTN.offset1;
  let loadGameY = height / 2 + UI_CONFIG.TITLE_BTN.offset2;

  // 새 게임 시작
  if (mx > btnX && mx < btnX + btnW && my > newGameY && my < newGameY + btnH) {
    resetGame(); 
  } 
  // 이어서 하기
  else if (localStorage.getItem("ssu_word_game_save") &&
           mx > btnX && mx < btnX + btnW && my > loadGameY && my < loadGameY + btnH) {
    loadGameProgress();
    gameState.activeView = "map"; // 명시적으로 인게임 맵 화면으로 전환
    updateDOMVisibility();
  }
}