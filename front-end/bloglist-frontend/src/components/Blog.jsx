import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isOwner = blog.user?.username === user?.username

  return (
    <div style={blogStyle}
      className='blog'>

      {showDetails ? (
        <div>
          <div>
            {blog.title} {blog.author}
            <button onClick={() => setShowDetails(false)}>hide</button>
          </div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>

          {isOwner && (
            <button style={{ color: 'blue' }} onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      ) : (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setShowDetails(true)}>view</button>
        </div>
      )}
    </div>
  )
}

export default Blog