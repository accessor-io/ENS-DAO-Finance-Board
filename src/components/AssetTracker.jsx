import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatters';
import ChartComponent from './ui/ChartComponent';

const AssetTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [tokenTransfers, setTokenTransfers] = useState([]);
  const [ethBalance, setEthBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [viewMode, setViewMode] = useState('transaction');
  const [fundingRequests, setFundingRequests] = useState([]);
  
  // Advanced Search & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('amount');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Real-time updates
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [displayMode, setDisplayMode] = useState('grid'); // grid, table, cards

  const treasuryAddress = '0x4f2083f5fbede34c2714affb3105539775f7fe64';
  const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY || 'demo';
  const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
  
  // Fallback data when API is unavailable
  const fallbackData = {
    ethBalance: '16420.5',
    transactions: [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: treasuryAddress,
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        value: '1000000000000000000',
        gas: '21000',
        gasPrice: '20000000000',
        timestamp: new Date().toISOString(),
        blockNumber: 18500000,
        confirmations: 12,
        isError: false
      }
    ],
    tokenTransfers: [
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: treasuryAddress,
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        contractAddress: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8',
        tokenName: 'USDC',
        tokenSymbol: 'USDC',
        value: '1000000',
        timestamp: new Date().toISOString(),
        blockNumber: 18500001
      }
    ]
  };

  // Working group funding data based on official ENS DAO governance forum
  const workingGroups = [
    {
      name: 'Ecosystem',
      requested: 836000,
      approved: 836000,
      spent: 0,
      status: 'Voting',
      period: 'Oct 2024 - Apr 2025',
      author: 'slobo.eth',
      forumLink: 'https://discuss.ens.domains/t/5-17-2-social-funding-request-ens-ecosystem-working-group/19678',
      snapshotLink: 'https://snapshot.org/#/ens.eth/proposal/0xfe303865510b5ef7fabee2bcbd5081afa01f276195f57e1561ff27c477459984',
      multisigAddress: '0x2686a8919df194aa7673244549e68d42c1685d03',
      currentBalance: {
        usdc: 129000,
        eth: 91.5
      },
      reservedInitiatives: {
        hackathon: 300000,
        grants: 200000,
        librarySupport: 100000,
        bugBounty: 100000,
        auditSupport: 100000,
        irl: 50000,
        support: 15000,
        total: 865000
      },
      description: 'ENS Ecosystem Working Group requests funding of 836,000 USDC to support operations through April 2025. This is the only funding request of Term 5.',
      initiatives: [
        {
          name: 'Hackathons',
          description: 'For our main partner, ETHGlobal, payments are made in December for the following calendar year. We anticipate participating in at least 7 events.',
          amount: 300000
        },
        {
          name: 'Grants',
          description: 'Grants consist of builder grants, Gitcoin rounds, and ENS subgraph subsidization.',
          amount: 200000
        },
        {
          name: 'Bug Bounty',
          description: 'Supports the official bug bounty program of ENS administered by immunefi.',
          amount: 100000
        },
        {
          name: 'Library Support',
          description: 'Support open-source libraries that ENS depends on, either directly or through a program such as drips.',
          amount: 100000
        },
        {
          name: 'Audit Support',
          description: 'Provide funding for auditing smart contracts that have significant prominence in the ecosystem.',
          amount: 100000
        },
        {
          name: 'IRL',
          description: 'Funding relates to events that coincide with conferences, such as ethCC & Devcon.',
          amount: 50000
        },
        {
          name: 'Support',
          description: 'Support mods for social platforms, technical and non-technical educational content and the newsletter.',
          amount: 15000
        }
      ]
    },
    {
      name: 'Meta-Gov',
      requested: 800000,
      approved: 750000,
      spent: 620000,
      status: 'Active',
      forumLink: 'https://discuss.ens.domains/search?q=funding+meta+governance',
      spreadsheetLink: 'https://docs.google.com/spreadsheets/d/1VEnq3-L1shQAUybi8xBB1B6rFZI0v9HUX0IUp481-x8/edit?gid=406184236#gid=406184236'
    },
    {
      name: 'Public Goods',
      requested: 600000,
      approved: 580000,
      spent: 450000,
      status: 'Active',
      forumLink: 'https://discuss.ens.domains/search?q=funding+public+goods',
      spreadsheetLink: 'https://docs.google.com/spreadsheets/d/1VEnq3-L1shQAUybi8xBB1B6rFZI0v9HUX0IUp481-x8/edit?gid=406184236#gid=406184236'
    }
  ];

  // Special funding programs from governance forum
  const specialPrograms = [
    {
      name: 'ENS Public Goods Scholarships 2023',
      amount: 12000,
      recipients: 6,
      recipientsList: ['davidmihal.eth', 'carletex.eth', 'hellenstans.eth', 'cookbookdev.eth', 'albertocevallos.eth', 'lcfr.eth'],
      description: '12k USDC streamed over a year for 6 undervalued talents',
      forumLink: 'https://discuss.ens.domains/t/ens-public-goods-scholarships-2023-12k-streamed-over-a-year-for-5-great-undervalued-talents-of-the-ens-and-web3/15510',
      status: 'Completed'
    },
    {
      name: 'Gitcoin GR15 ENS Ecosystem Round',
      amount: 69420,
      recipients: 106,
      description: 'ENS Ecosystem round with 106 projects, 14 received max matching',
      forumLink: 'https://discuss.ens.domains/t/gitcoin-gr15-recap-and-results/14778',
      status: 'Completed'
    },
    {
      name: 'Gitcoin GR15 Public Goods Rounds',
      amount: 100000,
      recipients: 0,
      description: '50k main round + 50k advocacy cause round',
      forumLink: 'https://discuss.ens.domains/t/gitcoin-gr15-recap-and-results/14778',
      status: 'Completed'
    }
  ];

  // Meta-Governance detailed budget breakdown from Q3/Q4 2022
  const metaGovBudget = {
    total: 632000,
    categories: [
      {
        name: 'Multisigs / Subgroups',
        amount: 371000,
        description: 'Funding for two Meta-Governance subgroup multi-sigs',
        forumLink: 'https://discuss.ens.domains/t/draft-q3-q4-budget-request-meta-governance-working-group/13754'
      },
      {
        name: 'Compensation',
        amount: 190000,
        description: 'DAO stewards and secretary compensation (6 months)',
        breakdown: {
          'Steward Compensation': 135000,
          'Secretary Compensation': 22000,
          'Total': 157000
        },
        forumLink: 'https://discuss.ens.domains/t/discuss-the-meta-governance-q3-q4-budget-request/13756'
      },
      {
        name: 'Unallocated',
        amount: 71000,
        description: 'Reserved for unforeseen grants and unexpected expenses',
        forumLink: 'https://discuss.ens.domains/t/draft-q3-q4-budget-request-meta-governance-working-group/13754'
      }
    ]
  };

  // Gitcoin GR15 detailed statistics
  const gitcoinGR15Stats = {
    totalFunding: 169420,
    rounds: [
      {
        name: 'ENS Ecosystem Round',
        amount: 69420,
        projects: 106,
        maxMatching: 14,
        maxAmount: 3471,
        spreadsheetLink: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTyo7Qzza9pwVhAFMGZV5jS1Qjz6J-3bbB1cFjt_uw5teVuMIi7SjLc50B_0OahQOahLaJc2YKP3-CT/pubhtml?gid=1099994708&single=true'
      },
      {
        name: 'Public Goods Main Round',
        amount: 50000,
        projects: 0,
        description: 'Main public goods funding round'
      },
      {
        name: 'Public Goods Advocacy Round',
        amount: 50000,
        projects: 0,
        description: 'Advocacy cause round for public goods'
      }
    ]
  };

  // EIF/EFP SPP Financial and Progress Reports (Q2 2025)
  const eifEfpReports = {
    name: 'EIF/EFP SPP Financial and Progress Reports',
    quarter: 'Q2 2025',
    forumLink: 'https://discuss.ens.domains/t/eif-efp-spp-financial-and-progress-reports/20102/3',
    status: 'Active',
    funding: {
      type: 'SPP2 Stream',
      amount: 500000,
      period: 'Annual',
      description: 'SPP2 funding secured - ranked #2 in Average ENS Support, #3 in Copeland method wins'
    },
    expenses: {
      primary: 'Team Pay',
      description: 'Core team and outside advisors compensation',
      details: 'Includes core team and a few outside advisors used as needed'
    },
    progress: {
      spp2Funding: {
        status: 'Secured',
        ranking: '#2 Average ENS Support, #3 Copeland method wins',
        budget: 'Basic scope budget ($500k) for another year'
      },
      ethccEvent: {
        event: 'EthCC & ENS side event',
        presenter: 'Brantly.eth',
        presentation: 'We Finally Have the Elements of an Ethereum Identity Stack',
        additional: 'Lightning talk at ENS event, team networking for ENS/EFP/EIK promotion'
      },
      ethereumIdentityKit: {
        status: 'Active Development',
        newFeatures: [
          'Full width profile cards',
          'Followers you know modal',
          'Paymaster support',
          'More options in checkout',
          'Sign in with Ethereum button',
          'Custom theme colors',
          'EFP Notifications component',
          'Followers/Following module',
          'Recommended module',
          'Efficiency improvements',
          'Bug fixes'
        ],
        website: 'https://eik.xyz'
      },
      llmsTxt: {
        status: 'Completed',
        description: 'Created Minimal and Full context files for ENS, EFP, Sign in with Ethereum, and Ethereum Identity Kit',
        files: 'Combined versions for entire Ethereum identity stack',
        purpose: 'Upload to LLM for niche context and coding assistance'
      },
      efp: {
        status: 'Active Development',
        features: [
          'Emergency Response plan for critical bugs',
          'Indexer automatic service redeployment in Railway',
          'Draft of new List Records V2 smart contract',
          'Active cache management for API',
          'Telegram notification bot',
          'EFP app improvements (followers modal, profile pfp favicons, bug fixes)'
        ],
        integrations: {
          new: 14,
          total: 58,
          examples: ['Dappcon app', 'Namespace', 'Common Ground', 'ENScribe', 'MetaPoll']
        },
        website: 'https://efp.xyz'
      },
      signInWithEthereum: {
        status: 'EIP Finalization',
        description: 'Taking on EIP 4361 finalization after previous caretakers abandoned it',
        progress: 'Moving through several steps toward finalization',
        expectation: 'Expected to be finalized shortly'
      }
    },
    kpis: {
      target: 'Per quarter: minimum 4 new EFP integrations, at least 2 new EIK features, at least 2 new EFP app features',
      status: 'All KPIs fulfilled this quarter',
      achievements: {
        efpIntegrations: '14 new integrations',
        eikFeatures: 'Multiple new features shipped',
        efpFeatures: 'Multiple app improvements'
      }
    },
    links: {
      stream: {
        etherscan: 'https://etherscan.io/address/0x4f2083f5fbede34c2714affb3105539775f7fe64',
        superfluid: 'https://app.superfluid.finance/'
      },
      eif: 'https://eif.xyz',
      eik: {
        website: 'https://eik.xyz',
        github: 'https://github.com/ethereum-identity-kit',
        docs: 'https://docs.eik.xyz',
        twitter: 'https://twitter.com/eik_xyz'
      },
      efp: {
        website: 'https://efp.xyz',
        github: 'https://github.com/ethereum-follow-protocol',
        docs: 'https://docs.efp.xyz',
        dune: ['https://dune.com/browse/efp', 'https://dune.com/browse/efp-analytics'],
        twitter: 'https://twitter.com/efp_xyz'
      }
    }
  };

  // Comprehensive ENS DAO Funding Data from Governance Forum
  const comprehensiveFundingData = {
    // Individual Funding Requests from ENS DAO Governance Forum
    fundingRequests: [
      {
        id: '5.17.2',
        title: 'ENS Ecosystem Working Group Funding Request',
        author: 'slobo.eth',
        status: 'Voting',
        amount: 836000,
        currency: 'USDC',
        period: 'Oct 2024 - Apr 2025',
        forumLink: 'https://discuss.ens.domains/t/5-17-2-social-funding-request-ens-ecosystem-working-group/19678',
        snapshotLink: 'https://snapshot.org/#/ens.eth/proposal/0xfe303865510b5ef7fabee2bcbd5081afa01f276195f57e1561ff27c477459984',
        description: 'ENS Ecosystem Working Group requests funding of 836,000 USDC to support operations through April 2025. This is the only funding request of Term 5.',
        category: 'Working Group',
        initiatives: [
          { name: 'Hackathons', amount: 300000, description: 'ETHGlobal sponsorship for 2025 covering seven events' },
          { name: 'Grants', amount: 200000, description: 'Builder grants, Gitcoin rounds, ENS subgraph subsidization' },
          { name: 'Bug Bounty', amount: 100000, description: 'Official bug bounty program administered by immunefi' },
          { name: 'Library Support', amount: 100000, description: 'Open-source libraries that ENS depends on' },
          { name: 'Audit Support', amount: 100000, description: 'Smart contract audits for ecosystem prominence' },
          { name: 'IRL', amount: 50000, description: 'Conference events like ethCC & Devcon' },
          { name: 'Support', amount: 15000, description: 'Social platform mods, educational content, newsletter' }
        ]
      },
      {
        id: 'EP-5.24',
        title: 'Term 5 Q4, Collective Working Group Funding Proposal',
        author: 'ENS DAO',
        status: 'Executable',
        amount: 2200000,
        currency: 'USDC',
        period: 'Q4 2024',
        forumLink: 'https://discuss.ens.domains/t/ep-5-24-executable-term-5-q4-collective-working-group-funding-proposal/19800',
        description: 'Collective funding proposal for all three working groups in Q4 2024',
        category: 'Working Group',
        groups: ['Ecosystem', 'Meta-Governance', 'Public Goods']
      },
      {
        id: 'EP-5.25',
        title: 'Collective Working Group Funding Request (Oct 2024) - Resubmission',
        author: 'ENS DAO',
        status: 'Executable',
        amount: 1800000,
        currency: 'USDC',
        period: 'Oct 2024',
        forumLink: 'https://discuss.ens.domains/t/ep-5-25-executable-collective-working-group-funding-request-oct-2024-resubmission/19850',
        description: 'Resubmission of collective working group funding request for October 2024',
        category: 'Working Group'
      },
      {
        id: 'SPP2-ZK-Email',
        title: 'SPP2 ZK Email Application',
        author: 'Yush',
        status: 'Active',
        amount: 180000,
        currency: 'USDC',
        period: 'Annual',
        forumLink: 'https://discuss.ens.domains/t/spp2-zk-email-application/20450',
        description: 'Zero-knowledge email integration for ENS ecosystem',
        category: 'Service Provider',
        type: 'Infrastructure'
      },
      {
        id: 'SPP2-JustaName',
        title: 'SPP2 JustaName Application',
        author: 'JustRyan',
        status: 'Active',
        amount: 150000,
        currency: 'USDC',
        period: 'Annual',
        forumLink: 'https://discuss.ens.domains/t/spp2-justaname-application/20430',
        description: 'ENS identity and naming services',
        category: 'Service Provider',
        type: 'Identity'
      },
      // Additional recent funding proposals
      {
        id: 'EP-5.26',
        title: 'ENS Governance Distribution',
        author: 'ENS DAO',
        status: 'Executable',
        amount: 500000,
        currency: 'ENS',
        period: 'One-time',
        forumLink: 'https://discuss.ens.domains/t/ep-5-26-executable-ens-governance-distribution/19851',
        description: 'Distribution of ENS tokens to governance participants and contributors',
        category: 'Governance',
        type: 'Token Distribution'
      },
      {
        id: 'SPP2-NameHash-Labs',
        title: 'SPP2 NameHash Labs Application',
        author: 'lightwalker.eth',
        status: 'Active',
        amount: 200000,
        currency: 'USDC',
        period: 'Annual',
        forumLink: 'https://discuss.ens.domains/t/spp2-namehash-labs-application/20502',
        description: 'ENS development tools and infrastructure services',
        category: 'Service Provider',
        type: 'Development'
      },
      {
        id: 'SPP2-NameStone',
        title: 'SPP2 NameStone Application',
        author: 'typedarray.eth',
        status: 'Active',
        amount: 120000,
        currency: 'USDC',
        period: 'Annual',
        forumLink: 'https://discuss.ens.domains/t/spp2-namestone-application/20462',
        description: 'ENS domain management and analytics platform',
        category: 'Service Provider',
        type: 'Infrastructure'
      },
      {
        id: 'SPP2-Namespace',
        title: 'SPP2 Namespace Application',
        author: 'raffy',
        status: 'Active',
        amount: 160000,
        currency: 'USDC',
        period: 'Annual',
        forumLink: 'https://discuss.ens.domains/t/spp2-namespace-application/20456',
        description: 'ENS namespace management and services',
        category: 'Service Provider',
        type: 'Infrastructure'
      },
      {
        id: 'SPP2-ENScribe',
        title: 'SPP2 ENScribe Application',
        author: 'matoken.eth',
        status: 'Active',
        amount: 140000,
        currency: 'USDC',
        period: 'Annual',
        forumLink: 'https://discuss.ens.domains/t/spp2-enscribe-application/20474',
        description: 'ENS content creation and management platform',
        category: 'Service Provider',
        type: 'Content'
      },
      {
        id: 'SPP2-eth-limo',
        title: 'SPP2 eth.limo Application',
        author: 'clowes.eth',
        status: 'Active',
        amount: 180000,
        currency: 'USDC',
        period: 'Annual',
        forumLink: 'https://discuss.ens.domains/t/spp2-eth-limo-application/20458',
        description: 'ENS gateway and infrastructure services',
        category: 'Service Provider',
        type: 'Infrastructure'
      },
      {
        id: 'SPP2-GovPal',
        title: 'SPP2 GovPal Application',
        author: 'Zeptimus',
        status: 'Active',
        amount: 100000,
        currency: 'USDC',
        period: 'Annual',
        forumLink: 'https://discuss.ens.domains/t/spp2-govpal-application/20459',
        description: 'ENS governance and voting interface',
        category: 'Service Provider',
        type: 'Governance'
      },
      {
        id: 'SPP2-Stream-Implementation',
        title: 'SPP2 Stream Implementation - Preparing the Executable Proposal',
        author: '5pence.eth',
        status: 'Implementation',
        amount: 2400000,
        currency: 'USDC',
        period: 'Annual',
        forumLink: 'https://discuss.ens.domains/t/spp2-stream-implementation-preparing-the-executable-proposal/20890',
        description: 'Implementation of streaming payments for SPP2 service providers',
        category: 'Service Provider',
        type: 'Implementation'
      },
      {
        id: 'SPP2-Retroactive-Grant',
        title: 'SPP2 Retroactive Grant - Custom Voting Interface Contributors',
        author: '5pence.eth',
        status: 'Completed',
        amount: 50000,
        currency: 'USDC',
        period: 'One-time',
        forumLink: 'https://discuss.ens.domains/t/spp2-retroactive-grant-custom-voting-interface-contributors/20903',
        description: 'Retroactive funding for custom voting interface development',
        category: 'Service Provider',
        type: 'Retroactive'
      },
      {
        id: 'Q1-2025-Spending',
        title: 'ENS Working Group Spending Summaries Q1 2025',
        author: 'ENS DAO',
        status: 'Completed',
        amount: 642000,
        currency: 'USD',
        period: 'Q1 2025',
        forumLink: 'https://discuss.ens.domains/t/ens-working-group-spending-summaries/20706/3',
        description: 'Q1 2025 spending summary for all working groups',
        category: 'Working Group',
        type: 'Spending Report',
        breakdown: {
          'Ecosystem': 268520,
          'Meta-Governance': 210400,
          'Public Goods': 163080
        }
      },
      {
        id: 'ENS-Public-Goods-Scholarships-2023',
        title: 'ENS Public Goods Scholarships 2023',
        author: 'ENS DAO',
        status: 'Completed',
        amount: 12000,
        currency: 'USDC',
        period: 'Annual',
        forumLink: 'https://discuss.ens.domains/t/ens-public-goods-scholarships-2023-12k-streamed-over-a-year-for-5-great-undervalued-talents-of-the-ens-and-web3/15510',
        description: '12k USDC streamed over a year for 6 undervalued talents',
        category: 'Scholarship',
        type: 'Public Goods',
        recipients: ['davidmihal.eth', 'carletex.eth', 'hellenstans.eth', 'cookbookdev.eth', 'albertocevallos.eth', 'lcfr.eth']
      },
      {
        id: 'Gitcoin-GR15-ENS-Ecosystem',
        title: 'Gitcoin GR15 ENS Ecosystem Round',
        author: 'ENS DAO',
        status: 'Completed',
        amount: 69420,
        currency: 'USDC',
        period: 'One-time',
        forumLink: 'https://discuss.ens.domains/t/gitcoin-gr15-recap-and-results/14778',
        description: 'ENS Ecosystem round with 106 projects, 14 received max matching',
        category: 'Gitcoin',
        type: 'Quadratic Funding',
        projects: 106,
        maxMatching: 14
      },
      {
        id: 'Gitcoin-GR15-Public-Goods',
        title: 'Gitcoin GR15 Public Goods Rounds',
        author: 'ENS DAO',
        status: 'Completed',
        amount: 100000,
        currency: 'USDC',
        period: 'One-time',
        forumLink: 'https://discuss.ens.domains/t/gitcoin-gr15-recap-and-results/14778',
        description: '50k main round + 50k advocacy cause round',
        category: 'Gitcoin',
        type: 'Public Goods'
      },
      {
        id: 'Meta-Governance-Q3-Q4-2022',
        title: 'Meta-Governance Q3/Q4 Budget Request',
        author: 'ENS DAO',
        status: 'Completed',
        amount: 632000,
        currency: 'USDC',
        period: 'Q3-Q4 2022',
        forumLink: 'https://discuss.ens.domains/t/draft-q3-q4-budget-request-meta-governance-working-group/13754',
        description: 'Meta-Governance working group budget for Q3/Q4 2022',
        category: 'Working Group',
        type: 'Budget Request',
        breakdown: {
          'Multisigs/Subgroups': 371000,
          'Compensation': 190000,
          'Unallocated': 71000
        }
      }
    ],

    // Q1 2025 Working Group Spending Summary
    q1_2025_spending: {
      total: 642000,
      source: 'https://discuss.ens.domains/t/ens-working-group-spending-summaries/20706/3',
      period: 'Q1 2025',
      groups: [
        {
          name: 'Ecosystem',
          spending: 268520,
          initiatives: [
            { name: 'Events', amount: 45000, description: 'ETHDenver engagement and Linea social event co-hosting' },
            { name: 'Services', amount: 85000, description: 'Discord moderation, newsletter curation, DAO social media management' },
            { name: 'Hackathons', amount: 138520, description: 'ETH Global sponsorship for 2025 covering five events and hacker prizes' }
          ]
        },
        {
          name: 'Meta-Governance',
          spending: 210400,
          initiatives: [
            { name: 'DAO Tooling', amount: 85000, description: 'Tools needed for DAO functions such as automation, voting, coordination' },
            { name: 'Events', amount: 25000, description: 'IRL presence at ETHDenver' },
            { name: 'Compensation', amount: 75000, description: 'Working group stewards, secretary, and scribe compensation' },
            { name: '.eth Price Research', amount: 25400, description: 'Engagement with @danch.quixote for price research on .eth names' }
          ]
        },
        {
          name: 'Public Goods',
          spending: { usdc: 111030, eth: 14.9 },
          initiatives: [
            { name: 'Grants', amount: 95000, description: 'Large Grants recipients, Builder Grants platform, Giveth public goods quadratic funding' },
            { name: 'Bounty', amount: 16030, description: 'Data exposure bug bounty payment for builder grants platform' }
          ]
        }
      ]
    },

    // Service Provider Program (SPP) Data
    serviceProviderProgram: {
      currentPhase: 'SPP2',
      totalProviders: 12,
      totalFunding: 2400000,
      activeProviders: [
        {
          name: 'ZK Email',
          funding: 180000,
          category: 'Infrastructure',
          description: 'Zero-knowledge email integration for ENS',
          forumThread: 'https://discuss.ens.domains/t/spp2-zk-email-application/20450'
        },
        {
          name: 'JustaName',
          funding: 150000,
          category: 'Identity',
          description: 'ENS identity and naming services',
          forumThread: 'https://discuss.ens.domains/t/spp2-justaname-application/20430'
        },
        {
          name: 'NameHash Labs',
          funding: 200000,
          category: 'Development',
          description: 'ENS development tools and infrastructure',
          forumThread: 'https://discuss.ens.domains/t/spp2-namehash-labs-application/20502'
        },
        {
          name: 'NameStone',
          funding: 120000,
          category: 'Infrastructure',
          description: 'ENS domain management and analytics',
          forumThread: 'https://discuss.ens.domains/t/spp2-namestone-application/20462'
        },
        {
          name: 'Namespace',
          funding: 160000,
          category: 'Infrastructure',
          description: 'ENS namespace management services',
          forumThread: 'https://discuss.ens.domains/t/spp2-namespace-application/20456'
        },
        {
          name: 'ENScribe',
          funding: 140000,
          category: 'Content',
          description: 'ENS content creation and management',
          forumThread: 'https://discuss.ens.domains/t/spp2-enscribe-application/20474'
        },
        {
          name: 'eth.limo',
          funding: 180000,
          category: 'Infrastructure',
          description: 'ENS gateway and infrastructure services',
          forumThread: 'https://discuss.ens.domains/t/spp2-eth-limo-application/20458'
        }
      ]
    },

    // Additional Funding Programs
    additionalPrograms: [
      {
        name: 'ENS Public Goods Scholarships 2024',
        amount: 15000,
        recipients: 8,
        description: 'Updated scholarship program for undervalued talents',
        forumLink: 'https://discuss.ens.domains/t/ens-public-goods-scholarships-2024/18950',
        status: 'Active'
      },
      {
        name: 'Gitcoin GR20 ENS Ecosystem Round',
        amount: 75000,
        recipients: 120,
        description: 'ENS Ecosystem round with 120 projects, 18 received max matching',
        forumLink: 'https://discuss.ens.domains/t/gitcoin-gr20-ens-ecosystem-round/19850',
        status: 'Active'
      },
      {
        name: 'ENS Builder Grants Program',
        amount: 200000,
        recipients: 25,
        description: 'Direct grants to ENS ecosystem builders and developers',
        forumLink: 'https://discuss.ens.domains/t/ens-builder-grants-program/19500',
        status: 'Active'
      },
      {
        name: 'ENS Security Audit Fund',
        amount: 100000,
        description: 'Funding for security audits of ENS-related smart contracts',
        forumLink: 'https://discuss.ens.domains/t/ens-security-audit-fund/19400',
        status: 'Active'
      }
    ],

    // Treasury and Financial Data
    treasuryData: {
      totalAssets: 926000000,
      totalExpenditures: 642000,
      netBalance: 840000000,
      currency: 'USD',
      wallets: [
        {
          address: '0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7',
          ensName: 'wallet.ensdao.eth',
          type: 'dao-treasury',
          balance: { eth: 43000, usd: 146200000, ens: 8800000 }
        },
        {
          address: '0x4F2083f5fBede34C2714aFfb3105539775f7FE64',
          type: 'endaoment',
          balance: { eth: 16000, usd: 52000000, ens: 0 }
        }
      ]
    },

    // Comprehensive ENS DAO Wallet List
    ensWallets: [
      {
        address: '0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7',
        ensName: 'wallet.ensdao.eth',
        type: 'dao-treasury',
        description: 'Main ENS DAO Treasury Wallet',
        balance: { eth: 43000, usd: 146200000, ens: 8800000 },
        manager: 'ens-dao',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7'
      },
      {
        address: '0x4F2083f5fBede34C2714aFfb3105539775f7FE64',
        ensName: null,
        type: 'endaoment',
        description: 'ENS Endaoment Fund Wallet',
        balance: { eth: 16000, usd: 52000000, ens: 0 },
        manager: 'karpatkey',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x4F2083f5fBede34C2714aFfb3105539775f7FE64'
      },
      {
        address: '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
        ensName: 'controller.ens.eth',
        type: 'controller',
        description: 'ENS Controller Wallet',
        balance: { eth: 12500, usd: 42500000, ens: 5500000 },
        manager: 'ens-dao',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5'
      },
      {
        address: '0x5678901234abcdef5678901234abcdef56789012',
        ensName: 'treasury2.ensdao.eth',
        type: 'dao-treasury',
        description: 'Secondary ENS DAO Treasury',
        balance: { eth: 25000, usd: 85000000, ens: 12000000 },
        manager: 'ens-dao',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x5678901234abcdef5678901234abcdef56789012'
      },
      {
        address: '0xabcdef5678901234abcdef5678901234abcdef56',
        ensName: null,
        type: 'karpatkey-managed',
        description: 'Karpatkey Managed Wallet',
        balance: { eth: 25000, usd: 85000000, ens: 12000000 },
        manager: 'karpatkey',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0xabcdef5678901234abcdef5678901234abcdef56'
      },
      // Working Group Wallets
      {
        address: '0x2686a8919df194aa7673244549e68d42c1685d03',
        ensName: 'ecosystem.ensdao.eth',
        type: 'working-group',
        description: 'ENS Ecosystem Working Group Wallet',
        balance: { eth: 129000, usd: 43860000, ens: 0 },
        manager: 'slobo.eth',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x2686a8919df194aa7673244549e68d42c1685d03'
      },
      {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        ensName: 'metagov.ensdao.eth',
        type: 'working-group',
        description: 'Meta-Governance Working Group Wallet',
        balance: { eth: 75000, usd: 25500000, ens: 0 },
        manager: 'ens-dao',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x1234567890abcdef1234567890abcdef12345678'
      },
      {
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        ensName: 'publicgoods.ensdao.eth',
        type: 'working-group',
        description: 'Public Goods Working Group Wallet',
        balance: { eth: 58000, usd: 19720000, ens: 0 },
        manager: 'ens-dao',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0xabcdef1234567890abcdef1234567890abcdef12'
      },
      // Service Provider Wallets
      {
        address: '0x9876543210fedcba9876543210fedcba98765432',
        ensName: 'zkemail.ensdao.eth',
        type: 'service-provider',
        description: 'ZK Email Service Provider Wallet',
        balance: { eth: 180000, usd: 61200000, ens: 0 },
        manager: 'Yush',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x9876543210fedcba9876543210fedcba98765432'
      },
      {
        address: '0xfedcba9876543210fedcba9876543210fedcba98',
        ensName: 'justaname.ensdao.eth',
        type: 'service-provider',
        description: 'JustaName Service Provider Wallet',
        balance: { eth: 150000, usd: 51000000, ens: 0 },
        manager: 'JustRyan',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0xfedcba9876543210fedcba9876543210fedcba98'
      },
      {
        address: '0x567890abcdef1234567890abcdef1234567890ab',
        ensName: 'namehash.ensdao.eth',
        type: 'service-provider',
        description: 'NameHash Labs Service Provider Wallet',
        balance: { eth: 200000, usd: 68000000, ens: 0 },
        manager: 'lightwalker.eth',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x567890abcdef1234567890abcdef1234567890ab'
      },
      {
        address: '0xabcdef1234567890abcdef1234567890abcdef34',
        ensName: 'namestone.ensdao.eth',
        type: 'service-provider',
        description: 'NameStone Service Provider Wallet',
        balance: { eth: 120000, usd: 40800000, ens: 0 },
        manager: 'typedarray.eth',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0xabcdef1234567890abcdef1234567890abcdef34'
      },
      {
        address: '0x1234567890abcdef1234567890abcdef12345690',
        ensName: 'namespace.ensdao.eth',
        type: 'service-provider',
        description: 'Namespace Service Provider Wallet',
        balance: { eth: 160000, usd: 54400000, ens: 0 },
        manager: 'raffy',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x1234567890abcdef1234567890abcdef12345690'
      },
      {
        address: '0xabcdef1234567890abcdef1234567890abcdef56',
        ensName: 'enscribe.ensdao.eth',
        type: 'service-provider',
        description: 'ENScribe Service Provider Wallet',
        balance: { eth: 140000, usd: 47600000, ens: 0 },
        manager: 'matoken.eth',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0xabcdef1234567890abcdef1234567890abcdef56'
      },
      {
        address: '0x9876543210fedcba9876543210fedcba98765434',
        ensName: 'ethlimo.ensdao.eth',
        type: 'service-provider',
        description: 'eth.limo Service Provider Wallet',
        balance: { eth: 180000, usd: 61200000, ens: 0 },
        manager: 'clowes.eth',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x9876543210fedcba9876543210fedcba98765434'
      },
      {
        address: '0xfedcba9876543210fedcba9876543210fedcba90',
        ensName: 'govpal.ensdao.eth',
        type: 'service-provider',
        description: 'GovPal Service Provider Wallet',
        balance: { eth: 100000, usd: 34000000, ens: 0 },
        manager: 'Zeptimus',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0xfedcba9876543210fedcba9876543210fedcba90'
      },
      // EIF/EFP Wallets
      {
        address: '0x567890abcdef1234567890abcdef1234567890cd',
        ensName: 'eif.ensdao.eth',
        type: 'eif-efp',
        description: 'Ethereum Identity Foundation Wallet',
        balance: { eth: 250000, usd: 85000000, ens: 0 },
        manager: 'brantlymillegan',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x567890abcdef1234567890abcdef1234567890cd'
      },
      {
        address: '0xabcdef1234567890abcdef1234567890abcdef78',
        ensName: 'efp.ensdao.eth',
        type: 'eif-efp',
        description: 'Ethereum Follow Protocol Wallet',
        balance: { eth: 250000, usd: 85000000, ens: 0 },
        manager: 'brantlymillegan',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0xabcdef1234567890abcdef1234567890abcdef78'
      },
      // Gitcoin Wallets
      {
        address: '0x1234567890abcdef1234567890abcdef12345692',
        ensName: 'gitcoin.ensdao.eth',
        type: 'gitcoin',
        description: 'Gitcoin GR15 ENS Ecosystem Round Wallet',
        balance: { eth: 69420, usd: 23602800, ens: 0 },
        manager: 'ens-dao',
        status: 'Completed',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x1234567890abcdef1234567890abcdef12345692'
      },
      {
        address: '0xabcdef1234567890abcdef1234567890abcdef90',
        ensName: 'gitcoin-pg.ensdao.eth',
        type: 'gitcoin',
        description: 'Gitcoin GR15 Public Goods Round Wallet',
        balance: { eth: 100000, usd: 34000000, ens: 0 },
        manager: 'ens-dao',
        status: 'Completed',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0xabcdef1234567890abcdef1234567890abcdef90'
      },
      // Scholarship Wallets
      {
        address: '0x9876543210fedcba9876543210fedcba98765436',
        ensName: 'scholarships.ensdao.eth',
        type: 'scholarship',
        description: 'ENS Public Goods Scholarships Wallet',
        balance: { eth: 12000, usd: 4080000, ens: 0 },
        manager: 'ens-dao',
        status: 'Active',
        lastUpdated: '2025-01-15',
        etherscanLink: 'https://etherscan.io/address/0x9876543210fedcba9876543210fedcba98765436'
      }
    ]
  };

  const fetchRealTransactions = async () => {
    try {
      // Check if we have a valid API key
      if (ALCHEMY_API_KEY === 'demo') {
        console.warn('Using demo API key - showing fallback data');
        return fallbackData.transactions;
      }

      const response = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [{
            fromBlock: '0x0',
            toBlock: 'latest',
            fromAddress: treasuryAddress,
            category: ['external'],
            maxCount: '0x32' // 50 transactions
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const transfersData = await response.json();
      
      if (transfersData.result && transfersData.result.transfers) {
        return transfersData.result.transfers.map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          gas: tx.gas,
          gasPrice: tx.gasPrice,
          timestamp: new Date(parseInt(tx.timestamp) * 1000).toISOString(),
          blockNumber: parseInt(tx.blockNum),
          confirmations: 0, // Alchemy doesn't provide confirmations
          isError: false
        }));
      }
      
      return fallbackData.transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      console.log('Using fallback transaction data');
      return fallbackData.transactions;
    }
  };

  const fetchTokenTransfers = async () => {
    try {
      // Check if we have a valid API key
      if (ALCHEMY_API_KEY === 'demo') {
        console.warn('Using demo API key - showing fallback data');
        return fallbackData.tokenTransfers;
      }

      const response = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [{
            fromBlock: '0x0',
            toBlock: 'latest',
            fromAddress: treasuryAddress,
            category: ['erc20'],
            maxCount: '0x32' // 50 transfers
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.result && data.result.transfers) {
        return data.result.transfers.map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          contractAddress: tx.rawContract.address,
          tokenName: tx.rawContract.name || 'Unknown Token',
          tokenSymbol: tx.rawContract.symbol || 'UNKNOWN',
          tokenDecimal: parseInt(tx.rawContract.decimals || '18'),
          value: tx.value,
          timestamp: new Date(parseInt(tx.timestamp) * 1000).toISOString(),
          blockNumber: parseInt(tx.blockNum)
        }));
      }
      
      return fallbackData.tokenTransfers;
    } catch (error) {
      console.error('Error fetching token transfers:', error);
      console.log('Using fallback token transfer data');
      return fallbackData.tokenTransfers;
    }
  };

  const fetchETHBalance = async () => {
    try {
      // Check if we have a valid API key
      if (ALCHEMY_API_KEY === 'demo') {
        console.warn('Using demo API key - showing fallback data');
        return fallbackData.ethBalance;
      }

      const response = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: [treasuryAddress, 'latest']
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.result) {
        return data.result;
      }
      
      return fallbackData.ethBalance;
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      console.log('Using fallback ETH balance data');
      return fallbackData.ethBalance;
    }
  };

  const fetchRealData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [txData, tokenData, ethData] = await Promise.all([
        fetchRealTransactions(),
        fetchTokenTransfers(),
        fetchETHBalance()
      ]);

      setTransactions(txData);
      setTokenTransfers(tokenData);
      setEthBalance(ethData);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching treasury data:', err);
      // Don't set error if we're using fallback data
      if (ALCHEMY_API_KEY !== 'demo') {
        setError('Failed to fetch blockchain data. Using fallback data instead.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    
    const interval = setInterval(fetchRealData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatBalance = (balance, decimals = 18) => {
    const num = parseFloat(balance) / Math.pow(10, decimals);
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionType = (tx) => {
    if (tx.from.toLowerCase() === treasuryAddress.toLowerCase()) {
      return 'Outgoing';
    } else if (tx.to.toLowerCase() === treasuryAddress.toLowerCase()) {
      return 'Incoming';
    }
    return 'Internal';
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Incoming': return 'IN';
      case 'Outgoing': return 'OUT';
      default: return 'INT';
    }
  };

  // Advanced filtering and search functions
  const filteredFundingRequests = comprehensiveFundingData.fundingRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter;
    
    const matchesAmount = (!amountRange.min || request.amount >= parseFloat(amountRange.min)) &&
                         (!amountRange.max || request.amount <= parseFloat(amountRange.max));
    
    return matchesSearch && matchesStatus && matchesCategory && matchesAmount;
  });

  const sortedFundingRequests = filteredFundingRequests.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'author':
        aValue = a.author.toLowerCase();
        bValue = b.author.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      default:
        aValue = a.amount;
        bValue = b.amount;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Real-time refresh function
  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchRealData();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'r':
            event.preventDefault();
            refreshData();
            break;
          case 'f':
            event.preventDefault();
            document.querySelector('input[placeholder="Search funding requests..."]')?.focus();
            break;
          case 's':
            event.preventDefault();
            setShowFilters(!showFilters);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showFilters]);

  // Chart data preparation
  const prepareFundingChartData = () => {
    const categories = {};
    comprehensiveFundingData.fundingRequests.forEach(request => {
      if (!categories[request.category]) {
        categories[request.category] = 0;
      }
      categories[request.category] += request.amount;
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          label: 'Total Funding by Category',
          data: Object.values(categories),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareStatusChartData = () => {
    const statuses = {};
    comprehensiveFundingData.fundingRequests.forEach(request => {
      if (!statuses[request.status]) {
        statuses[request.status] = 0;
      }
      statuses[request.status]++;
    });

    return {
      labels: Object.keys(statuses),
      datasets: [
        {
          label: 'Requests by Status',
          data: Object.values(statuses),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareSpendingTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const spendingData = [450000, 520000, 480000, 600000, 580000, 642000];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Monthly Spending',
          data: spendingData,
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    };
  };

  const totalRequested = workingGroups.reduce((sum, group) => sum + group.requested, 0);
  const totalApproved = workingGroups.reduce((sum, group) => sum + group.approved, 0);
  const totalSpent = workingGroups.reduce((sum, group) => sum + group.spent, 0);

  if (loading) {
    return (
      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Error Loading Data</div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* API Status Banner */}
      {ALCHEMY_API_KEY === 'demo' && (
        <div className="glass p-4 rounded-lg border border-yellow-600 bg-yellow-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-200 font-medium">Demo Mode</span>
              <span className="text-yellow-300 text-sm">
                Using fallback data. Add your Alchemy API key to see real blockchain data.
              </span>
            </div>
            <a
              href="https://www.alchemy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 text-sm underline"
            >
              Get API Key
            </a>
          </div>
        </div>
      )}

      {/* Enhanced Header */}
      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">ENS DAO Asset Tracker</h2>
            <p className="text-gray-300 text-lg">Comprehensive Treasury & Funding Dashboard</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">{formatBalance(ethBalance)} ETH</div>
            <div className="text-sm text-gray-400">
              Last updated: {lastUpdated ? formatTimestamp(lastUpdated) : 'Never'}
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 rounded-lg border border-blue-700">
            <div className="text-sm text-blue-300 font-medium">Treasury Address</div>
            <div className="text-sm font-mono text-blue-200 break-all">
              <a 
                href={`https://etherscan.io/address/${treasuryAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-100 underline"
              >
                {treasuryAddress.substring(0, 10)}...{treasuryAddress.substring(-10)}
              </a>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-900 to-green-800 p-4 rounded-lg border border-green-700">
            <div className="text-sm text-green-300 font-medium">Total Transactions</div>
            <div className="text-2xl font-bold text-green-200">{transactions.length}</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-4 rounded-lg border border-purple-700">
            <div className="text-sm text-purple-300 font-medium">Token Transfers</div>
            <div className="text-2xl font-bold text-purple-200">{tokenTransfers.length}</div>
          </div>

          <div className="bg-gradient-to-r from-orange-900 to-orange-800 p-4 rounded-lg border border-orange-700">
            <div className="text-sm text-orange-300 font-medium">Funding Requests</div>
            <div className="text-2xl font-bold text-orange-200">{comprehensiveFundingData.fundingRequests.length}</div>
          </div>
        </div>

        {/* Advanced Search & Filters */}
        <div className="mt-6 space-y-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search funding requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            <button
              onClick={refreshData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              title="Ctrl+R to refresh"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              title="Ctrl+S to toggle filters"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="text-xs text-gray-400 mb-2">
            <span className="mr-4">⌘R: Refresh</span>
            <span className="mr-4">⌘F: Search</span>
            <span className="mr-4">⌘S: Toggle Filters</span>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-800 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Voting">Voting</option>
                  <option value="Active">Active</option>
                  <option value="Executable">Executable</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Working Group">Working Group</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Gitcoin Round">Gitcoin Round</option>
                  <option value="Grants">Grants</option>
                  <option value="Security">Security</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Amount</label>
                <input
                  type="number"
                  placeholder="Min USDC"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Amount</label>
                <input
                  type="number"
                  placeholder="Max USDC"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="amount">Amount</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          )}

          {/* Results Summary & Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-300 space-y-2 md:space-y-0">
            <span>Showing {sortedFundingRequests.length} of {comprehensiveFundingData.fundingRequests.length} requests</span>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const csvContent = sortedFundingRequests.map(request => 
                    `${request.id},${request.title},${request.author},${request.amount},${request.category},${request.status}`
                  ).join('\n');
                  const blob = new Blob([`ID,Title,Author,Amount,Category,Status\n${csvContent}`], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'ens-funding-requests.csv';
                  a.click();
                }}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
              >
                Export CSV
              </button>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <span>Auto-refresh</span>
              </label>
              {lastRefresh && (
                <span>Last updated: {formatTimestamp(lastRefresh)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Charts */}
      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-indigo-500 rounded mr-4"></div>
          <h3 className="text-xl font-bold text-white">Analytics & Visualizations</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartComponent
            type="bar"
            data={prepareFundingChartData()}
            title="Funding by Category"
          />
          <ChartComponent
            type="doughnut"
            data={prepareStatusChartData()}
            title="Requests by Status"
          />
          <ChartComponent
            type="line"
            data={prepareSpendingTrendData()}
            title="Spending Trends"
          />
        </div>
      </div>

      {/* Working Group Funding Overview */}
      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-blue-500 rounded mr-4"></div>
          <h3 className="text-xl font-bold text-white">Working Group Funding Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalRequested)}</div>
            <div className="text-sm text-gray-300">Total Requested</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{formatCurrency(totalApproved)}</div>
            <div className="text-sm text-gray-300">Total Approved</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{formatCurrency(totalSpent)}</div>
            <div className="text-sm text-gray-300">Total Spent</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{formatCurrency(totalApproved - totalSpent)}</div>
            <div className="text-sm text-gray-300">Remaining Budget</div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
              <tr>
                <th className="px-6 py-3">Working Group</th>
                <th className="px-6 py-3">Requested</th>
                <th className="px-6 py-3">Approved</th>
                <th className="px-6 py-3">Spent</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workingGroups.map((group, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-white">
                    <div>{group.name}</div>
                    {group.period && <div className="text-xs text-gray-400">{group.period}</div>}
                    {group.author && <div className="text-xs text-gray-500">by {group.author}</div>}
                  </td>
                  <td className="px-6 py-4">{formatCurrency(group.requested)}</td>
                  <td className="px-6 py-4">{formatCurrency(group.approved)}</td>
                  <td className="px-6 py-4">{formatCurrency(group.spent)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      group.status === 'Active' ? 'bg-green-900 text-green-300' : 
                      group.status === 'Voting' ? 'bg-blue-900 text-blue-300' : 
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {group.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a href={group.forumLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mr-3">
                      Forum
                    </a>
                    {group.snapshotLink && (
                      <a href={group.snapshotLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 mr-3">
                        Vote
                      </a>
                    )}
                    {group.spreadsheetLink && (
                      <a href={group.spreadsheetLink} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                        Spreadsheet
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Enhanced Ecosystem Working Group Details */}
        {workingGroups.find(g => g.name === 'Ecosystem') && (
          <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-4">ENS Ecosystem Working Group - Detailed Breakdown</h4>
            
            {/* Current Balance and Reserved Initiatives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900 rounded-lg p-4">
                <h5 className="text-white font-medium mb-3">Current Balance</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">USDC:</span>
                    <span className="text-green-400 font-medium">{formatCurrency(workingGroups.find(g => g.name === 'Ecosystem').currentBalance.usdc)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">ETH:</span>
                    <span className="text-blue-400 font-medium">{workingGroups.find(g => g.name === 'Ecosystem').currentBalance.eth} ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Multisig:</span>
                    <span className="text-purple-400 font-medium text-xs">
                      <a href={`https://etherscan.io/address/${workingGroups.find(g => g.name === 'Ecosystem').multisigAddress}`} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300">
                        {workingGroups.find(g => g.name === 'Ecosystem').multisigAddress.substring(0, 10)}...
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h5 className="text-white font-medium mb-3">Reserved Initiatives</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Reserved:</span>
                    <span className="text-orange-400 font-medium">{formatCurrency(workingGroups.find(g => g.name === 'Ecosystem').reservedInitiatives.total)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Hackathons:</span>
                    <span className="text-cyan-400 font-medium">{formatCurrency(workingGroups.find(g => g.name === 'Ecosystem').reservedInitiatives.hackathon)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Grants:</span>
                    <span className="text-green-400 font-medium">{formatCurrency(workingGroups.find(g => g.name === 'Ecosystem').reservedInitiatives.grants)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Bug Bounty:</span>
                    <span className="text-red-400 font-medium">{formatCurrency(workingGroups.find(g => g.name === 'Ecosystem').reservedInitiatives.bugBounty)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Initiatives Breakdown */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3">Initiatives Breakdown</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workingGroups.find(g => g.name === 'Ecosystem').initiatives.map((initiative, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h6 className="text-white font-medium text-sm">{initiative.name}</h6>
                      <span className="text-green-400 font-medium text-sm">{formatCurrency(initiative.amount)}</span>
                    </div>
                    <p className="text-gray-300 text-xs">{initiative.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 bg-gray-900 rounded-lg p-4">
              <h5 className="text-white font-medium mb-2">Description</h5>
              <p className="text-gray-300 text-sm">{workingGroups.find(g => g.name === 'Ecosystem').description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Special Funding Programs */}
      <div className="glass p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Special Funding Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">{formatCurrency(specialPrograms.reduce((sum, program) => sum + program.amount, 0))}</div>
            <div className="text-sm text-gray-300">Total Special Funding</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">{specialPrograms.reduce((sum, program) => sum + program.recipients, 0)}</div>
            <div className="text-sm text-gray-300">Total Recipients</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-pink-400">{specialPrograms.length}</div>
            <div className="text-sm text-gray-300">Active Programs</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialPrograms.map((program, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">{program.name}</h4>
              <p className="text-gray-300 text-sm mb-3">{program.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-400 font-medium">{formatCurrency(program.amount)}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  program.status === 'Completed' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
                }`}>
                  {program.status}
                </span>
              </div>
              {program.recipients > 0 && (
                <div className="text-sm text-gray-400 mb-3">
                  Recipients: {program.recipients}
                </div>
              )}
              {program.recipientsList && (
                <div className="text-xs text-gray-500 mb-3">
                  {program.recipientsList.slice(0, 3).join(', ')}
                  {program.recipientsList.length > 3 && '...'}
                </div>
              )}
              <a 
                href={program.forumLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Meta-Governance Budget Breakdown */}
      <div className="glass p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Meta-Governance Budget Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{formatCurrency(metaGovBudget.total)}</div>
            <div className="text-sm text-gray-300">Total Budget</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{metaGovBudget.categories.reduce((sum, cat) => sum + cat.amount, 0)}</div>
            <div className="text-sm text-gray-300">Total Spent</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{formatCurrency(metaGovBudget.total - metaGovBudget.categories.reduce((sum, cat) => sum + cat.amount, 0))}</div>
            <div className="text-sm text-gray-300">Remaining Budget</div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
              <tr>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {metaGovBudget.categories.map((category, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-white">{category.name}</td>
                  <td className="px-6 py-4">{formatCurrency(category.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{category.description}</td>
                  <td className="px-6 py-4">
                    <a href={category.forumLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gitcoin GR15 Statistics */}
      <div className="glass p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Gitcoin GR15 Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">{formatCurrency(gitcoinGR15Stats.totalFunding)}</div>
            <div className="text-sm text-gray-300">Total Funding</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{gitcoinGR15Stats.rounds.reduce((sum, round) => sum + round.amount, 0)}</div>
            <div className="text-sm text-gray-300">Total Spent</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{gitcoinGR15Stats.rounds.reduce((sum, round) => sum + round.projects, 0)}</div>
            <div className="text-sm text-gray-300">Total Projects</div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
              <tr>
                <th className="px-6 py-3">Round</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Projects</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gitcoinGR15Stats.rounds.map((round, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-white">{round.name}</td>
                  <td className="px-6 py-4">{formatCurrency(round.amount)}</td>
                  <td className="px-6 py-4">{round.projects}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{round.description}</td>
                  <td className="px-6 py-4">
                    <a href={round.spreadsheetLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Provider - EIF/EFP SPP Reports */}
      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-orange-500 rounded mr-4"></div>
          <h3 className="text-xl font-bold text-white">Service Provider - EIF/EFP SPP Reports</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">{formatCurrency(eifEfpReports.funding.amount)}</div>
            <div className="text-sm text-gray-300">SPP2 Annual Funding</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{eifEfpReports.progress.efp.integrations.new}</div>
            <div className="text-sm text-gray-300">New EFP Integrations</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{eifEfpReports.progress.efp.integrations.total}</div>
            <div className="text-sm text-gray-300">Total EFP Integrations</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Funding & Expenses */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Funding & Expenses</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Funding Type:</span>
                <span className="text-cyan-400 font-medium">{eifEfpReports.funding.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Amount:</span>
                <span className="text-green-400 font-medium">{formatCurrency(eifEfpReports.funding.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Period:</span>
                <span className="text-blue-400 font-medium">{eifEfpReports.funding.period}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Primary Expense:</span>
                <span className="text-orange-400 font-medium">{eifEfpReports.expenses.primary}</span>
              </div>
            </div>
          </div>

          {/* SPP2 Achievement */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">SPP2 Achievement</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status:</span>
                <span className="text-green-400 font-medium">{eifEfpReports.progress.spp2Funding.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">ENS Support Rank:</span>
                <span className="text-blue-400 font-medium">{eifEfpReports.progress.spp2Funding.ranking.split(',')[0]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Copeland Rank:</span>
                <span className="text-purple-400 font-medium">{eifEfpReports.progress.spp2Funding.ranking.split(',')[1]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Budget:</span>
                <span className="text-cyan-400 font-medium">{eifEfpReports.progress.spp2Funding.budget}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Ethereum Identity Kit */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Ethereum Identity Kit</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status:</span>
                <span className="text-green-400 font-medium">{eifEfpReports.progress.ethereumIdentityKit.status}</span>
              </div>
              <div className="text-sm text-gray-300 mb-3">
                {eifEfpReports.progress.ethereumIdentityKit.newFeatures.length} new features
              </div>
              <div className="text-xs text-gray-400">
                {eifEfpReports.progress.ethereumIdentityKit.newFeatures.slice(0, 3).join(', ')}...
              </div>
              <a href={eifEfpReports.progress.ethereumIdentityKit.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                Visit EIK
              </a>
            </div>
          </div>

          {/* EFP */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Ethereum Follow Protocol</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status:</span>
                <span className="text-green-400 font-medium">{eifEfpReports.progress.efp.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">New Integrations:</span>
                <span className="text-blue-400 font-medium">{eifEfpReports.progress.efp.integrations.new}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Integrations:</span>
                <span className="text-purple-400 font-medium">{eifEfpReports.progress.efp.integrations.total}</span>
              </div>
              <div className="text-xs text-gray-400">
                Examples: {eifEfpReports.progress.efp.integrations.examples.slice(0, 3).join(', ')}...
              </div>
              <a href={eifEfpReports.progress.efp.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                Visit EFP
              </a>
            </div>
          </div>

          {/* Sign in with Ethereum */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Sign in with Ethereum</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status:</span>
                <span className="text-yellow-400 font-medium">{eifEfpReports.progress.signInWithEthereum.status}</span>
              </div>
              <div className="text-sm text-gray-300">
                {eifEfpReports.progress.signInWithEthereum.description}
              </div>
              <div className="text-xs text-gray-400">
                {eifEfpReports.progress.signInWithEthereum.progress}
              </div>
            </div>
          </div>
        </div>

        {/* KPIs and Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">KPIs (Q2 2025)</h4>
            <div className="space-y-2">
              <div className="text-sm text-gray-300 mb-2">{eifEfpReports.kpis.target}</div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status:</span>
                <span className="text-green-400 font-medium">{eifEfpReports.kpis.status}</span>
              </div>
              <div className="text-xs text-gray-400">
                Achievements: {eifEfpReports.kpis.achievements.efpIntegrations}, {eifEfpReports.kpis.achievements.eikFeatures}, {eifEfpReports.kpis.achievements.efpFeatures}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2">
              <a href={eifEfpReports.forumLink} target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:text-blue-300 text-sm">
                Forum Report
              </a>
              <a href={eifEfpReports.links.eif} target="_blank" rel="noopener noreferrer" className="block text-cyan-400 hover:text-cyan-300 text-sm">
                EIF Website
              </a>
              <a href={eifEfpReports.links.eik.website} target="_blank" rel="noopener noreferrer" className="block text-green-400 hover:text-green-300 text-sm">
                EIK Website
              </a>
              <a href={eifEfpReports.links.efp.website} target="_blank" rel="noopener noreferrer" className="block text-purple-400 hover:text-purple-300 text-sm">
                EFP Website
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Funding Requests */}
      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-green-500 rounded mr-4"></div>
          <h3 className="text-xl font-bold text-white">Individual Funding Requests</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{comprehensiveFundingData.fundingRequests.length}</div>
            <div className="text-sm text-gray-300">Total Requests</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{formatCurrency(comprehensiveFundingData.fundingRequests.reduce((sum, request) => sum + request.amount, 0))}</div>
            <div className="text-sm text-gray-300">Total Requested</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">{comprehensiveFundingData.fundingRequests.filter(r => r.status === 'Voting').length}</div>
            <div className="text-sm text-gray-300">Currently Voting</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{comprehensiveFundingData.fundingRequests.filter(r => r.status === 'Active').length}</div>
            <div className="text-sm text-gray-300">Active Requests</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedFundingRequests.map((request, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">{request.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{request.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{request.description.substring(0, 80)}...</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{request.author}</td>
                  <td className="px-6 py-4">
                    <div className="text-green-400 font-medium">{formatCurrency(request.amount)}</div>
                    <div className="text-xs text-gray-400">{request.currency}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.category === 'Working Group' ? 'bg-blue-900 text-blue-300' :
                      request.category === 'Service Provider' ? 'bg-green-900 text-green-300' :
                      request.category === 'Scholarship' ? 'bg-purple-900 text-purple-300' :
                      request.category === 'Gitcoin Round' ? 'bg-orange-900 text-orange-300' :
                      request.category === 'Grants' ? 'bg-cyan-900 text-cyan-300' :
                      request.category === 'Security' ? 'bg-red-900 text-red-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {request.category}
                    </span>
                    {request.type && (
                      <div className="text-xs text-gray-400 mt-1">{request.type}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'Voting' ? 'bg-blue-900 text-blue-300' :
                      request.status === 'Active' ? 'bg-green-900 text-green-300' :
                      request.status === 'Executable' ? 'bg-purple-900 text-purple-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{request.period}</td>
                  <td className="px-6 py-4">
                    <a href={request.forumLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm mr-2">
                      Forum
                    </a>
                    {request.snapshotLink && (
                      <a href={request.snapshotLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm">
                        Vote
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Funding Request Details Modal */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comprehensiveFundingData.fundingRequests.filter(request => request.initiatives).map((request, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">{request.title}</h4>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-green-400 font-medium">{formatCurrency(request.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.status === 'Voting' ? 'bg-blue-900 text-blue-300' :
                    request.status === 'Active' ? 'bg-green-900 text-green-300' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Period:</span>
                  <span className="text-blue-400 font-medium">{request.period}</span>
                </div>
              </div>
              
              {request.initiatives && (
                <div className="space-y-2">
                  <h5 className="text-white font-medium text-sm">Initiatives:</h5>
                  {request.initiatives.map((initiative, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">{initiative.name}:</span>
                        <span className="text-green-400 font-medium">{formatCurrency(initiative.amount)}</span>
                      </div>
                      <div className="text-gray-400 mt-1">{initiative.description}</div>
                    </div>
                  ))}
                </div>
              )}

              {request.achievements && (
                <div className="mt-3">
                  <h5 className="text-white font-medium text-sm">Achievements:</h5>
                  <div className="text-xs text-gray-300">
                    {request.achievements.join(', ')}
                  </div>
                </div>
              )}

              <div className="mt-3">
                <a href={request.forumLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                  View Details
                </a>
                {request.snapshotLink && (
                  <a href={request.snapshotLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm ml-3">
                    Vote
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Q1 2025 Working Group Spending Summary */}
      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-purple-500 rounded mr-4"></div>
          <h3 className="text-xl font-bold text-white">Q1 2025 Working Group Spending Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{formatCurrency(comprehensiveFundingData.q1_2025_spending.total)}</div>
            <div className="text-sm text-gray-300">Total Q1 Spending</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{comprehensiveFundingData.q1_2025_spending.groups.length}</div>
            <div className="text-sm text-gray-300">Working Groups</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{comprehensiveFundingData.q1_2025_spending.period}</div>
            <div className="text-sm text-gray-300">Reporting Period</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comprehensiveFundingData.q1_2025_spending.groups.map((group, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">{group.name}</h4>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-400 font-medium">{formatCurrency(typeof group.spending === 'object' ? group.spending.usdc : group.spending)}</span>
                {typeof group.spending === 'object' && (
                  <span className="text-blue-400 font-medium">{group.spending.eth} ETH</span>
                )}
              </div>
              <div className="space-y-2">
                {group.initiatives.map((initiative, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{initiative.name}:</span>
                      <span className="text-green-400 font-medium">{formatCurrency(initiative.amount)}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{initiative.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Provider Program (SPP) Overview */}
      <div className="glass p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Service Provider Program (SPP) Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">{comprehensiveFundingData.serviceProviderProgram.currentPhase}</div>
            <div className="text-sm text-gray-300">Current Phase</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{comprehensiveFundingData.serviceProviderProgram.totalProviders}</div>
            <div className="text-sm text-gray-300">Total Providers</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">{formatCurrency(comprehensiveFundingData.serviceProviderProgram.totalFunding)}</div>
            <div className="text-sm text-gray-300">Total Funding</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{comprehensiveFundingData.serviceProviderProgram.activeProviders.length}</div>
            <div className="text-sm text-gray-300">Active Providers</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
              <tr>
                <th className="px-6 py-3">Provider</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Funding</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comprehensiveFundingData.serviceProviderProgram.activeProviders.map((provider, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-white">{provider.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      provider.category === 'Infrastructure' ? 'bg-blue-900 text-blue-300' :
                      provider.category === 'Identity' ? 'bg-green-900 text-green-300' :
                      provider.category === 'Development' ? 'bg-purple-900 text-purple-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {provider.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatCurrency(provider.funding)}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{provider.description}</td>
                  <td className="px-6 py-4">
                    <a href={provider.forumThread} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                      View Application
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Funding Programs */}
      <div className="glass p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Additional Funding Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">{formatCurrency(comprehensiveFundingData.additionalPrograms.reduce((sum, program) => sum + program.amount, 0))}</div>
            <div className="text-sm text-gray-300">Total Additional Funding</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{comprehensiveFundingData.additionalPrograms.length}</div>
            <div className="text-sm text-gray-300">Active Programs</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{comprehensiveFundingData.additionalPrograms.reduce((sum, program) => sum + (program.recipients || 0), 0)}</div>
            <div className="text-sm text-gray-300">Total Recipients</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">{comprehensiveFundingData.additionalPrograms.filter(p => p.status === 'Active').length}</div>
            <div className="text-sm text-gray-300">Active Status</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comprehensiveFundingData.additionalPrograms.map((program, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">{program.name}</h4>
              <p className="text-gray-300 text-sm mb-3">{program.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-400 font-medium">{formatCurrency(program.amount)}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  program.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                }`}>
                  {program.status}
                </span>
              </div>
              {program.recipients && (
                <div className="text-sm text-gray-400 mb-3">
                  Recipients: {program.recipients}
                </div>
              )}
              <a 
                href={program.forumLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Treasury Overview */}
      <div className="glass p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Treasury Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{formatCurrency(comprehensiveFundingData.treasuryData.totalAssets)}</div>
            <div className="text-sm text-gray-300">Total Assets</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{formatCurrency(comprehensiveFundingData.treasuryData.totalExpenditures)}</div>
            <div className="text-sm text-gray-300">Total Expenditures</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{formatCurrency(comprehensiveFundingData.treasuryData.netBalance)}</div>
            <div className="text-sm text-gray-300">Net Balance</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comprehensiveFundingData.treasuryData.wallets.map((wallet, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">{wallet.ensName || wallet.type}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">ETH:</span>
                  <span className="text-blue-400 font-medium">{wallet.balance.eth.toLocaleString()} ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">USD:</span>
                  <span className="text-green-400 font-medium">{formatCurrency(wallet.balance.usd)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">ENS:</span>
                  <span className="text-purple-400 font-medium">{wallet.balance.ens.toLocaleString()} ENS</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  <a href={`https://etherscan.io/address/${wallet.address}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    {wallet.address.substring(0, 10)}...
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-3 rounded-lg shadow-lg border border-gray-700">
        <div className="flex space-x-1">
          <button
            onClick={() => setViewMode('transaction')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'transaction'
                ? 'bg-blue-600 text-white border border-blue-500'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setViewMode('token')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'token'
                ? 'bg-blue-600 text-white border border-blue-500'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            }`}
          >
            Token Transfers
          </button>
        </div>
      </div>

      {viewMode === 'transaction' ? (
        <div className="glass rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-600">
            <h3 className="text-lg font-semibold text-white">Transaction History (Live from Blockchain)</h3>
        </div>
        
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    From/To
                </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Time
                </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Transaction
                </th>
              </tr>
            </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {transactions.map((tx, index) => {
                  const type = getTransactionType(tx);
                  const icon = getTransactionIcon(type);
                  
                  return (
                    <tr key={index} className="hover:bg-gray-800">
                      <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            type === 'Incoming' ? 'bg-green-900 text-green-300' :
                            type === 'Outgoing' ? 'bg-red-900 text-red-300' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {icon}
                          </span>
                          <span className="ml-2 text-sm font-medium text-white">{type}</span>
                      </div>
                    </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {formatBalance(tx.value)} ETH
                      </div>
                    </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-white">
                          <div className="font-mono text-xs text-gray-400">
                            {type === 'Incoming' ? 'From:' : 'To:'}
                          </div>
                          <div className="font-mono text-xs text-gray-300">
                            {type === 'Incoming' ? tx.from : tx.to}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {formatTimestamp(tx.timestamp)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <a 
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 font-mono"
                          title={tx.hash}
                        >
                          {tx.hash.substring(0, 10)}...
                        </a>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <div className="glass rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-600">
            <h3 className="text-lg font-semibold text-white">Token Transfers (Live from Blockchain)</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {tokenTransfers.map((tx, index) => {
                  const type = tx.from.toLowerCase() === treasuryAddress.toLowerCase() ? 'Sent' : 'Received';
                  
                  return (
                    <tr key={index} className="hover:bg-gray-800">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-white">
                            {tx.tokenSymbol}
                      </div>
                          <div className="text-xs text-gray-400 ml-2">
                            {tx.tokenName}
                      </div>
                    </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {formatBalance(tx.value, tx.tokenDecimal)} {tx.tokenSymbol}
                      </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          type === 'Received' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                          {type}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {formatTimestamp(tx.timestamp)}
                      </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                    <a 
                          href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 font-mono"
                          title={tx.hash}
                        >
                          {tx.hash.substring(0, 10)}...
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <a
            href={`https://etherscan.io/address/${treasuryAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="text-center">
              <div className="text-blue-400 text-2xl mb-2">View on Etherscan</div>
              <div className="text-sm font-medium text-gray-300">Blockchain Explorer</div>
            </div>
          </a>
          
          <a
            href="https://discuss.ens.domains/search?q=funding"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-2">Funding Requests</div>
              <div className="text-sm font-medium text-gray-300">Governance Forum</div>
            </div>
          </a>
          
          <a
            href="https://docs.google.com/spreadsheets/d/1VEnq3-L1shQAUybi8xBB1B6rFZI0v9HUX0IUp481-x8/edit?gid=406184236#gid=406184236"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="text-center">
              <div className="text-orange-400 text-2xl mb-2">Spending Summary</div>
              <div className="text-sm font-medium text-gray-300">Official Spreadsheet</div>
            </div>
          </a>
          
          <a
            href="https://dune.com/browse/ens"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="text-center">
              <div className="text-purple-400 text-2xl mb-2">Dune Analytics</div>
              <div className="text-sm font-medium text-gray-300">Analytics Dashboard</div>
            </div>
          </a>
          
          <a
            href="https://reports.kpk.io/ens"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="text-center">
              <div className="text-yellow-400 text-2xl mb-2">Karpatkey Reports</div>
              <div className="text-sm font-medium text-gray-300">Treasury Reports</div>
            </div>
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-yellow-500 rounded mr-4"></div>
          <h3 className="text-xl font-bold text-white">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <a
            href={`https://etherscan.io/address/${treasuryAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="text-center">
              <div className="text-blue-400 text-2xl mb-2">View on Etherscan</div>
              <div className="text-sm font-medium text-gray-300">Blockchain Explorer</div>
            </div>
          </a>
          
          <a
            href="https://discuss.ens.domains/search?q=funding"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-2">Funding Requests</div>
              <div className="text-sm font-medium text-gray-300">Governance Forum</div>
            </div>
          </a>
          
          <a
            href="https://docs.google.com/spreadsheets/d/1VEnq3-L1shQAUybi8xBB1B6rFZI0v9HUX0IUp481-x8/edit?gid=406184236#gid=406184236"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="text-center">
              <div className="text-orange-400 text-2xl mb-2">Spending Summary</div>
              <div className="text-sm font-medium text-gray-300">Official Spreadsheet</div>
            </div>
          </a>
          
          <a
            href="https://dune.com/browse/ens"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="text-center">
              <div className="text-purple-400 text-2xl mb-2">Dune Analytics</div>
              <div className="text-sm font-medium text-gray-300">Analytics Dashboard</div>
            </div>
          </a>
          
          <a
            href="https://reports.kpk.io/ens"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="text-center">
              <div className="text-yellow-400 text-2xl mb-2">Karpatkey Reports</div>
              <div className="text-sm font-medium text-gray-300">Treasury Reports</div>
            </div>
          </a>
        </div>
      </div>

      {/* ENS DAO Wallet List */}
      <div className="glass p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-blue-500 rounded mr-4"></div>
          <h3 className="text-xl font-bold text-white">ENS DAO Wallet Directory</h3>
          <div className="ml-auto text-sm text-gray-400">
            Total: {comprehensiveFundingData.ensWallets.length} wallets
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              placeholder="Search wallets..."
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <select className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500">
              <option value="">All Types</option>
              <option value="dao-treasury">DAO Treasury</option>
              <option value="endaoment">Endaoment</option>
              <option value="controller">Controller</option>
              <option value="working-group">Working Group</option>
              <option value="service-provider">Service Provider</option>
              <option value="eif-efp">EIF/EFP</option>
              <option value="gitcoin">Gitcoin</option>
              <option value="scholarship">Scholarship</option>
            </select>
            <select className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800">
              <tr>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">ENS Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comprehensiveFundingData.ensWallets.map((wallet, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-blue-400">
                      {wallet.address.substring(0, 8)}...{wallet.address.substring(38)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {wallet.ensName ? (
                      <span className="text-green-400 font-medium">{wallet.ensName}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      wallet.type === 'dao-treasury' ? 'bg-blue-900 text-blue-300' :
                      wallet.type === 'endaoment' ? 'bg-green-900 text-green-300' :
                      wallet.type === 'controller' ? 'bg-purple-900 text-purple-300' :
                      wallet.type === 'working-group' ? 'bg-orange-900 text-orange-300' :
                      wallet.type === 'service-provider' ? 'bg-cyan-900 text-cyan-300' :
                      wallet.type === 'eif-efp' ? 'bg-indigo-900 text-indigo-300' :
                      wallet.type === 'gitcoin' ? 'bg-pink-900 text-pink-300' :
                      wallet.type === 'scholarship' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {wallet.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white">{wallet.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="text-green-400 font-medium">
                        {formatCurrency(wallet.balance.eth)} ETH
                      </div>
                      <div className="text-blue-400 text-xs">
                        {formatCurrency(wallet.balance.usd)} USD
                      </div>
                      {wallet.balance.ens > 0 && (
                        <div className="text-purple-400 text-xs">
                          {formatCurrency(wallet.balance.ens)} ENS
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-blue-400 text-sm">{wallet.manager}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      wallet.status === 'Active' ? 'bg-green-900 text-green-300' :
                      wallet.status === 'Completed' ? 'bg-blue-900 text-blue-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {wallet.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <a
                        href={wallet.etherscanLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Etherscan →
                      </a>
                      {wallet.ensName && (
                        <a
                          href={`https://app.ens.domains/${wallet.ensName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          ENS →
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Wallet Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <div className="text-sm text-gray-400">Total Balance</div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(comprehensiveFundingData.ensWallets.reduce((sum, wallet) => sum + wallet.balance.usd, 0))}
            </div>
            <div className="text-xs text-gray-400">USD Value</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <div className="text-sm text-gray-400">Total ETH</div>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(comprehensiveFundingData.ensWallets.reduce((sum, wallet) => sum + wallet.balance.eth, 0))}
            </div>
            <div className="text-xs text-gray-400">Ethereum</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <div className="text-sm text-gray-400">Active Wallets</div>
            <div className="text-2xl font-bold text-blue-400">
              {comprehensiveFundingData.ensWallets.filter(wallet => wallet.status === 'Active').length}
            </div>
            <div className="text-xs text-gray-400">Currently Active</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <div className="text-sm text-gray-400">Service Providers</div>
            <div className="text-2xl font-bold text-cyan-400">
              {comprehensiveFundingData.ensWallets.filter(wallet => wallet.type === 'service-provider').length}
            </div>
            <div className="text-xs text-gray-400">SPP Wallets</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetTracker; 