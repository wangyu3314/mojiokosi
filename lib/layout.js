// 完成動画のキャンバスサイズと、各要素の配置を一元管理する。
// バックエンド(Python)側にも同じ数値を移植して使う。

export const CANVAS_W = 1080;
export const CANVAS_H = 1920;

export const ICON_SIZE = 200;
export const GAP_ICON_VIDEO = 20; // アイコン<->動画スペースの間隔
export const GAP_ROW = 45; // タイトル<->上段アイコン、中段<->下段アイコンの間隔
export const GAP_ICON_TEXT = 20; // アイコンの端から1文字目までの間隔

export const TOP_MARGIN = 40;
export const BOTTOM_MARGIN = 40;
export const TITLE_AREA_HEIGHT = 220;

export const SEVEN_PLUS_GAP = 30; // 7人目以降の発言を表示するエリアの高さ

export const ICON_EDGE_MARGIN = 20; // 左右アイコンと画面端との間隔

// 元動画(1920x1080)を、切れない最大サイズで幅1080に収めた時の高さ
export const VIDEO_W = CANVAS_W;
export const VIDEO_H = Math.round(CANVAS_W * (1080 / 1920)); // 608

// 話者が7人以上いる時だけ、タイトルの下にこの高さの帯が追加される
export function extraTopGap(speakerCount) {
  return speakerCount >= 7 ? SEVEN_PLUS_GAP : 0;
}

// 各セクションのY座標(上端)を計算する
export function computeLayout(speakerCount) {
  const extra = extraTopGap(speakerCount);

  const titleTop = TOP_MARGIN;
  const titleBottom = titleTop + TITLE_AREA_HEIGHT;

  const speakingAreaTop = titleBottom;
  const speakingAreaBottom = speakingAreaTop + extra;

  const upperIconsTop = speakingAreaBottom + GAP_ROW;
  const upperIconsBottom = upperIconsTop + ICON_SIZE;

  const videoTop = upperIconsBottom + GAP_ICON_VIDEO;
  const videoBottom = videoTop + VIDEO_H;

  const midIconsTop = videoBottom + GAP_ICON_VIDEO;
  const midIconsBottom = midIconsTop + ICON_SIZE;

  const lowerIconsTop = midIconsBottom + GAP_ROW;
  const lowerIconsBottom = lowerIconsTop + ICON_SIZE;

  return {
    title: { top: titleTop, height: TITLE_AREA_HEIGHT },
    speakingArea: extra > 0 ? { top: speakingAreaTop, height: extra } : null,
    upperIcons: { top: upperIconsTop, height: ICON_SIZE },
    video: { top: videoTop, width: VIDEO_W, height: VIDEO_H },
    midIcons: { top: midIconsTop, height: ICON_SIZE },
    lowerIcons: { top: lowerIconsTop, height: ICON_SIZE },
    canvasHeightUsed: lowerIconsBottom + BOTTOM_MARGIN,
  };
}

// 6つの枠の名前と、話者が少ない時に埋めていく優先順位
export const ICON_SLOTS = ["left-top", "left-mid", "right-top", "right-mid", "left-bottom", "right-bottom"];
// 優先順位: ①左上 ②左中 ③右上 ④右中 ⑤左下 ⑥右下
export const ICON_SLOT_PRIORITY = ["left-top", "left-mid", "right-top", "right-mid", "left-bottom", "right-bottom"];

// 話者配列(登録順)に対して、優先順位通りに枠を割り当てる
export function assignSlots(speakers) {
  const map = {};
  speakers.slice(0, 6).forEach((speaker, i) => {
    map[ICON_SLOT_PRIORITY[i]] = speaker;
  });
  return map;
}

export function slotSide(slot) {
  return slot.startsWith("left") ? "left" : "right";
}

export function slotRow(slot) {
  if (slot.endsWith("top")) return "upper";
  if (slot.endsWith("mid")) return "mid";
  return "lower";
}

// 枠(スロット)ごとのX座標(アイコン用)
export function iconX(slot) {
  return slotSide(slot) === "left" ? ICON_EDGE_MARGIN : CANVAS_W - ICON_EDGE_MARGIN - ICON_SIZE;
}

// 枠(スロット)ごとの文字スペースのX範囲
export function textXRange(slot) {
  const half = CANVAS_W / 2;
  if (slotSide(slot) === "left") {
    return { left: ICON_EDGE_MARGIN + ICON_SIZE + GAP_ICON_TEXT, right: half };
  }
  return { left: half, right: CANVAS_W - ICON_EDGE_MARGIN - ICON_SIZE - GAP_ICON_TEXT };
}
