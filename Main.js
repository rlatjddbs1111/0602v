// 파일명: Main.js

const BUILDING_DROP_MIN = 0.1;
const BUILDING_DROP_MAX = 1.0;

// 💡 1티어, 2티어, 특수 구역으로 체계화된 드랍 테이블
let buildings = [
  // 🌟 [1티어 구역] 주요 랜드마크: 백마, 숭실 (밸런스를 위해 봉사도 섞음)
  { id: 1, name: "진리관", x: 0.49, y: 0.25, w: 0.07, h: 0.15, dropItems: ["baekma", "soongsil", "bongsa"] },
  { id: 6, name: "안익태", x: 0.15, y: 0.7, w: 0.12, h: 0.1, dropItems: ["baekma", "soongsil", "bongsa"] },
  { id: 10, name: "조만식", x: 0.57, y: 0.24, w: 0.1, h: 0.1, dropItems: ["baekma", "soongsil", "bongsa"] },
  { id: 14, name: "문화관", x: 0.03, y: 0.67, w: 0.05, h: 0.16, dropItems: ["baekma", "soongsil", "bongsa"] },

  // 🤝 [2티어 구역] 일반 강의동 및 시설: 가장 많이 소모되는 봉사 중심, 그리고 슝슝
  { id: 2, name: "한경직", x: 0.52, y: 0.55, w: 0.1, h: 0.2, dropItems: ["bongsa", "shung"] },
  { id: 4, name: "베어드", x: 0.3, y: 0.45, w: 0.15, h: 0.14, dropItems: ["bongsa", "shung"] },
  { id: 5, name: "형남공", x: 0.3, y: 0.6, w: 0.15, h: 0.14, dropItems: ["bongsa", "shung"] },
  { id: 8, name: "미래관", x: 0.67, y: 0.55, w: 0.1, h: 0.1, dropItems: ["bongsa", "shung"] },
  { id: 9, name: "중앙도서관", x: 0.69, y: 0.32, w: 0.08, h: 0.16, dropItems: ["bongsa", "shung"] },
  { id: 11, name: "전산관", x: 0.8, y: 0.55, w: 0.17, h: 0.1, dropItems: ["bongsa", "shung"] },
  { id: 12, name: "정보섬", x: 0.77, y: 0.76, w: 0.17, h: 0.2, dropItems: ["bongsa", "shung"] },
  { id: 13, name: "경상관", x: 0.07, y: 0.53, w: 0.15, h: 0.12, dropItems: ["bongsa", "shung"] },

  // 🥀 [특수 구역] 외곽 및 운동장: 소거법을 위한 목튤립 중심, 그리고 슝슝
  { id: 3, name: "대운동장", x: 0.2, y: 0.2, w: 0.2, h: 0.23, dropItems: ["tulip", "shung"] },
  { id: 15, name: "백마관", x: 0.24, y: 0.1, w: 0.16, h: 0.08, dropItems: ["tulip", "shung"] },

  // 학생회관 (스마트폰 진입 전용)
  { id: 7, name: "학생회관", x: 0.41, y: 0.22, w: 0.07, h: 0.2, dropItems: [] }
];

function buildDropProbabilities(items) {
  const count = items.length;
  if (count === 0) return {};
  const equalProb = 1 / count;
  let itemProb = equalProb;

  if (equalProb > BUILDING_DROP_MAX) itemProb = BUILDING_DROP_MAX;
  else if (equalProb < BUILDING_DROP_MIN) itemProb = BUILDING_DROP_MIN;

  let drops = items.reduce((obj, item) => {
    obj[item] = itemProb;
    return obj;
  }, {});

  const total = Object.values(drops).reduce((sum, v) => sum + v, 0);
  if (total === 0) return drops;

  for (let item of items) {
    drops[item] = drops[item] / total;
  }
  return drops;
}

for (let building of buildings) {
  building.drops = buildDropProbabilities(building.dropItems);
}

function processExplore(buildingId) {
  if (gameState.gameOver || gameState.isExploring) return;
  if (gameState.turns <= 0) return;
  gameState.isExploring = true;
  gameState.explorationTimer = 60; 
  gameState.pendingBuildingId = buildingId;

  gameState.explorationBarPos = 0;
  gameState.explorationBarSpeed = (0.015 + Math.random() * 0.01); 
  let targetCenter = 0.25 + Math.random() * 0.5; 
  
  gameState.explorationTargetWidth = 0.25; 
  gameState.explorationTargetStart = Math.max(0, Math.min(1 - gameState.explorationTargetWidth, targetCenter - gameState.explorationTargetWidth / 2));
  gameState.explorationPressed = false;
  gameState.explorationResult = null;
}

function executeExploreLogic(buildingId, accuracy = 0) {
  let building = buildings.find(b => b.id === buildingId);
  if (!building) return;
  
  gameState.isExploring = false;
  gameState.explorationPressed = false;
  gameState.explorationResult = accuracy;

  // 💡 성공 여부에 따른 판정 변수
  let isSuccess = accuracy >= 1.0;
  let rating = isSuccess ? "🎉 탐색 완벽!" : "💦 탐색 빗나감...";

  gameState.turns -= 1;

  // 💡 성공 시 100%(1.0), 실패 시 70%(0.7)의 확률 부여
  let dropChance = isSuccess ? 1.0 : 0.7; 
  
  let baseSum = 0;
  for (let it in building.drops) baseSum += building.drops[it];
  let gotItem = null;
  
  // 난수(Math.random())가 dropChance보다 낮으면 아이템 획득!
  if (baseSum > 0 && Math.random() < dropChance) {
    let rand = Math.random();
    let cumulative = 0;
    for (let item in building.drops) {
      cumulative += building.drops[item] / baseSum;
      if (rand < cumulative) {
        gameState.inventory[item] = (gameState.inventory[item] || 0) + 1;
        gotItem = item;
        break;
      }
    }
  }
  
  let itemResult = "";
  if (gotItem) {
    itemResult = ` 👉 [${HINT_CONFIG[gotItem].name}] 획득!`;
  } else {
    // 30% 확률로 진짜 아무것도 못 얻었을 때
    itemResult = " 👉 아무것도 얻지 못했다...";
  }
  
  gameState.explorationResultLabel = `${rating}${itemResult}`;
  gameState.explorationResultTimer = 90;

  saveGameProgress(); 
  if (typeof checkGameOverCondition === 'function') checkGameOverCondition();
}