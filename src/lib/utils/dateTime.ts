export const CreateDate = (year: number, month: number, day: number) => {
  return new Date(year, month - 1, day);
};
