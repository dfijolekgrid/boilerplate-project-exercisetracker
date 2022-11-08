export const dateFromTimestamp = (date: string) => {
  const newDate = new Date(Number.parseInt(date));
  return `${newDate.getFullYear()}-${
    newDate.getMonth() + 1
  }-${newDate.getDate()}`;
};
