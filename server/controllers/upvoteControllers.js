const Upvote = require('../models/Upvote');

exports.upvoteEvent = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { eventId } = req.params;
    
    // Check if upvote already exists
    const allUpvotes = await Upvote.list();
    const existingUpvote = allUpvotes.find(u => u.user_id == userId && u.event_id == eventId);
    
    if (existingUpvote) {
      return res.status(409).json({ error: 'Already upvoted this event' });
    }
    
    // Create new upvote
    const upvote = await Upvote.create({ user_id: userId, event_id: eventId });
    res.status(201).json(upvote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeUpvote = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { eventId } = req.params;
    
    // Find the upvote record
    const allUpvotes = await Upvote.list();
    const upvote = allUpvotes.find(u => u.user_id == userId && u.event_id == eventId);
    
    if (upvote) {
      if (upvote.user_id !== userId) {
        return res.status(403).json({ error: 'Forbidden: Not your upvote' });
      }
      await Upvote.delete(upvote.id);
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Upvote not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUpvotesForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const allUpvotes = await Upvote.list();
    const eventUpvotes = allUpvotes.filter(u => String(u.event_id) === String(eventId));
    res.json(eventUpvotes); // Return the array of upvote objects
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

exports.getUpvotesByUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const allUpvotes = await Upvote.list();
    const userUpvotes = allUpvotes.filter(u => String(u.user_id) === String(userId));
    res.json(userUpvotes); // Return the array of upvote objects
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}