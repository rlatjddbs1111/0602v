// 파일명: Map.js

// 위치를 맞출 때는 true로 켜고, 좌표 수정이 끝나면 false로 바꾸세요!
let debugMode = true; 

function drawMapScreen() {
    if (imgMap) {
        image(imgMap, 0, 0, width, height);
    } else {
        background(200); 
    }

    drawCollectionBox(width - 200, 80);

    if (debugMode) {
        for (let b of buildings) {
            fill(255, 0, 0, 100); 
            stroke(255, 0, 0);
            rect(width * b.x, height * b.y, width * b.w, height * b.h);
            
            fill(0); noStroke(); textAlign(CENTER, CENTER); textSize(14);
            text(b.name, width * b.x + width * b.w / 2, height * b.y + height * b.h / 2);
        }
    }
}

function handleMapClick(mx, my) {
  let helpCx = width - 200 + 150; 
  let helpCy = 80 + 26;           
  
  if (dist(mx, my, helpCx, helpCy) < 15) {
    gameState.previousView = gameState.activeView; 
    gameState.activeView = "tutorial";
    gameState.tutorialStep = 0;
    gameState.tutorialHistory = []; 
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
    return; 
  }

  for (let b of buildings) {
    if (mx > width * b.x && mx < width * b.x + width * b.w && 
        my > height * b.y && my < height * b.y + height * b.h && b.id !== 7) {
      processExplore(b.id); 
      return;
    }
  }

  // 💡 수정된 부분: 배열 순서가 아니라 고유 id(7)로 학생회관을 찾아냅니다!
  let studentUnion = buildings.find(b => b.id === 7);
  if (studentUnion && mx > width * studentUnion.x && mx < width * studentUnion.x + width * studentUnion.w && 
      my > height * studentUnion.y && my < height * studentUnion.y + height * studentUnion.h) {
    gameState.activeView = "phone"; 
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
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
    text("스페이스바로 초록색 영역에 맞춰 아이템을 획득하세요!", width / 2, barY - 30);

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