module.exports = {
  MONGO_URI: process.env.NEXT_PUBLIC_MONGO_URI,
  MONGO_OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
}
