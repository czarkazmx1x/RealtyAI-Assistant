import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Check, 
  Edit, 
  Home, 
  Info, 
  AlertCircle, 
  ExternalLink, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';

const ListingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [darkMode] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [showAITip, setShowAITip] = useState(false);
  
  // Simulated MLS data that would be extracted from photos
  const [mlsData, setMlsData] = useState({
    address: '123 Lakeside Drive',
    city: 'Atlanta',
    state: 'GA',
    zip: '30305',
    price: '1,295,000',
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    yearBuilt: 2015,
    lotSize: '0.5 acres',
    propertyType: 'Single Family',
    status: 'Active'
  });
  
  // Simulated AI-generated description
  const [description, setDescription] = useState(
    "Nestled along the pristine shores of a private lake, this stunning 4-bedroom, 3.5-bath residence offers luxurious lakeside living just minutes from downtown Atlanta. The home's expansive windows frame breathtaking water views from nearly every room, while the open-concept design creates a seamless flow between indoor and outdoor living spaces.\n\nThe gourmet kitchen features top-of-the-line stainless steel appliances, custom cabinetry, and a large center island - perfect for entertaining. The primary suite is a true retreat with a spa-like bathroom and private balcony overlooking the water.\n\nOutdoor amenities include a multi-level deck, private dock, and professionally landscaped grounds. Energy-efficient systems and smart home technology complete this exceptional property, offering the perfect blend of luxury, comfort, and natural beauty."
  );
  
  // Simulated photo data
  const simulatedPhotos = [
    { id: 1, url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Front+Exterior', tag: 'Exterior', isPrimary: true },
    { id: 2, url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Kitchen', tag: 'Kitchen' },
    { id: 3, url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Living+Room', tag: 'Living Room' },
    { id: 4, url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Master+Bedroom', tag: 'Primary Bedroom' },
    { id: 5, url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Bathroom', tag: 'Bathroom' },
    { id: 6, url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Backyard', tag: 'Backyard' },
  ];
  
  // Set photos on component mount in a real app
  useState(() => {
    setPhotos(simulatedPhotos);
  });
  
  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const toggleAITip = () => {
    setShowAITip(!showAITip);
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">New Listing Wizard</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
              <div className="flex space-x-1">
                <div className={`h-2 w-10 rounded-full ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`h-2 w-10 rounded-full ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`h-2 w-10 rounded-full ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Step 1: Photo Upload & Auto-tagging */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Upload & Tag Property Photos</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Upload photos of the property. Our AI will automatically detect and tag key features.</p>
            
            <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Property Photos</h3>
                
                {/* Photo Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {photos.map(photo => (
                    <div key={photo.id} className="relative group">
                      <img 
                        src={photo.url} 
                        alt={photo.tag} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        {photo.isPrimary && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 rounded-b-lg">
                        <p className="text-sm font-medium">{photo.tag}</p>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 bg-white rounded-full text-gray-800 mr-2">
                          <Edit size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Upload Button */}
                  <div className={`border-2 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500`}>
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Upload More Photos</p>
                  </div>
                </div>
                
                <div className="flex items-center text-blue-500 text-sm cursor-pointer">
                  <Camera size={16} className="mr-1" />
                  <span>Open Camera App</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Auto-Detected Property Info</h3>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} mb-4`}>
                  <div className="flex items-start">
                    <div className="p-1 bg-blue-100 rounded-full text-blue-600 mr-2">
                      <Info size={16} />
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Our AI has analyzed your photos and extracted the following information. Please review and adjust if needed.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <input 
                        type="text" 
                        className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        value={mlsData.address}
                        onChange={(e) => setMlsData({...mlsData, address: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input 
                          type="text" 
                          className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.city}
                          onChange={(e) => setMlsData({...mlsData, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <input 
                          type="text" 
                          className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.state}
                          onChange={(e) => setMlsData({...mlsData, state: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ZIP</label>
                        <input 
                          type="text" 
                          className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.zip}
                          onChange={(e) => setMlsData({...mlsData, zip: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <input 
                          type="text" 
                          className={`w-full p-2 pl-8 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.price}
                          onChange={(e) => setMlsData({...mlsData, price: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Beds</label>
                        <input 
                          type="text" 
                          className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.beds}
                          onChange={(e) => setMlsData({...mlsData, beds: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Baths</label>
                        <input 
                          type="text" 
                          className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.baths}
                          onChange={(e) => setMlsData({...mlsData, baths: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Sq Ft</label>
                        <input 
                          type="text" 
                          className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.sqft}
                          onChange={(e) => setMlsData({...mlsData, sqft: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Year Built</label>
                        <input 
                          type="text" 
                          className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.yearBuilt}
                          onChange={(e) => setMlsData({...mlsData, yearBuilt: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Lot Size</label>
                        <input 
                          type="text" 
                          className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.lotSize}
                          onChange={(e) => setMlsData({...mlsData, lotSize: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Property Type</label>
                        <select 
                          className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.propertyType}
                          onChange={(e) => setMlsData({...mlsData, propertyType: e.target.value})}
                        >
                          <option>Single Family</option>
                          <option>Condo</option>
                          <option>Townhouse</option>
                          <option>Multi-Family</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select 
                          className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                          value={mlsData.status}
                          onChange={(e) => setMlsData({...mlsData, status: e.target.value})}
                        >
                          <option>Active</option>
                          <option>Pending</option>
                          <option>Sold</option>
                          <option>Coming Soon</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: AI Description Preview & Edit */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">AI-Generated Listing Description</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Our AI has created an SEO-optimized listing description based on your photos and property details. Review and edit as needed.</p>
            
            <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Property Description</h3>
                <div className="flex items-center">
                  <button 
                    className="p-1 rounded-full bg-blue-100 text-blue-600 mr-2 relative"
                    onClick={toggleAITip}
                  >
                    <Info size={16} />
                    {showAITip && (
                      <div className="absolute right-0 mt-2 w-64 p-3 bg-white text-gray-800 rounded-lg shadow-lg z-10 text-xs">
                        <p className="font-medium mb-1">Why this description is SEO-friendly:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Contains high-value keywords: "lakeside living", "Atlanta"</li>
                          <li>Highlights unique selling points</li>
                          <li>Uses descriptive language that appeals to search engines</li>
                          <li>Properly structured with specific details</li>
                        </ul>
                      </div>
                    )}
                  </button>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">SEO Optimized</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} mb-6`}>
                <div className="flex items-start">
                  <div className="p-1 bg-blue-100 rounded-full text-blue-600 mr-2 flex-shrink-0">
                    <AlertCircle size={16} />
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">This description highlights lakefront features and emphasizes proximity to Atlanta. Keywords for local SEO have been included.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <textarea 
                  rows={12}
                  className={`w-full p-3 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} resize-none`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 text-sm">Shorten</button>
                  <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 text-sm">More Formal</button>
                  <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 text-sm">Highlight Views</button>
                </div>
                <button className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm">Regenerate</button>
              </div>
            </div>
            
            <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex mb-4">
                  <img 
                    src="https://placehold.co/600x400/e2e8f0/1e293b?text=Front+Exterior"
                    alt="Property Preview" 
                    className="w-1/3 h-48 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-bold mb-1">${mlsData.price}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{mlsData.address}, {mlsData.city}, {mlsData.state} {mlsData.zip}</p>
                    <div className="flex space-x-4 mb-3">
                      <div className="flex items-center">
                        <Home size={16} className="mr-1" />
                        <span>{mlsData.beds} Beds</span>
                      </div>
                      <div>
                        <span>{mlsData.baths} Baths</span>
                      </div>
                      <div>
                        <span>{mlsData.sqft} Sq Ft</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {description.substring(0, 180)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Publish & Export */}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Publish Listing</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Your listing is ready to be published. Choose your export options.</p>
            
            <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Review Summary</h3>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
                  <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <img 
                      src="https://placehold.co/600x400/e2e8f0/1e293b?text=Front+Exterior"
                      alt="Property" 
                      className="w-full md:w-1/4 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
                    />
                    <div>
                      <h4 className="text-xl font-bold mb-1">${mlsData.price}</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{mlsData.address}, {mlsData.city}, {mlsData.state} {mlsData.zip}</p>
                      <div className="flex flex-wrap gap-y-2 gap-x-4">
                        <div className="flex items-center">
                          <Home size={16} className="mr-1" />
                          <span>{mlsData.beds} Beds</span>
                        </div>
                        <div>
                          <span>{mlsData.baths} Baths</span>
                        </div>
                        <div>
                          <span>{mlsData.sqft} Sq Ft</span>
                        </div>
                        <div>
                          <span>{mlsData.yearBuilt} Built</span>
                        </div>
                        <div>
                          <span>{mlsData.lotSize} Lot</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Description Preview</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {description.substring(0, 200)}...
                    </p>
                    <button className="text-blue-500 text-sm mt-1">Show Full Description</button>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Export Options</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border-2 border-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Georgia MLS</h4>
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Recommended</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Export your listing directly to Georgia MLS with all data and photos.</p>
                    <button className="w-full py-2 bg-blue-500 text-white rounded-md flex items-center justify-center">
                      <ExternalLink size={16} className="mr-2" />
                      Export to MLS
                    </button>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                    <h4 className="font-medium mb-3">Your Website</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Publish this listing to your personal agent website.</p>
                    <button className="w-full py-2 bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md flex items-center justify-center">
                      <ExternalLink size={16} className="mr-2" />
                      Publish to Website
                    </button>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                    <h4 className="font-medium mb-3">Social Media</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Create social media posts to announce this new listing.</p>
                    <button className="w-full py-2 bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md flex items-center justify-center">
                      <ExternalLink size={16} className="mr-2" />
                      Create Social Posts
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Next Steps</h3>
                
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}>
                    <div className="p-1 bg-green-100 rounded-full text-green-600 mr-3 flex-shrink-0">
                      <Check size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Schedule Open House</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Set up open house dates and promote them.</p>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}>
                    <div className="p-1 bg-green-100 rounded-full text-green-600 mr-3 flex-shrink-0">
                      <Check size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Create Virtual Tour</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Add a virtual 3D tour to enhance the listing.</p>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}>
                    <div className="p-1 bg-green-100 rounded-full text-green-600 mr-3 flex-shrink-0">
                      <Check size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Notify Potential Buyers</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Send notifications to clients looking for similar properties.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto flex justify-between">
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 dark:text-blue-300'}`}
            onClick={handlePrevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft size={16} className="mr-2" />
            Previous
          </button>
          
          {currentStep < 3 ? (
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
              onClick={handleNextStep}
            >
              Next
              <ArrowRight size={16} className="ml-2" />
            </button>
          ) : (
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center"
            >
              Finish & Publish
              <Check size={16} className="ml-2" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListingWizard;