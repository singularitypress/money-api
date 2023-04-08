export const sanitizePayee = (payee: string) => {
  if (
    payee.match(
      /(Amazon\.ca|AMZN Mktp CA)\*.+\s+(AMAZON\.CA\s+ON|WWW\.AMAZON\.CAON)/,
    )
  ) {
    return "Amazon.ca";
  }
  if (payee.match(/^UBER EATS.*/)) {
    return "Uber Eats";
  }
  return payee.replace(/\s+/, " ");
};
