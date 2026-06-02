// 파일명: sketch.js

const MAX_TURNS = 30; 
let currentMaxTurns = MAX_TURNS;

let inputField, submitBtn;
let tutorialInput, tutorialSubmitBtn; 

let imgJinri, imgShung, imgMap;
let imgBaekma, imgSoongsil, imgBongsa, imgTulip; 

function preload() {
  imgJinri = loadImage('ImgJinri.png');
  imgShung = loadImage('ImgShung.png');
  imgMap = loadImage('MapBg.jpg'); 
  
  // 💡 주석 완벽 해제! (이미지 파일명과 대소문자가 정확한지 꼭 확인하세요)
  imgBaekma = loadImage('ImgBaekma.png');
  imgSoongsil = loadImage('ImgSoongsil.png');
  imgBongsa = loadImage('ImgBongsa.png');
  imgTulip = loadImage('ImgTulip.png');
}

function checkGameOverCondition() {
  if (gameState.turns <= 0 && !gameState.gameWon){
    gameState.activeView = "gameOver"; 
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
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

  // 로드된 이미지들을 HINT_CONFIG에 연결
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

  switch(gameState.activeView) {
    case "map": drawMapScreen(); break;
    case "phone": drawPhoneScreen(); break;
    case "title": drawTitleScreen(); break;
    case "tutorial": drawTutorialScreen(); break; 
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
    case "tutorial": handleTutorialClick(mouseX, mouseY); break; 
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
    
    let accuracy = 0;
    
    if (pos >= tStart && pos <= tStart + tW) {
      accuracy = 1.0; // 타깃 명중
    } else {
      accuracy = 0;   // 타깃 빗나감
    }
    
    gameState.explorationResult = accuracy;
    gameState.isExploring = false;
    executeExploreLogic(gameState.pendingBuildingId, accuracy);
    
    return false; // 스페이스바 스크롤 방지
  }
}