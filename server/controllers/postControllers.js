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

exports.updatePost = async (req, res) => {
  try {
    // Make sure id is a number
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid post ID' });
    }
    
    const post = await Post.update(id, req.body);
    
    if (!post) {
      return res.status(404).send({ message: 'Post not found or could not be updated' });
    }
    
    res.send(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).send({ message: 'Error updating post' });
  }
};

exports.deletePost = async (req,res) => {
  try{
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({message: 'Invalid post ID'});
    }

   const deletedCount = await Post.deletePost(id);

   if (deletedCount === 0) {
    return res.status(404).send({ message: 'Post not found' });
   }

    res.send({message: 'Post deleted successfully'});
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send({message: 'Error deleting post'});
  }
}
