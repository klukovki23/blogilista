
const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    return blogs.reduce((favorite, blog) => blog.likes > favorite.likes ? blog : favorite
    )

}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return 0


    const counts = {}
    blogs.forEach((blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
    })

    let maxAuthor = null
    let maxBlogs = 0

    for (const author in counts) {
        if (counts[author] > maxBlogs) {
            maxAuthor = author
            maxBlogs = counts[author]
        }
    }

    return {
        author: maxAuthor,
        blogs: maxBlogs,
    }
}



const mostLikes = (blogs) => {
    if (blogs.length === 0) return 0


    const grouped = lodash.groupBy(blogs, 'author')

    const authorsLikes = Object.keys(grouped).map(author => ({
        author,
        likes: lodash.sumBy(grouped[author], 'likes')
    }))

    return lodash.maxBy(authorsLikes, 'likes')
}




module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,

}

