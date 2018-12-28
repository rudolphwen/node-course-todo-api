const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123')
    }]
}, {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass'
}];

const todos = [
    {_id: new ObjectID(), text: 'First test todo'},
    {_id: new ObjectID(), text: 'Second test todo', completed: true, completedAt: 333}
];

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

// const populateUsers = (done) => {
//     User.deleteMany({}).then(() => {
//         // let userOne = new User(users[0]);
//         let userTwo = new User(users[1]);

//         // return userOne.save();
//         return userTwo.save();
//     }).then(() => done());
// };
const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        let userOne = new User(users[0]);
        return userOne.save();
    }).then(() => {
        let userTwo = new User(users[1]);
        return userTwo.save();
    }).then(() => done());
};

// const populateUsers = (done) => {        // Rudolph: have an issue ( Error: Timeout of 2000ms exceeded.)
//     User.deleteMany({}).then(() => {     //          seems that Promise.all() not work for server.text.js
//         let userOne = new User(users[0]).save();
//         let userTwo = new User(users[1]).save();

//         // Promise.all([userOne, userTwo]).then(() => {})
//         return Promise.all([userOne, userTwo]);
//     }).then(() => done());
// };

module.exports = {todos, populateTodos, users, populateUsers};