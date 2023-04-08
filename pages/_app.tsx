import { Nav } from "@components/global";
import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Nav />
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
