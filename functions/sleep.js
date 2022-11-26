const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(true), ms))

module.exports = sleep
