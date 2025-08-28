const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')



const api = supertest(app)

let token = null


beforeEach(async () => {

    await User.deleteMany({})
    await Blog.deleteMany({})

    const newUser = { username: 'user', password: 'salasana' }
    await api.post('/api/users').send(newUser)

    const loginResponse = await api.post('/api/login').send(newUser)
    token = loginResponse.body.token

    for (let blog of helper.initialBlogs) {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
    }

})

describe('initial blogs saved', () => {


    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map((e) => e.title)
        assert(contents.includes('Go To Statement Considered Harmful'))
    })

    test('blogs are returned with field id instead of _id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body

        assert.ok(blogs[0].id)
    })

    test('missing likes value set to zero', async () => {

        const newBlog = {
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: "",
        }


        const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201).expect('Content-Type', /application\/json/)


        const savedBlog = response.body
        assert.strictEqual(savedBlog.likes, 0)
    })
})

describe('adding a new blog', () => {

    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
        }


        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const contents = blogsAtEnd.map((n) => n.title)
        assert(contents.includes('Type wars'))
    })


    test('blog without title is not added', async () => {
        const newBlog = {

            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,

        }

        await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {

            title: "Type wars",
            author: "Robert C. Martin",
            likes: 2,

        }


        await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without authorization is not added', async () => {
        const newBlog = {

            title: "Type wars",
            author: "Robert C. Martin",
            likes: 2,

        }


        await api.post('/api/blogs').send(newBlog).expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})


describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const contents = blogsAtEnd.map((b) => b.title)
        assert(!contents.includes(blogToDelete.title))

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('returns  code 404 if id is not valid', async () => {
        const NonexistingId = await helper.nonExistingId()


        await api.delete(`/api/blogs/${NonexistingId}`).set('Authorization', `Bearer ${token}`).expect(404)


    })
})


describe('updating likes field of a blog', () => {
    test('returns code 200 if id is valid', async () => {

        const blogsAtStart = await helper.blogsInDb()

        const blogToUpdate = blogsAtStart[0]

        const updatedData = {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 1
        }

        const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedData).expect(200)

        assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

    })

    test('returns code 404 if id not valid', async () => {

        const NonexistingId = await helper.nonExistingId()
        const updatedData = {
            ...NonexistingId,
            likes: NonexistingId.likes + 1
        }

        await api.put(`/api/blogs/${NonexistingId}`).send(updatedData).expect(404)

    })

})



after(async () => {
    await mongoose.connection.close()
})