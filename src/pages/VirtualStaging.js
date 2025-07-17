import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  ImageIcon, 
  Save, 
  Share, 
  Square, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Move,
  Check,
  Search,
  X,
  Download,
  ExternalLink
} from 'lucide-react';

const VirtualStaging = () => {
  const [darkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('living');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFurniture, setSelectedFurniture] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  
  // Simulated furniture items by category
  const furnitureItems = {
    living: [
      { id: 'sofa1', name: 'Modern Sofa', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Sofa' },
      { id: 'chair1', name: 'Accent Chair', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Chair' },
      { id: 'coffee1', name: 'Coffee Table', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Table' },
      { id: 'lamp1', name: 'Floor Lamp', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Lamp' },
      { id: 'rug1', name: 'Area Rug', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Rug' },
      { id: 'shelf1', name: 'Bookshelf', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Shelf' },
    ],
    kitchen: [
      { id: 'table1', name: 'Dining Table', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Table' },
      { id: 'chair2', name: 'Dining Chair', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Chair' },
      { id: 'island1', name: 'Kitchen Island', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Island' },
    ],
    bedroom: [
      { id: 'bed1', name: 'Queen Bed', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Bed' },
      { id: 'dresser1', name: 'Dresser', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Dresser' },
      { id: 'nightstand1', name: 'Nightstand', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Nightstand' },
    ],
    decor: [
      { id: 'plant1', name: 'Indoor Plant', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Plant' },
      { id: 'art1', name: 'Wall Art', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Art' },
      { id: 'vase1', name: 'Decorative Vase', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Vase' },
    ],
    outdoor: [
      { id: 'patio1', name: 'Patio Set', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Patio' },
      { id: 'lounge1', name: 'Lounge Chair', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Lounge' },
      { id: 'umbrella1', name: 'Patio Umbrella', image: 'https://placehold.co/120x80/e2e8f0/1e293b?text=Umbrella' },
    ]
  };
  
  // Simulated property photos
  const propertyPhotos = [
    { id: 1, name: 'Living Room', image: 'https://placehold.co/800x500/e2e8f0/1e293b?text=Living+Room+Empty' },
    { id: 2, name: 'Kitchen', image: 'https://placehold.co/800x500/e2e8f0/1e293b?text=Kitchen+Empty' },
    { id: 3, name: 'Master Bedroom', image: 'https://placehold.co/800x500/e2e8f0/1e293b?text=Bedroom+Empty' },
    { id: 4, name: 'Bathroom', image: 'https://placehold.co/800x500/e2e8f0/1e293b?text=Bathroom+Empty' },
    { id: 5, name: 'Backyard', image: 'https://placehold.co/800x500/e2e8f0/1e293b?text=Backyard+Empty' },
  ];
  
  // Filtered furniture based on search
  const filteredFurniture = searchQuery 
    ? Object.values(furnitureItems).flat().filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : furnitureItems[activeCategory];
  
  // Helper function to add furniture to the scene
  const addFurniture = (item) => {
    setSelectedFurniture([...selectedFurniture, {
      ...item,
      instanceId: Date.now(), // Create a unique ID for this instance
      position: { x: 50, y: 50 }, // Default position
      rotation: 0,
      scale: 1,
    }]);
  };
  
  // Helper function to remove furniture from the scene
  const removeFurniture = (instanceId) => {
    setSelectedFurniture(selectedFurniture.filter(item => item.instanceId !== instanceId));
  };
  
  // Helper to toggle the before/after comparison view
  const toggleCompare = () => {
    setShowCompare(!showCompare);
  };
  
  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top header */}
      <header className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex justify-between items-center`}>
        <h1 className="text-xl font-bold">Virtual Staging</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center`}
            onClick={toggleCompare}
          >
            <ImageIcon size={18} className="mr-2" />
            <span>{showCompare ? 'Exit Compare' : 'Before/After'}</span>
          </button>
          
          <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center`}>
            <RotateCcw size={18} className="mr-2" />
            <span>Reset</span>
          </button>
          
          <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center`}>
            <Save size={18} className="mr-2" />
            <span>Save</span>
          </button>
          
          <button className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center">
            <Download size={18} className="mr-2" />
            <span>Export Images</span>
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Property photos */}
        <div className={`w-56 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-medium mb-2">Property Photos</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">5 photos available</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {propertyPhotos.map((photo) => (
              <div 
                key={photo.id}
                className={`rounded-lg overflow-hidden cursor-pointer ${photo.id === 1 ? 'ring-2 ring-blue-500' : ''}`}
              >
                <img src={photo.image} alt={photo.name} className="w-full h-20 object-cover" />
                <p className="text-xs p-1">{photo.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Center - Canvas area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas toolbar */}
          <div className={`h-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b border-gray-200 dark:border-gray-700 flex items-center px-4`}>
            <div className="flex items-center space-x-2">
              <button className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <Move size={16} />
              </button>
              <button className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <Edit3 size={16} />
              </button>
              <button className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <Square size={16} />
              </button>
              <span className="ml-2 text-sm text-gray-500">|</span>
              <span className="text-sm">Living Room</span>
            </div>
            
            <div className="ml-auto flex items-center space-x-2">
              <span className="text-sm text-gray-500">Zoom:</span>
              <button className="text-sm px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">100%</button>
              <button className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <ChevronLeft size={16} />
              </button>
              <button className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Canvas area */}
          <div className="flex-1 bg-gray-300 dark:bg-gray-700 overflow-hidden flex items-center justify-center relative">
            {/* Before/After comparison mode */}
            {showCompare ? (
              <div className="relative w-full h-full flex">
                <div className="w-1/2 h-full overflow-hidden border-r-2 border-white">
                  <img 
                    src={propertyPhotos[0].image} 
                    alt="Before" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    Before
                  </div>
                </div>
                <div className="w-1/2 h-full overflow-hidden">
                  <img 
                    src="https://placehold.co/800x500/e2e8f0/1e293b?text=Living+Room+Staged" 
                    alt="After" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    After
                  </div>
                </div>
              </div>
            ) : (
              /* Normal editing mode */
              <div className="relative w-full h-full">
                {/* Main room image */}
                <img 
                  src={propertyPhotos[0].image} 
                  alt="Room" 
                  className="w-full h-full object-contain"
                />
                
                {/* Placed furniture items */}
                {selectedFurniture.map((item) => (
                  <div 
                    key={item.instanceId}
                    className="absolute cursor-move border-2 border-blue-500"
                    style={{
                      left: `${item.position.x}%`,
                      top: `${item.position.y}%`,
                      transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
                      width: '100px',
                      height: '60px',
                    }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Control handles that would appear on selection */}
                    <div className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-md">
                      <Trash2 size={14} className="text-red-500" onClick={() => removeFurniture(item.instanceId)} />
                    </div>
                  </div>
                ))}
                
                {/* AI suggestion tooltip (example) */}
                <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg max-w-xs flex items-start">
                  <ImageIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">AI Suggestion</p>
                    <p className="text-xs">This living room would look great with a modern sectional sofa and coffee table.</p>
                  </div>
                  <button className="ml-2 text-white p-1">
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right sidebar - Furniture library */}
        <div className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-l border-gray-200 dark:border-gray-700 flex flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-medium mb-2">Furniture Library</h2>
            
            {/* Search box */}
            <div className={`rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center p-1.5 mb-4`}>
              <Search size={16} className="text-gray-500 mr-1" />
              <input 
                type="text" 
                placeholder="Search furniture..." 
                className="bg-transparent text-sm w-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X size={16} className="text-gray-500" />
                </button>
              )}
            </div>
            
            {/* Category tabs */}
            <div className="flex space-x-1 overflow-x-auto pb-2 mb-2">
              {Object.keys(furnitureItems).map((category) => (
                <button 
                  key={category}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                    activeCategory === category 
                      ? 'bg-blue-500 text-white' 
                      : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => {
                    setActiveCategory(category);
                    setSearchQuery('');
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Furniture items */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-2">
              {filteredFurniture.map((item) => (
                <div 
                  key={item.id}
                  className={`rounded-lg overflow-hidden cursor-pointer border ${darkMode ? 'border-gray-700 hover:border-blue-500' : 'border-gray-200 hover:border-blue-500'}`}
                  onClick={() => addFurniture(item)}
                >
                  <div className="h-20 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="max-w-full max-h-full" />
                  </div>
                  <div className="p-1">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredFurniture.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No furniture items found.</p>
                <p className="text-xs mt-1">Try a different category or search term.</p>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center mb-2">
              <Check size={16} className="mr-2" />
              Apply Staging
            </button>
            
            <button className="w-full py-2 text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md flex items-center justify-center">
              <ExternalLink size={16} className="mr-2" />
              View in 3D Space
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirtualStaging;