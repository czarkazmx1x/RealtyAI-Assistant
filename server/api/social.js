import express from 'express';
import { Post, Listing } from '../models/database.js';
import { authenticateUser } from '../middleware/auth.js';
import { postToNextdoor } from '../../post_to_nextdoor.mcp.js';

const router = express.Router();

// Get all posts
router.get('/', authenticateUser, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get posts by platform
router.get('/platform/:platform', authenticateUser, async (req, res) => {
  try {
    const posts = await Post.find({ platform: req.params.platform }).sort({ createdAt: -1 });
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    console.error('Error fetching posts by platform:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single post
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create draft post
router.post('/draft', authenticateUser, async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      status: 'draft'
    });
    
    await post.save();
    
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Error creating draft post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Post to Nextdoor
router.post('/nextdoor', authenticateUser, async (req, res) => {
  try {
    const { listingId, content, images } = req.body;
    
    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    
    // Create post data
    const postData = {
      address: listing.address,
      post: content || `Check out this great property at ${listing.address}!`,
      listingData: {
        Address: listing.address,
        Bedrooms: listing.bedrooms,
        Bathrooms: listing.bathrooms,
        Square_Footage: listing.squareFootage,
        'Lot_Size_(acres)': listing.lotSize,
        Features: listing.features,
        Price: listing.price,
        Neighborhood: listing.neighborhood
      }
    };
    
    // Post to Nextdoor
    const result = await postToNextdoor(postData, images || []);
    
    if (result.success) {
      // Save post to database
      const post = new Post({
        platform: 'nextdoor',
        content: postData.post,
        images: images ? images.map(img => img.url || img) : [],
        listingId,
        status: 'published',
        publishedTime: new Date(),
        engagement: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0
        }
      });
      
      await post.save();
      
      res.json({ 
        success: true, 
        message: 'Posted to Nextdoor successfully',
        data: {
          post,
          nextdoorResult: result
        }
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Failed to post to Nextdoor',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error posting to Nextdoor:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Schedule post
router.post('/schedule', authenticateUser, async (req, res) => {
  try {
    const { listingId, content, platform, scheduledTime, images } = req.body;
    
    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    
    // Create scheduled post
    const post = new Post({
      platform,
      content,
      images: images ? images.map(img => img.url || img) : [],
      listingId,
      status: 'scheduled',
      scheduledTime: new Date(scheduledTime)
    });
    
    await post.save();
    
    res.status(201).json({ 
      success: true, 
      message: `Post scheduled for ${new Date(scheduledTime).toLocaleString()}`,
      data: post
    });
  } catch (error) {
    console.error('Error scheduling post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.json({ success: true, message: 'Post removed' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
