export function formatTrainingPrice(price: number, duration: string): string {
  const years = /^(\d+)\s+ans?$/i.exec(duration.trim());
  const yearCount = years ? Number(years[1]) : 0;
  const annualPrice = yearCount > 1 && price % yearCount === 0;
  const amount = annualPrice ? price / yearCount : price;
  const formattedAmount = new Intl.NumberFormat("fr-FR")
    .format(amount)
    .replace(/\u202f/g, " ");

  return `${formattedAmount} FCFA${annualPrice ? "/an" : ""}`;
}
