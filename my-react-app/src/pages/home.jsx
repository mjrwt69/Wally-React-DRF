import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Masonry from 'react-masonry-css'
import PostCard from '../components/Postcard'

const Home = () => {
  const [posts, setPosts] = useState([])

  // Helpers for anonymous like tracking
  const getAnonLikes = () => {
    try {
      return JSON.parse(localStorage.getItem('anon_likes')) || []
    } catch {
      return []
    }
  }

  const saveAnonLikes = (likes) => {
    localStorage.setItem('anon_likes', JSON.stringify(likes))
  }

  // Fetch posts and apply localStorage is_liked state for anonymous users
  const fetchPosts = async () => {
    const token = localStorage.getItem('access_token')
    try {
      const res = await axios.get('http://localhost:8000/api/posts/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      const data = res.data

      const anonLikes = getAnonLikes()

      const updated = data.map(post => ({
        ...post,
        is_liked: token ? post.is_liked : anonLikes.includes(post.id)
      }))

      console.log(updated)

      setPosts(updated)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const handleLike = async (postId) => {
    const token = localStorage.getItem('access_token')

    // Update UI immediately
    setPosts(prevPosts =>
  prevPosts.map(post => {
    if (post.id !== postId) return post

    const wasLiked = post.is_liked
    const updatedLikeCount = wasLiked
      ? post.like_count - 1
      : post.like_count + 1

    return {
      ...post,
      is_liked: !wasLiked,
      like_count: updatedLikeCount,
    }

    
  })
)

    // Anonymous like handling
    if (!token) {
      const anonLikes = getAnonLikes()
      const updatedLikes = anonLikes.includes(postId)
        ? anonLikes.filter(id => id !== postId)
        : [...anonLikes, postId]
      saveAnonLikes(updatedLikes)
    }

    // Backend request (only if token exists)
    try {
      await axios.post(
        `http://localhost:8000/api/posts/${postId}/like/`,
        {},
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      )
    } catch (error) {
      console.error(error)
      fetchPosts() // fallback
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  }

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map(post => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
      </Masonry>

      <div>{}</div>
    </div>
  )
}

export default Home
