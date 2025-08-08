import React, { useState, useEffect } from 'react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Implement comprehensive testing suite',
      description: 'Add unit tests, integration tests, and E2E tests for all components',
      status: 'pending',
      priority: 'high',
      assignee: 'Development Team',
      dueDate: '2024-02-28',
      progress: 0,
      category: 'testing',
      estimatedHours: 16,
      actualHours: 0,
      dependencies: ['Component architecture complete']
    },
    {
      id: 2,
      title: 'Set up CI/CD pipeline',
      description: 'Configure automated testing and deployment pipeline',
      status: 'pending',
      priority: 'high',
      assignee: 'DevOps Team',
      dueDate: '2024-03-05',
      progress: 0,
      category: 'deployment',
      estimatedHours: 12,
      actualHours: 0,
      dependencies: ['Testing suite complete']
    },
    {
      id: 3,
      title: 'Performance optimization',
      description: 'Optimize bundle size, implement code splitting, and improve load times',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Frontend Team',
      dueDate: '2024-02-25',
      progress: 60,
      category: 'optimization',
      estimatedHours: 8,
      actualHours: 5,
      dependencies: ['Core features complete']
    },
    {
      id: 4,
      title: 'Security audit implementation',
      description: 'Conduct security review and implement best practices',
      status: 'pending',
      priority: 'high',
      assignee: 'Security Team',
      dueDate: '2024-03-10',
      progress: 0,
      category: 'security',
      estimatedHours: 20,
      actualHours: 0,
      dependencies: ['All features complete']
    },
    {
      id: 5,
      title: 'Documentation finalization',
      description: 'Complete API documentation and user guides',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Documentation Team',
      dueDate: '2024-03-01',
      progress: 75,
      category: 'documentation',
      estimatedHours: 10,
      actualHours: 7,
      dependencies: ['API integration complete']
    },
    {
      id: 6,
      title: 'User acceptance testing',
      description: 'Conduct UAT with stakeholders and gather feedback',
      status: 'pending',
      priority: 'medium',
      assignee: 'QA Team',
      dueDate: '2024-03-12',
      progress: 0,
      category: 'testing',
      estimatedHours: 24,
      actualHours: 0,
      dependencies: ['All features complete', 'Documentation complete']
    },
    {
      id: 7,
      title: 'Production environment setup',
      description: 'Configure production servers and monitoring',
      status: 'pending',
      priority: 'high',
      assignee: 'DevOps Team',
      dueDate: '2024-03-08',
      progress: 0,
      category: 'deployment',
      estimatedHours: 16,
      actualHours: 0,
      dependencies: ['CI/CD pipeline complete']
    },
    {
      id: 8,
      title: 'Error handling improvements',
      description: 'Enhance error handling and user feedback systems',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Frontend Team',
      dueDate: '2024-02-27',
      progress: 40,
      category: 'development',
      estimatedHours: 6,
      actualHours: 2,
      dependencies: ['Core components complete']
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'testing': return 'bg-purple-100 text-purple-800';
      case 'deployment': return 'bg-blue-100 text-blue-800';
      case 'optimization': return 'bg-green-100 text-green-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'documentation': return 'bg-yellow-100 text-yellow-800';
      case 'development': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDaysUntil = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (dueDate) => {
    const daysUntil = calculateDaysUntil(dueDate);
    if (daysUntil < 0) return 'text-red-600';
    if (daysUntil <= 3) return 'text-orange-600';
    if (daysUntil <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredAndSortedTasks = tasks
    .filter(task => filter === 'all' || task.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'progress':
          return b.progress - a.progress;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => calculateDaysUntil(t.dueDate) < 0).length,
    highPriority: tasks.filter(t => t.priority === 'high').length
  };

  const totalEstimatedHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
  const totalActualHours = tasks.reduce((sum, task) => sum + task.actualHours, 0);
  const overallProgress = tasks.length > 0 ? 
    Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <p className="text-emerald-100 mt-2">Development Task Tracking</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{overallProgress}%</div>
            <div className="text-emerald-200 text-sm">Overall Progress</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Tasks</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-500">Overdue</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.highPriority}</div>
          <div className="text-sm text-gray-500">High Priority</div>
        </div>
      </div>

      {/* Time Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Estimated Hours</span>
              <span className="font-semibold text-gray-900">{totalEstimatedHours}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Actual Hours</span>
              <span className="font-semibold text-blue-600">{totalActualHours}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className="font-semibold text-green-600">{totalEstimatedHours - totalActualHours}h</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {stats.completed} of {stats.total} tasks completed
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Sort</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
                <option value="progress">Progress</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Task List</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredAndSortedTasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Assignee: {task.assignee}</span>
                      <span>Est: {task.estimatedHours}h</span>
                      <span>Actual: {task.actualHours}h</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getUrgencyColor(task.dueDate)}`}>
                      Due: {task.dueDate}
                    </div>
                    <div className="text-xs text-gray-500">
                      {calculateDaysUntil(task.dueDate)} days {calculateDaysUntil(task.dueDate) < 0 ? 'overdue' : 'remaining'}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      task.progress === 100 ? 'bg-green-500' : 
                      task.progress > 0 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{task.progress}% complete</span>
                  {task.dependencies.length > 0 && (
                    <span className="text-orange-600">
                      Dependencies: {task.dependencies.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager; 