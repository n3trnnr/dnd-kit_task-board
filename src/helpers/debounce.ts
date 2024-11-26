
// export const debounce = (callback: any, delay: number) => {
//     return function (...args) {
//         let timer;
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             callback.apply(this, args);
//         }, delay);
//     }
// }

// const f = debounce(console.log('ok'), 1000)

export const debounce = (callback, delay) => {
    let timer;
    return function (...args) {
        timer = setTimeout(() => {
            clearTimeout(timer);
            callback.apply(this, args)
        }, delay)
    }
}