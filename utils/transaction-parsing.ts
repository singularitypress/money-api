import { Transaction } from "@types";

export const monthlySpendingPerYear = (transactions: Transaction[]) => {
  const monthlySpending: {
    [key: string]: {
      [key: string]: number;
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
      acc[year][month] = 0;
    }

    acc[year][month] += transaction.amt;

    return acc;
  }, monthlySpending);
};
