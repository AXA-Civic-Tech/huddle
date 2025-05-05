const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const { user_id, contents, event_id } = req.body;
    const comment = await Comment.create({ user_id, contents, event_id });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const allComments = await Comment.list();
    const eventComments = allComments.filter(c => c.event_id == eventId);
    res.json(eventComments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.find(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (req.session.userId !== comment.user_id) {
      return res.status(403).json({ error: 'Forbidden: Not your comment' });
    }
    await Comment.delete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 