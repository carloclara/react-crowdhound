import React, { useEffect, useState } from 'react'
import moment from 'moment'
import ShowMore from 'react-show-more'
import Comments from '../Comments'
import MoreActions from '../MoreActions'
import NotificationCounter from '../NotificationCounter'
import WriteComment from '../WriteComment'
import { stringPattern } from '../../../helpers/Commons'
import {
  getContent,
  addContent,
  editContent,
  deleteContent,
  likeContent
} from '../../../actions/content'
import anonymousAvatar from '../../../assets/images/anonymous-avatar.png'

const PostSingle = ({ element = {}, userData = {}, styles = {} }) => {
  const {
    primaryAvatarStyle,
    postUsernameStyle,
    postDateStyle,
    postDescriptionStyle,
    commentInputStyle
  } = styles
  const [data, setData] = useState(element)
  const [comment, setComment] = useState('')
  const [showEditableTextBox, setShowEditableTextBox] = useState(false)
  const [post, setPost] = useState('')

  useEffect(() => {
    setData(element)
  }, [element])

  const insertComment = async (e, { rootId, id }) => {
    if (e.keyCode === 13 && comment.trim().length > 0) {
      await addContent(userData, rootId, id, comment, `comment-${id}`)
      const comments = await getContent(id)
      if (comments.elements[0]) {
        setData(comments.elements[0])
      }
      setComment('')
    }
  }

  const updatePost = async (e, element) => {
    if (e.keyCode === 13 && post.trim().length > 0) {
      await editContent(element, post)
      const posts = await getContent(element.id)
      if (posts.elements[0]) {
        setData(posts.elements[0])
      }
      setShowEditableTextBox(false)
    }
  }

  const deleteComment = async (element) => {
    await deleteContent(element)
  }

  const likeComment = async (elementId) => {
    await likeContent(userData, elementId)
    const posts = await getContent(element.id)
    if (posts.elements[0]) {
      setData(posts.elements[0])
    }
  }

  return (
    <div className='ch-news-feed-post-wrapper'>
      <div className='ch-news-feed-content-wrapper'>
        {stringPattern(userData.userId) === data.title && (
          <MoreActions
            element={data}
            showEditableTextBox={(e) => {
              setShowEditableTextBox(e)
            }}
            setDescription={(e) => {
              setPost(e)
            }}
            deleteComment={(e) => {
              deleteComment(e)
            }}
          />
        )}
        <table className='ch-news-feed-main-table'>
          <tbody>
            <tr>
              <td className='left-cell'>
                <img
                  className='ch-news-feed-primary-avatar'
                  style={{ ...primaryAvatarStyle }}
                  src={anonymousAvatar}
                />
              </td>
              <td className='right-cell'>
                <span
                  className='ch-news-feed-element-user-id'
                  style={{ ...postUsernameStyle }}
                >
                  {data.summary ? data.summary : 'Unknown'}
                </span>
                <span
                  className='ch-news-feed-element-date'
                  style={{ ...postDateStyle }}
                >
                  {moment(data.created * 1000).fromNow()}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          className='ch-news-feed-element-description'
          style={{ ...postDescriptionStyle }}
        >
          {showEditableTextBox && (
            <div className='ch-news-feed-editable-comment-wrapper'>
              <input
                type='text'
                className='ch-news-feed-write-comments-text-box'
                value={post}
                style={{ ...commentInputStyle }}
                onKeyUp={(e) => updatePost(e, data)}
                onChange={(e) => {
                  setPost(e.target.value)
                }}
              />
              <button
                onClick={() => {
                  setShowEditableTextBox(false)
                }}
              >
                Cancel
              </button>
            </div>
          )}
          {!showEditableTextBox && (
            <ShowMore
              lines={3}
              more='See More'
              less='See Less'
              anchorClass='ch-news-feed-see-more-description'
            >
              <p>{data.description}</p>
            </ShowMore>
          )}
        </div>
        <NotificationCounter
          element={data}
          userData={userData}
          label='Comment'
          likeComment={(e) => {
            likeComment(e)
          }}
          styles={styles}
        />
        <Comments
          elements={data.children}
          userData={userData}
          styles={styles}
        />
        <WriteComment
          element={data}
          comment={comment}
          setComment={(e) => {
            setComment(e)
          }}
          insertComment={(e, el) => {
            insertComment(e, el)
          }}
          styles={styles}
        />
      </div>
    </div>
  )
}

export default PostSingle
