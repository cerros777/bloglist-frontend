import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a,b) => b.likes - a.likes)
      setBlogs( sortedBlogs )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try{
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception){
      setErrorMessage('Wrong credentials')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleLogout = (e) => {
    e.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async(newBlog) => {
    try{
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      setErrorMessage('a new blog added')
      setTimeout(() => setErrorMessage(''), 5000)
    } catch {
      setErrorMessage('Blog creation failed')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const addLike = async (blogToUpdate) => {
    console.log('blog to like', blogToUpdate)
    try {
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
      }
      const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)
      console.log('blog liked',returnedBlog)
      const returnedBlogWithUser = {
        ...returnedBlog,
        user: blogToUpdate.user.id ? {
          username: blogToUpdate.user.username,
          name: blogToUpdate.user.name,
          id: blogToUpdate.user.id,
        } : blogToUpdate.user
      }
      setBlogs(blogs.map(blog => blog.id !== blogToUpdate.id ? blog : returnedBlogWithUser))
    } catch {
      setErrorMessage('like failed')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }


  const deleteBlog = async(blogToDelete) => {
    if(window.confirm('Do you want to delete this blog?'))
      try{
        await blogService.deleteBlog(blogToDelete.id)
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
        setErrorMessage('blog deleted')
        setTimeout(() => setErrorMessage(''), 5000)
      } catch {
        setErrorMessage('blog deletion failed')
        setTimeout(() => setErrorMessage(''), 5000)
      }
  }

  const blogFormRef = useRef()

  if(user === null){
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div>
              username:
            <input
              data-testid='username'
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
              password:
            <input 
              data-testid='password'
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <NewBlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} onLike={addLike} deleteBlog={deleteBlog} user={user} />
      )}
    </div>
  )
}

export default App