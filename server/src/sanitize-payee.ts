export const sanitizePayee = (payee: string) => {
  const regex = /[^a-zA-Z0-9 ]/g;
  return payee
    .replace(regex, " ")
    .replace(/\s\s+/g, " ")
    .replace(/google pay/i, "")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    )
    .replace(/^(Amzn\s|Amazon\s).*/gim, "Amazon")
    .replace(/^(Apple\s).*/gim, "Apple")
    .replace(/^(Google\s).*/gim, "Google")
    .replace(/^(Presto).*/gim, "Presto")
    .replace(/^(Ritual).*/gim, "Ritual")
    .replace(/^(Shoppers).*/gim, "Shoppers Drug Mart")
    .replace(/^(Staples).*/gim, "Staples")
    .replace(/^(Steam).*/gim, "Steam")
    .replace(/^(Cc Lounge).*/gim, "CC Lounge")
    .replace(/^(Domino).*/gim, "Domino")
    .replace(/^(Fanatical).*/gim, "Fanatical")
    .replace(/^(Chatime).*/gim, "Chatime")
    .replace(/^(Green Man Gaming).*/gim, "Green Man Gaming")
    .replace(/^(Lcbo).*/gim, "LCBO")
    .replace(/^(Lyft).*/gim, "Lyft")
    .replace(/^(Uber Eats).*/gim, "Uber Eats");
};
