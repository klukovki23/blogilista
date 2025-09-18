
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    if (user)
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
  }, [user])



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    setBlogs(blogs.map(b => b.id !== blog.id ? b : { ...returnedBlog, user: blog.user }))
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (error) {
        console.error('Blog deletion failed:', error)
      }
    }
  }
  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }

    return <div className="notification">{message}</div>
  }

  const ErrorMessage = ({ errorMessage }) => {
    if (errorMessage === null) {
      return null
    }

    return <div className="error">{errorMessage}</div>
  }

  const addBlog = (newBlog) => {
    try {
      blogService.create(newBlog)
        .then(createdBlog => {
          setBlogs(blogs.concat({ ...createdBlog, user }))
        })
      setMessage(`a new blog ${newBlog.title} by  ${newBlog.author}  was added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('error creating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(`${user.username} loged in`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleLogout = () => {

    window.localStorage.clear()
    setUser(null)
    setMessage(`${user.username} loged out`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }


  const blogList = () => {


    return (
      <div>
        <h2>blogs</h2>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} user={user} />
          )}
      </div>
    )
  }

  return (
    <div>

      <Notification message={message} />{' '}
      <ErrorMessage errorMessage={errorMessage} />

      {!user && <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />}
      {user && (
        <div>
          <p>{user.name} logged in </p>
          <button onClick={handleLogout} style={{ marginBottom: '30px' }}>logout</button>

          <Togglable buttonLabel="new blog">
            <NewBlog
              createBlog={addBlog}
            />
          </Togglable>
          {blogList()}
        </div>
      )}
    </div>
  )
}

export default App