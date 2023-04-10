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

    // if the previous year doesn't exist, create it. Check if the previous year is greater than the first year
    if (year - 1 > Number(Object.keys(acc)[0]) && !acc[year - 1]) {
      acc[year - 1] = {};
    }

    if (month - 1 > 0 && !acc[year][month - 1]) {
      acc[year][month - 1] = {
        amt: 0,
        transactions: [],
      };
    }

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
