const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const biggerList = [
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 1,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]


describe('dummy', () => {
    test('dummy returns one', () => {
        const blogs = []
        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
    })
})


describe('favorite blog', () => {


    test('when list has only one blog, it is favorite', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result,
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            })
    })


    test('chosen favorite blog from bigger list', () => {
        const result = listHelper.favoriteBlog(biggerList)
        assert.deepStrictEqual(result,
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0
            }
        )
    })

    const emptyList = []

    test('empty list is zero', () => {
        const result = listHelper.favoriteBlog(emptyList)
        assert.strictEqual(result, 0)
    })

})


describe('total likes', () => {


    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })


    test('bigger list is calculated right', () => {
        const result = listHelper.totalLikes(biggerList)
        assert.strictEqual(result, 25)
    })

    const emptyList = []

    test('empty list is zero', () => {
        const result = listHelper.totalLikes(emptyList)
        assert.strictEqual(result, 0)
    })

})


describe('most blogs', () => {


    test('when list has only one blog, returns its author and 1', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })


    test('in bigger list returns favorite author and amount of blogs', () => {
        const result = listHelper.mostBlogs(biggerList)
        assert.deepStrictEqual(result,
            {
                author: 'Robert C. Martin',
                blogs: 3
            }
        )
    })

    const emptyList = []

    test('empty list is zero', () => {
        const result = listHelper.mostBlogs(emptyList)
        assert.strictEqual(result, 0)
    })

})


describe('most likes', () => {


    test('when list has only one blog, returns its author and its likes', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })


    test('in bigger list returns favorite author and calculated likes', () => {
        const result = listHelper.mostLikes(biggerList)
        assert.deepStrictEqual(result,
            {
                author: 'Robert C. Martin',
                likes: 13
            }
        )
    })

    const emptyList = []

    test('empty list is zero', () => {
        const result = listHelper.mostLikes(emptyList)
        assert.strictEqual(result, 0)
    })

})



