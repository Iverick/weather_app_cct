/** 
 * Given an array of ISO timestamps and a parallel array of values,
 * return the last value whose timestamp is ≤ the reference time.
 * Returns `undefined` if no timestamp meets the criteria.
 */
export function getLastValueBefore<T>(
  timeStamps: string[],
  values: T[],
  reference: string | Date
): T | undefined {
  const refDate = reference instanceof Date ? reference : new Date(reference);
  let last: T | undefined;
  for (let i = 0; i < timeStamps.length; i++) {
    const tsDate = new Date(timeStamps[i]);
    if (tsDate <= refDate) {
      last = values[i];
    } else {
      break;
    }
  }
  return last;
}