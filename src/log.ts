export const debug = (...params: any[]) => {
  console.log(...params.map((o) => JSON.stringify(o, null, 2)));
};
