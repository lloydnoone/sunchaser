import React from 'react'
import axios from 'axios'
import auth from '../../lib/auth'

class Comments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      comments: this.props.comments
    }
    this.handleDeleteComment = this.handleDeleteComment.bind(this)
    this.handleSubmitComment = this.handleSubmitComment.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleDeleteComment(e, commentId) {
    e.preventDefault()
    const journeyId = this.props.savedJourney.id
    axios.delete(`/api/journeys/${journeyId}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    })
      .then((res) => {
        console.log('comments: ', res.data.comments)
        const comments = [...res.data.comments]
        this.setState({ comments })
      })
      .catch(err => console.log(err))
  }

  handleSubmitComment(e) {
    e.preventDefault()
    const journeyId = this.props.savedJourney.id
    axios.post(`/api/journeys/${journeyId}/comments/`, { text: this.state.text }, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    })
      .then((res) => { 
        const commentsArr = [...res.data.comments]
        this.setState({ comments: commentsArr, text: '' })
      })
      .catch(err => console.log('error: ', err))
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  isOwner() {
    return true //auth.getPayload().sub === this.props.savedJourney.user.id
  }

  render() {
    console.log('user in comments: ', this.props.savedJourney.users)
    return (
      <>
        {this.state.comments && this.state.comments.map(comment => (
          <div className='panelWrapper' key={comment.id}>
            <div>{comment.text}</div>
            {this.isOwner() && <button onClick={(e) => this.handleDeleteComment(e, comment.id)}>delete</button>}
          </div>
        ))}
        {this.isOwner() && 
          <form className='panelWrapper' onSubmit={this.handleSubmitComment}>
            <textarea
              rows='4'
              cols='5'
              type='textarea'
              placeholder="Comment"
              name="text"
              onChange={this.handleChange}
              value={this.state.text}
            />
            <button type='submit'>Add comment</button>
          </form>
        }
      </>
    )
  }
}

export default Comments