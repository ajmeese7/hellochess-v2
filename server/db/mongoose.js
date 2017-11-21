var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/HelloChess', {
  useMongoClient: true
});

module.export = mongoose;
