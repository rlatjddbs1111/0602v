// 파일명: Scene.js

function resetGame() {
    currentMaxTurns = MAX_TURNS;
    gameState.turns = currentMaxTurns; 
    gameState.stage = 1;
    currentAnswer = STAGE_ANSWERS[1];
    gameState.inventory = { baekma: 0, soongsil: 0, shung: 0, bongsa: 0, tulip: 0 };
    gameState.history = [];
    gameState.gameWon = false;
    gameState.activeView = "map"; 
    gameState.isExploring = false;
    gameState.explorationTimer = 0;
    gameState.pendingBuildingId = null;
    gameState.winStreak = 0;
    
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
    saveGameProgress(); 
}

function nextStage() {
    gameState.stage += 1;
    currentMaxTurns = MAX_TURNS - (gameState.stage - 1) * 4; 
    gameState.turns = currentMaxTurns; 
    currentAnswer = STAGE_ANSWERS[gameState.stage] || "진리";
    gameState.gameWon = false;
    gameState.history = []; 
    gameState.activeView = "map";
    gameState.isExploring = false;
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
    saveGameProgress();
}

function updateDOMVisibility() {
  if (gameState.activeView === "phone") {
    if (inputField && submitBtn) { inputField.show(); submitBtn.show(); }
    if (typeof tutorialInput !== 'undefined' && tutorialInput) { tutorialInput.hide(); tutorialSubmitBtn.hide(); }
  } 
  else if (gameState.activeView === "tutorial" && gameState.tutorialStep === 4) {
    if (inputField && submitBtn) { inputField.hide(); submitBtn.hide(); }
    
    let boxW = 680, boxH = 600;
    let boxX = width / 2 - boxW / 2, boxY = height / 2 - boxH / 2;
    
    if (typeof tutorialInput !== 'undefined' && tutorialInput) {
      tutorialInput.position(boxX + boxW/2 - 100, boxY + boxH - 140);
      tutorialSubmitBtn.position(boxX + boxW/2 + 35, boxY + boxH - 140);
      tutorialInput.show();
      tutorialSubmitBtn.show();
    }
  } 
  else {
    if (inputField && submitBtn) { inputField.hide(); submitBtn.hide(); }
    if (typeof tutorialInput !== 'undefined' && tutorialInput) { tutorialInput.hide(); tutorialSubmitBtn.hide(); }
  }
}

function showInGamePopup(msg) {
  gameState.popupMessage = msg;
  gameState.popupTimer = 120; 
}

function drawInGamePopup() {
  if (gameState.popupTimer > 0 && gameState.popupMessage) {
    push();
    rectMode(CENTER);
    fill(0, 220);
    noStroke();
    rect(width / 2, height / 2, 420, 100, 15);
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(gameState.popupMessage, width / 2, height / 2);
    pop();
    gameState.popupTimer--; 
  } else {
    gameState.popupMessage = null;
  }
}

function drawGameOverOverlay() {
  fill(0, 150); rect(0, 0, width, height); 
  let boxW = UI_CONFIG.GAME_OVER.w;
  let boxH = UI_CONFIG.GAME_OVER.h;
  fill(255); rect(width / 2 - boxW/2, height / 2 - boxH/2 + 10, boxW, boxH, 15);
  
  fill(50); textAlign(CENTER, CENTER); textSize(26);
  text("도전 실패...", width / 2, height / 2 - 20);
  
  textSize(18); fill(200, 50, 50);
  text(`정답: ${currentAnswer}`, width / 2, height / 2 + 15);
  
  fill(50); textSize(16);
  text("클릭하여 다시 시작", width / 2, height / 2 + 55);
}

function handleGameOverClick(mx, my) {
  let boxW = UI_CONFIG.GAME_OVER.w;
  let boxH = UI_CONFIG.GAME_OVER.h;
  if(mx > width / 2 - boxW/2 && mx < width / 2 + boxW/2 && 
     my > height / 2 - boxH/2 + 10 && my < height / 2 + boxH/2 + 10) {
    resetGame();
  }
}

function drawGameWinOverlay() {
  fill(0, 150); rect(0, 0, width, height); 
  let boxW = UI_CONFIG.GAME_WIN.w;
  let boxH = UI_CONFIG.GAME_WIN.h;
  fill(255); rect(width / 2 - boxW/2, height / 2 - boxH/2, boxW, boxH, 15);
  fill(50); textAlign(CENTER, CENTER);
  
  if (gameState.stage < 2) {
    textSize(26); text(`Stage ${gameState.stage} 성공!`, width / 2, height / 2 - 20);
    textSize(18); fill(50);
    text("다음 스테이지로 나아가려면 클릭하세요.", width / 2, height / 2 + 30);
  } else {
    textSize(28); fill(0, 102, 204);
    text("🎉 모든 진리 수집 성공! 🎉", width / 2, height / 2 - 60);
    
    fill(50); textSize(16);
    text("소속: 글로벌미디어학부", width / 2, height / 2 - 10);
    text("제작자: 이준배, 김성윤", width / 2, height / 2 + 15);
    
    textSize(13);
    text('"숭실의 자음과 모음을 모아 진리를 찾는\n여정을 게임으로 구현하게 되어 뜻깊었습니다!"', width / 2, height / 2 + 65);
    
    textSize(15); fill(100);
    text("클릭하여 처음부터 다시 시작", width / 2, height / 2 + 115);
  }
}

function handleWinClick(mx, my) {
  let boxW = UI_CONFIG.GAME_WIN.w;
  let boxH = UI_CONFIG.GAME_WIN.h;
  if(mx > width / 2 - boxW/2 && mx < width / 2 + boxW/2 && 
     my > height / 2 - boxH/2 && my < height / 2 + boxH/2) {
    if (gameState.stage < 2) {
        nextStage();
    } else {
        // 💡 게임 변수 초기화 후 곧바로 메인 타이틀 화면으로 덮어씌움
        resetGame();
        gameState.activeView = "title";
        if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
        saveGameProgress();
    }
  }
}