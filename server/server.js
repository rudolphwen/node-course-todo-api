// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

let express = require('express');
let { ObjectID } = require('mongodb');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

let app = express();

app.use(express.json());

app.post('/todos', (req, res) => {  // resource creation, to create a new todo
    // console.log(req.body);
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/123sdnvakl    => read todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/12445225
app.get('/todos/:id', (req, res) => {
    // res.send(req.params);
    let id = req.params.id;

    // Valid id using isValid
        // 404 - send back empty send
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // findById
        // seccess
            // if todo - send it back
            // if no todo - send back 404 with empty body
        // error
            // 400 - and send empty body back
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        // res.send({todo: todo});
        res.send({todo});
    }, (e) => {
        res.status(400).send();
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };

// let Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// });

// let newTodo = new Todo({
//     text: 'Cook dinner'
// });

// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (e) => {
//     console.log('Unable to save todo');
// });

// let otherTodo = new Todo({
//     text: 'Feed the cat',
//     completed: true,
//     completedAt: 123
// });

// let otherTodo = new Todo({
//     text: '   Edit this video  '
// });

// otherTodo.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save', e);
// });

// model: User
// email - require it - trim it - set type - set min length of 1
// let User = mongoose.model('User', {
//     email: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     }
// });

// let user = new User({
//     email: 'test1@test.com     '
// });

// user.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) =>{
//     console.log('Unable to save user', e);
// });