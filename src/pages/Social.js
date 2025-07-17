import React, { useState, useEffect } from 'react';
import { FiPlus, FiCalendar, FiImage, FiSend, FiClock, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';

// Mock data
const mockPosts = [
  {
    id: 1,
    platform: 'nextdoor',
    content: 'NEW LISTING! $450,000 - 3BR/2BA gem in Downtown! Beautiful 1800 sq ft home with hardwood floors.',
    images: [],
    status: 'published',
    publishedTime: '2025-07-01T14:30:00Z',
    listingId: 1,
    engagement: { views: 124, likes: 14, comments: 3, shares: 2 }
  },
  {
    id: 2,
    platform: 'nextdoor',
    content: 'PRICE REDUCED! $525,000 - 4BR/3BA in Oak Hills! Amazing 2200 sq ft home with updated kitchen.',
    images: [],
    status: 'scheduled',
    scheduledTime: '2025-07-15T16:00:00Z',
    listingId: 2,
    engagement: { views: 0, likes: 0, comments: 0, shares: 0 }
  }
];

const mockListings = [
  { id: 1, address: '123 Main St', price: 450000, bedrooms: 3, bathrooms: 2, squareFootage: 1800, status: 'active' },
  { id: 2, address: '456 Oak Ave', price: 525000, bedrooms: 4, bathrooms: 3, squareFootage: 2200, status: 'pending' }
];

const Social = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [listings, setListings] = useState(mockListings);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state for creating posts
  const [formData, setFormData] = useState({
    content: '',
    platform: 'nextdoor',
    listingId: '',
    scheduledTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    images: []
  });

  // Generate post content based on listing
  const generatePostContent = (listing) => {
    const content = `NEW LISTING! $${listing.price.toLocaleString()} - ${listing.bedrooms}BR/${listing.bathrooms}BA in ${listing.address.split(' ').pop()}! 
      
Beautiful ${listing.squareFootage.toLocaleString()} sq ft home with modern features. Great location with easy access to parks, shopping, and top schools! 

Message me for a private showing! 🏡✨`;
    
    setFormData({
      ...formData,
      content: content
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-populate post content when listing is selected
    if (name === 'listingId' && value) {
      const listing = listings.find(listing => listing.id === parseInt(value));
      if (listing) {
        generatePostContent(listing);
      }
    }
  };

  // Open modal for creating new post
  const openCreateModal = (listingId = null) => {
    setShowCreateModal(true);
    setIsScheduled(false);
    
    if (listingId) {
      const listing = listings.find(listing => listing.id === listingId);
      if (listing) {
        setFormData({
          content: '',
          platform: 'nextdoor',
          listingId: listing.id.toString(),
          scheduledTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          images: []
        });
        generatePostContent(listing);
      }
    } else {
      setFormData({
        content: '',
        platform: 'nextdoor',
        listingId: '',
        scheduledTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        images: []
      });
    }
  };

  // Open post detail modal
  const openDetailModal = (post) => {
    setSelectedPost(post);
    setShowDetailModal(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare post data
    const postData = {
      ...formData,
      status: isScheduled ? 'scheduled' : 'published',
      listingId: formData.listingId ? parseInt(formData.listingId) : null
    };
    
    if (isScheduled) {
      // Schedule post
      const newPost = {
        id: posts.length + 1,
        ...postData,
        scheduledTime: postData.scheduledTime,
        publishedTime: null,
        engagement: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0
        }
      };
      setPosts([...posts, newPost]);
    } else {
      // Publish post immediately
      const newPost = {
        id: posts.length + 1,
        ...postData,
        publishedTime: new Date().toISOString(),
        scheduledTime: null,
        engagement: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0
        }
      };
      setPosts([...posts, newPost]);
    }
    
    setShowCreateModal(false);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesPlatform && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div>
      {/* Header with filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="text-xl font-semibold text-gray-800">Social Media Management</h1>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Platform filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </span>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
              >
                <option value="all">All Platforms</option>
                <option value="nextdoor">Nextdoor</option>
              </select>
            </div>
            
            {/* Status filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiClock className="h-5 w-5 text-gray-400" />
              </span>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            
            {/* Create post button */}
            <button 
              onClick={() => openCreateModal()}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiPlus className="mr-2" /> Create Post
            </button>
          </div>
        </div>
      </div>
      
      {/* Listings quick access */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Post for Listing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listings.filter(listing => listing.status !== 'sold').map(listing => (
            <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900">{listing.address}</h3>
              <p className="text-gray-600">${listing.price.toLocaleString()} - {listing.bedrooms}BR/{listing.bathrooms}BA</p>
              <p className="text-sm text-gray-500 mt-1">{listing.squareFootage.toLocaleString()} sqft</p>
              <button
                onClick={() => openCreateModal(listing.id)}
                className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                <FiSend className="mr-2" /> Create Post
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Posts list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Posts</h2>
        </div>
        
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredPosts.map(post => (
              <div 
                key={post.id} 
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => openDetailModal(post)}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex-1 mb-3 md:mb-0 md:mr-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
                        Nextdoor
                      </span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? 'Published' : 'Scheduled'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900">
                      {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                    </p>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      {post.status === 'published' ? (
                        <span><FiClock className="inline mr-1" /> Published: {formatDate(post.publishedTime)}</span>
                      ) : (
                        <span><FiCalendar className="inline mr-1" /> Scheduled: {formatDate(post.scheduledTime)}</span>
                      )}
                    </div>
                  </div>
                  
                  {post.status === 'published' && (
                    <div className="flex space-x-4">
                      <div className="text-center">
                        <p className="text-xl font-semibold text-gray-900">{post.engagement.views}</p>
                        <p className="text-xs text-gray-500">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-semibold text-gray-900">{post.engagement.likes}</p>
                        <p className="text-xs text-gray-500">Likes</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FiSend className="h-12 w-12 mb-2" />
            <p className="text-lg">No posts found</p>
            <p className="text-sm">Create a new post to get started</p>
          </div>
        )}
      </div>
      
      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Create Social Media Post
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Platform selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select 
                  name="platform"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.platform}
                  onChange={handleInputChange}
                >
                  <option value="nextdoor">Nextdoor</option>
                </select>
              </div>
              
              {/* Listing selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Listing</label>
                <select 
                  name="listingId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.listingId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a listing</option>
                  {listings.filter(listing => listing.status !== 'sold').map(listing => (
                    <option key={listing.id} value={listing.id}>
                      {listing.address} - ${listing.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Post content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Content</label>
                <textarea 
                  name="content"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="5"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter your post content here..."
                ></textarea>
              </div>
              
              {/* Schedule option */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="scheduled"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={isScheduled}
                    onChange={() => setIsScheduled(!isScheduled)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="scheduled" className="font-medium text-gray-700">Schedule for later</label>
                </div>
              </div>
              
              {/* Schedule datetime */}
              {isScheduled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date & Time</label>
                  <input 
                    type="datetime-local" 
                    name="scheduledTime"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isScheduled ? 'Schedule Post' : 'Post Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Post Detail Modal */}
      {showDetailModal && selectedPost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Post Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  Nextdoor
                </span>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedPost.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedPost.status === 'published' ? 'Published' : 'Scheduled'}
                </span>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-gray-900 whitespace-pre-line">{selectedPost.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Status</h4>
                  <p className="text-gray-900">
                    {selectedPost.status === 'published' ? (
                      <>Published on {formatDate(selectedPost.publishedTime)}</>
                    ) : (
                      <>Scheduled for {formatDate(selectedPost.scheduledTime)}</>
                    )}
                  </p>
                </div>
                
                {selectedPost.listingId && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Related Listing</h4>
                    <p className="text-gray-900">
                      {listings.find(l => l.id === selectedPost.listingId)?.address || 'Unknown listing'}
                    </p>
                  </div>
                )}
              </div>
              
              {selectedPost.status === 'published' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Engagement</h4>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xl font-semibold text-blue-700">{selectedPost.engagement.views}</p>
                      <p className="text-xs text-gray-500">Views</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-xl font-semibold text-red-700">{selectedPost.engagement.likes}</p>
                      <p className="text-xs text-gray-500">Likes</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xl font-semibold text-green-700">{selectedPost.engagement.comments}</p>
                      <p className="text-xs text-gray-500">Comments</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xl font-semibold text-purple-700">{selectedPost.engagement.shares}</p>
                      <p className="text-xs text-gray-500">Shares</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                {selectedPost.status === 'scheduled' && (
                  <button 
                    onClick={() => {
                      const updatedPosts = posts.map(post => 
                        post.id === selectedPost.id ? 
                        { ...post, status: 'published', publishedTime: new Date().toISOString(), scheduledTime: null } : 
                        post
                      );
                      setPosts(updatedPosts);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                  >
                    Publish Now
                  </button>
                )}
                <button 
                  onClick={() => {
                    const updatedPosts = posts.filter(post => post.id !== selectedPost.id);
                    setPosts(updatedPosts);
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Social;