const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, });

// module.exports = {
//     mongoose: mongoose
// };

module.exports = {mongoose};