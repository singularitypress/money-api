import { Nav } from "@components/global";
import "../styles/globals.scss";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Nav />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
