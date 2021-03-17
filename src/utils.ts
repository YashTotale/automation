export const differenceInMinutes = (
  d1: Date | number,
  d2: Date | number
): string => {
  if (typeof d1 !== "number") d1 = d1.getTime();
  if (typeof d2 !== "number") d2 = d2.getTime();

  return ((d1 - d2) / 1000 / 60).toFixed(1);
};
