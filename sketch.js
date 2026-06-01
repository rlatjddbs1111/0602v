/* 숭실 단어 탐험 v0.2.4 - 이미지 전면 교체 버전 */
const MAX_TURNS = 30; 
let currentMaxTurns = MAX_TURNS;

let inputField, submitBtn;

// 1. 모든 이미지 변수 선언
let imgJinri, imgBaekma, imgSoongsil, imgShung, imgBongsa, imgTulip;

function preload() {
  // 2. 파일명에 맞게 이미지 로드 (없는 파일은 주석 처리해도 무방합니다)
  imgJinri = loadImage('ImgJinri.png');
  imgShung = loadImage('ImgShung.png');
  imgBaekma = loadImage('ImgBaekma.png');
  imgSoongsil = loadImage('ImgSoongsil.png');
  imgBongsa = loadImage('ImgBongsa.png');
  imgTulip = loadImage('ImgTulip.png');

  imgMap = loadImage('MapBg.jpg');
}

function checkGameOverCondition() {
  if (gameState.turns <= 0 && !gameState.gameWon){
    gameState.activeView = "gameOver"; 
    updateDOMVisibility();
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

  // 3. 로드된 이미지를 HINT_CONFIG에 안전하게 연결
  if (imgJinri) HINT_CONFIG.jinri.img = imgJinri;
  if (imgShung) HINT_CONFIG.shung.img = imgShung;
  if (imgBaekma) HINT_CONFIG.baekma.img = imgBaekma;
  if (imgSoongsil) HINT_CONFIG.soongsil.img = imgSoongsil;
  if (imgBongsa) HINT_CONFIG.bongsa.img = imgBongsa;
  if (imgTulip) HINT_CONFIG.tulip.img = imgTulip;
  
  loadGameProgress();
  gameState.activeView = "title"; 
  updateDOMVisibility();
}

function draw() {
  background(240);
  drawGlobalHeader();

  switch(gameState.activeView) {
    case "map": drawMapScreen(); break;
    case "phone": drawPhoneScreen(); break;
    case "title": drawTitleScreen(); break;
    case "gameOver": drawGameOverOverlay(); break;
    case "gameWin": drawGameWinOverlay(); break;
  }

  if (gameState.isExploring) drawExplorationOverlay();
  else if (gameState.explorationResultLabel) drawExplorationResultOverlay();

  drawInGamePopup(); 
}

function drawGlobalHeader() {
  currentMaxTurns = MAX_TURNS - ((gameState.stage-1)*4);
  fill(50, 100, 150); rect(0, 0, width, 60);
  
  fill(255); textSize(22); textAlign(LEFT, CENTER);
  text("숭실 단어 탐험: 진리 수집", 20, 30);
  
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
  switch(gameState.activeView) {
    case "title": handleTitleClick(mouseX, mouseY); break;
    case "map": handleMapClick(mouseX, mouseY); break;
    case "phone": handlePhoneClick(mouseX, mouseY); break;
    case "gameWin": handleWinClick(mouseX, mouseY); break;
    case "gameOver": handleGameOverClick(mouseX, mouseY); break;
  }
}

function keyPressed() {
  if (gameState.isExploring && !gameState.explorationPressed && (key === ' ' || keyCode === 32)) {
    gameState.explorationPressed = true;
    let pos = gameState.explorationBarPos; 
    let tStart = gameState.explorationTargetStart;
    let tW = gameState.explorationTargetWidth;
    let tCenter = tStart + tW / 2;
    let diff = Math.abs(pos - tCenter);
    
    let accuracy = 0;
    if (diff <= tW / 2) {
      accuracy = 1 - (diff / (tW / 2));
    } else {
      let outerLimit = tW * 1.1;
      if (diff <= outerLimit) {
        accuracy = 0.4 * (1 - (diff - tW / 2) / (outerLimit - tW / 2));
      }
    }
    
    gameState.explorationResult = accuracy;
    gameState.isExploring = false;
    executeExploreLogic(gameState.pendingBuildingId, accuracy);
  }
}