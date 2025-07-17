import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, 
  Calendar, 
  Users, 
  ArrowRight, 
  MessageSquare, 
  Phone, 
  Edit3
} from 'lucide-react';

const Dashboard = () => {
  const [darkMode] = useState(false);
  const [stats, setStats] = useState({
    activeListings: 12,
    pendingContacts: 8,
    upcomingTasks: 5
  });
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In the actual implementation, this would call the API
        // const [propertiesRes, contactsRes, tasksRes] = await Promise.all([
        //   axios.get('/api/properties'),
        //   axios.get('/api/contacts'),
        //   axios.get('/api/tasks')
        // ]);

        // For now, we'll use mock data
        setStats({
          activeListings: 12,
          pendingContacts: 8,
          upcomingTasks: 5
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // AI-suggested tasks
  const suggestedTasks = [
    {
      id: 1,
      title: 'Call Jane Smith',
      description: 'Follow up on Oakwood property visit',
      priority: 'high',
      dueTime: '3:00 PM',
      dueDate: 'Today'
    },
    {
      id: 2,
      title: 'Send Lake Property Tips',
      description: 'Social post for waterfront property clients',
      priority: 'medium',
      dueTime: '5:00 PM',
      dueDate: 'Today'
    },
    {
      id: 3,
      title: 'Update MLS for 123 Pine Street',
      description: 'Price reduction approved',
      priority: 'low',
      dueTime: '',
      dueDate: 'Tomorrow'
    }
  ];

  // Today's schedule
  const todaySchedule = [
    {
      id: 1,
      title: 'Property Showing',
      time: '10:00 AM - 11:30 AM',
      location: '456 Maple Drive',
      type: 'showing'
    },
    {
      id: 2,
      title: 'Client Meeting',
      time: '1:00 PM - 2:00 PM',
      location: 'The Johnsons - Buyer Consultation',
      type: 'meeting'
    },
    {
      id: 3,
      title: 'Open House Prep',
      time: '3:30 PM - 5:00 PM',
      location: '789 Oak Lane',
      type: 'prep'
    }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome back, Matt</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats Section */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm`}>
            <h3 className="text-lg font-medium mb-2">Active Listings</h3>
            <p className="text-3xl font-bold">{stats.activeListings}</p>
            <p className="text-sm text-green-500 mt-2">+2 from last month</p>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm`}>
            <h3 className="text-lg font-medium mb-2">Pending Contacts</h3>
            <p className="text-3xl font-bold">{stats.pendingContacts}</p>
            <p className="text-sm text-yellow-500 mt-2">3 need follow-up</p>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm`}>
            <h3 className="text-lg font-medium mb-2">Upcoming Tasks</h3>
            <p className="text-3xl font-bold">{stats.upcomingTasks}</p>
            <p className="text-sm text-blue-500 mt-2">2 high priority</p>
          </div>
        </div>
        
        {/* AI Suggestions Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm col-span-1 lg:col-span-2`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">AI Suggested Tasks</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">Smart Priorities</span>
          </div>
          
          <div className="space-y-4">
            {suggestedTasks.map(task => (
              <div 
                key={task.id} 
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 
                  task.priority === 'high' ? 'bg-blue-50 border-l-4 border-blue-500' : 
                  task.priority === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 
                  'bg-gray-100 border-l-4 border-gray-500'
                }`}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{task.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' : 
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300' : 
                    'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                  }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
                <div className="flex justify-between mt-3">
                  <span className="text-xs text-gray-500">{task.dueDate}{task.dueTime ? `, ${task.dueTime}` : ''}</span>
                  <button className="text-xs px-3 py-1 rounded-lg bg-blue-500 text-white">
                    {task.title.toLowerCase().includes('call') ? 'Schedule Call' : 
                     task.title.toLowerCase().includes('send') ? 'Create Post' : 
                     'Schedule'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Calendar Preview Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm`}>
          <h3 className="text-lg font-medium mb-4">Today's Schedule</h3>
          
          <div className="space-y-4">
            {todaySchedule.map(event => (
              <div 
                key={event.id} 
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-l-4 ${
                  event.type === 'showing' ? 'border-blue-500' : 
                  event.type === 'meeting' ? 'border-green-500' : 
                  'border-purple-500'
                }`}
              >
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{event.time}</p>
                <p className="text-xs mt-1">{event.location}</p>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg">
            View Full Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;