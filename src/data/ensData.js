export const ensFinancialData = {
  dashboardMetadata: {
    version: "2.0.0",
    lastUpdated: "2025-04-30T11:47:00Z",
    dataSources: ["etherscan", "karpatkey", "dune-analytics", "ens-forum", "coingecko"]
  },
  ensDaoOverview: {
    totalAssets: 926000000,
    totalExpenditures: 642000, // Q1 2025 Working Group spending
    netBalance: 840000000,
    currency: "USD"
  },
  endaoment: {
    fundId: "ENS-Endaoment-2023",
    walletAddress: "0x4F2083f5fBede34C2714aFfb3105539775f7FE64",
    totalContributions: 52000000,
    disbursedAmount: 10000000,
    availableBalance: 42000000,
    recipients: [
      {
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        amount: {
          eth: 1000,
          usd: 3400000,
          ens: 0
        },
        purpose: "Grant for ENS development",
        txHash: "0x12345678abcdef1234567890abcdef1234567890abcdef1234567890abcdef12"
      },
      {
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        amount: {
          eth: 2000,
          usd: 6600000,
          ens: 0
        },
        purpose: "Infrastructure development",
        txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
      },
      {
        walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
        amount: {
          eth: 500,
          usd: 1700000,
          ens: 0
        },
        purpose: "Security audit funding",
        txHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba98"
      },
      {
        walletAddress: "0xfedcba9876543210fedcba9876543210fedcba98",
        amount: {
          eth: 800,
          usd: 2720000,
          ens: 0
        },
        purpose: "Community grants program",
        txHash: "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fe"
      }
    ]
  },
  wallets: [
    {
      address: "0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7",
      ensName: "wallet.ensdao.eth",
      type: "dao-treasury",
      balance: {
        eth: 43000,
        usd: 146200000,
        ens: 8800000
      },
      manager: "ens-dao"
    },
    {
      address: "0x4F2083f5fBede34C2714aFfb3105539775f7FE64",
      ensName: null,
      type: "endaoment",
      balance: {
        eth: 16000,
        usd: 52000000,
        ens: 0
      },
      manager: "karpatkey"
    },
    {
      address: "0x1234567890abcdef1234567890abcdef12345678",
      ensName: "controller.ens.eth",
      type: "controller",
      balance: {
        eth: 5000,
        usd: 17000000,
        ens: 2000000
      },
      manager: "ens-dao"
    },
    {
      address: "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5",
      ensName: "controller.ens.eth",
      type: "controller",
      balance: {
        eth: 12500,
        usd: 42500000,
        ens: 5500000
      },
      manager: "ens-dao"
    },
    {
      address: "0x5678901234abcdef5678901234abcdef56789012",
      ensName: "treasury2.ensdao.eth",
      type: "dao-treasury",
      balance: {
        eth: 25000,
        usd: 85000000,
        ens: 12000000
      },
      manager: "ens-dao"
    },
    {
      address: "0xabcdef5678901234abcdef5678901234abcdef56",
      ensName: null,
      type: "karpatkey-managed",
      balance: {
        eth: 8000,
        usd: 27200000,
        ens: 1500000
      },
      manager: "karpatkey"
    }
  ],
  transactions: [
    {
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      fromAddress: "0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7",
      toAddress: "0x4F2083f5fBede34C2714aFfb3105539775f7FE64",
      amount: {
        eth: 16000,
        usd: 52000000,
        ens: 0
      },
      timestamp: "2023-03-07T00:00:00Z",
      category: "endaoment-disbursement",
      description: "Transfer of 16,000 ETH to ENDAOment Safe wallet (EP3.4)"
    },
    {
      txHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
      fromAddress: "0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7",
      toAddress: "0x1234567890abcdef1234567890abcdef12345678",
      amount: {
        eth: 10000,
        usd: 34000000,
        ens: 0
      },
      timestamp: "2022-11-01T00:00:00Z",
      category: "eth-to-usdc-swap",
      description: "Swap 10,000 ETH to USDC for operational expenses"
    },
    {
      txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      fromAddress: "0x4F2083f5fBede34C2714aFfb3105539775f7FE64",
      toAddress: "0x1234567890abcdef1234567890abcdef12345678",
      amount: {
        eth: 1000,
        usd: 3400000,
        ens: 0
      },
      timestamp: "2023-04-15T10:30:00Z",
      category: "expenditure",
      description: "Grant disbursement for ENS development project"
    },
    {
      txHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
      fromAddress: "0x4F2083f5fBede34C2714aFfb3105539775f7FE64",
      toAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      amount: {
        eth: 2000,
        usd: 6600000,
        ens: 0
      },
      timestamp: "2023-05-20T14:45:00Z",
      category: "expenditure",
      description: "Infrastructure development funding"
    },
    {
      txHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
      fromAddress: "0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7",
      toAddress: "0x5678901234abcdef5678901234abcdef56789012",
      amount: {
        eth: 5000,
        usd: 17000000,
        ens: 0
      },
      timestamp: "2023-06-10T09:15:00Z",
      category: "transfer",
      description: "Internal treasury rebalancing"
    },
    {
      txHash: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
      fromAddress: "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5",
      toAddress: "0x9876543210fedcba9876543210fedcba98765432",
      amount: {
        eth: 500,
        usd: 1700000,
        ens: 0
      },
      timestamp: "2023-07-05T16:20:00Z",
      category: "expenditure",
      description: "Security audit payment"
    },
    {
      txHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      fromAddress: "0xabcdef5678901234abcdef5678901234abcdef56",
      toAddress: "0xfedcba9876543210fedcba9876543210fedcba98",
      amount: {
        eth: 800,
        usd: 2720000,
        ens: 0
      },
      timestamp: "2023-07-25T11:30:00Z",
      category: "expenditure",
      description: "Community grants program funding"
    },
    {
      txHash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
      fromAddress: "0x1234567890abcdef1234567890abcdef12345678",
      toAddress: "0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7",
      amount: {
        eth: 0,
        usd: 5000000,
        ens: 500000
      },
      timestamp: "2023-08-01T08:00:00Z",
      category: "revenue",
      description: "Domain registration fees revenue"
    }
  ],
  contracts: [
    {
      address: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
      ensName: "token.ensdao.eth",
      name: "$ENS Token",
      type: "token",
      deployedTimestamp: "2021-11-08T00:00:00Z"
    },
    {
      address: "0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef",
      ensName: "tokenlock.ensdao.eth",
      name: "Token Lock",
      type: "token-lock",
      deployedTimestamp: "2021-11-08T00:00:00Z"
    },
    {
      address: "0x323A76393544d5ecca80cd6ef2A560C6A395b7E3",
      ensName: "governor.ensdao.eth",
      name: "Governor",
      type: "governance",
      deployedTimestamp: "2021-11-08T00:00:00Z"
    },
    {
      address: "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5",
      ensName: "controller.ens.eth",
      name: "Controller",
      type: "controller",
      deployedTimestamp: "2017-05-01T00:00:00Z"
    },
    {
      address: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
      ensName: "registrar.ens.eth",
      name: "ENS Registrar",
      type: "controller",
      deployedTimestamp: "2019-05-04T00:00:00Z"
    },
    {
      address: "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41",
      ensName: "registry.ens.eth",
      name: "ENS Registry",
      type: "controller",
      deployedTimestamp: "2017-05-01T00:00:00Z"
    }
  ],
  expenditures: [
    {
      expenditureId: "EP3.3",
      category: "eth-to-usdc-swap",
      amount: {
        eth: 10000,
        usd: 34000000,
        ens: 0
      },
      recipient: "0x1234567890abcdef1234567890abcdef12345678",
      txHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
      description: "Swap 10,000 ETH to USDC for operational expenses",
      date: "2022-11-01T00:00:00Z"
    },
    {
      expenditureId: "EP3.4",
      category: "endaoment",
      amount: {
        eth: 16000,
        usd: 52000000,
        ens: 0
      },
      recipient: "0x4F2083f5fBede34C2714aFfb3105539775f7FE64",
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      description: "Transfer to ENDAOment Safe wallet",
      date: "2023-03-07T00:00:00Z"
    },
    {
      expenditureId: "EP4.1",
      category: "grants",
      amount: {
        eth: 1000,
        usd: 3400000,
        ens: 0
      },
      recipient: "0x1234567890abcdef1234567890abcdef12345678",
      txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      description: "Grant for ENS development project",
      date: "2023-04-15T10:30:00Z"
    },
    {
      expenditureId: "EP4.2",
      category: "development",
      amount: {
        eth: 2000,
        usd: 6600000,
        ens: 0
      },
      recipient: "0xabcdef1234567890abcdef1234567890abcdef12",
      txHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
      description: "Infrastructure development funding",
      date: "2023-05-20T14:45:00Z"
    },
    {
      expenditureId: "EP4.3",
      category: "operational",
      amount: {
        eth: 500,
        usd: 1700000,
        ens: 0
      },
      recipient: "0x9876543210fedcba9876543210fedcba98765432",
      txHash: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
      description: "Security audit payment",
      date: "2023-07-05T16:20:00Z"
    },
    {
      expenditureId: "EP4.4",
      category: "grants",
      amount: {
        eth: 800,
        usd: 2720000,
        ens: 0
      },
      recipient: "0xfedcba9876543210fedcba9876543210fedcba98",
      txHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      description: "Community grants program funding",
      date: "2023-07-25T11:30:00Z"
    }
  ],
  karpatkeyFinance: {
    managedAssets: 52000000,
    safeWallets: [
      {
        address: "0x4F2083f5fBede34C2714aFfb3105539775f7FE64",
        purpose: "endaoment"
      },
      {
        address: "0xabcdef5678901234abcdef5678901234abcdef56",
        purpose: "treasury"
      }
    ],
    strategies: [
      {
        strategyId: "ENS-KP-001",
        description: "Liquidity provision on Aave",
        allocatedAmount: 26000000,
        protocol: "aave"
      },
      {
        strategyId: "ENS-KP-002",
        description: "Staking on Lido",
        allocatedAmount: 26000000,
        protocol: "lido"
      },
      {
        strategyId: "ENS-KP-003",
        description: "Uniswap V3 LP positions",
        allocatedAmount: 13000000,
        protocol: "uniswap"
      },
      {
        strategyId: "ENS-KP-004",
        description: "Balancer weighted pools",
        allocatedAmount: 13000000,
        protocol: "balancer"
      }
    ],
    performance: {
      roi: 5.83,
      lastReported: "2025-01-31T00:00:00Z"
    }
  },
  
  // Q1 2025 Working Group Spending Data from ENS Forum
  workingGroups: {
    q1_2025: {
      totalSpending: 642000,
      currency: "USD",
      period: "Q1 2025",
      source: "ENS DAO Governance Forum",
      url: "https://discuss.ens.domains/t/ens-working-group-spending-summaries/20706/3",
      groups: [
        {
          name: "Ecosystem",
          spending: 268520,
          currency: "USDC",
          initiatives: [
            {
              name: "Events",
              description: "ETHDenver engagement and Linea social event co-hosting",
              amount: 45000
            },
            {
              name: "Services",
              description: "Discord moderation, newsletter curation, DAO social media management on X and Farcaster",
              amount: 85000
            },
            {
              name: "Hackathons",
              description: "ETH Global sponsorship for 2025 covering five events and hacker prizes",
              amount: 138520
            }
          ],
          governanceDistribution: {
            ensTokens: 250,
            description: "Term 5 grants closeout - all term 5 grant recipients received ENS tokens for 2024 contributions"
          }
        },
        {
          name: "Meta-Governance",
          spending: 210400,
          currency: "USDC",
          initiatives: [
            {
              name: "DAO Tooling",
              description: "Tools needed for DAO functions such as automation, voting, coordination",
              amount: 85000
            },
            {
              name: "Events",
              description: "IRL presence at ETHDenver",
              amount: 25000
            },
            {
              name: "Compensation",
              description: "Working group stewards, secretary, and scribe compensation as provisioned in ENS DAO Steward Compensation forum post",
              amount: 75000
            },
            {
              name: ".eth Price Research",
              description: "Engagement with @danch.quixote for price research on .eth names",
              amount: 25400
            }
          ],
          governanceDistribution: {
            ensTokens: 24965,
            description: "Hedgey Vesting contracts to execute on [EP 5.26] ENS Governance Distribution"
          }
        },
        {
          name: "Public Goods",
          spending: {
            usdc: 111030,
            eth: 14.9
          },
          currency: "Mixed",
          initiatives: [
            {
              name: "Grants",
              description: "Large Grants recipients for milestone completions, Builder Grants platform allocation, Giveth public goods quadratic funding round matching funds",
              amount: 95000
            },
            {
              name: "Bounty",
              description: "Data exposure bug bounty payment for builder grants platform",
              amount: 16030
            }
          ]
        }
      ]
    }
  }
};

