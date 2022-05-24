const PROD = process.env.NODE_ENV === "production"

module.exports = {
  log: (...args) => {
    if (!PROD) {
      console.log(...args)
    }
  },

  clear: () => {
    if (!PROD) {
      console.clear()
    }
  },
}
