// 파일명: sketch.js

const MAX_TURNS = 30; 
let currentMaxTurns = MAX_TURNS;

let inputField, submitBtn;
let tutorialInput, tutorialSubmitBtn; 

let imgJinri, imgShung;
let imgBaekma, imgSoongsil, imgBongsa, imgTulip; 

function preload() {
  imgJinri = loadImage('ImgJinri.png');
  imgShung = loadImage('ImgShung.png');
  
  imgBaekma = loadImage('ImgBaekma.png');
  imgSoongsil = loadImage('ImgSoongsil.png');
  imgBongsa = loadImage('ImgBongsa.png');
  imgTulip = loadImage('ImgTulip.png');

  // 💡 제 실수로 누락되었던 핵심 코드 복구 완료!
  for (let b of buildings) {
    if (b.imgPath) {
      b.img = loadImage(b.imgPath);
    }
  }
}

function checkGameOverCondition() {
  if (gameState.turns <= 0 && !gameState.gameWon){
    gameState.activeView = "gameOver"; 
    gameState.winStreak = 0; 
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
    saveGameProgress(); 
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth(); 

  inputField = createInput();
  inputField.position(width/2 - 60, 580); 
  inputField.size(120, 20);
  
  submitBtn = createButton("제출");
  submitBtn.position(width/2 + 70, 580);
  submitBtn.mousePressed(guessWordAction);

  tutorialInput = createInput();
  tutorialInput.size(120, 24); 
  tutorialSubmitBtn = createButton("연습 제출");
  tutorialSubmitBtn.size(80, 30);
  tutorialSubmitBtn.mousePressed(tutorialGuessAction);

  if (imgJinri) HINT_CONFIG.jinri.img = imgJinri;
  if (imgShung) HINT_CONFIG.shung.img = imgShung;
  if (imgBaekma) HINT_CONFIG.baekma.img = imgBaekma;
  if (imgSoongsil) HINT_CONFIG.soongsil.img = imgSoongsil;
  if (imgBongsa) HINT_CONFIG.bongsa.img = imgBongsa;
  if (imgTulip) HINT_CONFIG.tulip.img = imgTulip;
  
  loadGameProgress();
  gameState.activeView = "title"; 
  if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
}

function draw() {
  background(240);
  drawGlobalHeader();

  // 💡 정답 화면 전환 딜레이 로직 (1초 후 팝업 띄우기)
  if (gameState.winDelayTimer > 0) {
    gameState.winDelayTimer--;
    if (gameState.winDelayTimer <= 0) {
      gameState.activeView = "gameWin";
      gameState.overlayTimer = 45; 
      if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
      saveGameProgress();
    }
  }

  let bgView = gameState.activeView;
  if (bgView === "gameWin" || bgView === "gameOver") {
    bgView = "phone"; 
  }

  switch(bgView) {
    case "map": drawMapScreen(); break;
    case "phone": drawPhoneScreen(); break;
    case "title": drawTitleScreen(); break;
    case "tutorial": drawTutorialScreen(); break; 
  }

  if (gameState.activeView === "gameWin") drawGameWinOverlay();
  else if (gameState.activeView === "gameOver") drawGameOverOverlay();

  if (gameState.isExploring) drawExplorationOverlay();
  else if (gameState.explorationResultLabel) drawExplorationResultOverlay();

  drawInGamePopup(); 
}

function drawGlobalHeader() {
  currentMaxTurns = MAX_TURNS - ((gameState.stage-1)*4);
  fill(50, 100, 150); rect(0, 0, width, 60);
  
  fill(255); textSize(22); textAlign(LEFT, CENTER);
  text(`숭실 단어 탐험 (Stage ${gameState.stage})`, 20, 30);
  
  textAlign(CENTER, CENTER);
  textSize(18);
  if (gameState.winStreak > 0) {
    text(`🔥 ${gameState.winStreak} 연승 중`, width / 2, 30);
  }
  
  textAlign(RIGHT, CENTER);
  textSize(22);
  text(`남은 기회: ${gameState.turns}/${currentMaxTurns}`, width - 20, 30);
}

function mousePressed() {
  if (gameState.isExploring) return; 

  if (gameState.winDelayTimer > 0) return; 

  if (gameState.activeView === "gameWin") {
    handleWinClick(mouseX, mouseY);
    return;
  }
  if (gameState.activeView === "gameOver") {
    handleGameOverClick(mouseX, mouseY);
    return;
  }

  switch(gameState.activeView) {
    case "title": handleTitleClick(mouseX, mouseY); break;
    case "map": handleMapClick(mouseX, mouseY); break;
    case "phone": handlePhoneClick(mouseX, mouseY); break;
    case "tutorial": handleTutorialClick(mouseX, mouseY); break; 
  }
}

function keyPressed() {
  if (gameState.isExploring && !gameState.explorationPressed && (key === ' ' || keyCode === 32)) {
    gameState.explorationPressed = true;
    let pos = gameState.explorationBarPos; 
    let tStart = gameState.explorationTargetStart;
    let tW = gameState.explorationTargetWidth;
    
    let accuracy = 0;
    if (pos >= tStart && pos <= tStart + tW) accuracy = 1.0; 
    else accuracy = 0;   
    
    gameState.explorationResult = accuracy;
    gameState.isExploring = false;
    executeExploreLogic(gameState.pendingBuildingId, accuracy);
    
    return false; 
  }
}