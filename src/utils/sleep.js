// One-liner that lets us sleep before executing next line
// Defined a function with ms (milliseconds as input)
// Returns a promise with a resolver
// The resolver gets passed into a settimeout
// When the timeout is done the resolver gets executed and the whole function gets returned
export const sleep = (ms) => new Promise(res => setTimeout(res, ms));