
//각 값은 화면 비율로 표현 (0~1 사이)
//건물별 드롭 확률은 최소/최대 규칙을 따르며, 각 건물 내 아이템들은 균일하게 배분됩니다.
const BUILDING_DROP_MIN = 0.1;
const BUILDING_DROP_MAX = 1.0;

let buildings = [
  { id: 1, name: "진리관", x: 0.49, y: 0.25, w: 0.07, h: 0.15, dropItems: ["baekma", "soongsil"] },
  { id: 2, name: "한경직", x: 0.52, y: 0.55, w: 0.1, h: 0.2, dropItems: ["shung", "bongsa"] },
  { id: 3, name: "대운동장", x: 0.2, y: 0.2, w: 0.2, h: 0.23, dropItems: ["tulip"] },
  { id: 4, name: "베어드", x: 0.3, y: 0.45, w: 0.15, h: 0.14, dropItems: ["shung", "bongsa"] },
  { id: 5, name: "형남공", x: 0.3, y: 0.6, w: 0.15, h: 0.14, dropItems: ["shung", "bongsa"] },
  { id: 6, name: "안익태", x: 0.15, y: 0.7, w: 0.12, h: 0.1, dropItems: ["baekma", "soongsil"] },
  { id: 7, name: "학생회관", x: 0.41, y: 0.22, w: 0.07, h: 0.2, dropItems: [] }, // 폰 화면으로 이동하는 건물 (아이템 없음)
  { id: 8, name: "미래관", x: 0.67, y: 0.55, w: 0.1, h: 0.1, dropItems: ["shung", "bongsa"] },
  { id: 9, name: "중앙도서관", x: 0.69, y: 0.32, w: 0.08, h: 0.16, dropItems: ["shung", "bongsa"] },
  { id: 10, name: "조만식", x: 0.57, y: 0.24, w: 0.1, h: 0.1, dropItems: ["baekma", "soongsil"] },
  { id: 11, name: "전산관", x: 0.8, y: 0.55, w: 0.17, h: 0.1, dropItems: ["shung", "bongsa"] },
  { id: 12, name: "정보섬", x: 0.77, y: 0.76, w: 0.17, h: 0.2, dropItems: ["shung", "bongsa"] },
  { id: 13, name: "경상관", x: 0.07, y: 0.53, w: 0.15, h: 0.12, dropItems: ["shung", "bongsa"] },
  { id: 14, name: "문화관", x: 0.03, y: 0.67, w: 0.05, h: 0.16, dropItems: ["baekma", "soongsil"] },
  { id: 15, name: "백마관", x: 0.24, y: 0.1, w: 0.16, h: 0.08, dropItems: ["tulip"] }
];

function buildDropProbabilities(items) {
  const count = items.length;
  if (count === 0) return {};

  const equalProb = 1 / count;
  let itemProb = equalProb;

  if (equalProb > BUILDING_DROP_MAX) {
    itemProb = BUILDING_DROP_MAX;
  } else if (equalProb < BUILDING_DROP_MIN) {
    itemProb = BUILDING_DROP_MIN;
  }

  let drops = items.reduce((obj, item) => {
    obj[item] = itemProb;
    return obj;
  }, {});

  const total = Object.values(drops).reduce((sum, v) => sum + v, 0);
  if (total === 0) return drops;

  // 확률 합이 1이 되도록 정규화
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
  gameState.explorationTimer = 60; // frames
  gameState.pendingBuildingId = buildingId;

  // 미니게임 초기화
  gameState.explorationBarPos = 0;
  gameState.explorationBarSpeed = (0.02 + Math.random() * 0.015) / 2; // 속도를 절반으로 감소
  let targetCenter = 0.25 + Math.random() * 0.5; // 0.25~0.75 사이
  gameState.explorationTargetWidth = 0.18; // 더 넓은 타깃 너비로 판정 완화
  gameState.explorationTargetStart = Math.max(0, Math.min(1 - gameState.explorationTargetWidth, targetCenter - gameState.explorationTargetWidth / 2));
  gameState.explorationPressed = false;
  gameState.explorationResult = null;

}

function executeExploreLogic(buildingId, accuracy = 0) {
  let building = buildings.find(b => b.id === buildingId);
  if (!building) return;
  // 탐색 종료 처리
  gameState.isExploring = false;
  gameState.explorationPressed = false;
  gameState.explorationResult = accuracy;

  let rating = "나쁨";
  if (accuracy >= 0.75) rating = "좋아요";
  else if (accuracy >= 0.35) rating = "보통";
  let itemResult = "";

  gameState.turns -= 1;

  // item drop chance = timing accuracy
  let dropChance = 0.9 + (accuracy * 0.1);
  let baseSum = 0;
  for (let it in building.drops) baseSum += building.drops[it];
  let gotItem = null;
  if (baseSum > 0 && dropChance > 0 && Math.random() < dropChance) {
    // building.drops는 이미 item 간 상대 확률로 정규화됨
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
  if (gotItem) {
    itemResult = ` · ${HINT_CONFIG[gotItem].name} 획득!`;
  } else {
    itemResult = " · 아이템 없음";
  }
  gameState.explorationResultLabel = `${rating}${itemResult}`;
  gameState.explorationResultTimer = 90;

  saveGameProgress(); // 탐색 결과 저장
  checkGameOverCondition();
}