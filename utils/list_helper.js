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
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}