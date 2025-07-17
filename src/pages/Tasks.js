import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiCheck, FiTrash2, FiCalendar, FiClock, FiFilter } from 'react-icons/fi';
import { format, parseISO, isToday, isTomorrow, isPast, addDays } from 'date-fns';

// Mock data (will be replaced with API calls)
const mockTasks = [
  {
    id: 1,
    title: 'Call John Smith',
    description: 'Follow up on property interest',
    dueDate: '2025-07-15',
    type: 'lead-followup',
    completed: false,
    relatedToId: 1,
    relatedToType: 'lead'
  },
  {
    id: 2,
    title: 'Schedule showing at 123 Main St',
    description: 'For the Miller family, evening preferred',
    dueDate: '2025-07-12',
    type: 'showing',
    completed: false,
    relatedToId: 1,
    relatedToType: 'listing'
  },
  {
    id: 3,
    title: 'Submit offer for Jane Doe',
    description: 'On 456 Oak Ave property',
    dueDate: '2025-07-13',
    type: 'offer',
    completed: true,
    relatedToId: 2,
    relatedToType: 'lead'
  },
  {
    id: 4,
    title: 'Prepare listing presentation',
    description: 'For the Johnson property on Pine Rd',
    dueDate: '2025-07-20',
    type: 'listing',
    completed: false,
    relatedToId: null,
    relatedToType: null
  }
];

const Tasks = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [displayFilter, setDisplayFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state for adding/editing tasks
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    type: 'lead-followup',
    completed: false
  });

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Will implement real API call here
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Open modal for adding new task
  const openAddModal = () => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      type: 'lead-followup',
      completed: false
    });
    setShowAddModal(true);
  };

  // Open modal for editing existing task
  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate,
      type: task.type,
      completed: task.completed
    });
    setShowAddModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedTask) {
        // Update existing task (will implement real API call)
        const updatedTasks = tasks.map(task => 
          task.id === selectedTask.id ? { ...task, ...formData } : task
        );
        setTasks(updatedTasks);
      } else {
        // Add new task (will implement real API call)
        const newTask = {
          id: tasks.length + 1,
          ...formData,
          relatedToId: null,
          relatedToType: null
        };
        setTasks([...tasks, newTask]);
      }
      
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Toggle task completion
  const toggleTaskStatus = async (id) => {
    try {
      // Will implement real API call here
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        // Will implement real API call here
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesDisplay = 
      displayFilter === 'all' ? true :
      displayFilter === 'today' ? isToday(parseISO(task.dueDate)) :
      displayFilter === 'tomorrow' ? isTomorrow(parseISO(task.dueDate)) :
      displayFilter === 'upcoming' ? (!isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && !isTomorrow(parseISO(task.dueDate))) :
      displayFilter === 'overdue' ? (isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && !task.completed) :
      displayFilter === 'completed' ? task.completed : true;
      
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
      
    return matchesDisplay && matchesType;
  });

  // Task type color
  const getTypeColor = (type) => {
    switch (type) {
      case 'lead-followup':
        return 'bg-blue-100 text-blue-800';
      case 'showing':
        return 'bg-purple-100 text-purple-800';
      case 'offer':
        return 'bg-green-100 text-green-800';
      case 'listing':
        return 'bg-yellow-100 text-yellow-800';
      case 'admin':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format task type for display
  const formatTaskType = (type) => {
    switch (type) {
      case 'lead-followup':
        return 'Lead Follow-up';
      case 'showing':
        return 'Property Showing';
      case 'offer':
        return 'Offer/Contract';
      case 'listing':
        return 'Listing Task';
      case 'admin':
        return 'Administrative';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Get due date class
  const getDueDateClass = (dueDate) => {
    const date = parseISO(dueDate);
    if (isPast(date) && !isToday(date)) {
      return 'text-red-600 font-medium';
    } else if (isToday(date)) {
      return 'text-yellow-600 font-medium';
    } else if (isTomorrow(date)) {
      return 'text-orange-600 font-medium';
    } else {
      return 'text-gray-500';
    }
  };

  // Format due date for display
  const formatDueDate = (dueDate) => {
    const date = parseISO(dueDate);
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'MMM dd, yyyy');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Task List */}
      <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-xl font-semibold text-gray-800">Tasks</h1>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Display filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </span>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={displayFilter}
                onChange={(e) => setDisplayFilter(e.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="today">Due Today</option>
                <option value="tomorrow">Due Tomorrow</option>
                <option value="upcoming">Upcoming</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {/* Type filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </span>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="lead-followup">Lead Follow-up</option>
                <option value="showing">Property Showing</option>
                <option value="offer">Offer/Contract</option>
                <option value="listing">Listing Task</option>
                <option value="admin">Administrative</option>
              </select>
            </div>
            
            {/* Add task button */}
            <button 
              onClick={openAddModal}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" /> Add Task
            </button>
          </div>
        </div>
        
        {filteredTasks.length > 0 ? (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`flex items-start bg-gray-50 p-4 rounded-lg border-l-4 ${
                  task.completed ? 'border-gray-300 opacity-60' : 'border-blue-500'
                }`}
              >
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  onChange={() => toggleTaskStatus(task.id)}
                  checked={task.completed}
                />
                <div className="ml-3 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center mt-1 sm:mt-0 space-x-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(task.type)}`}>
                        {formatTaskType(task.type)}
                      </span>
                      <span className={`text-xs ${getDueDateClass(task.dueDate)}`}>
                        <FiClock className="inline mr-1" /> {formatDueDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                  {task.description && (
                    <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="ml-2 flex space-x-1">
                  <button 
                    onClick={() => openEditModal(task)}
                    className="p-1 text-gray-400 hover:text-blue-500"
                  >
                    <FiCheck className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FiCheck className="h-12 w-12 mb-2" />
            <p className="text-lg">No tasks found</p>
            <p className="text-sm">Create a new task to get started</p>
          </div>
        )}
      </div>
      
      {/* Add Task Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
            <input 
              id="title"
              type="text" 
              name="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Details (Optional)</label>
            <textarea 
              id="description"
              name="description"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add more details about this task..."
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input 
              id="dueDate"
              type="date" 
              name="dueDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
            <select 
              id="type"
              name="type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="lead-followup">Lead Follow-up</option>
              <option value="showing">Property Showing</option>
              <option value="offer">Offer/Contract</option>
              <option value="listing">Listing Task</option>
              <option value="admin">Administrative</option>
            </select>
          </div>
          
          <button 
            type="button"
            onClick={handleSubmit}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Task
          </button>
        </div>
      </div>
      
      {/* Edit Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
                  <input 
                    type="text" 
                    name="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details (Optional)</label>
                  <textarea 
                    name="description"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input 
                      type="date" 
                      name="dueDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                    <select 
                      name="type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="lead-followup">Lead Follow-up</option>
                      <option value="showing">Property Showing</option>
                      <option value="offer">Offer/Contract</option>
                      <option value="listing">Listing Task</option>
                      <option value="admin">Administrative</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="completed"
                    id="completed"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={formData.completed}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
                    Mark as completed
                  </label>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {selectedTask ? 'Update' : 'Add'} Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
