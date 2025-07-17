import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Eye, 
  FileText, 
  ImageIcon, 
  Instagram, 
  Layout, 
  Maximize2, 
  Search, 
  Sliders, 
  Star, 
  Users,
  X
} from 'lucide-react';

const SocialContent = () => {
  const [darkMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  
  // Template categories
  const categories = [
    { id: 'listings', name: 'Listings', count: 12 },
    { id: 'tips', name: 'Buyer/Seller Tips', count: 18 },
    { id: 'market', name: 'Market Updates', count: 8 },
    { id: 'seasonal', name: 'Seasonal', count: 6 },
    { id: 'personal', name: 'Personal Branding', count: 10 },
  ];
  
  // Sample templates
  const templates = [
    { 
      id: 1, 
      title: 'New Listing Announcement', 
      category: 'listings',
      platforms: ['instagram', 'facebook', 'nextdoor'],
      image: 'https://placehold.co/300x300/e2e8f0/1e293b?text=New+Listing',
      description: 'Announce your newest property with key details and high-quality photos',
      popular: true
    },
    { 
      id: 2, 
      title: '10 Lake Property Tips', 
      category: 'tips',
      platforms: ['instagram', 'facebook', 'linkedin'],
      image: 'https://placehold.co/300x300/e2e8f0/1e293b?text=Lake+Tips',
      description: 'Essential considerations for waterfront property buyers',
      popular: true
    },
    { 
      id: 3, 
      title: 'Market Snapshot', 
      category: 'market',
      platforms: ['instagram', 'facebook', 'linkedin', 'nextdoor'],
      image: 'https://placehold.co/300x300/e2e8f0/1e293b?text=Market+Data',
      description: 'Share current market trends with charts and expert analysis',
      popular: false
    },
    { 
      id: 4, 
      title: 'Summer Home Maintenance', 
      category: 'seasonal',
      platforms: ['instagram', 'facebook', 'nextdoor'],
      image: 'https://placehold.co/300x300/e2e8f0/1e293b?text=Summer+Tips',
      description: 'Seasonal checklist for homeowners to maintain their property',
      popular: false
    },
    { 
      id: 5, 
      title: 'Agent Introduction', 
      category: 'personal',
      platforms: ['instagram', 'facebook', 'linkedin'],
      image: 'https://placehold.co/300x300/e2e8f0/1e293b?text=Agent+Bio',
      description: 'Introduce yourself and highlight your expertise and service areas',
      popular: true
    },
    { 
      id: 6, 
      title: 'Just Sold Property', 
      category: 'listings',
      platforms: ['instagram', 'facebook', 'nextdoor'],
      image: 'https://placehold.co/300x300/e2e8f0/1e293b?text=Sold+Property',
      description: 'Showcase your recent sales success with property details',
      popular: false
    },
  ];
  
  // Filter templates based on search and platform
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || template.platforms.includes(selectedPlatform);
    return matchesSearch && matchesPlatform;
  });
  
  // Selected template content (simulated)
  const templateContent = selectedTemplate ? {
    title: selectedTemplate.title,
    content: `✨ ${selectedTemplate.title} ✨\n\nLooking for the perfect lakefront property in Atlanta? Here are 10 essential tips to consider before making your purchase:\n\n1. Water quality and restrictions\n2. Flood zones and insurance requirements\n3. Dock and boating regulations\n4. Seasonal water level changes\n5. Shoreline erosion concerns\n6. Privacy and neighboring properties\n7. Road access during all seasons\n8. Community rules and HOA details\n9. Wildlife considerations\n10. Future development plans\n\nReady to find your dream waterfront home? Let's talk! 📞 Contact me today for personalized guidance on lake properties in the Atlanta area.`,
    hashtags: '#AtlantaRealEstate #LakeProperty #WaterfrontHomes #HomeownerTips #GeorgiaLiving'
  } : null;
  
  // Sample AI suggestions for the selected template
  const aiSuggestions = [
    'Add specific details about Lake Lanier or Lake Allatoona for local relevance',
    'Include a mortgage rate update to create urgency',
    'Mention the tax benefits of waterfront property ownership',
    'Add a client success story with permission',
    'Highlight seasonal activities possible at lakefront properties'
  ];
  
  // Toggle preview mode
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };
  
  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setPreviewMode(false);
  };
  
  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top header */}
      <header className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex justify-between items-center`}>
        <h1 className="text-xl font-bold">Social Content Generator</h1>
        
        <div className="flex items-center space-x-4">
          <div className={`relative rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <input 
              type="text" 
              placeholder="Search templates..." 
              className="px-10 py-2 rounded-md bg-transparent focus:outline-none w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            {searchQuery && (
              <button 
                className="absolute right-3 top-2.5 text-gray-400"
                onClick={() => setSearchQuery('')}
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-sm mr-2">Platform:</span>
            <select 
              className={`rounded-md py-2 px-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="nextdoor">Nextdoor</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Categories & Templates */}
        {!selectedTemplate || (selectedTemplate && !previewMode) ? (
          <div className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-medium">Categories</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <ul>
                <li>
                  <button 
                    className={`w-full text-left px-4 py-3 flex justify-between items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedTemplate(null)}
                  >
                    <div className="flex items-center">
                      <Layout size={16} className="mr-2 text-blue-500" />
                      <span>All Templates</span>
                    </div>
                    <span className="text-sm text-gray-500">{templates.length}</span>
                  </button>
                </li>
                
                {categories.map(category => (
                  <li key={category.id}>
                    <button 
                      className={`w-full text-left px-4 py-3 flex justify-between items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center">
                        {category.id === 'listings' && <ImageIcon size={16} className="mr-2 text-green-500" />}
                        {category.id === 'tips' && <FileText size={16} className="mr-2 text-purple-500" />}
                        {category.id === 'market' && <Sliders size={16} className="mr-2 text-orange-500" />}
                        {category.id === 'seasonal' && <Calendar size={16} className="mr-2 text-red-500" />}
                        {category.id === 'personal' && <Users size={16} className="mr-2 text-cyan-500" />}
                        <span>{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="px-4 pt-6 pb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Popular Templates</h3>
              </div>
              
              <ul className="mb-4">
                {templates.filter(t => t.popular).map(template => (
                  <li key={template.id}>
                    <button 
                      className={`w-full text-left px-4 py-3 flex items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${selectedTemplate?.id === template.id ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <Star size={16} className="mr-2 text-yellow-500" />
                      <span className="text-sm">{template.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
        
        {/* Center - Templates or Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!selectedTemplate ? (
            /* Template gallery */
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-6">Content Templates</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <div 
                    key={template.id}
                    className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-blue-500 cursor-pointer transition-all duration-200 transform hover:-translate-y-1`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={template.image} 
                        alt={template.title}
                        className="w-full h-full object-cover"
                      />
                      {template.popular && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Star size={12} className="mr-1" />
                          Popular
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                        <h3 className="text-white font-medium">{template.title}</h3>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {template.platforms.map(platform => (
                          <span 
                            key={platform}
                            className={`text-xs px-2 py-1 rounded-full 
                              ${platform === 'instagram' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' : ''}
                              ${platform === 'facebook' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : ''}
                              ${platform === 'nextdoor' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}
                              ${platform === 'linkedin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : ''}
                            `}
                          >
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredTemplates.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">No templates found</h3>
                    <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Template editor or preview */
            previewMode ? (
              /* Preview mode */
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-lg mx-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Preview: {selectedTemplate.title}</h2>
                    <button 
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center`}
                      onClick={togglePreview}
                    >
                      <Edit size={18} className="mr-2" />
                      <span>Edit</span>
                    </button>
                  </div>
                  
                  <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-8`}>
                    {/* Instagram-style preview */}
                    <div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                        MB
                      </div>
                      <div>
                        <p className="font-medium text-sm">mattbaker_realty</p>
                        <p className="text-xs text-gray-500">Atlanta, GA</p>
                      </div>
                    </div>
                    
                    <img 
                      src={selectedTemplate.image}
                      alt={selectedTemplate.title}
                      className="w-full aspect-square object-cover"
                    />
                    
                    <div className="p-4">
                      <div className="mb-3">
                        <p className="font-medium">mattbaker_realty</p>
                        <p className="whitespace-pre-line text-sm">{templateContent.content.slice(0, 150)}... <span className="text-gray-500">more</span></p>
                      </div>
                      
                      <p className="text-sm text-blue-500 dark:text-blue-400">{templateContent.hashtags}</p>
                    </div>
                  </div>
                  
                  <div className="rounded-xl overflow-hidden bg-blue-50 dark:bg-blue-900 p-4 mb-6">
                    <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Ready to Schedule</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">This post is optimized and ready to be published.</p>
                    
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-800' : 'bg-white'} flex items-center justify-between`}>
                      <div className="flex items-center">
                        <Calendar size={18} className="mr-2 text-blue-500" />
                        <input 
                          type="date" 
                          className="bg-transparent border-none focus:outline-none text-sm"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <Clock size={18} className="mr-2 text-blue-500" />
                        <select className="bg-transparent border-none focus:outline-none text-sm">
                          <option>10:00 AM</option>
                          <option>11:00 AM</option>
                          <option>12:00 PM</option>
                          <option>1:00 PM</option>
                          <option>2:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium">
                      Save Draft
                    </button>
                    <button className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-medium">
                      Schedule Post
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Editor mode */
              <div className="flex-1 flex">
                <div className="flex-1 overflow-y-auto p-6 border-r border-gray-200 dark:border-gray-700">
                  <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Edit Template: {selectedTemplate.title}</h2>
                      <div className="flex space-x-2">
                        <button 
                          className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center`}
                          onClick={togglePreview}
                        >
                          <Eye size={18} className="mr-2" />
                          <span>Preview</span>
                        </button>
                        <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center`}>
                          <Maximize2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-medium">Post Title</label>
                        <span className="text-xs text-gray-500">(Internal use only)</span>
                      </div>
                      <input 
                        type="text" 
                        className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        value={templateContent?.title || ''}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-medium">Image</label>
                        <button className="text-blue-500 text-sm">Change Image</button>
                      </div>
                      <div className="relative rounded-lg overflow-hidden mb-2 aspect-video">
                        <img 
                          src={selectedTemplate.image}
                          alt={selectedTemplate.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Primary image for post</span>
                        <span>1:1 ratio recommended</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="font-medium block mb-2">Post Content</label>
                      <div className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg overflow-hidden`}>
                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} flex space-x-2`}>
                          <button className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>B</button>
                          <button className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>I</button>
                          <button className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>U</button>
                          <span className="text-gray-500">|</span>
                          <button className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>😊</button>
                          <button className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>@</button>
                          <button className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>#</button>
                        </div>
                        <textarea 
                          rows={12}
                          className={`w-full p-3 ${darkMode ? 'bg-gray-700' : 'bg-white'} resize-none focus:outline-none`}
                          value={templateContent?.content || ''}
                        ></textarea>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-500">Optimized for Instagram</span>
                        <span className="text-sm text-gray-500">2,193/2,200 characters</span>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <label className="font-medium block mb-2">Hashtags</label>
                      <input 
                        type="text" 
                        className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        value={templateContent?.hashtags || ''}
                      />
                      <p className="text-sm text-gray-500 mt-1">Separate hashtags with spaces</p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium">
                        Regenerate with AI
                      </button>
                      <button className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-medium">
                        Save & Preview
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* AI Suggestions */}
                <div className="w-72 overflow-y-auto p-4 bg-blue-50 dark:bg-gray-800">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-4 flex items-center">
                    <Star size={16} className="mr-2" />
                    AI Suggestions
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {aiSuggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors`}
                      >
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-4 flex items-center">
                    <Instagram size={16} className="mr-2" />
                    Platform Optimization
                  </h3>
                  
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} mb-3`}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">Instagram</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        Optimized
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Image ratio, character count, and hashtags are optimized</p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} mb-3`}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">Facebook</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                        Consider changes
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Reduce hashtags for better engagement on Facebook</p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">Nextdoor</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        Optimized
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Content is appropriately local and conversational</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default SocialContent;