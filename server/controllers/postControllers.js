const Post = require('../models/Post');

exports.listPosts = async (req, res) => {
  try {
    const posts = await Post.list(); // This should fetch all events/posts
    res.send(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send({ message: 'Error fetching posts' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).send(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send({ message: 'Error creating post' });
  }
};

