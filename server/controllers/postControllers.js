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
    const post = await Post.create({
      ...req.body, // req.body already has images URL string and other fields
    });

    res.status(201).send(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send({ message: "Error creating post" });
  }
};

exports.updatePost = async (req, res) => {
  try {
     // Make sure id is a number
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid post ID' });
    }

    // If a new image file is uploaded, set the images field
    if (req.file && req.file.path) {
      req.body.images = req.file.path; // Set the image URL (Cloudinary URL or local file path)
    }

    // If no image is uploaded, ensure the images field is left unchanged (don't overwrite existing image URL)
    else if (!req.body.images) {
      // Keep the original image if no new file is uploaded and the body doesn't have an image field
      const existingPost = await Post.findById(id);
      if (existingPost) {
        req.body.images = existingPost.images; // Preserve the current image URL
      }
    }

    // Update the post with new data
    const updatedPost = await Post.update(id, req.body);

    if (!updatedPost) {
      return res.status(404).send({ message: 'Post not found or could not be updated' });
    }

    res.send(updatedPost); // Send the updated post
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
