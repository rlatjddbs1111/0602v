// 파일명: Map.js
// [AI 활용 - 특정 문법 보조]
// drawingContext.shadowBlur와 sin(frameCount)를 결합하여 심장 박동처럼 빛이 깜빡이는 수학적 애니메이션 기법은 AI의 조언을 활용함.
// 그 외 건물의 배치, 라벨링, 이미지 렌더링은 모두 직접 구현함.

let debugMode = false; 
let draggedBuilding = null; 

function drawMapScreen() {
    drawCollectionBox(width - 200, 80);

    for (let b of buildings) {
        if (b.img && b.img.width > 1) { 
            let aspect = b.img.height / b.img.width;
            b.h = (b.w * width * aspect) / height; 
        }

        let bX = width * b.x;
        let bY = height * b.y;
        let bW = width * b.w;
        let bH = height * b.h;

        // --- 💡 학생회관(id: 7) 전용 특수 빛 효과 (크기 대폭 확대) ---
        if (b.id === 7) {
            // 기본 크기(35)와 박동 진폭(25)을 키워 훨씬 더 크게 퍼지도록 설정
            let glowIntensity = 35 + sin(frameCount * 0.05) * 25;
            drawingContext.shadowBlur = glowIntensity;
            drawingContext.shadowColor = 'rgba(255, 215, 0, 1.0)'; // 색상도 100% 진하게 변경
        }

        if (b.img && b.img.width > 1) {
            image(b.img, bX, bY, bW, bH);
        } else {
            fill(150, 150); stroke(100);
            rect(bX, bY, bW, bH);
        }

        // --- 💡 다른 건물이나 텍스트에 빛이 번지지 않도록 즉시 초기화 ---
        if (b.id === 7) {
            drawingContext.shadowBlur = 0;
        }

        // --- 라벨 자동 생성 로직 ---
        let labelX = bX + bW / 2;       
        let labelY = bY + bH * 0.75;    

        textSize(14);
        textStyle(BOLD); 
        
        let tWidth = textWidth(b.name); 
        let paddingX = 20;              
        let paddingY = 24;              

        fill(0, 180); 
        noStroke();
        rect(labelX - (tWidth + paddingX) / 2, labelY - paddingY / 2, tWidth + paddingX, paddingY, 3);

        fill(255); 
        textAlign(CENTER, CENTER);
        text(b.name, labelX, labelY);
        
        textStyle(NORMAL); 
        // -----------------------------------------

        if (debugMode) {
            stroke(255, 0, 0); noFill();
            rect(bX, bY, bW, bH); 
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

  if (debugMode) {
    for (let b of buildings) {
      if (mx > width * b.x && mx < width * b.x + width * b.w && 
          my > height * b.y && my < height * b.y + height * b.h) {
        draggedBuilding = b;
        return; 
      }
    }
  }

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
    console.log(`[${draggedBuilding.name}] 📍 새 좌표 복사 👉 x: ${draggedBuilding.x.toFixed(3)}, y: ${draggedBuilding.y.toFixed(3)}, w: ${draggedBuilding.w.toFixed(3)}`);
    draggedBuilding = null;
  }
}

function mapMouseWheel(event) {
  if (!debugMode || gameState.activeView !== "map") return true;

  for (let b of buildings) {
    if (mouseX > width * b.x && mouseX < width * b.x + width * b.w &&
        mouseY > height * b.y && mouseY < height * b.y + height * b.h) {
      
      if (event.delta > 0) {
        b.w *= 0.95; 
      } else {
        b.w *= 1.05; 
      }

      console.log(`[${b.name}] 📐 새 크기 복사 👉 w: ${b.w.toFixed(3)} (x: ${b.x.toFixed(3)}, y: ${b.y.toFixed(3)})`);
      return false; 
    }
  }
  return true;
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