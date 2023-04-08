import { Transaction } from "@types";

export const monthlyAmountPerYear = (transactions: Transaction[]) => {
  const monthlySpending: {
    [key: string]: {
      [key: string]: {
        amt: number;
        desc: string[];
      };
    };
  } = {};

  return transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (!acc[year]) {
      acc[year] = {};
    }

    if (!acc[year][month]) {
      acc[year][month] = {
        amt: 0,
        desc: [],
      };
    }

    acc[year][month].amt += transaction.amt;
    acc[year][month].desc.push(transaction.desc);

    return acc;
  }, monthlySpending);
};
