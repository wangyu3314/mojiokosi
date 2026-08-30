import { useState } from "react";
import { uploadVideo, transcribeVideo } from "../lib/api";

export default function VideoUploader({ onReady }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | transcribing | error
  const [errorMessage, setErrorMessage] = useState("");

  async function handleStart() {
    if (!file) return;

    setStatus("uploading");
    setErrorMessage("");

    try {
      const { video_id } = await uploadVideo(file);

      setStatus("transcribing");
      const { segments } = await transcribeVideo(video_id);

      const previewUrl = URL.createObjectURL(file);
      onReady({ videoId: video_id, previewUrl, segments });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "処理に失敗しました");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
      <p style={{ margin: 0, fontSize: 14, color: "#6B6255" }}>
        動画ファイルをアップロードすると、自動で文字起こしを行います。
      </p>

      <input
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button onClick={handleStart} disabled={!file || status !== "idle"}>
        {status === "uploading" && "アップロード中..."}
        {status === "transcribing" && "文字起こし中...(少し時間がかかります)"}
        {(status === "idle" || status === "error") && "アップロードして文字起こしを開始"}
      </button>

      {status === "error" && (
        <p style={{ color: "#C23A5C", fontSize: 13, margin: 0 }}>{errorMessage}</p>
      )}
    </div>
  );
}
