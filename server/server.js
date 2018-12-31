// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

// let env = process.env.NODE_ENV || 'development';
// console.log('env *****', env);

// if(env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if(env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
// }
require('./config/config');

const _ = require('lodash');
const express = require('express');
const { ObjectID } = require('mongodb');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');
let { authenticate } = require('./middleware/authenticate');

let app = express();
// const port = process.env.PORT || 3000;
const port = process.env.PORT;

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

app.delete('/todos/:id', (req, res) => {
    // get the id
    let id = req.params.id;

    // validate the id -> not valid? return 404
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // remove todo by id
        // seccess
            // if no doc, send 404
            // if doc, send doc back with 200
        // error
            // 400 with empty body
    // Todo.findOneAndDelete({_id: id}).then((todo) => {
    Todo.findByIdAndDelete(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
        // res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

// POST /users
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    // User.findByToken     => model methods are called on a User object
    // user.generateAuthToken   => instnace mentods are called on an individual user

    user.save().then(() => {
        // res.send(user);
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// let authenticate = (req, res, next) => {
//     let token = req.header('x-auth');

//     User.findByToken(token).then((user) => {
//         if(!user) {
//             // res.status(401).send();
//             return Promise.reject();
//         }

//         // res.send(user);
//         req.user = user;
//         req.token = token;
//         next()
//     }).catch((e) => {
//         res.status(401).send();
//     });
// };

// app.get('/users/me', (req, res) => {
app.get('/users/me', authenticate, (req, res) => {
    // let token = req.header('x-auth');

    // User.findByToken(token).then((user) => {
    //     if(!user) {
    //         // res.status(401).send();
    //         return Promise.reject();
    //     }

    //     res.send(user);
    // }).catch((e) => {
    //     res.status(401).send();
    // });
    res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    // res.send(body);
    User.findByCredentials(body.email, body.password).then((user) => {
        // res.send(user);
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
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