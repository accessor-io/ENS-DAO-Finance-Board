import React, { useState, useEffect } from 'react';

const MilestoneTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const milestones = [
    {
      id: 'm1',
      title: 'Project Foundation',
      description: 'Core architecture and basic dashboard setup',
      status: 'completed',
      date: '2024-01-15',
      progress: 100,
      achievements: [
        'React + Vite setup completed',
        'Tailwind CSS integration',
        'Basic component structure',
        'Routing system implemented'
      ],
      metrics: {
        components: 5,
        features: 3,
        performance: 95
      }
    },
    {
      id: 'm2',
      title: 'Data Integration',
      description: 'Real-time blockchain data and API connections',
      status: 'completed',
      date: '2024-01-30',
      progress: 100,
      achievements: [
        'Etherscan API integration',
        'ENS domain resolution',
        'Real-time data fetching',
        'Caching system implemented'
      ],
      metrics: {
        components: 8,
        features: 5,
        performance: 92
      }
    },
    {
      id: 'm3',
      title: 'Analytics Dashboard',
      description: 'Advanced analytics and risk assessment features',
      status: 'completed',
      date: '2024-02-10',
      progress: 100,
      achievements: [
        'Risk assessment metrics',
        'Treasury health scoring',
        'Performance insights',
        'Strategic recommendations'
      ],
      metrics: {
        components: 12,
        features: 7,
        performance: 94
      }
    },
    {
      id: 'm4',
      title: 'Production Readiness',
      description: 'Testing, optimization, and deployment preparation',
      status: 'in-progress',
      date: '2024-02-25',
      progress: 60,
      achievements: [
        'Error handling system',
        'Performance optimization',
        'Build optimization',
        'Documentation updates'
      ],
      metrics: {
        components: 15,
        features: 8,
        performance: 96
      }
    },
    {
      id: 'm5',
      title: 'Launch & Deployment',
      description: 'Production deployment and monitoring setup',
      status: 'pending',
      date: '2024-03-15',
      progress: 0,
      achievements: [
        'CI/CD pipeline setup',
        'Production environment',
        'Monitoring and logging',
        'User acceptance testing'
      ],
      metrics: {
        components: 15,
        features: 8,
        performance: 98
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      case 'blocked': return 'Blocked';
      default: return 'Unknown';
    }
  };

  const calculateDaysUntil = (targetDate) => {
    const target = new Date(targetDate);
    const diffTime = target - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Milestone Tracker</h1>
            <p className="text-indigo-100 mt-2">Project Development Milestones</p>
            <p className="text-indigo-200 text-sm mt-1">
              Current Date: {currentDate.toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">
              {milestones.filter(m => m.status === 'completed').length}/{milestones.length}
            </div>
            <div className="text-indigo-200 text-sm">Milestones Complete</div>
          </div>
        </div>
      </div>

      {/* Milestone Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Development Timeline</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div 
                key={milestone.id} 
                className={`relative border-l-4 pl-6 pb-6 ${
                  milestone.status === 'completed' ? 'border-green-500' :
                  milestone.status === 'in-progress' ? 'border-blue-500' :
                  'border-gray-300'
                }`}
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-2 w-4 h-4 rounded-full border-2 border-white ${
                  getStatusColor(milestone.status)
                }`}></div>
                
                {/* Milestone Content */}
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                     onClick={() => setSelectedMilestone(selectedMilestone === milestone.id ? null : milestone.id)}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusText(milestone.status)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {milestone.date}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(milestone.progress)}`}
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{milestone.progress}% Complete</span>
                    {milestone.status === 'pending' && (
                      <span className="text-blue-600">
                        {calculateDaysUntil(milestone.date)} days remaining
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedMilestone === milestone.id && (
                  <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Achievements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {milestone.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-700">{achievement}</span>
                        </div>
                      ))}
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-3">Metrics</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{milestone.metrics.components}</div>
                        <div className="text-xs text-gray-500">Components</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{milestone.metrics.features}</div>
                        <div className="text-xs text-gray-500">Features</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{milestone.metrics.performance}</div>
                        <div className="text-xs text-gray-500">Performance</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {milestones.filter(m => m.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-500">Milestones Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 text-xl">⚡</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {milestones.filter(m => m.status === 'in-progress').length}
              </p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-yellow-600 text-xl">📅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {milestones.filter(m => m.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      {(() => {
        const nextMilestone = milestones.find(m => m.status === 'pending' || m.status === 'in-progress');
        if (!nextMilestone) return null;
        
        return (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Milestone</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{nextMilestone.title}</h4>
                <p className="text-sm text-gray-600">{nextMilestone.description}</p>
                <p className="text-xs text-gray-500 mt-1">Target: {nextMilestone.date}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">{nextMilestone.progress}%</div>
                <div className="text-sm text-gray-500">Progress</div>
              </div>
            </div>
            {nextMilestone.status === 'pending' && (
              <div className="mt-3 text-sm text-yellow-700">
                ⏰ {calculateDaysUntil(nextMilestone.date)} days until target date
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default MilestoneTracker; 