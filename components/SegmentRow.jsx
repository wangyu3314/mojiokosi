import { FONT_OPTIONS, fontFamilyFor } from "../lib/fonts";
import IconPicker from "./IconPicker";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function parseTime(text) {
  const match = text.trim().match(/^(\d{1,2}):(\d{1,2})$/);
  if (!match) return null;
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  if (seconds >= 60) return null;
  return minutes * 60 + seconds;
}

// segment.iconOverride の解決: null/undefined=話者に従う、{type:"none"}=このセリフだけ無し、それ以外=個別指定
function resolveIcon(segmentOverride, speakerIcon) {
  if (segmentOverride == null) return speakerIcon ?? null;
  if (segmentOverride.type === "none") return null;
  return segmentOverride;
}

export default function SegmentRow({
  segment,
  speakers,
  isActive,
  globalDefaultFont,
  globalFontSize,
  globalDefaultOutlineColor,
  globalDefaultOutlineEnabled,
  onChangeText,
  onChangeSpeaker,
  onChangeStart,
  onChangeEnd,
  onChangeFontOverride,
  onChangeColorOverride,
  onChangeIconOverride,
  onChangeFontSizeOverride,
  onChangeOutlineColorOverride,
  onChangeOutlineEnabledOverride,
  onDelete,
}) {
  const speaker = speakers.find((s) => s.id === segment.speakerId);

  const effectiveFontId = segment.fontOverride ?? speaker?.font ?? globalDefaultFont;
  const effectiveColor = segment.colorOverride ?? speaker?.color ?? "#C9C2B8";
  const effectiveIcon = resolveIcon(segment.iconOverride, speaker?.icon);
  const effectiveFontSize = segment.fontSizeOverride ?? globalFontSize;
  const effectiveOutlineColor = segment.outlineColorOverride ?? globalDefaultOutlineColor;
  const effectiveOutlineEnabled = segment.outlineEnabledOverride ?? globalDefaultOutlineEnabled;

  function handleStartBlur(e) {
    const parsed = parseTime(e.target.value);
    if (parsed !== null && parsed < segment.end) {
      onChangeStart(segment.id, parsed);
    } else {
      e.target.value = formatTime(segment.start);
    }
  }

  function handleEndBlur(e) {
    const parsed = parseTime(e.target.value);
    if (parsed !== null && parsed > segment.start) {
      onChangeEnd(segment.id, parsed);
    } else {
      e.target.value = formatTime(segment.end);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "10px 12px",
        background: isActive ? "#F2EEE6" : "#FFFFFF",
        border: isActive ? "1px solid #C9C2B8" : "1px solid #F0EBE2",
        borderLeft: `3px solid ${effectiveColor}`,
        borderRadius: 8,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 6 }}>
        <input
          type="text"
          defaultValue={formatTime(segment.start)}
          onBlur={handleStartBlur}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          title="開始時刻(分:秒)"
          style={{ width: 40, fontSize: 12, color: "#8A8175", border: "none", background: "transparent", padding: 0 }}
        />
        <span style={{ fontSize: 12, color: "#C9C2B8" }}>〜</span>
        <input
          type="text"
          defaultValue={formatTime(segment.end)}
          onBlur={handleEndBlur}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          title="終了時刻(分:秒)"
          style={{ width: 40, fontSize: 12, color: "#8A8175", border: "none", background: "transparent", padding: 0 }}
        />
      </div>

      <IconPicker
        icon={effectiveIcon}
        onChange={(icon) => onChangeIconOverride(segment.id, icon)}
        fallbackColor={effectiveColor}
        mode="segment"
      />

      <textarea
        value={segment.text}
        onChange={(e) => onChangeText(segment.id, e.target.value)}
        rows={2}
        placeholder="聞き取れなかった場合はここに入力(Enterで改行できます)"
        style={{
          flex: 1,
          minWidth: 140,
          border: "1px solid transparent",
          background: "transparent",
          fontFamily: fontFamilyFor(effectiveFontId),
          color: effectiveColor,
          textShadow: effectiveOutlineEnabled
            ? `-1px -1px 0 ${effectiveOutlineColor}, 1px -1px 0 ${effectiveOutlineColor}, -1px 1px 0 ${effectiveOutlineColor}, 1px 1px 0 ${effectiveOutlineColor}`
            : "none",
          fontSize: 14,
          resize: "vertical",
          padding: 4,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <select value={segment.speakerId ?? ""} onChange={(e) => onChangeSpeaker(segment.id, e.target.value || null)}>
          <option value="">話者を選択</option>
          {speakers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={segment.fontOverride ?? ""}
          onChange={(e) => onChangeFontOverride(segment.id, e.target.value || null)}
          title="このセリフだけフォントを変える(空欄なら話者のフォントに従う)"
          style={{ fontSize: 12 }}
        >
          <option value="">話者と同じ</option>
          {FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
        <label title="このセリフだけ色を変える" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <input
            type="color"
            value={effectiveColor}
            onChange={(e) => onChangeColorOverride(segment.id, e.target.value)}
            style={{ width: 18, height: 18, padding: 0, border: "none" }}
          />
          {segment.colorOverride && (
            <button
              className="secondary"
              onClick={() => onChangeColorOverride(segment.id, null)}
              title="色の上書きを解除して話者の色に戻す"
              style={{ fontSize: 10, padding: "2px 4px" }}
            >
              戻す
            </button>
          )}
        </label>

        <input
          type="number"
          value={effectiveFontSize}
          onChange={(e) => onChangeFontSizeOverride(segment.id, Number(e.target.value) || null)}
          title="このセリフの文字サイズ(px)"
          style={{ width: 56, fontSize: 12, padding: "2px 4px" }}
        />

        <label title="このセリフだけ縁取り色を変える" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <input
            type="color"
            value={effectiveOutlineColor}
            onChange={(e) => onChangeOutlineColorOverride(segment.id, e.target.value)}
            disabled={!effectiveOutlineEnabled}
            style={{ width: 18, height: 18, padding: 0, border: "none" }}
          />
          <span
            onClick={() => onChangeOutlineEnabledOverride(segment.id, !effectiveOutlineEnabled)}
            style={{ fontSize: 10, cursor: "pointer", color: "#6B6255", userSelect: "none" }}
            title="縁取りのON/OFF"
          >
            縁取り{effectiveOutlineEnabled ? "あり" : "なし"}
          </span>
        </label>
      </div>

      <button className="secondary" onClick={() => onDelete(segment.id)} title="この行を削除" style={{ padding: "4px 8px", fontSize: 12 }}>
        削除
      </button>
    </div>
  );
}
