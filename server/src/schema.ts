/**
 * @fileoverview Schema for the GraphQL server based on Transaction objects for express
 */

import { makeExecutableSchema } from "@graphql-tools/schema";
import { CPIResponse, Transaction, TransactionResolver } from "@types";

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

  type CPIMonth {
    d: String
    STATIC_TOTALCPICHANGE: Float
    CPI_MEDIAN: Float
    CPI_TRIM: Float
    STATIC_CPIXFET: Float
    CPI_COMMON: Float
    CPIW: Float
    V41690973: Float
    V41690914: Float
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

    cpi(startDate: String, endDate: String): [CPIMonth]
  }
`;

export const schema = (transactions: Transaction[], cpi?: CPIResponse) =>
  makeExecutableSchema({
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
          }: TransactionResolver,
        ) => {
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
                  transactionDesc.includes(excludeString),
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
        cpi: async (parent, { startDate, endDate }) => {
          if (!cpi) {
            return [];
          }
          const filtered = cpi.observations.filter((month) => {
            const dateInRange =
              startDate && endDate
                ? new Date(month.d) >= new Date(startDate) &&
                  new Date(month.d) <= new Date(endDate)
                : true;
            return dateInRange;
          });
          return filtered.map((month) => ({
            ...month,
            CPI_COMMON: parseFloat(month.CPI_COMMON.v),
            CPI_MEDIAN: parseFloat(month.CPI_MEDIAN.v),
            CPI_TRIM: parseFloat(month.CPI_TRIM.v),
            CPIW: parseFloat(month.CPIW.v),
            STATIC_CPIXFET: parseFloat(month.STATIC_CPIXFET.v),
            STATIC_TOTALCPICHANGE: parseFloat(month.STATIC_TOTALCPICHANGE.v),
            V41690914: parseFloat(month.V41690914.v),
            V41690973: parseFloat(month.V41690973.v),
          }));
        },
      },
    },
  });
