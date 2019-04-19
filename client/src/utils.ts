export function asyncSequence(promiseFns: (() => Promise<any>)[]) {
    return promiseFns.reduce((result, fn) => result.then(fn), Promise.resolve());
}
