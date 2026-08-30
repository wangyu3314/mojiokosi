import Head from "next/head";

const REQUIREMENTS = [
  { label: "Python 3.10以上", href: "https://www.python.org/downloads/" },
  { label: "Node.js 18以上", href: "https://nodejs.org/" },
  { label: "ffmpeg", href: "https://www.gyan.dev/ffmpeg/builds/" },
];

const SETUP_STEPS = [
  {
    title: "ダウンロードして解凍する",
    body: "下のボタンからZIPをダウンロードし、好きな場所に解凍します。",
  },
  {
    title: "必要なものを入れる",
    body: "Python・Node.js・ffmpegをまだ入れていなければ先にインストールしてください。フォントは backend/fonts/README.md の一覧を見ながら用意します。",
  },
  {
    title: "start.bat をダブルクリック",
    body: "初回だけ環境構築で数分かかります。2つの黒いウィンドウが起動し、自動でブラウザが開きます。",
  },
  {
    title: "そのまま使う",
    body: "2回目以降は start.bat を開くだけ。閉じるときは黒いウィンドウを2つとも閉じてください。",
  },
];

const USAGE_STEPS = [
  {
    title: "動画をアップロード",
    body: "編集画面で動画ファイルを選ぶと、自動で音声が文字起こしされます(サーバーに送らずローカルで処理されます)。",
  },
  {
    title: "セリフを確認・修正",
    body: "文字起こし結果が行ごとに表示されます。誤字は直接クリックして書き換えられ、聞き取れなかった箇所は「行を追加」で手動入力できます。",
  },
  {
    title: "話者を登録して割り当てる",
    body: "名前・色・アイコン(文字か画像)・フォントを話者ごとに登録し、各セリフの行でどの話者の発言かを選びます。",
  },
  {
    title: "タイトルを設定",
    body: "動画上部に表示する固定タイトルの文言・フォント・文字色・縁取りを設定します。",
  },
  {
    title: "動画を書き出す",
    body: "「動画を書き出す」を押すと、アイコン・字幕・タイトルを焼き込んだ完成動画がダウンロードできます。",
  },
];

const SPEAKER_COLORS = ["#1D9E75", "#D85A30", "#2F5FA8", "#B8791A", "#7A3FA0", "#C23A5C"];

