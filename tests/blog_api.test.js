const { test, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

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

after(async () => {
    await mongoose.connection.close()
})
