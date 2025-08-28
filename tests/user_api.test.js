const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')

const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'joku', passwordHash })

    await user.save()
})

test('creation succeeds with a fresh username', async () => {
    const newUser = {
        username: 'klukovki',
        name: 'Kseniia',
        password: 'salainen',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 2)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
})

test('creation fails with proper statuscode and message if username already taken', async () => {
    const newUser = {
        username: 'joku',
        name: 'käyttäjä',
        password: 'salasana',
    }

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    assert.match(result.body.error, /expected `username` to be unique/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
})

test('creation fails if username or password is too short', async () => {
    const newUser = {
        username: 'ab',
        password: '12',
    }

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    assert.match(result.body.error, /username and password must be at least 3 characters long/)
})

after(async () => {
    await mongoose.connection.close()
})
