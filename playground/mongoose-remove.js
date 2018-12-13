const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Todo.remove({})
// Todo.remove({}).then((result) => {
//     console.log(result);
// });
// (node:24200) DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.

// Todo.findOneAndRemove
// Todo.findByIdAndRemove
Todo.findOneAndRemove({_id:'5c11b29bad98c6e51b1ac61d'}).then((todo) => {
    console.log(todo);
});
// (node:11116) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.


// Todo.findByIdAndRemove('5c11b0d5ad98c6e51b1ac5ca').then((todo) => {
//     console.log(todo);
// });
// (node:11212) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.

