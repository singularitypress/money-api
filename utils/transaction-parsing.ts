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
      Array.from({ length: 12 }, (_, i) => i + 1).forEach((month) => {
        acc[year][month] = {
          amt: 0,
          transactions: [],
        };
      });
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

export const convertToMonthly = (
  data: {
    id: string;
    data: {
      x: string;
      y: number;
      transactions: Transaction[];
    }[];
  }[]
) => {
  return data.reduce(
    (acc, curr) => {
      return {
        ...acc,
        data: [
          ...acc.data,
          ...curr.data.map((data) => ({
            x: `${curr.id}-${data.x}`,
            y: data.y,
            transactions: data.transactions,
          })),
        ],
      };
    },
    {
      id: "Monthly Amount",
      color: "hsl(0, 70%, 50%)",
      data: [],
      transactions: [],
    } as {
      id: string;
      color: string;
      data: {
        x: string;
        y: number;
        transactions: Transaction[];
      }[];
    }
  );
};

export const convertToTransactionSerie = (data: Transaction[]) => {
  const monthName = (month: number) => {
    const date = new Date(2020, month, 1);
    return date.toLocaleString("default", { month: "long" });
  };

  return Object.keys(monthlyAmountPerYear(data)).map((year) => {
    return {
      id: year,
      data: Object.keys(monthlyAmountPerYear(data)[year]).map((month) => ({
        x: monthName(Number(month) - 1),
        y: monthlyAmountPerYear(data)[year][month].amt * -1,
        transactions: monthlyAmountPerYear(data)[year][month].transactions,
      })),
    };
  });
};
