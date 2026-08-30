import { Html, Head, Main, NextScript } from "next/document";
import { GOOGLE_FONTS_URL } from "../lib/fonts";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