// Enhanced data for charts with more comprehensive information
export const monthlyExpenditures = [
  { month: 'Nov 2022', amount: 34000000, category: 'eth-to-usdc-swap' },
  { month: 'Dec 2022', amount: 2500000, category: 'operational' },
  { month: 'Jan 2023', amount: 3800000, category: 'operational' },
  { month: 'Feb 2023', amount: 5200000, category: 'grants' },
  { month: 'Mar 2023', amount: 52000000, category: 'endaoment' },
  { month: 'Apr 2023', amount: 3400000, category: 'grants' },
  { month: 'May 2023', amount: 6600000, category: 'development' },
  { month: 'Jun 2023', amount: 4500000, category: 'operational' },
  { month: 'Jul 2023', amount: 4420000, category: 'grants' },
  { month: 'Aug 2023', amount: 2800000, category: 'operational' },
];

export const assetAllocation = [
  { name: 'ETH', value: 620000000, percentage: 67 },
  { name: 'ENS', value: 220000000, percentage: 24 },
  { name: 'USDC', value: 64000000, percentage: 7 },
  { name: 'Other', value: 22000000, percentage: 2 },
];

export const karpatkeyPerformance = [
  { month: 'Mar 2023', value: 52000000, roi: 0.0 },
  { month: 'Apr 2023', value: 52100000, roi: 0.2 },
  { month: 'May 2023', value: 52400000, roi: 0.8 },
  { month: 'Jun 2023', value: 52800000, roi: 1.5 },
  { month: 'Jul 2023', value: 53200000, roi: 2.3 },
  { month: 'Aug 2023', value: 53600000, roi: 3.1 },
  { month: 'Sep 2023', value: 54000000, roi: 3.8 },
  { month: 'Oct 2023', value: 54300000, roi: 4.4 },
  { month: 'Nov 2023', value: 54700000, roi: 5.2 },
  { month: 'Dec 2023', value: 55000000, roi: 5.8 },
  { month: 'Jan 2024', value: 55030000, roi: 5.83 },
];

// Additional comprehensive data for better analysis
export const expendituresByCategory = [
  { category: 'ENDAOment', amount: 52000000, percentage: 60.5 },
  { category: 'ETH-USDC Swap', amount: 34000000, percentage: 39.5 },
  { category: 'Development', amount: 6600000, percentage: 7.7 },
  { category: 'Grants', amount: 10520000, percentage: 12.2 },
  { category: 'Operational', amount: 8700000, percentage: 10.1 },
];

export const walletsByManager = [
  { manager: 'ENS DAO', count: 4, totalValue: 290700000 },
  { manager: 'Karpatkey', count: 2, totalValue: 79200000 }
];

export const contractsByType = [
  { type: 'Token', count: 1 },
  { type: 'Token Lock', count: 1 },
  { type: 'Governance', count: 1 },
  { type: 'Controller', count: 3 }
];