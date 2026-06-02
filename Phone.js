// 파일명: Phone.js

function drawPhoneScreen() {
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
  
  let displayHistory = gameState.history.slice(-10);
  for (let entry of displayHistory) {
    fill(255); textSize(18); textAlign(LEFT, TOP); 
    text(`${entry.guess} - `, pX + 25, histY + 6); 
    
    let iconX = pX + 90;
    for (let i = 0; i < 2; i++) {
      let currentHint = entry.hint[i];
      
      if (currentHint === "?") {
        fill(255); textSize(28); text("?", iconX, histY); 
      } else {
        let matchedConfig = HINT_CONFIG[currentHint];
        
        if (!matchedConfig) {
          for (let k in HINT_CONFIG) {
            if (HINT_CONFIG[k].icon === currentHint) matchedConfig = HINT_CONFIG[k];
          }
        }
        
        if (matchedConfig && matchedConfig.img) {
          image(matchedConfig.img, iconX, histY - 4, 32, 32);
        } else if (matchedConfig) {
          fill(255); textSize(28); 
          text(matchedConfig.icon, iconX, histY);
        } else {
          fill(255); textSize(28); text("✨", iconX, histY); 
        }
      }
      iconX += 40; 
    }
    histY += 38; 
  }
}

function handlePhoneClick(mx, my) {
  // 인게임 ? 버튼 감지
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

  let pX = width/2 - UI_CONFIG.PHONE.w/2;
  let pY = UI_CONFIG.PHONE.y;
  
  if (mx > pX && mx < pX + UI_CONFIG.PHONE.w && my > pY && my < pY + 40) {
    gameState.activeView = "map"; 
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility(); 
  }
}

function drawCollectionBox(x, y) {
  push(); translate(x, y);
  fill(255); stroke(200); strokeWeight(1);
  rect(0, 0, 180, 280, 10); 
  noStroke(); fill(50); textSize(22); textAlign(CENTER, TOP); 
  text("수집 현황", 90, 15); 
  
  // 도움말 진입 버튼 그리기
  fill(50, 150, 250);
  circle(150, 26, 24); 
  fill(255); textSize(16); textAlign(CENTER, CENTER);
  text("?", 150, 26);    

  textAlign(LEFT, CENTER);
  let y_off = 60; 
  
  for (let k in HINT_CONFIG) {
    if (k === "jinri") continue; 
    let item = HINT_CONFIG[k];
    
    if (item.img) {
      image(item.img, 20, y_off - 18, 36, 36);
      fill(50); textSize(20); 
      text(`${item.name}: ${gameState.inventory[k]}`, 65, y_off); 
    } else {
      fill(50); textSize(20);
      text(`${item.icon} ${item.name}: ${gameState.inventory[k]}`, 20, y_off);
    }
    y_off += 45; 
  }
  pop();
}