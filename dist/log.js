export const debug = (...params) => {
    console.log(...params.map((o) => JSON.stringify(o, null, 2)));
};
