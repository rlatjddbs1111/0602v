// 위치 맞출 때만 true, 실제 게임 출시할 때는 false로 바꾸세요!
let debugMode = true; 

function drawMapScreen() {
    // 1. 화면 전체에 꽉 차게 맵 이미지를 그립니다 (창 크기가 변해도 자동 스케일링)
    if (imgMap) {
        image(imgMap, 0, 0, width, height);
    } else {
        background(200); // 이미지 로드 실패 시 임시 배경
    }

    // 폰 화면에서 키웠던 수집 현황 박스 위치에 맞게 x좌표 조정
    drawCollectionBox(width - 200, 80);

    // 2. 디버그 모드일 때만 각 건물의 클릭 범위(히트박스)를 화면에 표시
    if (debugMode) {
        for (let b of buildings) {
            fill(255, 0, 0, 100); // 빨간색 반투명
            stroke(255, 0, 0);
            rect(width * b.x, height * b.y, width * b.w, height * b.h);
            
            fill(0); noStroke(); textAlign(CENTER, CENTER); textSize(14);
            text(b.name, width * b.x + width * b.w / 2, height * b.y + height * b.h / 2);
        }
    }
}

function handleMapClick(mx, my) {
  // 일반 건물 클릭 검사
  for (let b of buildings) {
    if (mx > width * b.x && mx < width * b.x + width * b.w && 
        my > height * b.y && my < height * b.y + height * b.h && b.id !== 7) {
      processExplore(b.id); 
      return;
    }
  }
  // 학생회관(폰 이동) 클릭 검사 (id: 7, 배열 인덱스 6)
  let studentUnion = buildings[6];
  if (mx > width * studentUnion.x && mx < width * studentUnion.x + width * studentUnion.w && 
      my > height * studentUnion.y && my < height * studentUnion.y + height * studentUnion.h) {
    gameState.activeView = "phone"; 
    updateDOMVisibility();
  }
}

function drawExplorationOverlay() {
    fill(0, 180); rect(0, 0, width, height);
    fill(255); textSize(30); textAlign(CENTER, CENTER); text("탐색 중 ...", width / 2, height / 2 - 140);

    let barW = width * 0.6, barH = 24;
    let barX = width / 2 - barW / 2, barY = height / 2 - 20;
    fill(80); rect(barX, barY, barW, barH, 6);

    let tStart = barX + gameState.explorationTargetStart * barW;
    let tW = gameState.explorationTargetWidth * barW;
    noStroke(); fill(60, 200, 120, 180); rect(tStart, barY, tW, barH, 6);

    gameState.explorationBarPos += gameState.explorationBarSpeed;
    if (gameState.explorationBarPos > 1) {
        gameState.explorationBarPos = 1; gameState.explorationBarSpeed *= -1;
    } else if (gameState.explorationBarPos < 0) {
        gameState.explorationBarPos = 0; gameState.explorationBarSpeed *= -1;
    }
    let handleX = barX + gameState.explorationBarPos * barW;
    fill(240, 200, 60); rect(handleX - 6, barY - 6, 12, barH + 12, 6);

    fill(255); textSize(14); textAlign(CENTER, CENTER);
    text("스페이스바로 타이밍을 맞춰 아이템 획득 확률을 올리세요!", width / 2, barY - 30);

    gameState.explorationTimer--;
    if (gameState.explorationTimer <= 0 && !gameState.explorationPressed) {
        gameState.isExploring = false;
        executeExploreLogic(gameState.pendingBuildingId, 0);
    }
}

function drawExplorationResultOverlay() {
    if (!gameState.explorationResultLabel) return;
    fill(0, 180); rect(0, 0, width, height);
    fill(255); textSize(32); textAlign(CENTER, CENTER);
    text("탐색 결과", width / 2, height / 2 - 40);
    textSize(24); fill(220, 240, 180);
    text(gameState.explorationResultLabel, width / 2, height / 2 + 20);

    gameState.explorationResultTimer--;
    if (gameState.explorationResultTimer <= 0) {
        gameState.explorationResultLabel = null;
    }
}