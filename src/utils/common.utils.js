
export const date2IsoStr = (date) => date.toISOString().slice(0, 10);

export const offsetDate = (date, offset) => {
  const newDate = new Date();
  newDate.setDate(date.getDate() + offset);
  return newDate;
}