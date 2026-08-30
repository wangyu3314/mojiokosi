// 話者を追加するたびに、この配列から順番に色を割り当てる。
// あとから話者ごと・セリフごとに自由に変更できる(これは初期値)。
export const SPEAKER_COLORS = [
  "#1D9E75", // ティール
  "#D85A30", // コーラル
  "#2F5FA8", // ブルー
  "#B8791A", // マスタード
  "#7A3FA0", // パープル
  "#C23A5C", // ピンク
];

export function colorForIndex(index) {
  return SPEAKER_COLORS[index % SPEAKER_COLORS.length];
}
