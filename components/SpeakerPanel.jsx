import { useState } from "react";
import { colorForIndex } from "../lib/speakerColors";
import { FONT_OPTIONS } from "../lib/fonts";
import IconPicker from "./IconPicker";

export default function SpeakerPanel({
  speakers,
  onAddSpeaker,
  globalDefaultFont,
  onChangeGlobalDefaultFont,
  globalDefaultOutlineColor,
  onChangeGlobalDefaultOutlineColor,
  globalDefaultOutlineEnabled,
  onChangeGlobalDefaultOutlineEnabled,
  onChangeSpeakerColor,
  onChangeSpeakerFont,
  onChangeSpeakerIcon,
}) {
  const [newName, setNewName] = useState("");

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;

    const color = colorForIndex(speakers.length);
    // font: null は「全体のデフォルトフォントに合わせる」という意味
    onAddSpeaker({ id: crypto.randomUUID(), name, color, font: null, icon: null });
    setNewName("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#6B6255" }}>全体のデフォルトフォント</p>
        <select value={globalDefaultFont} onChange={(e) => onChangeGlobalDefaultFont(e.target.value)}>
          {FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <p style={{ margin: "4px 0 0", fontSize: 11, color: "#8A8175" }}>
          話者ごとに個別のフォントを設定していない場合、これが使われます。
        </p>
      </div>

      <div>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#6B6255" }}>字幕の縁取り(デフォルト)</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <input
              type="checkbox"
              checked={globalDefaultOutlineEnabled}
              onChange={(e) => onChangeGlobalDefaultOutlineEnabled(e.target.checked)}
            />
            縁取りあり
          </label>
          <input
            type="color"
            value={globalDefaultOutlineColor}
            onChange={(e) => onChangeGlobalDefaultOutlineColor(e.target.value)}
            disabled={!globalDefaultOutlineEnabled}
            style={{ width: 22, height: 22, padding: 0, border: "none" }}
          />
        </div>
      </div>

      <div>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#6B6255" }}>話者を登録(アイコン枠は先着6人まで)</p>

        {speakers.map((speaker, index) => (
          <div key={speaker.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <IconPicker
              icon={speaker.icon}
              onChange={(icon) => onChangeSpeakerIcon(speaker.id, icon)}
              fallbackColor={speaker.color}
              mode="speaker"
            />

            <label title="クリックして色を変更">
              <input
                type="color"
                value={speaker.color}
                onChange={(e) => onChangeSpeakerColor(speaker.id, e.target.value)}
                style={{ width: 18, height: 18, padding: 0, border: "none", borderRadius: "50%" }}
              />
            </label>

            <span style={{ fontSize: 14, minWidth: 60 }}>{speaker.name}</span>
            {index >= 6 && (
              <span style={{ fontSize: 10, color: "#B8791A" }}>7人目以降(アイコン枠なし)</span>
            )}

            <select
              value={speaker.font ?? ""}
              onChange={(e) => onChangeSpeakerFont(speaker.id, e.target.value || null)}
              style={{ marginLeft: "auto", fontSize: 12 }}
              title="この話者だけフォントを変える(空欄なら全体のデフォルトに従う)"
            >
              <option value="">デフォルトに従う</option>
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="text"
            placeholder="話者の名前"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            style={{ flex: 1 }}
          />
          <button className="secondary" onClick={handleAdd}>
            追加
          </button>
        </div>
      </div>
    </div>
  );
}
