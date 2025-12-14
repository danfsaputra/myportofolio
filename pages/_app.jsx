// pages/_app.jsx
import "../styles/App.css";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Dani DEV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Website & Data" />
        <meta name="keywords" content="Website & Data" />
        <meta name="robots" content="index, follow" />

        <link rel="icon" href="/danidev.png" type="image/jpg" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
