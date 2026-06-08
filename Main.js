// 파일명: Main.js
// [AI 활용 - 부분 로직 보조]
// Math.random()을 활용해 드랍 확률을 최솟값/최댓값 밸런스에 맞춰 누적 분포로 계산하는 로직은 AI의 도움을 받음.
const BUILDING_DROP_MIN = 0.1;
const BUILDING_DROP_MAX = 1.0;

let buildings = [
  // 주요 랜드마크: 백마, 숭실 (밸런스를 위해 봉사도 섞음)
  { id: 1, name: "진리관", imgPath: "assets/b_jinri.png", img: null, x: 0.443, y: 0.144, w: 0.126, h: 0.15, dropItems: ["baekma", "soongsil", "bongsa"] },
  { id: 6, name: "안익태", imgPath: "assets/b_ahn.png", img: null, x: 0.142, y: 0.734, w: 0.146, h: 0.1, dropItems: ["baekma", "soongsil", "bongsa"] },
  { id: 10, name: "조만식", imgPath: "assets/b_cho.png", img: null, x: 0.579, y: 0.144, w: 0.127, h: 0.1, dropItems: ["baekma", "soongsil", "bongsa"] },
  { id: 14, name: "문화관", imgPath: "assets/b_culture.png", img: null, x: 0.013, y: 0.681, w: 0.124, h: 0.16, dropItems: ["baekma", "soongsil", "bongsa"] },

  // 일반 강의동 및 시설: 가장 많이 소모되는 봉사 중심, 그리고 슝슝
  { id: 2, name: "한경직", imgPath: "assets/b_han.png", img: null, x: 0.480, y: 0.538, w: 0.163, h: 0.2, dropItems: ["bongsa", "shung"] },
  { id: 4, name: "베어드", imgPath: "assets/b_baird.png", img: null, x: 0.302, y: 0.465, w: 0.150, h: 0.14, dropItems: ["bongsa", "shung"] },
  { id: 5, name: "형남공", imgPath: "assets/b_hyungnam.png", img: null, x: 0.292, y: 0.627, w: 0.182, h: 0.14, dropItems: ["bongsa", "shung"] },
  { id: 8, name: "미래관", imgPath: "assets/b_mirae.png", img: null, x: 0.652, y: 0.539, w: 0.155, h: 0.1, dropItems: ["bongsa", "shung"] },
  { id: 9, name: "중앙도서관", imgPath: "assets/b_library.png", img: null, x: 0.715, y: 0.261, w: 0.182, h: 0.16, dropItems: ["bongsa", "shung"] },
  { id: 11, name: "전산관", imgPath: "assets/b_computer.png", img: null, x: 0.811, y: 0.508, w: 0.176, h: 0.1, dropItems: ["bongsa", "shung"] },
  { id: 12, name: "정보섬", imgPath: "assets/b_infosum.png", img: null, x: 0.687, y: 0.749, w: 0.228, h: 0.2, dropItems: ["bongsa", "shung"] },
  { id: 13, name: "경상관", imgPath: "assets/b_kyungsang.png", img: null, x: 0.072, y: 0.491, w: 0.150, h: 0.12, dropItems: ["bongsa", "shung"] },

  //  외곽 및 운동장: 소거법을 위한 목튤립 중심, 그리고 슝슝
  { id: 3, name: "대운동장", imgPath: "assets/b_stadium.png", img: null, x: 0.107, y: 0.239, w: 0.221, h: 0.23, dropItems: ["tulip", "shung"] },
  { id: 15, name: "백마관", imgPath: "assets/b_baekma.png", img: null, x: 0.073, y: 0.087, w: 0.160, h: 0.08, dropItems: ["tulip", "shung"] },

  // 학생회관 (스마트폰 진입 전용)
  { id: 7, name: "학생회관", imgPath: "assets/b_student.png", img: null, x: 0.342, y: 0.278, w: 0.160, h: 0.2, dropItems: [] }
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

  let isSuccess = accuracy >= 1.0;
  let rating = isSuccess ? "🎉 탐색 완벽!" : "💦 탐색 빗나감...";

  gameState.turns -= 1;
  let dropChance = isSuccess ? 1.0 : 0.7; 
  
  let baseSum = 0;
  for (let it in building.drops) baseSum += building.drops[it];
  let gotItem = null;
  
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
    itemResult = " 👉 아무것도 얻지 못했다...";
  }
  
  gameState.explorationResultLabel = `${rating}${itemResult}`;
  gameState.explorationResultTimer = 90;

  saveGameProgress(); 
  if (typeof checkGameOverCondition === 'function') checkGameOverCondition();
}