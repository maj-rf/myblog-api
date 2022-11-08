const mongoInitialize = (mongoose) => {
  const mongoDB = process.env.MONGO_URI;
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};

module.exports = mongoInitialize;
