
export function randomIntId(lenght: number = 10): number {
  const maxval = '1'.padEnd(lenght - 1, '0');
  return Math.floor(Math.random() * parseInt(maxval, 10));
}

