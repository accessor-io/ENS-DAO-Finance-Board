import React, { useState, useEffect } from 'react';
import { ensFinancialData } from '../data/ensData';
import MilestoneTracker from './MilestoneTracker';
import TaskManager from './TaskManager';

const ProjectTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activePhase, setActivePhase] = useState('development');

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const projectPhases = [
    {
      id: 'planning',
      name: 'Planning & Research',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      tasks: [
        { name: 'Requirements Analysis', status: 'completed', priority: 'high' },
        { name: 'Technology Stack Selection', status: 'completed', priority: 'high' },
        { name: 'Architecture Design', status: 'completed', priority: 'medium' },
        { name: 'API Integration Planning', status: 'completed', priority: 'medium' }
      ]
    },
    {
      id: 'development',
      name: 'Core Development',
      status: 'in-progress',
      progress: 85,
      startDate: '2024-01-16',
      endDate: '2024-02-15',
      tasks: [
        { name: 'Dashboard Framework Setup', status: 'completed', priority: 'high' },
        { name: 'Component Architecture', status: 'completed', priority: 'high' },
        { name: 'Data Integration Layer', status: 'completed', priority: 'high' },
        { name: 'Real-time Data Fetching', status: 'completed', priority: 'high' },
        { name: 'Analytics Implementation', status: 'completed', priority: 'medium' },
        { name: 'Error Handling System', status: 'in-progress', priority: 'medium' },
        { name: 'Performance Optimization', status: 'pending', priority: 'low' }
      ]
    },
    {
      id: 'testing',
      name: 'Testing & Quality Assurance',
      status: 'pending',
      progress: 0,
      startDate: '2024-02-16',
      endDate: '2024-03-01',
      tasks: [
        { name: 'Unit Testing', status: 'pending', priority: 'high' },
        { name: 'Integration Testing', status: 'pending', priority: 'high' },
        { name: 'Performance Testing', status: 'pending', priority: 'medium' },
        { name: 'Security Audit', status: 'pending', priority: 'high' },
        { name: 'User Acceptance Testing', status: 'pending', priority: 'medium' }
      ]
    },
    {
      id: 'deployment',
      name: 'Deployment & Launch',
      status: 'pending',
      progress: 0,
      startDate: '2024-03-02',
      endDate: '2024-03-15',
      tasks: [
        { name: 'Production Environment Setup', status: 'pending', priority: 'high' },
        { name: 'CI/CD Pipeline', status: 'pending', priority: 'high' },
        { name: 'Monitoring & Logging', status: 'pending', priority: 'medium' },
        { name: 'Documentation Finalization', status: 'pending', priority: 'medium' },
        { name: 'Launch Preparation', status: 'pending', priority: 'high' }
      ]
    }
  ];

  const features = [
    {
      id: 'dashboard-core',
      name: 'Dashboard Core',
      status: 'completed',
      description: 'Main dashboard with overview and navigation',
      components: ['Dashboard.jsx', 'Header.jsx', 'Sidebar.jsx'],
      progress: 100
    },
    {
      id: 'data-visualization',
      name: 'Data Visualization',
      status: 'completed',
      description: 'Charts and graphs for financial data',
      components: ['PieChart.jsx', 'BarChart.jsx', 'LineChart.jsx', 'AreaChart.jsx'],
      progress: 100
    },
    {
      id: 'real-time-data',
      name: 'Real-Time Data Integration',
      status: 'completed',
      description: 'Live blockchain data and API integration',
      components: ['RealTimeData.jsx', 'useENSData.js', 'api.js'],
      progress: 100
    },
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      status: 'completed',
      description: 'Risk assessment and performance insights',
      components: ['AnalyticsOverview.jsx'],
      progress: 100
    },
    {
      id: 'tables',
      name: 'Data Tables',
      status: 'completed',
      description: 'Sortable and filterable data tables',
      components: ['WalletsTable.jsx', 'TransactionsTable.jsx', 'ExpendituresTable.jsx', 'ContractsTable.jsx'],
      progress: 100
    },
    {
      id: 'endaoment',
      name: 'ENDAOment Management',
      status: 'completed',
      description: 'Fund tracking and disbursement monitoring',
      components: ['EndaomentOverview.jsx'],
      progress: 100
    },
    {
      id: 'testing',
      name: 'Testing Suite',
      status: 'pending',
      description: 'Comprehensive testing framework',
      components: ['Unit Tests', 'Integration Tests', 'E2E Tests'],
      progress: 0
    },
    {
      id: 'deployment',
      name: 'Deployment Infrastructure',
      status: 'pending',
      description: 'Production deployment and monitoring',
      components: ['CI/CD Pipeline', 'Monitoring', 'Logging'],
      progress: 0
    }
  ];

  const metrics = {
    totalComponents: 15,
    completedComponents: 12,
    totalFeatures: 8,
    completedFeatures: 6,
    totalTasks: 25,
    completedTasks: 18,
    codeCoverage: 0,
    performanceScore: 95,
    accessibilityScore: 90,
    seoScore: 85
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateOverallProgress = () => {
    const totalPhases = projectPhases.length;
    const completedPhases = projectPhases.filter(phase => phase.status === 'completed').length;
    const inProgressPhase = projectPhases.find(phase => phase.status === 'in-progress');
    
    let progress = (completedPhases / totalPhases) * 100;
    
    if (inProgressPhase) {
      progress += (inProgressPhase.progress / totalPhases);
    }
    
    return Math.round(progress);
  };

  return (
    <div className="space-y-6">
      {/* Milestone Tracker */}
      <MilestoneTracker />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ENS DAO Finance Schema</h1>
            <p className="text-blue-100 mt-2">Project Development Tracker</p>
            <p className="text-blue-200 text-sm mt-1">
              Last updated: {currentTime.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{calculateOverallProgress()}%</div>
            <div className="text-blue-200 text-sm">Overall Progress</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600 text-lg">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.completedComponents}</p>
              <p className="text-sm text-gray-500">Components Built</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-lg">⚡</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.performanceScore}</p>
              <p className="text-sm text-gray-500">Performance Score</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-lg">🎯</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.completedFeatures}</p>
              <p className="text-sm text-gray-500">Features Complete</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-yellow-600 text-lg">📊</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.completedTasks}</p>
              <p className="text-sm text-gray-500">Tasks Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Phases */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Development Phases</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {projectPhases.map((phase) => (
              <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(phase.status)}`}></div>
                    <h3 className="text-lg font-medium text-gray-900">{phase.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{phase.progress}%</div>
                    <div className="text-sm text-gray-500">
                      {phase.startDate} - {phase.endDate}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      phase.status === 'completed' ? 'bg-green-500' : 
                      phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${phase.progress}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {phase.tasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(task.status)}`}></div>
                        <span className="text-sm text-gray-700">{task.name}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Feature Progress</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    feature.status === 'completed' ? 'bg-green-100 text-green-800' :
                    feature.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {feature.status}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      feature.progress === 100 ? 'bg-green-500' : 
                      feature.progress > 0 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${feature.progress}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-500">
                  {feature.components.length} components • {feature.progress}% complete
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quality Metrics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{metrics.performanceScore}</span>
              </div>
              <h3 className="font-medium text-gray-900">Performance</h3>
              <p className="text-sm text-gray-500">Lighthouse Score</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">{metrics.accessibilityScore}</span>
              </div>
              <h3 className="font-medium text-gray-900">Accessibility</h3>
              <p className="text-sm text-gray-500">WCAG Compliance</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">{metrics.seoScore}</span>
              </div>
              <h3 className="font-medium text-gray-900">SEO</h3>
              <p className="text-sm text-gray-500">Search Optimization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Manager */}
      <TaskManager />
      
      {/* Next Steps */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">1</span>
            </div>
            <span className="text-gray-700">Implement comprehensive testing suite</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">2</span>
            </div>
            <span className="text-gray-700">Set up CI/CD pipeline for automated deployment</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">3</span>
            </div>
            <span className="text-gray-700">Configure production monitoring and logging</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">4</span>
            </div>
            <span className="text-gray-700">Finalize documentation and user guides</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTracker; 