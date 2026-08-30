import { useRef, useState } from "react";

// mode: "speaker" (恒常設定。削除すると単純にアイコン無し=色に戻る)
//       "segment" (このセリフだけの上書き。話者のアイコンに戻す/このセリフだけ無しにする、の2択がある)
// icon: null | { type: "char", value: string } | { type: "image", value: dataURL }
export default function IconPicker({ icon, onChange, fallbackColor = "#C9C2B8", size = 22, mode = "speaker" }) {
  const [open, setOpen] = useState(false);
  const [charInput, setCharInput] = useState("");
  const fileInputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ type: "image", value: reader.result });
      setOpen(false);
    };
    reader.readAsDataURL(file);
  }

  function handleApplyChar() {
    const value = charInput.trim();
    if (!value) return;
    onChange({ type: "char", value: [...value][0] }); // サロゲートペアも1文字として扱う
    setCharInput("");
    setOpen(false);
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="アイコンを設定"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "none",
          padding: 0,
          background: icon?.type === "image" ? "transparent" : icon?.type === "char" ? "#F0EBE2" : fallbackColor,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon?.type === "image" && (
          <img src={icon.value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {icon?.type === "char" && <span style={{ fontSize: size * 0.6 }}>{icon.value}</span>}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: size + 4,
            left: 0,
            zIndex: 10,
            background: "#FFFFFF",
            border: "1px solid #E3DCD1",
            borderRadius: 8,
            padding: 10,
            width: 200,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
          }}
        >
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "#8A8175" }}>文字を1つ入力(絵文字も可)</p>
            <div style={{ display: "flex", gap: 4 }}>
              <input
                type="text"
                value={charInput}
                onChange={(e) => setCharInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyChar()}
                style={{ width: 60, fontSize: 14 }}
              />
              <button type="button" className="secondary" onClick={handleApplyChar} style={{ fontSize: 11 }}>
                決定
              </button>
            </div>
          </div>

          <div>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "#8A8175" }}>画像をアップロード</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ fontSize: 11 }} />
          </div>

          {mode === "speaker" && icon && (
            <button
              type="button"
              className="secondary"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              style={{ fontSize: 11 }}
            >
              アイコンを削除(色に戻す)
            </button>
          )}

          {mode === "segment" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                style={{ fontSize: 11 }}
              >
                話者のアイコンに戻す
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  onChange({ type: "none" });
                  setOpen(false);
                }}
                style={{ fontSize: 11 }}
              >
                このセリフだけアイコンなしにする
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
