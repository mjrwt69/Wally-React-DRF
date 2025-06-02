import React, { useState, useEffect } from 'react'

const PostCard = ({ post, onLike, isDashboard = false, onEdit, onDelete }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [animating, setAnimating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(post.title)

  useEffect(() => {
    setIsLiked(post.is_liked)
    setLikeCount(post.like_count)
    setEditedTitle(post.title)
  }, [post.is_liked, post.like_count, post.title])

  const handleLike = () => {
  setIsLiked(prevLiked => {
    const newLiked = !prevLiked
    setLikeCount(count => (newLiked ? count + 1 : count - 1))
    return newLiked
  })
  setAnimating(true)
  onLike(post.id)
};

  useEffect(() => {
    if (animating) {
      const timeout = setTimeout(() => setAnimating(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [animating])

  // Called when user clicks Save button
  const handleSaveEdit = () => {
    onEdit(post.id, editedTitle)
    setIsEditing(false)
  }

  // Called when user clicks Cancel button
  const handleCancelEdit = () => {
    setEditedTitle(post.title) // revert changes
    setIsEditing(false)
  }

  const HeartIcon = ({ filled, isAnimating }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "red" : "none"}
      stroke="red"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-8 h-8 transition-transform duration-300 cursor-pointer ${
        isAnimating ? 'scale-125' : 'scale-100'
      }`}
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.01 4.01 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h.74C14.09 5.01 15.76 4 17.5 4 19.99 4 22 6.01 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full object-cover rounded-t"
        />
      )}
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="border rounded p-1 flex-grow mr-2"
            />
          ) : (
            <h2 className="text-xl font-bold mb-1 flex-grow">{post.title}</h2>
          )}
          {isDashboard && !isEditing && (
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          )}
          {isDashboard && isEditing && (
            <div className="space-x-2 space-y-1">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className='flex justify-between'>

          <p className="text-gray-600 text-sm mb-2">By @{post.author}</p>

          <div>

            <button
            onClick={handleLike}
            className="flex items-center space-x-1 hover:scale-110 transition-transform duration-150"
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            <HeartIcon filled={isLiked} isAnimating={animating} />
            <span className="text-lg select-none p-3 text-red-500">{likeCount}</span>
          </button>
          </div>

        </div>

      
        </div>
      </div>
  )
}

export default PostCard
