function drawPhoneScreen() {
  // 수집 현황 박스가 훨씬 커졌으므로 위치를 왼쪽으로 넉넉히 이동 (width - 200)
  drawCollectionBox(width - 200, 80);
  
  let pW = UI_CONFIG.PHONE.w;
  let pH = UI_CONFIG.PHONE.h;
  let pX = width/2 - pW/2;
  let pY = UI_CONFIG.PHONE.y;
  
  fill(220); stroke(100); rect(pX, pY, pW, pH, 20); noStroke();
  fill(50); rect(pX + 20, pY + 50, pW - 40, pH - 100, 5);
  fill(150); rect(pX, pY, pW, 40, 20, 20, 0, 0);
  
  fill(50); textSize(14); textAlign(LEFT, CENTER); 
  text("🔙 지도로 돌아가기", pX + 15, pY + 20);
  
  fill(255); textAlign(LEFT, TOP); 
  let histY = pY + 60;
  
  // 더 큼직하게 보이도록 최근 10개만 렌더링
  let displayHistory = gameState.history.slice(-10);
  for (let entry of displayHistory) {
    fill(255); textSize(18); textAlign(LEFT, TOP); // 글자 크기도 16 -> 18로 확대
    text(`${entry.guess} - `, pX + 25, histY + 6); // 수직 정렬을 위해 오프셋 조정
    
    let iconX = pX + 90;
    for (let i = 0; i < 2; i++) {
      let currentHint = entry.hint[i];
      
      if (currentHint === "?") {
        fill(255); textSize(28); text("?", iconX, histY); // 물음표 크기도 확대
      } else {
        let matchedConfig = HINT_CONFIG[currentHint];
        
        if (!matchedConfig) {
          for (let k in HINT_CONFIG) {
            if (HINT_CONFIG[k].icon === currentHint) matchedConfig = HINT_CONFIG[k];
          }
        }
        
        if (matchedConfig && matchedConfig.img) {
          // 💡 힌트 내역 이미지 크기 28x28 -> 32x32로 확대
          image(matchedConfig.img, iconX, histY - 4, 32, 32);
        } else if (matchedConfig) {
          fill(255); textSize(28); 
          text(matchedConfig.icon, iconX, histY);
        } else {
          fill(255); textSize(28); text("✨", iconX, histY); 
        }
      }
      iconX += 40; // 큼직해진 만큼 가로 간격 34 -> 40으로 확대
    }
    histY += 38; // 세로 줄 간격 32 -> 38로 확대
  }
}

function handlePhoneClick(mx, my) {
  let pX = width/2 - UI_CONFIG.PHONE.w/2;
  let pY = UI_CONFIG.PHONE.y;
  
  if (mx > pX && mx < pX + UI_CONFIG.PHONE.w && my > pY && my < pY + 40) {
    gameState.activeView = "map"; 
    updateDOMVisibility(); 
  }
}

function drawCollectionBox(x, y) {
  push(); translate(x, y);
  fill(255); stroke(200); strokeWeight(1);
  // 💡 박스 크기 대폭 확장 (140x240 -> 180x280)
  rect(0, 0, 180, 280, 10); 
  noStroke(); fill(50); textSize(22); textAlign(CENTER, TOP); // 제목 텍스트 크기 확대
  text("수집 현황", 90, 15); // 제목 위치 중앙(90)으로 맞춤
  
  textAlign(LEFT, CENTER);
  let y_off = 60; // 시작 높이 낮춤
  
  for (let k in HINT_CONFIG) {
    if (k === "jinri") continue; 
    let item = HINT_CONFIG[k];
    
    if (item.img) {
      // 💡 수집 현황 이미지 크기 대폭 확대 (26x26 -> 36x36)
      image(item.img, 20, y_off - 18, 36, 36);
      fill(50); textSize(20); // 텍스트 크기 16 -> 20
      text(`${item.name}: ${gameState.inventory[k]}`, 65, y_off); // 텍스트를 오른쪽으로 밀어줌
    } else {
      fill(50); textSize(20);
      text(`${item.icon} ${item.name}: ${gameState.inventory[k]}`, 20, y_off);
    }
    y_off += 45; // 줄 간격 35 -> 45로 확대
  }
  pop();
}