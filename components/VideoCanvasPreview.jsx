import {
  CANVAS_W,
  CANVAS_H,
  ICON_SIZE,
  computeLayout,
  assignSlots,
  iconX,
  textXRange,
  slotRow,
  slotSide,
} from "../lib/layout";
import { fontFamilyFor } from "../lib/fonts";

const DISPLAY_W = 280;
const SCALE = DISPLAY_W / CANVAS_W;
const DISPLAY_H = CANVAS_H * SCALE;

function IconSlotView({ slot, speaker, top }) {
  const left = iconX(slot);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: ICON_SIZE,
        height: ICON_SIZE,
        borderRadius: 8,
        background: speaker ? speaker.color : "rgba(255,255,255,0.08)",
        border: speaker ? "none" : "1px dashed rgba(255,255,255,0.25)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {speaker?.icon?.type === "image" && (
        <img src={speaker.icon.value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {speaker?.icon?.type === "char" && <span style={{ fontSize: ICON_SIZE * 0.6 }}>{speaker.icon.value}</span>}
      {speaker && !speaker.icon && (
        <span style={{ fontSize: 40, color: "#fff", fontWeight: 700 }}>{speaker.name.slice(0, 1)}</span>
      )}
    </div>
  );
}

export default function VideoCanvasPreview({
  videoRef,
  previewUrl,
  onTimeUpdate,
  title,
  speakers,
  activeSegments,
  globalDefaultFont,
  globalFontSize,
  globalDefaultOutlineColor,
  globalDefaultOutlineEnabled,
}) {
  const layout = computeLayout(speakers.length);
  const slots = assignSlots(speakers);
  const overflowSpeakers = speakers.slice(6);

  // 同時に複数のセリフがアクティブな場合も、話者ごとに(スロットごとに)それぞれ表示する
  const activeBySlot = {};
  let overflowActiveText = null;

  for (const segment of activeSegments) {
    const speaker = speakers.find((s) => s.id === segment.speakerId);
    if (!speaker) continue;

    const slot = Object.entries(slots).find(([, sp]) => sp.id === speaker.id)?.[0];
    if (slot) {
      activeBySlot[slot] = { segment, speaker };
    } else if (overflowSpeakers.some((s) => s.id === speaker.id)) {
      // 7人目以降のエリアは1行だけなので、最初に見つかったものを表示する
      if (!overflowActiveText) overflowActiveText = `${speaker.name}: ${segment.text}`;
    }
  }

  return (
    <div
      style={{
        width: DISPLAY_W,
        height: DISPLAY_H,
        overflow: "hidden",
        position: "relative",
        background: "#1A1714",
        borderRadius: 8,
        flexShrink: 0,
      }}
    >
      <div style={{ width: CANVAS_W, height: CANVAS_H, position: "relative", transform: `scale(${SCALE})`, transformOrigin: "top left" }}>
        {/* タイトル */}
        <div
          style={{
            position: "absolute",
            top: layout.title.top,
            left: 40,
            right: 40,
            height: layout.title.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {title.text.split("\n").map((line, i) => (
            <div key={i} style={{ width: "100%" }}>
              <span
                style={{
                  fontFamily: fontFamilyFor(title.fontId),
                  color: title.color,
                  textShadow: title.outlineEnabled
                    ? `-3px -3px 0 ${title.outlineColor}, 3px -3px 0 ${title.outlineColor}, -3px 3px 0 ${title.outlineColor}, 3px 3px 0 ${title.outlineColor}`
                    : "none",
                  fontWeight: 800,
                  fontSize: title.fontSize,
                  lineHeight: 1.3,
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </div>

        {/* 7人目以降の発言エリア */}
        {layout.speakingArea && (
          <div
            style={{
              position: "absolute",
              top: layout.speakingArea.top,
              left: 40,
              right: 40,
              height: layout.speakingArea.height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: activeSpeaker?.color ?? "#fff",
              fontFamily: fontFamilyFor(activeSpeaker?.font ?? globalDefaultFont),
              fontSize: 26,
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {overflowActiveText}
          </div>
        )}

        {/* アイコン(上段・中段・下段) */}
        <IconSlotView slot="left-top" speaker={slots["left-top"]} top={layout.upperIcons.top} />
        <IconSlotView slot="right-top" speaker={slots["right-top"]} top={layout.upperIcons.top} />
        <IconSlotView slot="left-mid" speaker={slots["left-mid"]} top={layout.midIcons.top} />
        <IconSlotView slot="right-mid" speaker={slots["right-mid"]} top={layout.midIcons.top} />
        <IconSlotView slot="left-bottom" speaker={slots["left-bottom"]} top={layout.lowerIcons.top} />
        <IconSlotView slot="right-bottom" speaker={slots["right-bottom"]} top={layout.lowerIcons.top} />

        {/* 動画スペース */}
        <video
          ref={videoRef}
          src={previewUrl}
          controls
          onTimeUpdate={onTimeUpdate}
          style={{
            position: "absolute",
            top: layout.video.top,
            left: 0,
            width: layout.video.width,
            height: layout.video.height,
            background: "#000",
            objectFit: "contain",
          }}
        />

        {/* 現在アクティブな各話者のセリフ(同時に複数いれば、それぞれのスロットに表示) */}
        {Object.entries(activeBySlot).map(([slot, { segment, speaker }]) => (
          <SubtitleTextZone
            key={slot}
            slot={slot}
            top={
              slotRow(slot) === "upper"
                ? layout.upperIcons.top
                : slotRow(slot) === "mid"
                ? layout.midIcons.top
                : layout.lowerIcons.top
            }
            speaker={speaker}
            segment={segment}
            globalDefaultFont={globalDefaultFont}
            globalFontSize={globalFontSize}
            globalDefaultOutlineColor={globalDefaultOutlineColor}
            globalDefaultOutlineEnabled={globalDefaultOutlineEnabled}
          />
        ))}
      </div>
    </div>
  );
}

function SubtitleTextZone({
  slot,
  top,
  speaker,
  segment,
  globalDefaultFont,
  globalFontSize,
  globalDefaultOutlineColor,
  globalDefaultOutlineEnabled,
}) {
  const { left, right } = textXRange(slot);
  const fontId = segment.fontOverride ?? speaker?.font ?? globalDefaultFont;
  const color = segment.colorOverride ?? speaker?.color ?? "#FFFFFF";
  const fontSize = segment.fontSizeOverride ?? globalFontSize;
  const outlineColor = segment.outlineColorOverride ?? globalDefaultOutlineColor;
  const outlineEnabled = segment.outlineEnabledOverride ?? globalDefaultOutlineEnabled;
  const isLeft = slotSide(slot) === "left";

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: right - left,
        height: ICON_SIZE,
        display: "flex",
        alignItems: "center", // 高さは常に中央揃え
        justifyContent: isLeft ? "flex-start" : "flex-end",
        overflow: "visible", // はみ出しても切り取らない
      }}
    >
      <span
        style={{
          fontFamily: fontFamilyFor(fontId),
          color,
          textShadow: outlineEnabled
            ? `-2px -2px 0 ${outlineColor}, 2px -2px 0 ${outlineColor}, -2px 2px 0 ${outlineColor}, 2px 2px 0 ${outlineColor}`
            : "none",
          fontWeight: 800,
          fontSize,
          lineHeight: 1.3,
          whiteSpace: "pre", // 手動改行のみを反映し、自動折り返しはしない
          textAlign: isLeft ? "left" : "right",
        }}
      >
        {segment.text}
      </span>
    </div>
  );
}
