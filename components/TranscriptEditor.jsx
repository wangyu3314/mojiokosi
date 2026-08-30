import SegmentRow from "./SegmentRow";

export default function TranscriptEditor({
  segments,
  speakers,
  currentTime,
  globalDefaultFont,
  globalFontSize,
  globalDefaultOutlineColor,
  globalDefaultOutlineEnabled,
  onChangeGlobalFontSize,
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
  onDeleteSegment,
  onAddSegment,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#6B6255" }}>字幕を編集</p>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
            全体の文字サイズ(px)
            <input
              type="number"
              value={globalFontSize}
              onChange={(e) => onChangeGlobalFontSize(Number(e.target.value) || 32)}
              style={{ width: 56, fontSize: 12, padding: "2px 4px" }}
            />
          </label>
          <button className="secondary" onClick={onAddSegment} style={{ fontSize: 12, padding: "4px 10px" }}>
            + 今の再生位置に行を追加
          </button>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 12, color: "#8A8175" }}>
        テキスト欄でEnterキーを押すと改行できます。動画上の文字スペースは自動で折り返し・切り取りされないので、
        はみ出さないよう手動で改行してください。フォント・色・アイコン・文字サイズ・縁取りは
        全体のデフォルト → 話者ごとの設定 → セリフごとの設定 の順で上書きされます。
      </p>

      {segments.map((segment) => {
        const isActive = currentTime >= segment.start && currentTime < segment.end;
        return (
          <SegmentRow
            key={segment.id}
            segment={segment}
            speakers={speakers}
            isActive={isActive}
            globalDefaultFont={globalDefaultFont}
            globalFontSize={globalFontSize}
            globalDefaultOutlineColor={globalDefaultOutlineColor}
            globalDefaultOutlineEnabled={globalDefaultOutlineEnabled}
            onChangeText={onChangeText}
            onChangeSpeaker={onChangeSpeaker}
            onChangeStart={onChangeStart}
            onChangeEnd={onChangeEnd}
            onChangeFontOverride={onChangeFontOverride}
            onChangeColorOverride={onChangeColorOverride}
            onChangeIconOverride={onChangeIconOverride}
            onChangeFontSizeOverride={onChangeFontSizeOverride}
            onChangeOutlineColorOverride={onChangeOutlineColorOverride}
            onChangeOutlineEnabledOverride={onChangeOutlineEnabledOverride}
            onDelete={onDeleteSegment}
          />
        );
      })}
    </div>
  );
}
