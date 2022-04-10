export const date2IsoStr = (date) => date.toISOString().slice(0, 10);

export const date2Str = (date) => (
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
)

export const offsetDate = (date, offset) => {
  const newDate = new Date();
  newDate.setDate(date.getDate() + offset);
  return newDate;
}

export const isToday = (date) => date2IsoStr(date) === date2IsoStr(new Date());
