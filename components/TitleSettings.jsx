import { FONT_OPTIONS } from "../lib/fonts";

export default function TitleSettings({ title, onChangeTitle }) {
  function update(patch) {
    onChangeTitle({ ...title, ...patch });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ margin: 0, fontSize: 13, color: "#6B6255" }}>
        動画上部の固定タイトル(動画全体を通して表示されます)
      </p>

      <textarea
        value={title.text}
        onChange={(e) => update({ text: e.target.value })}
        placeholder={"タイトルを入力"}
        rows={3}
        style={{
          fontFamily: "inherit",
          fontSize: 14,
          padding: 8,
          border: "1px solid #E3DCD1",
          borderRadius: 6,
          resize: "vertical",
        }}
      />
      <p style={{ margin: 0, fontSize: 11, color: "#8A8175" }}>
        Enterキーで改行すると、その通りに複数行で表示されます。中央揃えは自動です。
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          フォント
          <select value={title.fontId} onChange={(e) => update({ fontId: e.target.value })}>
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          文字サイズ(px)
          <input
            type="number"
            value={title.fontSize}
            onChange={(e) => update({ fontSize: Number(e.target.value) || 48 })}
            style={{ width: 60 }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          文字色
          <input
            type="color"
            value={title.color}
            onChange={(e) => update({ color: e.target.value })}
            style={{ width: 22, height: 22, padding: 0, border: "none" }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, opacity: title.outlineEnabled ? 1 : 0.4 }}>
          縁取り色
          <input
            type="color"
            value={title.outlineColor}
            onChange={(e) => update({ outlineColor: e.target.value })}
            disabled={!title.outlineEnabled}
            style={{ width: 22, height: 22, padding: 0, border: "none" }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
          <input
            type="checkbox"
            checked={title.outlineEnabled}
            onChange={(e) => update({ outlineEnabled: e.target.checked })}
          />
          縁取りあり
        </label>
      </div>
    </div>
  );
}