export default function Download() {
  return (
    <>
      <Head>
        <title>配信字幕エディタ - ダウンロード</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="page">
        {/* --- Hero --- */}
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">ローカルで動く・無料</p>
            <h1>
              切り抜きの字幕を、
              <br />
              <span className="accent">喋ってる人の色</span>で。
            </h1>
            <p className="lead">
              配信のスクリーンレコードに、話者ごとに色分けしたアイコン付き字幕とタイトルを焼き込むツールです。
              サーバーは使わず、ダウンロードしたフォルダをそのまま自分のPCで動かします。
            </p>
            <a className="cta" href="/downloads/stream-subtitle-app.zip" download>
              ダウンロード(ZIP)
            </a>
            <p className="cta-note">Windows対応・要 Python / Node.js / ffmpeg</p>
          </div>

          <div className="mock" aria-hidden="true">
            <div className="mock-title">
              <span>いやいや</span>
              <span>ぼくじゃなくちゃ</span>
            </div>
            <div className="mock-row">
              {SPEAKER_COLORS.slice(0, 3).map((c) => (
                <span key={c} className="mock-icon" style={{ background: c }} />
              ))}
            </div>
            <div className="mock-video" />
            <div className="mock-row">
              {SPEAKER_COLORS.slice(3).map((c) => (
                <span key={c} className="mock-icon" style={{ background: c }} />
              ))}
            </div>
          </div>
        </section>

        {/* --- Why local --- */}
        <section className="band">
          <div className="band-item">
            <span className="dot" style={{ background: "#1D9E75" }} />
            サーバー費用がかからない
          </div>
          <div className="band-item">
            <span className="dot" style={{ background: "#2F5FA8" }} />
            動画は外に出ない
          </div>
          <div className="band-item">
            <span className="dot" style={{ background: "#D85A30" }} />
            自分の話者・フォントで自由に編集
          </div>
        </section>

        {/* --- Requirements --- */}
        <section className="section">
          <h2>先に用意するもの</h2>
          <ul className="req-list">
            {REQUIREMENTS.map((r) => (
              <li key={r.label}>
                <a href={r.href} target="_blank" rel="noreferrer">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* --- Steps --- */}
        <section className="section">
          <h2>はじめかた</h2>
          <ol className="steps">
            {SETUP_STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="step-num">{i + 1}</span>
                <div>
                  <p className="step-title">{s.title}</p>
                  <p className="step-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* --- Usage --- */}
        <section className="section">
          <h2>アプリの使い方</h2>
          <ol className="steps">
            {USAGE_STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="step-num">{i + 1}</span>
                <div>
                  <p className="step-title">{s.title}</p>
                  <p className="step-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section download-again">
          <a className="cta" href="/downloads/stream-subtitle-app.zip" download>
            ダウンロード(ZIP)
          </a>
        </section>

        <footer className="footer">配信字幕エディタ</footer>
      </main>

      <style jsx>{`
        .page {
          background: #14110f;
          color: #f2ece2;
          font-family: "Noto Sans JP", sans-serif;
          min-height: 100vh;
        }

        .hero {
          display: flex;
          flex-wrap: wrap;
          gap: 48px;
          align-items: center;
          justify-content: center;
          max-width: 1080px;
          margin: 0 auto;
          padding: 96px 24px 64px;
        }

        .hero-copy {
          flex: 1 1 380px;
          max-width: 480px;
        }

        .eyebrow {
          font-size: 13px;
          letter-spacing: 0.08em;
          color: #7a9e91;
          margin: 0 0 16px;
        }

        h1 {
          font-family: "Mochiy Pop One", sans-serif;
          font-weight: 400;
          font-size: clamp(32px, 5vw, 44px);
          line-height: 1.4;
          margin: 0 0 20px;
        }

        .accent {
          color: #4dd8e8;
          -webkit-text-stroke: 1px #14110f;
        }

        .lead {
          font-size: 15px;
          line-height: 1.9;
          color: #c9c0b3;
          margin: 0 0 32px;
        }

        .cta {
          display: inline-block;
          background: #4dd8e8;
          color: #14110f;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 32px;
          border-radius: 999px;
          text-decoration: none;
        }

        .cta:hover {
          background: #6ee2ef;
        }

        .cta-note {
          font-size: 12px;
          color: #7d7568;
          margin: 12px 0 0;
        }

        .mock {
          flex: 1 1 260px;
          max-width: 300px;
          aspect-ratio: 9 / 16;
          background: #1a1714;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.6);
        }

        .mock-title {
          text-align: center;
          font-family: "Mochiy Pop One", sans-serif;
          font-weight: 400;
        }

        .mock-title span {
          display: block;
          font-size: 18px;
          color: #4dd8e8;
          -webkit-text-stroke: 1.5px #fff;
          line-height: 1.4;
        }

        .mock-row {
          display: flex;
          justify-content: space-between;
        }

        .mock-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
        }

        .mock-video {
          flex: 1;
          margin: 12px 0;
          background: repeating-linear-gradient(
            135deg,
            #26221d,
            #26221d 8px,
            #1e1a16 8px,
            #1e1a16 16px
          );
          border-radius: 8px;
        }

        .band {
          border-top: 1px solid #26221d;
          border-bottom: 1px solid #26221d;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 32px;
          padding: 20px 24px;
          font-size: 13px;
          color: #c9c0b3;
        }

        .band-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .section {
          max-width: 640px;
          margin: 0 auto;
          padding: 64px 24px;
        }

        .section h2 {
          font-family: "Mochiy Pop One", sans-serif;
          font-weight: 400;
          font-size: 22px;
          margin: 0 0 28px;
        }

        .req-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .req-list a {
          color: #f2ece2;
          font-size: 15px;
          text-decoration: none;
          border-bottom: 1px solid #4dd8e8;
          padding-bottom: 2px;
        }

        .steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .steps li {
          display: flex;
          gap: 16px;
        }

        .step-num {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #26221d;
          color: #4dd8e8;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-title {
          margin: 0 0 4px;
          font-weight: 700;
          font-size: 15px;
        }

        .step-body {
          margin: 0;
          font-size: 13px;
          line-height: 1.8;
          color: #c9c0b3;
        }

        .download-again {
          text-align: center;
          padding-top: 0;
        }

        .footer {
          text-align: center;
          padding: 48px 24px 64px;
          font-size: 12px;
          color: #5c564c;
        }
      `}</style>
    </>
  );
}
