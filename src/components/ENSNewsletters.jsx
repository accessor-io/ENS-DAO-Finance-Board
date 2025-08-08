import React from 'react';


const ENSNewsletters = () => {
  const newsletters = [
    {
      id: 86,
      date: "05/06/2025",
      title: "ENS DAO Newsletter #86",
      description: "Weekly community update and governance highlights"
    },
    {
      id: 87,
      date: "5/20/2025",
      title: "ENS DAO Newsletter #87",
      description: "Working group updates and treasury management insights"
    },
    {
      id: 88,
      date: "06/3/25",
      title: "ENS DAO Newsletter #88",
      description: "Q1 2025 spending summaries and governance distribution"
    },
    {
      id: 89,
      date: "06/17/25",
      title: "ENS DAO Newsletter #89",
      description: "Ecosystem development and community initiatives"
    },
    {
      id: 90,
      date: "07/01/25",
      title: "ENS DAO Newsletter #90",
      description: "Meta-governance updates and DAO tooling progress"
    },
    {
      id: 91,
      date: "07/15/25",
      title: "ENS DAO Newsletter #91",
      description: "Public goods funding and grant recipient updates"
    },
    {
      id: 92,
      date: "07/29/25",
      title: "ENS DAO Newsletter #92",
      description: "Latest developments and upcoming governance proposals"
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg border border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">ENS DAO Newsletters</h2>
            <p className="text-gray-300">Community updates and governance highlights</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Source:</p>
            <a 
              href="https://discuss.ens.domains/t/ens-working-group-spending-summaries/20706/3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              ENS DAO Governance Forum
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Total Newsletters</h3>
            <p className="text-3xl font-bold">{newsletters.length}</p>
            <p className="text-blue-100 text-sm">Published</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Latest Issue</h3>
            <p className="text-3xl font-bold">#92</p>
            <p className="text-green-100 text-sm">July 29, 2025</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Frequency</h3>
            <p className="text-3xl font-bold">Bi-weekly</p>
            <p className="text-purple-100 text-sm">Updates</p>
          </div>
        </div>
      </div>

      {/* Newsletters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsletters.map((newsletter) => (
          <div key={newsletter.id} className="glass p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{newsletter.title}</h3>
                <p className="text-gray-400 text-sm">{formatDate(newsletter.date)}</p>
              </div>
              <div className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                #{newsletter.id}
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{newsletter.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">ENS DAO</span>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Archive Info */}
      <div className="p-6 rounded-lg border border-gray-700 bg-gray-800">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Newsletter Archive</h3>
          <p className="text-gray-300 text-sm mb-4">
            All ENS DAO newsletters are published on the official ENS DAO Governance Forum and 
            provide regular updates on working group activities, treasury management, and community initiatives.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-400">
            <span>• Working Group Updates</span>
            <span>• Treasury Reports</span>
            <span>• Governance Proposals</span>
            <span>• Community Highlights</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ENSNewsletters; 