import { useRef, useState } from "react";
import VideoUploader from "../components/VideoUploader";
import SpeakerPanel from "../components/SpeakerPanel";
import TranscriptEditor from "../components/TranscriptEditor";
import TitleSettings from "../components/TitleSettings";
import VideoCanvasPreview from "../components/VideoCanvasPreview";
import { DEFAULT_FONT_ID } from "../lib/fonts";
import { renderVideo, downloadUrlFor } from "../lib/api";

const DEFAULT_FONT_SIZE = 32;

export default function Home() {
  const [videoId, setVideoId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [segments, setSegments] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [globalDefaultFont, setGlobalDefaultFont] = useState(DEFAULT_FONT_ID);
  const [globalFontSize, setGlobalFontSize] = useState(DEFAULT_FONT_SIZE);
  const [globalDefaultOutlineColor, setGlobalDefaultOutlineColor] = useState("#000000");
  const [globalDefaultOutlineEnabled, setGlobalDefaultOutlineEnabled] = useState(true);
  const [title, setTitle] = useState({
    text: "",
    fontId: DEFAULT_FONT_ID,
    fontSize: 48,
    color: "#4DD8E8",
    outlineColor: "#FFFFFF",
    outlineEnabled: true,
  });
  const videoRef = useRef(null);
  const [renderState, setRenderState] = useState("idle"); // idle | rendering | done | error
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [renderError, setRenderError] = useState("");

  function handleReady({ videoId, previewUrl, segments }) {
    setVideoId(videoId);
    setPreviewUrl(previewUrl);
    setSegments(
      segments.map((s) => ({
        ...s,
        speakerId: null,
        fontOverride: null,
        colorOverride: null,
        iconOverride: null,
        fontSizeOverride: null,
        outlineColorOverride: null,
        outlineEnabledOverride: null,
      }))
    );
  }

  function handleAddSpeaker(speaker) {
    setSpeakers((prev) => [...prev, speaker]);
  }

  function handleChangeSpeakerColor(speakerId, color) {
    setSpeakers((prev) => prev.map((s) => (s.id === speakerId ? { ...s, color } : s)));
  }

  function handleChangeSpeakerFont(speakerId, fontId) {
    setSpeakers((prev) => prev.map((s) => (s.id === speakerId ? { ...s, font: fontId } : s)));
  }

  function handleChangeSpeakerIcon(speakerId, icon) {
    setSpeakers((prev) => prev.map((s) => (s.id === speakerId ? { ...s, icon } : s)));
  }

  function handleChangeText(segmentId, text) {
    setSegments((prev) => prev.map((s) => (s.id === segmentId ? { ...s, text } : s)));
  }

  function handleChangeSpeaker(segmentId, speakerId) {
    setSegments((prev) => prev.map((s) => (s.id === segmentId ? { ...s, speakerId } : s)));
  }

  function handleChangeStart(segmentId, newStart) {
    setSegments((prev) =>
      prev.map((s) => (s.id === segmentId ? { ...s, start: newStart } : s)).sort((a, b) => a.start - b.start)
    );
  }

  function handleChangeEnd(segmentId, newEnd) {
    setSegments((prev) => prev.map((s) => (s.id === segmentId ? { ...s, end: newEnd } : s)));
  }

  function handleChangeFontOverride(segmentId, fontId) {
    setSegments((prev) => prev.map((s) => (s.id === segmentId ? { ...s, fontOverride: fontId } : s)));
  }

  function handleChangeColorOverride(segmentId, color) {
    setSegments((prev) => prev.map((s) => (s.id === segmentId ? { ...s, colorOverride: color } : s)));
  }

  function handleChangeIconOverride(segmentId, icon) {
    setSegments((prev) => prev.map((s) => (s.id === segmentId ? { ...s, iconOverride: icon } : s)));
  }

  function handleChangeFontSizeOverride(segmentId, size) {
    setSegments((prev) => prev.map((s) => (s.id === segmentId ? { ...s, fontSizeOverride: size } : s)));
  }

  function handleChangeOutlineColorOverride(segmentId, color) {
    setSegments((prev) => prev.map((s) => (s.id === segmentId ? { ...s, outlineColorOverride: color } : s)));
  }

  function handleChangeOutlineEnabledOverride(segmentId, enabled) {
    setSegments((prev) => prev.map((s) => (s.id === segmentId ? { ...s, outlineEnabledOverride: enabled } : s)));
  }

  function handleDeleteSegment(segmentId) {
    setSegments((prev) => prev.filter((s) => s.id !== segmentId));
  }

  function handleAddSegment() {
    const start = videoRef.current ? videoRef.current.currentTime : currentTime;
    setSegments((prev) =>
      [
        ...prev,
        {
          id: crypto.randomUUID(),
          start,
          end: start + 2,
          text: "",
          speakerId: null,
          fontOverride: null,
          colorOverride: null,
          iconOverride: null,
          fontSizeOverride: null,
          outlineColorOverride: null,
          outlineEnabledOverride: null,
        },
      ].sort((a, b) => a.start - b.start)
    );
  }

  const hasTranscript = segments.length > 0 || videoId !== null;
  const activeSegments = segments.filter((s) => currentTime >= s.start && currentTime < s.end);

  async function handleExport() {
    setRenderState("rendering");
    setRenderError("");
    try {
      const spec = {
        title,
        globalDefaultFont,
        globalFontSize,
        globalDefaultOutlineColor,
        globalDefaultOutlineEnabled,
        speakers,
        segments,
      };
      const { download_url } = await renderVideo(videoId, spec);
      setDownloadUrl(downloadUrlFor(download_url));
      setRenderState("done");
    } catch (err) {
      setRenderState("error");
      setRenderError(err.message || "書き出しに失敗しました");
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>配信字幕エディタ</h1>
      <p style={{ fontSize: 13, color: "#6B6255", marginTop: 0, marginBottom: 24 }}>
        動画をアップロードして、話者ごとに色分けした字幕を作成します。
      </p>

      {!hasTranscript && <VideoUploader onReady={handleReady} />}

      {hasTranscript && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <VideoCanvasPreview
              videoRef={videoRef}
              previewUrl={previewUrl}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              title={title}
              speakers={speakers}
              activeSegments={activeSegments}
              globalDefaultFont={globalDefaultFont}
              globalFontSize={globalFontSize}
              globalDefaultOutlineColor={globalDefaultOutlineColor}
              globalDefaultOutlineEnabled={globalDefaultOutlineEnabled}
            />

            <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 20 }}>
              <SpeakerPanel
                speakers={speakers}
                onAddSpeaker={handleAddSpeaker}
                globalDefaultFont={globalDefaultFont}
                onChangeGlobalDefaultFont={setGlobalDefaultFont}
                globalDefaultOutlineColor={globalDefaultOutlineColor}
                onChangeGlobalDefaultOutlineColor={setGlobalDefaultOutlineColor}
                globalDefaultOutlineEnabled={globalDefaultOutlineEnabled}
                onChangeGlobalDefaultOutlineEnabled={setGlobalDefaultOutlineEnabled}
                onChangeSpeakerColor={handleChangeSpeakerColor}
                onChangeSpeakerFont={handleChangeSpeakerFont}
                onChangeSpeakerIcon={handleChangeSpeakerIcon}
              />

              <TitleSettings title={title} onChangeTitle={setTitle} />
            </div>
          </div>

          <TranscriptEditor
            segments={segments}
            speakers={speakers}
            currentTime={currentTime}
            globalDefaultFont={globalDefaultFont}
            globalFontSize={globalFontSize}
            globalDefaultOutlineColor={globalDefaultOutlineColor}
            globalDefaultOutlineEnabled={globalDefaultOutlineEnabled}
            onChangeGlobalFontSize={setGlobalFontSize}
            onChangeText={handleChangeText}
            onChangeSpeaker={handleChangeSpeaker}
            onChangeStart={handleChangeStart}
            onChangeEnd={handleChangeEnd}
            onChangeFontOverride={handleChangeFontOverride}
            onChangeColorOverride={handleChangeColorOverride}
            onChangeIconOverride={handleChangeIconOverride}
            onChangeFontSizeOverride={handleChangeFontSizeOverride}
            onChangeOutlineColorOverride={handleChangeOutlineColorOverride}
            onChangeOutlineEnabledOverride={handleChangeOutlineEnabledOverride}
            onDeleteSegment={handleDeleteSegment}
            onAddSegment={handleAddSegment}
          />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <button onClick={handleExport} disabled={renderState === "rendering"}>
              {renderState === "rendering" ? "動画を書き出し中...(少し時間がかかります)" : "動画を書き出す"}
            </button>

            {renderState === "error" && (
              <p style={{ color: "#C23A5C", fontSize: 13, margin: 0 }}>{renderError}</p>
            )}

            {renderState === "done" && downloadUrl && (
              <a href={downloadUrl} download style={{ fontSize: 14 }}>
                完成した動画をダウンロード
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
