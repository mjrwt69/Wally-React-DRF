import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PostCard from '../components/Postcard'

const Dashboard = () => {
  const [title, setTitle] = useState('')
  const [image, setImage] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch logged-in user's posts
  const fetchMyPosts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('access_token')
      const res = await axios.get('http://localhost:8000/api/posts/mine/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPosts(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching user posts:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyPosts()
  }, [])

  // Handle image input change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    if (file) setImage(file);
  }

  // Create new post
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    if (image) {
      formData.append('image', image)
    }

    try {
      const token = localStorage.getItem('access_token')
      await axios.post('http://localhost:8000/api/posts/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      alert('Post created successfully!')
      setTitle('')
      setImage(null)
      fetchMyPosts() // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    }
  }

  // Edit post title handler
  const handleEdit = async (postId, newTitle) => {
    try {
      const token = localStorage.getItem('access_token')
      await axios.patch(
        `http://localhost:8000/api/posts/${postId}/`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, title: newTitle } : post
        )
      )
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    }
  }

  // Delete post handler
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      const token = localStorage.getItem('access_token')
      await axios.delete(`http://localhost:8000/api/posts/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  // Like handler placeholder (implement your logic here)
  const handleLike = async (postId) => {
  const token = localStorage.getItem('access_token')
  // Optimistically update UI
  setPosts(prevPosts =>
    prevPosts.map(post => {
      if (post.id !== postId) return post
      const liked = post.is_liked
      return {
        ...post,
        is_liked: !liked,
        like_count: liked ? post.like_count - 1 : post.like_count + 1,
      }
    })
  )

  try {
    await axios.post(
      `http://localhost:8000/api/posts/${postId}/like/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  } catch (error) {
    // Revert UI if error happens
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post
        const liked = post.is_liked
        return {
          ...post,
          is_liked: !liked,
          like_count: liked ? post.like_count - 1 : post.like_count + 1,
        }
      })
    )
    console.error('Error toggling like:', error)
  }
}

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-10">
      {/* Add New Post Form */}
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">📝 Create a New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-900
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            border-2 border-gray-300 rounded-md
            file:cursor-pointer"
          />

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="max-h-48 object-cover mt-2 rounded"
            />
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Post
          </button>
        </form>
      </div>

      {/* User Posts Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">📌 My Posts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-600">You have no posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                isDashboard={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
