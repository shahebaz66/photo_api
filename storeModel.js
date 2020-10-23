const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//mongoose.set('debug', true);
mongoose.Promise = Promise;
//mongodb://127.0.0.1:27017/cloud?retryWrites=true&w=majority
mongoose
  .connect(`mongodb+srv://admin-shahebaz:admin123@shahebaz.r8yb8.mongodb.net/meme?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successfull!'));
const visitSchema = new Schema({
    type: String,
    url: String,
    category: String
});

module.exports = Store = mongoose.model('Store', visitSchema);
