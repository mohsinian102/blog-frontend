const express = require('express');
const router = express.Router();
const axios = require('axios');
require ('dotenv').config({ path: '../.env '});

const backendPath = process.env.BACKEND_PATH;

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${backendPath}/posts/all`);
    let loggedInStatus = await axios.get(`${backendPath}/auth/status`, {withCredentials: true});
    console.log(loggedInStatus.data);
    res.render('index', { posts: response.data, verified: loggedInStatus.data });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Render individual blog post
router.get('/post/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/posts/${req.params.id}`);
    res.render('post', { post: response.data });
  } catch (error) {
    res.status(500).send('Error fetching the post');
  }
});

// Render register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle user registration
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      username: req.body.username,
      password: req.body.password
    });
    res.redirect('/login');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Render login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle user login
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5000/auth/login', {
      email: req.body.email,
      password: req.body.password
    });
  } catch (error) {
    console.log(error);
    console.log(req.body);
    res.status(400).send(error);
  }
});

// Render page to create a new post
router.get('/posts/new', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('createPost');
});

// Handle new post creation
router.post('/posts', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3000/api/posts', {
      title: req.body.title,
      content: req.body.content,
      userId: req.session.user.id
    });
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error creating post');
  }
});

// Render edit post page
router.get('/posts/:id/edit', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/posts/${req.params.id}`);
    res.render('editPost', { post: response.data });
  } catch (error) {
    res.status(500).send('Error fetching post');
  }
});

// Handle post updates
router.post('/posts/:id', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/posts/${req.params.id}`, {
      title: req.body.title,
      content: req.body.content
    });
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error updating post');
  }
});

// Handle post deletion
router.post('/posts/:id/delete', async (req, res) => {
  try {
    await axios.delete(`http://localhost:3000/api/posts/${req.params.id}`);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error deleting post');
  }
});

module.exports = router;
