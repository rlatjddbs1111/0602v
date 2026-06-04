// 파일명: Map.js

// 💡 건물 배치가 끝났다면 여기를 false로 바꾸세요! 그래야 미니게임 클릭이 작동합니다.
let debugMode = false; 
let draggedBuilding = null; 

function drawMapScreen() {
    drawCollectionBox(width - 200, 80);

    for (let b of buildings) {
        // 💡 찌그러짐 방지 마법: 이미지가 있으면 원본 비율(Aspect Ratio)에 맞춰 높이를 자동 계산!
        if (b.img && b.img.width > 0) { 
            let aspect = b.img.height / b.img.width;
            b.h = (b.w * width * aspect) / height; // Main.js의 h값을 원본 비율로 덮어씌움
        }

        let bX = width * b.x;
        let bY = height * b.y;
        let bW = width * b.w;
        let bH = height * b.h;

        if (b.img) {
            image(b.img, bX, bY, bW, bH);
        } else {
            fill(150, 150); stroke(100);
            rect(bX, bY, bW, bH);
        }

        if (debugMode) {
            stroke(255, 0, 0); noFill();
            rect(bX, bY, bW, bH); // 빨간 히트박스도 찌그러짐 없이 딱 맞게 표시됨
            
            fill(0); noStroke(); textAlign(CENTER, CENTER); textSize(14);
            text(b.name, bX + bW / 2, bY + bH / 2);
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

  // 디버그 모드일 때는 클릭을 '드래그'로 인식하고 미니게임 진입을 차단합니다.
  if (debugMode) {
    for (let b of buildings) {
      if (mx > width * b.x && mx < width * b.x + width * b.w && 
          my > height * b.y && my < height * b.y + height * b.h) {
        draggedBuilding = b;
        return; 
      }
    }
  }

  // 디버그 모드가 아닐 때(false)만 미니게임으로 넘어갑니다.
  for (let b of buildings) {
    if (mx > width * b.x && mx < width * b.x + width * b.w && 
        my > height * b.y && my < height * b.y + height * b.h && b.id !== 7) {
      processExplore(b.id); 
      return;
    }
  }

  let studentUnion = buildings.find(b => b.id === 7);
  if (studentUnion && mx > width * studentUnion.x && mx < width * studentUnion.x + width * studentUnion.w && 
      my > height * studentUnion.y && my < height * studentUnion.y + height * studentUnion.h) {
    gameState.activeView = "phone"; 
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
  }
}

function mapMouseDragged() {
  if (!debugMode || gameState.activeView !== "map") return;

  if (draggedBuilding) {
    draggedBuilding.x = mouseX / width;
    draggedBuilding.y = mouseY / height;
  }
}

function mapMouseReleased() {
  if (draggedBuilding) {
    console.log(`[${draggedBuilding.name}] 새 좌표 복사하기 👉  x: ${draggedBuilding.x.toFixed(3)}, y: ${draggedBuilding.y.toFixed(3)}`);
    draggedBuilding = null;
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