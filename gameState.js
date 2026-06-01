// UI 관련 매직 넘버를 관리하는 전역 상수
const UI_CONFIG = {
  PHONE: { w: 280, h: 500, y: 80 },
  TITLE_BTN: { w: 280, h: 40, offset1: 80, offset2: 135 },
  GAME_OVER: { w: 300, h: 160 },
  GAME_WIN: { w: 400, h: 260 }
};

let gameState = {
  turns: 30, // MAX_TURNS 초기값
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
  popupTimer: 0
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
    updateDOMVisibility();
    return true;
  }
  return false;
}