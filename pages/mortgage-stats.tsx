import { Container } from "@components/ui";
import Head from "next/head";

export default function MortgageStats({}) {
  return (
    <>
      <Head>
        <title>Mortgage Stats</title>
      </Head>
      <Container>
        <h1 className="text-3xl font-bold">Mortgage Stats</h1>
      </Container>
    </>
  );
}
