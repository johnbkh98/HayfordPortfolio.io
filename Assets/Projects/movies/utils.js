// helper function for delaying the search fetch request here to wait after the last keypress.
const debounce = (func, delay = 1000) => { // a default delay of 1 sec
    let timeoutId;
    return (...args) => { // clearing timeout request of fetch
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay)
    };
};