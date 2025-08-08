import React, { useState } from 'react';
import { 
  serviceProviderData, 
  getCategoryColor, 
  getStatusColor, 
  formatDate 
} from '../data/serviceProviderData';

const ServiceProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'providers', label: 'Service Providers' },
    { id: 'updates', label: 'Program Updates' },
    { id: 'voting', label: 'Voting Reports' },
    { id: 'analytics', label: 'Analytics' }
  ];

  const filteredProviders = selectedCategory === 'all' 
    ? serviceProviderData.activeServiceProviders
    : serviceProviderData.activeServiceProviders.filter(p => p.category === selectedCategory);

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'funding':
        return parseInt(b.funding.replace(/[$,]/g, '')) - parseInt(a.funding.replace(/[$,]/g, ''));
      case 'date':
        return new Date(b.applicationDate) - new Date(a.applicationDate);
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg border border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {serviceProviderData.programOverview.title}
            </h2>
            <p className="text-gray-300">{serviceProviderData.programOverview.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Current Phase:</p>
            <p className="text-blue-400 font-semibold">{serviceProviderData.programOverview.currentPhase}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Total Providers</h3>
            <p className="text-3xl font-bold">{serviceProviderData.statistics.totalProviders}</p>
            <p className="text-blue-100 text-sm">Active Service Providers</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Total Funding</h3>
            <p className="text-3xl font-bold">{serviceProviderData.statistics.totalFunding}</p>
            <p className="text-green-100 text-sm">Distributed</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Average Funding</h3>
            <p className="text-3xl font-bold">{serviceProviderData.statistics.averageFunding}</p>
            <p className="text-purple-100 text-sm">Per Provider</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Forum Activity</h3>
            <p className="text-3xl font-bold">{serviceProviderData.statistics.totalViews.toLocaleString()}</p>
            <p className="text-orange-100 text-sm">Total Views</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Program Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Since:</span>
                  <span className="text-white font-semibold">{formatDate(serviceProviderData.statistics.activeSince)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Forum Threads:</span>
                  <span className="text-blue-400 font-semibold">{serviceProviderData.statistics.forumThreads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Replies:</span>
                  <span className="text-green-400 font-semibold">{serviceProviderData.statistics.totalReplies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Updated:</span>
                  <span className="text-purple-400 font-semibold">{formatDate(serviceProviderData.programOverview.lastUpdated)}</span>
                </div>
              </div>
            </div>
            
            <div className="glass p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
              <div className="space-y-3">
                {Object.entries(serviceProviderData.categories).map(([category, data]) => (
                  <div key={category} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getCategoryColor(category)}`}></span>
                      <span className="text-gray-300">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{data.count} providers</div>
                      <div className="text-sm text-gray-400">{data.totalFunding}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Providers Tab */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-1"
              >
                <option value="all">All Categories</option>
                {Object.keys(serviceProviderData.categories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-1"
              >
                <option value="name">Name</option>
                <option value="funding">Funding</option>
                <option value="date">Application Date</option>
                <option value="views">Forum Views</option>
              </select>
            </div>
          </div>

          {/* Providers Table */}
          <div className="glass rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Funding</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Application</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Forum Activity</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {sortedProviders.map((provider) => (
                    <tr key={provider.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{provider.name}</div>
                          <div className="text-sm text-gray-400">{provider.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(provider.category)} text-white`}>
                          {provider.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-400">{provider.funding}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(provider.status)} text-white`}>
                          {provider.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{formatDate(provider.applicationDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          <div>{provider.views} views</div>
                          <div>{provider.replies} replies</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Program Updates Tab */}
      {activeTab === 'updates' && (
        <div className="space-y-4">
          {serviceProviderData.programUpdates.map((update) => (
            <div key={update.id} className="glass p-6 rounded-lg border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{update.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <span>{formatDate(update.date)}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white`}>
                      {update.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 mb-3">
                    Contributors: {update.contributors.join(', ')}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{update.replies} replies</span>
                    <span>{update.views} views</span>
                  </div>
                </div>
                <a
                  href={update.forumThread}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  View Thread
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Voting Reports Tab */}
      {activeTab === 'voting' && (
        <div className="glass rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Delegate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {serviceProviderData.votingReports.map((report, index) => (
                  <tr key={index} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{report.delegate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{formatDate(report.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{report.views}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={report.forumThread}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Report
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Funding Distribution</h3>
            <div className="space-y-3">
              {Object.entries(serviceProviderData.categories).map(([category, data]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getCategoryColor(category)}`}></span>
                    <span className="text-gray-300">{category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{data.totalFunding}</div>
                    <div className="text-sm text-gray-400">{data.count} providers</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Program Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Funding:</span>
                <span className="text-green-400 font-semibold">{serviceProviderData.statistics.totalFunding}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Average Funding:</span>
                <span className="text-blue-400 font-semibold">{serviceProviderData.statistics.averageFunding}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Forum Threads:</span>
                <span className="text-purple-400 font-semibold">{serviceProviderData.statistics.forumThreads}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Views:</span>
                <span className="text-orange-400 font-semibold">{serviceProviderData.statistics.totalViews.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDashboard; 