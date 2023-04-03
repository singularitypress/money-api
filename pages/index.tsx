import { Transaction } from "@types";
import axios from "axios";

export default function Home({ data }: { data: Transaction[] }) {
  return (
    <>
      <h1>Home</h1>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </>
  );
}

// getStaticProps that fetches data from the GraphQL API from API_URL in .env
export async function getStaticProps() {
  const {
    data: {
      data: { transactions },
    },
  } = await axios.post(`${process.env.API_URL}/graphql`, {
    query: /* GraphQL */ `
      query {
        transactions(
          maxAmt: "0.00"
          minAmt: "-1000000.00"
          excludeString: [
            "Customer Transfer Dr."
            "Bill Payment"
            "WITHDRAWAL"
            "Cheque"
            "TFR-TO"
            "ATM W/D"
            "PCMAST"
            "ETFR"
            "TDATM"
            "SENDE-TFR"
            "CASHWITHDRA"
            "CADDRAFT"
          ]
        ) {
          amt
          desc
          date
          institution
          account
        }
      }
    `,
  });

  return {
    props: {
      data: (transactions as Transaction[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    },
  };
}
