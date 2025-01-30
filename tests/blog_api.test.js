const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

describe('Blogs: When there are some initial blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('Get request returns correct number of blogs', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, 4)
    })

    test('Get request returns blogs in JSON form', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Identifying field for blog is called id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]

        assert(Object.keys(blog).includes('id'))
    })

    describe('Adding new blogs', () => {
        test('A valid blog can be added', async () => {
            const newBlog = {
                title: 'How to Keep Your People from Falling into Despair',
                author: 'Anomander Dragnipurake',
                url: 'https://moonsspawn.com/ani',
                likes: 28919
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')
            const titles = response.body.map(r => r.title)

            assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
            assert(titles.includes('How to Keep Your People from Falling into Despair'))
        })

        test('If likes are not specified, default to 0', async () => {
            const newBlog = {
                title: 'Mental Health and Radiance',
                author: 'Kaladin Stormblessed',
                url: 'https://urithi.ru/w1ndrunn3r'
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')
            const likes = response.body.map(r => r.likes)

            assert.strictEqual(likes.at(-1), 0)
        })

        test('If blog has no title, respond with 400 Bad Request', async () => {
            const newBlog = {
                author: 'Man Dible',
                url: 'https://mandible.com/blogs',
                likes: 2
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        })

        test('If blog has no url, respond with 400 Bad Request', async () => {
            const newBlog = {
                title: 'Art as a Tool for Illusion',
                author: 'Shallan Davar',
                likes: 1000000
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        })
    })

    describe('Deleting and modifying blogs', () => {
        test('A blog can be deleted based on its id', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAfter = await helper.blogsInDb()
            const titles = blogsAfter.map(b => b.title)

            assert(!titles.includes(blogToDelete.title))
            assert.strictEqual(blogsAfter.length, blogsAtStart.length - 1)
        })

        test('A blog can be modified', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToModify = blogsAtStart[0]

            const modifiedBlog = {
                title: blogToModify.title,
                author: blogToModify.author,
                url: blogToModify.url,
                likes: blogToModify.likes + 1
            }

            await api
                .put(`/api/blogs/${blogToModify.id}`)
                .send(modifiedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')

            assert.strictEqual(response.body[0].likes, blogsAtStart[0].likes + 1)
        })
    })
})

describe('Users: When there is one initial user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('gheimnis', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('Adding new user with an unused username succeeds', async () => {
        initialUsers = await helper.usersInDb()

        const newUser = {
            username: 'Chuchi',
            name: 'Chaeschtli',
            password: 'Sektion'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersAfter.length, initialUsers.length + 1)

        const usernames = usersAfter.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('Adding new user fails when username already exists', async () => {
        const initialUsers = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Duplicate',
            password: 'salaisuus'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.usersInDb()
        assert(result.body.error.includes('Expected `username` to be unique'))

        assert.strictEqual(usersAfter.length, initialUsers.length)
    })

    test('Adding new user fails when username is too short', async () => {
        const initialUsers = await helper.usersInDb()

        const newUser = {
            username: 'Mo',
            name: 'Mariano Rivera',
            password: 'Cl0ser'
        }

        const result = await api
            .post ('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersAfter.length, initialUsers.length)

        assert(result.body.error.includes('User validation failed: username: Path `username` (`Mo`) is shorter than the minimum allowed length (3).'))
    })

    test('Adding new user fails when the password is too short', async () => {
        const initialUsers = await helper.usersInDb()

        const newUser = {
            username: 'S1sterD4wn',
            name: 'Menandore',
            password: 'yo'
        }

        const result = await api
            .post ('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersAfter.length, initialUsers.length)

        assert(result.body.error.includes('Password must be at least 3 characters long.'))
    })
})

after(async () => {
    await mongoose.connection.close()
})
