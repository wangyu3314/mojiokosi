// 字幕・タイトルに使えるフォントの選択肢(すべてGoogle Fonts)。
// family はそのままCSSのfont-familyに使う正式名称。
export const FONT_OPTIONS = [
  { id: "mplus-u", label: "M PLUS U(デフォルト)", family: "'M PLUS U', sans-serif" },
  { id: "noto-serif-jp", label: "Noto Serif JP", family: "'Noto Serif JP', serif" },
  { id: "dela-gothic-one", label: "Dela Gothic One", family: "'Dela Gothic One', sans-serif" },
  { id: "kaisei-decol", label: "Kaisei Decol", family: "'Kaisei Decol', serif" },
  { id: "hachi-maru-pop", label: "Hachi Maru Pop", family: "'Hachi Maru Pop', cursive" },
  { id: "mochiy-pop-one", label: "Mochiy Pop One", family: "'Mochiy Pop One', sans-serif" },
  { id: "yusei-magic", label: "Yusei Magic", family: "'Yusei Magic', sans-serif" },
  { id: "dotgothic16", label: "DotGothic16", family: "'DotGothic16', sans-serif" },
  { id: "zen-kurenaido", label: "Zen Kurenaido", family: "'Zen Kurenaido', sans-serif" },
  { id: "reggae-one", label: "Reggae One", family: "'Reggae One', cursive" },
  { id: "yuji-syuku", label: "Yuji Syuku", family: "'Yuji Syuku', serif" },
  { id: "wdxl-lubrifont-jp-n", label: "WDXL Lubrifont JP N", family: "'WDXL Lubrifont JP N', sans-serif" },
  { id: "stick", label: "Stick", family: "'Stick', sans-serif" },
  { id: "shippori-antique-b1", label: "Shippori Antique B1", family: "'Shippori Antique B1', sans-serif" },
  { id: "new-tegomin", label: "New Tegomin", family: "'New Tegomin', serif" },
  { id: "zen-antique-soft", label: "Zen Antique Soft", family: "'Zen Antique Soft', serif" },
];

export const DEFAULT_FONT_ID = "mplus-u";

export function fontFamilyFor(fontId) {
  const found = FONT_OPTIONS.find((f) => f.id === fontId);
  return (found ?? FONT_OPTIONS[0]).family;
}

// Google FontsのCSS2 APIから、上記すべてのフォントを一括で読み込むURL
const GOOGLE_FONT_NAMES = [
  "M+PLUS+U",
  "Noto+Serif+JP",
  "Dela+Gothic+One",
  "Kaisei+Decol",
  "Hachi+Maru+Pop",
  "Mochiy+Pop+One",
  "Yusei+Magic",
  "DotGothic16",
  "Zen+Kurenaido",
  "Reggae+One",
  "Yuji+Syuku",
  "WDXL+Lubrifont+JP+N",
  "Stick",
  "Shippori+Antique+B1",
  "New+Tegomin",
  "Zen+Antique+Soft",
];

export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?" +
  GOOGLE_FONT_NAMES.map((name) => `family=${name}`).join("&") +
  "&display=swap";
