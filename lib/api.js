// バックエンド(FastAPI)のURL。開発中はローカルのuvicornを指す。
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/video/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("動画のアップロードに失敗しました");
  }

  return res.json(); // { video_id, filename }
}

export async function transcribeVideo(videoId) {
  const res = await fetch(`${API_BASE_URL}/video/${videoId}/transcribe`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("文字起こしに失敗しました");
  }

  return res.json(); // { video_id, segments }
}

export async function renderVideo(videoId, spec) {
  const res = await fetch(`${API_BASE_URL}/video/${videoId}/render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spec),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail || "動画の書き出しに失敗しました");
  }

  return res.json(); // { video_id, download_url }
}

export function downloadUrlFor(path) {
  return `${API_BASE_URL}${path}`;
}
