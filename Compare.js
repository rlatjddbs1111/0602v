// 파일명: Compare.js

const HINT_CONFIG = {
  jinri:    { name: "진리", icon: "✨" }, 
  baekma:   { name: "백마", icon: "🐴" },
  soongsil: { name: "숭실", icon: "🏫" },
  shung:    { name: "슝슝", icon: "🔄" }, 
  bongsa:   { name: "봉사", icon: "🤝" },
  tulip:    { name: "목튤립", icon: "🥀" }
};

function guessWordAction() {
  let val = inputField.value().trim();
  
  if (val.length !== 2) {
    showInGamePopup("정확히 2글자를 입력해주세요!");
    inputField.value("");
    return;
  }
  
  for (let ch of val) {
    if (!(ch >= '가' && ch <= '힣')) {
      showInGamePopup("올바른 완성형 한글을 입력해주세요!\n(자음/모음 낱자는 입력할 수 없습니다.)");
      inputField.value("");
      return;
    }
  }

  let hint_types = calculateHints(val, currentAnswer);
  if (hint_types) {
    applyGuessResult(val, hint_types);
  }
}

function calculateHints(guess, answer) {
  let guess_parsed = splitHangulWord(guess);
  let answer_parsed = splitHangulWord(answer);

  if (!guess_parsed || !answer_parsed) return null;

  let hint_types = [];

  for (let i = 0; i < 2; i++) {
    if (guess[i] === answer[i]) {
      hint_types.push("jinri");
      continue;
    }

    let gc = guess_parsed[i];
    let ac = answer_parsed[i];
    let other_ac = answer_parsed[1 - i]; 

    let cnt = 0;
    let cnt_other = 0;

    if (gc.first && gc.first === ac.first) cnt++;
    if (gc.middle && gc.middle === ac.middle) cnt++;
    if (gc.final && gc.final === ac.final) cnt++;

    let other_ac_arr = [other_ac.first, other_ac.middle, other_ac.final];
    if (gc.first && other_ac_arr.includes(gc.first)) cnt_other++;
    if (gc.middle && other_ac_arr.includes(gc.middle)) cnt_other++;
    if (gc.final && other_ac_arr.includes(gc.final)) cnt_other++;
    
    if (gc.first == ac.first && cnt >= 2) hint_types.push("baekma");
    else if (gc.first != ac.first && cnt >= 2) hint_types.push("soongsil");
    else if (cnt >= 1) hint_types.push("bongsa");      
    else if (cnt_other >= 1) hint_types.push("shung"); 
    else hint_types.push("tulip");
  }
  
  return hint_types;
}

function applyGuessResult(guess, hint_types) {
  if (hint_types[0] === "jinri" && hint_types[1] === "jinri") {
    gameState.gameWon = true;
    gameState.activeView = "gameWin";
    gameState.winStreak += 1;
    gameState.history.push({ guess: guess, hint: ["jinri", "jinri"] });
    
    if (typeof updateDOMVisibility === 'function') updateDOMVisibility(); 
    saveGameProgress(); 
    return;
  }

  let final_hint_icons = [];
  for (let type of hint_types) {
    if (type === "jinri") {
      final_hint_icons.push("jinri");
    } else {
      if (gameState.inventory[type] > 0) {
        gameState.inventory[type] -= 1;
        final_hint_icons.push(type); 
      } 
      else if ((type === "baekma" || type === "soongsil") && gameState.inventory["bongsa"] > 0) {
        gameState.inventory["bongsa"] -= 1;
        final_hint_icons.push("bongsa"); 
      }
      else {
        final_hint_icons.push("?");
      }
    }
  }

  gameState.turns -= 1;
  gameState.history.push({ guess: guess, hint: final_hint_icons });
  
  if (inputField) inputField.value("");
  if (typeof checkGameOverCondition === 'function') checkGameOverCondition();
  saveGameProgress(); 
}

// 💡 무제한 연습 모드 처리 함수
function tutorialGuessAction() {
  if (!tutorialInput) return;
  let val = tutorialInput.value().trim();

  if (val.length !== 2) {
    showInGamePopup("정확히 2글자를 입력해주세요!");
    tutorialInput.value("");
    return;
  }

  for (let ch of val) {
    if (!(ch >= '가' && ch <= '힣')) {
      showInGamePopup("올바른 완성형 한글을 입력해주세요!");
      tutorialInput.value("");
      return;
    }
  }

  // 무조건 정답을 '진리'로 고정하여 테스트
  let hint_types = calculateHints(val, "진리");
  
  if (hint_types) {
    let final_hint_icons = [];
    for (let type of hint_types) {
      if (type === "jinri") final_hint_icons.push("jinri");
      else final_hint_icons.push(type); 
    }
    gameState.tutorialHistory.push({ guess: val, hint: final_hint_icons });
  }

  tutorialInput.value("");
}