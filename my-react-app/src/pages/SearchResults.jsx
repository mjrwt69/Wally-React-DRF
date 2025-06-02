import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostCard from '../components/Postcard' // Adjust path if needed

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchTerm = searchParams.get('search') || ''

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const url = `http://localhost:8000/api/posts/?search=${encodeURIComponent(searchTerm)}`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.results || data) // handle pagination if enabled
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [searchTerm])

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">
        Search results for "<span className="text-blue-600">{searchTerm}</span>"
      </h2>

      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No posts found.</p>}

      <div
        className="masonry-grid"
        style={{
          columnCount: 3,
          columnGap: '1.25rem',
        }}
      >
        {posts.map((post) => (
          <div key={post.id} style={{ breakInside: 'avoid', marginBottom: '1.25rem' }}>
            <PostCard post={post} onLike={() => {}} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults
