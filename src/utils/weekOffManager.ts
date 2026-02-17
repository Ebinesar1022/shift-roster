let counter = 0;

export const getNextWeekOff = () => {
  const day = counter % 7;
  counter++;
  return day;
};
