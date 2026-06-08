// 파일명: gameState.js
// [AI 활용 - 문법 템플릿]
// 브라우저 localStorage에 데이터를 읽고 쓰는 JSON.stringify/parse 직렬화 표준 문법 템플릿은 AI의 제안을 활용함.
// 저장할 gameState 객체의 프로퍼티 구성과 Object.assign을 활용한 데이터 병합 로직은 직접 설계함.

const UI_CONFIG = {
  PHONE: { w: 280, h: 500, y: 80 },
  TITLE_BTN: { w: 280, h: 40, offset1: 40, offset2: 95, offset3: 150 },
  GAME_OVER: { w: 300, h: 160 },
  GAME_WIN: { w: 400, h: 260 }
};

let gameState = {
  turns: 30, 
  stage: 1,
  inventory: { baekma: 0, soongsil: 0, shung: 1, bongsa: 3, tulip: 1 },
  history: [],
  gameWon: false,
  activeView: "title",
  isExploring: false,
  explorationTimer: 0,
  pendingBuildingId: null,

  explorationBarPos: 0,
  explorationBarSpeed: 0.01,
  explorationTargetStart: 0,
  explorationTargetWidth: 0.12,
  explorationPressed: false,
  explorationResult: null,
  explorationResultLabel: null,
  explorationResultTimer: 0,

  winStreak: 0,
  popupMessage: null,
  popupTimer: 0,
  
  tutorialStep: 0, 
  tutorialHistory: [], 
  previousView: null,
  
  // 💡 화면 전환 직후 더블클릭/스킵을 방지하기 위한 쿨다운 타이머
  overlayTimer: 0 
};

const STAGE_ANSWERS = {
  1: "방학",
  2: "진리"
};
let currentAnswer = STAGE_ANSWERS[1];

function saveGameProgress() {
  localStorage.setItem("ssu_word_game_save", JSON.stringify({
    turns: gameState.turns,
    stage: gameState.stage,
    inventory: gameState.inventory,
    history: gameState.history,
    gameWon: gameState.gameWon,
    activeView: gameState.activeView,
    winStreak: gameState.winStreak
  }));
}

function loadGameProgress() {
  let saved = localStorage.getItem("ssu_word_game_save");
  if (saved) {
    let data = JSON.parse(saved);
    Object.assign(gameState, data);
    if (gameState.winStreak === undefined) gameState.winStreak = 0;
    
    currentAnswer = STAGE_ANSWERS[gameState.stage] || "진리";
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
    return true;
  }
  return false;
}