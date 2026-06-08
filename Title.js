// 파일명: Title.js

function drawTitleScreen() {
  background(30, 144, 255);
  fill(255); textAlign(CENTER, CENTER);
  
  textSize(42); text("진리를 찾아서", width / 2, height / 2 - 160);
  textSize(16); fill(230, 245, 255);
  text("숭실대학교 캠퍼스 단어 추리 게임", width / 2, height / 2 - 100);

  let btnW = UI_CONFIG.TITLE_BTN.w;
  let btnH = UI_CONFIG.TITLE_BTN.h;
  let btnX = width / 2 - btnW / 2;
  
  stroke(255); strokeWeight(1); noFill();
  rect(btnX, height / 2 + UI_CONFIG.TITLE_BTN.offset1, btnW, btnH, 10);
  noStroke(); fill(255); textSize(20);
  text("새 게임 시작", width / 2, height / 2 + UI_CONFIG.TITLE_BTN.offset1 + 20);
  
  stroke(255); noFill();
  rect(btnX, height / 2 + UI_CONFIG.TITLE_BTN.offset2, btnW, btnH, 10);
  noStroke(); fill(255);
  text("초보자 가이드", width / 2, height / 2 + UI_CONFIG.TITLE_BTN.offset2 + 20);

  if (localStorage.getItem("ssu_word_game_save")) {
    stroke(255); noFill();
    rect(btnX, height / 2 + UI_CONFIG.TITLE_BTN.offset3, btnW, btnH, 10);
    noStroke(); fill(255);
    text("이어서 하기", width / 2, height / 2 + UI_CONFIG.TITLE_BTN.offset3 + 20);
  }
}

function handleTitleClick(mx, my) {
  let btnW = UI_CONFIG.TITLE_BTN.w;
  let btnH = UI_CONFIG.TITLE_BTN.h;
  let btnX = width / 2 - btnW / 2;
  
  let newGameY = height / 2 + UI_CONFIG.TITLE_BTN.offset1;
  let guideY = height / 2 + UI_CONFIG.TITLE_BTN.offset2;
  let loadGameY = height / 2 + UI_CONFIG.TITLE_BTN.offset3;

  if (mx > btnX && mx < btnX + btnW && my > newGameY && my < newGameY + btnH) {
    resetGame(); 
  } 
  else if (mx > btnX && mx < btnX + btnW && my > guideY && my < guideY + btnH) {
    gameState.previousView = "title"; 
    gameState.activeView = "tutorial";
    gameState.tutorialStep = 0;
    gameState.tutorialHistory = [];
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
  }
  else if (localStorage.getItem("ssu_word_game_save") && mx > btnX && mx < btnX + btnW && my > loadGameY && my < loadGameY + btnH) {
    loadGameProgress();
    gameState.activeView = "map"; 
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
  }
}

