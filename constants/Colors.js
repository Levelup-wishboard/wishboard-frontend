// constants/Colors.js

export const BOARD_COLORS = {
  'Q&A': '#93FFC9',       // 초록
  '정보': '#93DEFF',      // 파랑
  '트로피': '#FFC107',    // 노랑
  '인원모집': '#FF9393',  // 분홍
  All: '#607D8B',         // 회색
};

// 도전 태그 색상 매핑
const TAG_COLORS = {
  '갖고싶다': '#FFFF93',
  '가보고싶다': '#CC93FF',
  '배우고싶다': '#FF9393',
  '해보고싶다': '#93DEFF',
  '되고싶다': '#93FFC9',
};

// ✅ 이 함수는 TAG_COLORS 아래에 있어야 합니다!
export function getTagColor(tag) {
  return TAG_COLORS[tag] || '#CCCCCC'; // 기본 회색
}

