// SafeNotes ENS Data Structure
export const safeNotesENSData = {
  title: "ENS Logo SafeNotes",
  admin: "Admin",
  connect: "Connect",
  safes: [
    {
      id: 1,
      safe: "ENS-001",
      amount: "$1,250,000",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      category: "Treasury",
      description: "Main ENS DAO treasury safe",
      date: "2025-01-15"
    },
    {
      id: 2,
      safe: "ENS-002", 
      amount: "$850,000",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      category: "Working Groups",
      description: "Ecosystem working group funding",
      date: "2025-01-20"
    },
    {
      id: 3,
      safe: "ENS-003",
      amount: "$650,000", 
      address: "0x7890abcdef1234567890abcdef1234567890abcd",
      category: "Meta-Governance",
      description: "Governance tooling and infrastructure",
      date: "2025-01-25"
    },
    {
      id: 4,
      safe: "ENS-004",
      amount: "$450,000",
      address: "0x4567890abcdef1234567890abcdef1234567890ab",
      category: "Public Goods",
      description: "Grants and community initiatives",
      date: "2025-02-01"
    },
    {
      id: 5,
      safe: "ENS-005",
      amount: "$320,000",
      address: "0xdef1234567890abcdef1234567890abcdef12345",
      category: "Emergency",
      description: "Emergency fund and contingency",
      date: "2025-02-05"
    }
  ],
  
  // Summary statistics
  summary: {
    totalSafes: 5,
    totalAmount: "$3,520,000",
    categories: {
      "Treasury": 1,
      "Working Groups": 1, 
      "Meta-Governance": 1,
      "Public Goods": 1,
      "Emergency": 1
    },
    lastUpdated: "2025-02-05"
  },

  // Category colors for UI
  categoryColors: {
    "Treasury": "blue",
    "Working Groups": "green", 
    "Meta-Governance": "purple",
    "Public Goods": "orange",
    "Emergency": "red"
  },

  // Source information
  source: {
    url: "https://safenotes.xyz/ens",
    name: "SafeNotes ENS",
    description: "ENS DAO Safe management and tracking"
  }
};

// Helper functions
export const formatSafeAmount = (amount) => {
  return amount.replace('$', '').replace(',', '');
};

export const getCategoryColor = (category) => {
  const colors = {
    "Treasury": "bg-blue-600",
    "Working Groups": "bg-green-600",
    "Meta-Governance": "bg-purple-600", 
    "Public Goods": "bg-orange-600",
    "Emergency": "bg-red-600"
  };
  return colors[category] || "bg-gray-600";
};

export const truncateAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}; 