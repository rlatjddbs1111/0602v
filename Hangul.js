const FIRST_HANGUL = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const MIDDLE_HANGUL = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅜ','ㅝ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const FINAL_HANGUL = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

function splitHangulChar(ch) {
  let ch_code = ch.charCodeAt(0) - 44032;
  if (ch_code < 0 || ch_code > 11171) return null;
  let f_idx = Math.floor(ch_code / 588);
  let m_idx = Math.floor((ch_code % 588) / 28);
  let fn_idx = ch_code % 28;
  return { first: FIRST_HANGUL[f_idx], middle: MIDDLE_HANGUL[m_idx], final: FINAL_HANGUL[fn_idx] };
}

function splitHangulWord(word) {
  if (word.length !== 2) return null;
  return [splitHangulChar(word[0]), splitHangulChar(word[1])];
}

function compareHangulInput(word) {
  if (word.length !== 2) return false;
  for (let ch of word) { if (!(ch >= '가' && ch <= '힣')) return false; }
  return true;
}