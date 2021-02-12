import React from 'react';
import axios from 'axios';

import './App.css';

class App extends React.Component {

  state = {
    title: '',
    body: '',
    posts: []
  };

  componentDidMount = () => {
    this.getBlogPost();
  };

  getBlogPost = () => {
    axios.get('/api')
      .then((response) => {
        const data = response.data;
        this.setState({ posts: data });
        console.log('Data has been received');
      })
      .catch(() => {
        alert('Error retrieving data!!');
      })
  }

  //target is the element that triggered the event. in this case it's input
  handleChange = ({target}) => {
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };

  submit = (event) => {
    event.preventDefault();

    const payload = {
      title: this.state.title,
      body: this.state.body
    };
    
    axios({
      url: '/api/save',
      method: 'POST',
      data: payload
      })
      .then(() => {
        console.log('Data has been sent to the server');
        this.resetUserInputs();
        this.getBlogPost();
      })
      .catch((e) => {
        console.log("Internal server error: ", e);
      });
  };

  resetUserInputs = () => {
    this.setState({
      title: '',
      body: ''
    });
  };

  displayBlogPost = (posts) => {
    if(!posts.length) return null;

    return posts.map((post, index) => (
      <div className="blog-post__display" key={index}>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
    ));
  }

  render() {

    console.log('State: ', this.state);

    //JSX
    return(
      <div className="app">
        <h2>Testing the ol pushie pushie</h2>
        <form onSubmit={this.submit}>
          <div className="form-input">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={this.state.title}
              onChange={this.handleChange}
             />
          </div>
          <div className="form-input">
            <textarea name="body" placeholder="Body" cols="30" rows="10" value={this.state.body} onChange={this.handleChange}></textarea>
          </div>

          <button>Submit</button>
        </form>
        <div className="blog-">
          {this.displayBlogPost(this.state.posts)}
        </div>
      </div>
    );
  }
}

export default App;
