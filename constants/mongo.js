module.exports = {
  MONGO_URI: process.env.MONGODB_URI,
  MONGO_OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
}
