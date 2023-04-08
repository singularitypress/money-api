import { Transaction } from "@types";

export const monthlyAmountPerYear = (transactions: Transaction[]) => {
  const monthlySpending: {
    [key: string]: {
      [key: string]: {
        amt: number;
        transactions: Transaction[];
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
        transactions: [],
      };
    }

    acc[year][month].amt += transaction.amt;
    acc[year][month].transactions.push(transaction);

    return acc;
  }, monthlySpending);
};

export const spendingByPayee = (transactions: Transaction[]) => {
  const payeeSpending: {
    [key: string]: {
      amt: number;
      count: number;
    };
  } = {};

  return transactions.reduce((acc, transaction) => {
    if (!acc[transaction.desc]) {
      acc[transaction.desc] = {
        amt: 0,
        count: 0,
      };
    }

    acc[transaction.desc].amt += transaction.amt;
    acc[transaction.desc].count += 1;

    return acc;
  }, payeeSpending);
};
