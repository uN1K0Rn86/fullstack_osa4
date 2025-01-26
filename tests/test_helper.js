const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'How to Be a Proper Hipster',
        author: 'Hunter McTannersworthington',
        url: 'https://iwishiwasreal.blogspot.com',
        likes: 1958
    },
    {
        title: 'Woodworking with Don',
        author: 'Don Duckson',
        url: 'https://workthawood.blogs.com',
        likes: 200022
    },
    {
        title: 'Tech for Techies',
        author: 'Techie McTechface',
        url: 'https://techsters.blogspot.com',
        likes: 19456
    },
    {
        title: 'Baby Blues (not)',
        author: 'Mary Manderville',
        url: 'https://babybluenot.blogspot.com',
        likes: 100909
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'Will remove',
        author: 'Will Removal',
        url: 'https://not.com',
        likes: 1
    })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb
}