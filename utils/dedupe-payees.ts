/**
 * @file dedupe-payees.ts
 * @description Dedupe an array of strings by comparing the first 6 characters
 * @param {string[]} payees
 */

export const dedupePayees = (payees: string[]) => {
  const dedupedPayees: string[] = [];

  payees.forEach((payee) => {
    if (
      dedupedPayees.every(
        (dedupedPayee) =>
          payee.substring(0, 5) !== dedupedPayee.substring(0, 5),
      )
    ) {
      dedupedPayees.push(payee);
    }
  });

  return dedupedPayees;
};
