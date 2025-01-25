const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
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
        likes: 0,
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

test('Dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('Total likes', () => {
    test('When list has only one blog, returns the likes of that blog', () => {
        assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
    })

    test('When there are several blogs, returns the total likes of those', () => {
        assert.strictEqual(listHelper.totalLikes(blogs), 36)
    })

    test('When there are no blogs, returns 0', () => {
        assert.strictEqual(listHelper.totalLikes([]), 0)
    })
})

describe('Favorite blog', () => {
    test('When list has one blog, returns that blog', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        })
    })

    test('When there are several blogs, returns the blog with the most likes', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(blogs), {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        })
    })

    test('When there are no blogs, returns null', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
    })
})

describe('Most blogs', () => {
    test('When list has one blog, return that author and 1', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })

    test('When list has several blogs, return the author with the most blogs and their blog count', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
            author: "Robert C. Martin",
            blogs: 3
          })
    })

    test('When list has no blogs, return author: null and 0', () => {
        assert.deepStrictEqual(listHelper.mostBlogs([]), {
            author: null,
            blogs: 0
        })
    })
})

describe('Most likes', () => {
    test('When list has one blog, return that author and the number of likes', () => {
        assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('When list has several blogs, return the author with the most likes and the number of likes', () => {
        assert.deepStrictEqual(listHelper.mostLikes(blogs), {
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })

    test('When list has no blogs, return author: null and 0', () => {
        assert.deepStrictEqual(listHelper.mostBlogs([]), {
            author: null,
            blogs: 0
        })
    })
})