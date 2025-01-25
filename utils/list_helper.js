const dummy = (blogs) => {
        return 1
    }

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) =>
    blogs.length > 0
        ? blogs.reduce((maxBlog, curBlog) => {
            return curBlog.likes > maxBlog.likes 
                ? curBlog
                : maxBlog
          })
        : null

const mostBlogs = (blogs) => {
    const authorBlogs = blogs.reduce((authors, blog) => {
        authors[blog.author] = (authors[blog.author] || 0) + 1
        return authors
    }, {})

    const most = Object.entries(authorBlogs).reduce((max, [ author, blogs ]) => {
        return blogs > max.blogs
            ? { author, blogs }
            : max
    }, { author: null, blogs: 0 })

    return most
}

const mostLikes = (blogs) => {
    const authorLikes = blogs.reduce((authors, blog) => {
        authors[blog.author] = (authors[blog.author] || 0) + blog.likes
        return authors
    }, {})

    const most = Object.entries(authorLikes).reduce((max, [ author, likes ]) => {
        return likes > max.likes
            ? { author, likes }
            : max
    }, { author: null, likes: 0 })

    return most
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}