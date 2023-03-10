import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPost } from './postsSlice'
import { addNewPost } from './postsSlice'

export const AddPostForm = () => {
  const [input, setInputs] = useState({
    title: '',
    content: '',
  })
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const [userId, setUserId] = useState('')

  const dispatch = useDispatch()
  const users = useSelector((state) => state.users)

  const onTitleChanged = (e) => setInputs({ ...input, title: e.target.value })

  const onContentChanged = (e) =>
    setInputs({ ...input, content: e.target.value })

  const onAuthorChanged = (e) => setUserId(e.target.value)

  const canSave =
    Boolean(input.title) && Boolean(input.content) && Boolean(userId)

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        await dispatch(
          addNewPost({
            title: input.title,
            content: input.content,
            user: userId,
          })
        ).unwrap()
        setInputs({
          title: '',
          content: '',
        })
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))
  return (
    <section>
      <h2>Add a New Post</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSavePostClicked()
          // dispatch(addPost(input.title, input.content, userId))
          setInputs({
            title: '',
            content: '',
          })
        }}
      >
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={input.title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={input.content}
          onChange={onContentChanged}
        />
        <button type="submit" disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}
