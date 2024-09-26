import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const [showDeleteBtn, setShowDeleteBtn] = useState(false)

  useEffect(() => {
    console.log('User:', user)
    console.log('Blog User:', blog.user)
    if (blog.user && user && blog.user.username === user.username) {
      setShowDeleteBtn(true)
    } else {
      setShowDeleteBtn(false)
    }
  }, [blog.user, user])

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} >
      <p className='title'>{blog.title}</p> 
      <p className='author'>{blog.author}</p>
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      <div style={showWhenVisible} className='hidenDiv'>
        <p className='urlElement'>{blog.url} </p><br/>
        <p className='likesElement'>likes {blog.likes} </p><button onClick={() => onLike(blog)}>like</button> <br/>
        {visible && showDeleteBtn && <button onClick={() => deleteBlog(blog)}>remove</button>}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}


export default Blog