function drawTutorialScreen() {
  background(240);
  let boxW = 680, boxH = 600;
  let boxX = width / 2 - boxW / 2, boxY = height / 2 - boxH / 2;
  
  fill(255); stroke(150); strokeWeight(2); rect(boxX, boxY, boxW, boxH, 15); noStroke();
  fill(50, 100, 150); rect(boxX, boxY, boxW, 70, 15, 15, 0, 0);
  
  fill(255); textSize(28); textAlign(CENTER, CENTER); 
  text("초보자 가이드", width / 2, boxY + 35);
  
  fill(50); textAlign(CENTER, TOP); textSize(22); 
  
  if (gameState.tutorialStep === 0) {
    text("1단계 : 캠퍼스 탐색", width / 2, boxY + 110);
    textSize(18); textAlign(LEFT, TOP); fill(80); 
    let t = "지도에 있는 숭실대 건물들을 클릭해 보세요.\n\n건물을 탐색하면 스페이스바 타이밍 미니게임이 시작됩니다.\n타이밍을 잘 맞출수록 '힌트 아이템' 획득 확률이 올라갑니다!\n\n💡 꿀팁: 건물마다 얻을 수 있는 아이템의 종류가 다릅니다!\n특정 힌트가 필요하다면 여러 건물을 골고루 탐색해 보세요.\n\n(주의: 탐색할 때마다 남은 기회가 1씩 줄어듭니다.)";
    text(t, boxX + 45, boxY + 170);
  } 
  else if (gameState.tutorialStep === 1) {
    text("2단계 : 학생회관(스마트폰) 단어 추리", width / 2, boxY + 110);
    textSize(18); textAlign(LEFT, TOP); fill(80);
    let t = "힌트 아이템을 충분히 모았다면 '학생회관'으로 이동하세요.\n\n화면 아래 입력창에 생각나는 2글자 한글 단어를 입력하고\n제출 버튼을 누르면, 내가 가진 아이템을 소모하여\n정답과 얼마나 비슷한지 결과를 알려줍니다.\n\n아이템이 부족하면 정확한 힌트를 볼 수 없으니 주의하세요!";
    text(t, boxX + 45, boxY + 170);
  } 
  else if (gameState.tutorialStep === 2) {
    // 💡 백마와 숭실을 분리하여 초성 일치 여부를 명확히 강조!
    text("3단계 : 힌트 해석법 (기본 종류)", width / 2, boxY + 100);
    textSize(18); textAlign(LEFT, TOP); fill(80);
    
    let sy = boxY + 140; 
    let iconS = 32; 

    if (imgJinri) image(imgJinri, boxX + 45, sy - 4, iconS, iconS); else text("✨", boxX + 45, sy);
    text("진리 : 정답과 위치/글자가 완벽히 일치!", boxX + 90, sy + 2); sy += 48;

    if (imgBaekma) image(imgBaekma, boxX + 45, sy - 4, iconS, iconS); else text("🐴", boxX + 45, sy);
    text("백마 : '초성'이 맞고, 제자리 자음,모음이 2개 이상 일치", boxX + 90, sy + 2); sy += 48;

    if (imgSoongsil) image(imgSoongsil, boxX + 45, sy - 4, iconS, iconS); else text("🏫", boxX + 45, sy);
    text("숭실 : '초성'은 틀리지만, 제자리 자음,모음이 2개 이상 일치", boxX + 90, sy + 2); sy += 48;

    if (imgBongsa) image(imgBongsa, boxX + 45, sy - 4, iconS, iconS); else text("🤝", boxX + 45, sy);
    text("봉사 : 제자리 정답과 자음,모음이 딱 1개만 일치", boxX + 90, sy + 2); sy += 48;

    if (imgShung) image(imgShung, boxX + 45, sy - 4, iconS, iconS); else text("🔄", boxX + 45, sy);
    text("슝슝 : 제자리엔 없지만, '다른 자리' 정답에 포함됨", boxX + 90, sy + 2); sy += 48;

    if (imgTulip) image(imgTulip, boxX + 45, sy - 4, iconS, iconS); else text("🥀", boxX + 45, sy);
    text("목튤립 : 두 글자 어디에도 일치하는 자음,모음이 전혀 없음", boxX + 90, sy + 2); sy += 48;
  } 
  else if (gameState.tutorialStep === 3) {
    text("4단계 : 심화 규칙 및 예시 모음", width / 2, boxY + 90);
    
    let sy = boxY + 130;
    fill(60, 100, 200); textSize(20); textAlign(LEFT, TOP);
    text("📌 꼭 알아둬야 할 심화 규칙", boxX + 40, sy); sy += 35;
    
    fill(80); textSize(17);
    text("1. 봉사 vs 슝슝 : '제자리 일치(봉사)'가 '다른 자리(슝슝)'보다 우선합니다.\n   (예: 제자리도 맞고 옆자리도 맞으면 슝슝 대신 봉사 판정)", boxX + 40, sy); sy += 50;
    text("2. 아이템 부족 : 백마/숭실 판정 시 해당 아이템이 없으면 봉사로 대체!\n   대체할 봉사마저 없으면 힌트를 볼 수 없어 [ ? ] 가 뜹니다.", boxX + 40, sy); sy += 65;

    fill(60, 100, 200); textSize(20);
    text("💡 힌트 판정 예시 (정답이 '진리'일 때)", boxX + 40, sy); sy += 35;
    
    // 💡 텍스트를 약간 줄여서 긴 설명도 한 줄에 깔끔하게 들어가도록 설정
    fill(80); textSize(16);
    let iconS = 26;
    
    // 예시 1: 완벽 일치
    text("• 진리 👉", boxX + 40, sy); 
    if(imgJinri) { image(imgJinri, boxX+115, sy-4, iconS, iconS); image(imgJinri, boxX+145, sy-4, iconS, iconS); } else { text("✨ ✨", boxX+115, sy); }
    text("('진리' 완벽 일치)", boxX+180, sy); sy += 36;

    // 예시 2: 초성 맞고 2개 일치 (백마) + 일치 없음 (목튤립)
    text("• 지구 👉", boxX + 40, sy); 
    if(imgBaekma) image(imgBaekma, boxX+115, sy-4, iconS, iconS); else text("🐴", boxX+115, sy);
    if(imgTulip) image(imgTulip, boxX+145, sy-4, iconS, iconS); else text("🥀", boxX+145, sy);
    text("('지': 초성 맞고 2개 일치 ➡️백마 / '구': 일치 없음 ➡️목튤립)", boxX+180, sy); sy += 36;

    // 예시 3: 초성 틀리고 2개 일치 (숭실) + 일치 없음 (목튤립)
    text("• 민속 👉", boxX + 40, sy); 
    if(imgSoongsil) image(imgSoongsil, boxX+115, sy-4, iconS, iconS); else text("🏫", boxX+115, sy);
    if(imgTulip) image(imgTulip, boxX+145, sy-4, iconS, iconS); else text("🥀", boxX+145, sy);
    text("('민': 초성 틀리고 2개 일치 ➡️숭실 / '속': 일치 없음 ➡️목튤립)", boxX+180, sy); sy += 36;

    // 예시 4: 1개만 일치 (봉사) + 일치 없음 (목튤립)
    text("• 장구 👉", boxX + 40, sy); 
    if(imgBongsa) image(imgBongsa, boxX+115, sy-4, iconS, iconS); else text("🤝", boxX+115, sy);
    if(imgTulip) image(imgTulip, boxX+145, sy-4, iconS, iconS); else text("🥀", boxX+145, sy);
    text("('장': ㅈ 1개 일치 ➡️봉사 / '구': 일치 없음 ➡️목튤립)", boxX+180, sy); sy += 36;

    // 예시 5: 0개 일치 (목튤립) + 옆 글자 포함 (슝슝)
    text("• 우주 👉", boxX + 40, sy); 
    if(imgTulip) image(imgTulip, boxX+115, sy-4, iconS, iconS); else text("🥀", boxX+115, sy);
    if(imgShung) image(imgShung, boxX+145, sy-4, iconS, iconS); else text("🔄", boxX+145, sy);
    text("('우': 일치 없음 ➡️목튤립 / '주': 옆 글자 '진'에 ㅈ ➡️슝슝)", boxX+180, sy);
  }
  else if (gameState.tutorialStep === 4) {
    text("5단계 : 무제한 연습 모드", width / 2, boxY + 100);
    textSize(16); textAlign(CENTER, TOP); fill(80);
    text("정답 단어는 [ 진리 ] 입니다. 아무 2글자 한글이나 입력해 보세요!\n(아이템 소모 없이 결과 아이콘을 무제한으로 확인할 수 있습니다.)", width / 2, boxY + 140);

    fill(245); stroke(220); rect(boxX + 50, boxY + 190, boxW - 100, 250, 10); noStroke();

    let histY = boxY + 210;
    let displayHistory = gameState.tutorialHistory.slice(-5); 
    for (let entry of displayHistory) {
      fill(50); textSize(20); textAlign(LEFT, TOP);
      let startX = width / 2 - 60;
      text(`${entry.guess} - `, startX, histY + 6);

      let iconX = startX + 70;
      for (let i = 0; i < 2; i++) {
        let currentHint = entry.hint[i];
        let matchedConfig = HINT_CONFIG[currentHint];

        if (matchedConfig && matchedConfig.img) {
          image(matchedConfig.img, iconX, histY - 4, 36, 36);
        } else if (matchedConfig) {
          fill(255); textSize(28); text(matchedConfig.icon, iconX, histY);
        } else {
          fill(50); textSize(28); text("✨", iconX, histY);
        }
        iconX += 45;
      }
      histY += 45;
    }
  }

  stroke(200); strokeWeight(1); line(boxX, boxY + boxH - 80, boxX + boxW, boxY + boxH - 80); noStroke();
  fill(100); textSize(18); textAlign(CENTER, CENTER); text(`${gameState.tutorialStep + 1} / 5`, width / 2, boxY + boxH - 40);

  let btnY = boxY + boxH - 60;
  if (gameState.tutorialStep > 0) {
    fill(150); rect(boxX + 30, btnY, 100, 40, 5); fill(255); text("이전", boxX + 80, btnY + 20);
  }
  
  fill(50, 150, 250); rect(boxX + boxW - 130, btnY, 100, 40, 5); fill(255);
  if (gameState.tutorialStep < 4) text("다음", boxX + boxW - 80, btnY + 20);
  else text("닫기", boxX + boxW - 80, btnY + 20);
}

function handleTutorialClick(mx, my) {
  let boxW = 680, boxH = 600;
  let boxX = width / 2 - boxW / 2, boxY = height / 2 - boxH / 2;
  
  let btnY = boxY + boxH - 60;
  let prevBtn = { x: boxX + 30, y: btnY, w: 100, h: 40 };
  let nextBtn = { x: boxX + boxW - 130, y: btnY, w: 100, h: 40 };

  if (gameState.tutorialStep > 0 && mx > prevBtn.x && mx < prevBtn.x + prevBtn.w && my > prevBtn.y && my < prevBtn.y + prevBtn.h) {
    gameState.tutorialStep--;
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
  }
  else if (mx > nextBtn.x && mx < nextBtn.x + nextBtn.w && my > nextBtn.y && my < nextBtn.y + nextBtn.h) {
    if (gameState.tutorialStep < 4) {
      gameState.tutorialStep++;
      if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
    } else {
      gameState.activeView = gameState.previousView || "title";
      gameState.previousView = null;
      if (typeof updateDOMVisibility === 'function') updateDOMVisibility();
    }
  }
}