/**
 * @fileoverview Schema for the GraphQL server based on Transaction objects for express
 */

import { makeExecutableSchema } from "@graphql-tools/schema";
import { convert } from "./convert";
import { Transaction, TransactionResolver } from "@types";

/**
 * Transactions resolver that takes in args and returns a list of transactions,
 * the args include a date range, amount range, a list of institutions, a list of accounts
 * @param {object} parent
 * @param {object} args
 * @param {string} args.startDate
 * @param {string} args.endDate
 * @param {string} args.minAmt
 * @param {string} args.maxAmt
 * @param {string[]} args.institutions
 * @param {string[]} args.accounts
 * @param {string} args.info
 * @param {string[]} args.desc
 * @param {string[]} args.excludeString
 * @return {Promise<Transaction[]>}
 */
const typeDefs = /* GraphQL */ `
  type Transaction {
    date: String
    desc: String
    amt: Float
    institution: String
    account: String
    info: String
    debit: String
    credit: String
  }

  type Query {
    transactions(
      startDate: String
      endDate: String
      minAmt: String
      maxAmt: String
      institutions: [String]
      accounts: [String]
      info: String
      desc: [String]
      excludeString: [String]
    ): [Transaction]
  }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      transactions: async (
        parent,
        {
          startDate,
          endDate,
          minAmt,
          maxAmt,
          institutions,
          accounts,
          info,
          desc,
          excludeString,
        }: TransactionResolver
      ) => {
        const transactions: Transaction[] = await convert();
        const filtered = transactions.filter((transaction) => {
          const {
            date,
            amt,
            institution,
            account,
            info: transactionInfo,
            desc: transactionDesc,
          } = transaction;
          const dateInRange =
            startDate && endDate
              ? new Date(date) >= new Date(startDate) &&
                new Date(date) <= new Date(endDate)
              : true;
          const amtInRange =
            minAmt && maxAmt
              ? amt >= parseFloat(minAmt) && amt <= parseFloat(maxAmt)
              : true;
          const institutionInList = institutions
            ? institutions.includes(institution)
            : true;
          const accountInList = accounts ? accounts.includes(account) : true;
          const infoInList = info ? transactionInfo.includes(info) : true;
          const descInList = desc
            ? desc.some((descString) => transactionDesc.includes(descString))
            : true;
          const excludeStringInList = excludeString
            ? !excludeString.some((excludeString) =>
                transactionDesc.includes(excludeString)
              )
            : true;

          return (
            dateInRange &&
            amtInRange &&
            institutionInList &&
            accountInList &&
            infoInList &&
            descInList &&
            excludeStringInList
          );
        });
        return filtered;
      },
    },
  },
});
