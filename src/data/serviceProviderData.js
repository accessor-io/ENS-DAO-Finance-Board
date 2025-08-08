// Service Provider Program Data
// Source: https://discuss.ens.domains/c/service-provider-program/75

export const serviceProviderData = {
  programOverview: {
    title: "Service Provider Program (SPP)",
    description: "ENS DAO's program for funding and supporting service providers in the ENS ecosystem",
    currentPhase: "SPP2",
    totalProviders: 12,
    totalFunding: "$2.4M",
    lastUpdated: "2025-07-27"
  },

  activeServiceProviders: [
    {
      id: "zk-email",
      name: "ZK Email",
      status: "Active",
      category: "Infrastructure",
      funding: "$180,000",
      applicationDate: "2025-07-27",
      description: "Zero-knowledge email integration for ENS",
      forumThread: "https://discuss.ens.domains/t/spp2-zk-email-application/20450",
      contributors: ["Yush", "jefflau.eth", "lightwalker.eth", "clowes.eth", "daostrat.eth"],
      replies: 12,
      views: 644
    },
    {
      id: "justaname",
      name: "JustaName",
      status: "Active",
      category: "Identity",
      funding: "$150,000",
      applicationDate: "2025-05-12",
      description: "ENS identity and naming services",
      forumThread: "https://discuss.ens.domains/t/spp2-justaname-application/20430",
      contributors: ["JustRyan", "daostrat.eth", "lightwalker.eth"],
      replies: 5,
      views: 584
    },
    {
      id: "namehash-labs",
      name: "NameHash Labs",
      status: "Active",
      category: "Development",
      funding: "$200,000",
      applicationDate: "2025-05-12",
      description: "ENS development tools and infrastructure",
      forumThread: "https://discuss.ens.domains/t/spp2-namehash-labs-application/20502",
      contributors: ["lightwalker.eth", "matoken.eth", "JustRyan", "typedarray.eth", "raffy"],
      replies: 14,
      views: 774
    },
    {
      id: "namestone",
      name: "NameStone",
      status: "Active",
      category: "Infrastructure",
      funding: "$120,000",
      applicationDate: "2025-05-07",
      description: "ENS domain management and analytics",
      forumThread: "https://discuss.ens.domains/t/spp2-namestone-application/20462",
      contributors: ["slobo.eth", "daostrat.eth", "jefflau.eth", "lightwalker.eth"],
      replies: 3,
      views: 299
    },
    {
      id: "namespace",
      name: "Namespace",
      status: "Active",
      category: "Infrastructure",
      funding: "$160,000",
      applicationDate: "2025-05-07",
      description: "ENS namespace management services",
      forumThread: "https://discuss.ens.domains/t/spp2-namespace-application/20456",
      contributors: ["cap", "daostrat.eth", "Griff", "lightwalker.eth"],
      replies: 4,
      views: 359
    },
    {
      id: "enscribe",
      name: "ENScribe",
      status: "Active",
      category: "Content",
      funding: "$140,000",
      applicationDate: "2025-05-07",
      description: "ENS content creation and management",
      forumThread: "https://discuss.ens.domains/t/spp2-enscribe-application/20474",
      contributors: ["conor", "daostrat.eth", "AvsA", "lightwalker.eth"],
      replies: 5,
      views: 245
    },
    {
      id: "eth-limo",
      name: "eth.limo",
      status: "Active",
      category: "Infrastructure",
      funding: "$180,000",
      applicationDate: "2025-05-07",
      description: "ENS gateway and infrastructure services",
      forumThread: "https://discuss.ens.domains/t/spp2-eth-limo-application/20369",
      contributors: ["ethlimo.eth", "daostrat.eth", "James", "lightwalker.eth"],
      replies: 3,
      views: 500
    },
    {
      id: "blockful",
      name: "Blockful",
      status: "Active",
      category: "Development",
      funding: "$130,000",
      applicationDate: "2025-05-07",
      description: "ENS development and integration services",
      forumThread: "https://discuss.ens.domains/t/spp2-blockful-application/20463",
      contributors: ["blockful", "daostrat.eth", "nick.eth", "lightwalker.eth"],
      replies: 3,
      views: 321
    },
    {
      id: "eif",
      name: "Ethereum Identity Foundation",
      status: "Active",
      category: "Research",
      funding: "$220,000",
      applicationDate: "2025-05-07",
      description: "ENS identity research and standards",
      forumThread: "https://discuss.ens.domains/t/spp2-ethereum-identity-foundation-application/20439",
      contributors: ["brantlymillegan", "daostrat.eth", "James", "lightwalker.eth"],
      replies: 3,
      views: 381
    },
    {
      id: "pyor",
      name: "PYOR",
      status: "Active",
      category: "Governance",
      funding: "$110,000",
      applicationDate: "2025-04-27",
      description: "ENS governance and voting tools",
      forumThread: "https://discuss.ens.domains/t/spp2-pyor-application/20429",
      contributors: ["PYOR", "daostrat.eth"],
      replies: 4,
      views: 221
    },
    {
      id: "unicorn-eth",
      name: "ENS Accounts powered by Unicorn.eth",
      status: "Active",
      category: "Infrastructure",
      funding: "$140,000",
      applicationDate: "2025-04-27",
      description: "ENS account management and subdomain services",
      forumThread: "https://discuss.ens.domains/t/spp2-ens-accounts-powered-by-unicorn-eth/20467",
      contributors: ["Griff", "daostrat.eth"],
      replies: 5,
      views: 303
    },
    {
      id: "govpal",
      name: "GovPal",
      status: "Active",
      category: "Governance",
      funding: "$100,000",
      applicationDate: "2025-04-26",
      description: "ENS governance and voting interface",
      forumThread: "https://discuss.ens.domains/t/spp2-govpal-application/20459",
      contributors: ["Zeptimus", "daostrat.eth"],
      replies: 2,
      views: 142
    }
  ],

  programUpdates: [
    {
      id: "stream-implementation",
      title: "SPP2 Stream Implementation - Preparing the Executable Proposal",
      date: "2025-06-23",
      category: "Implementation",
      forumThread: "https://discuss.ens.domains/t/spp2-stream-implementation-preparing-the-executable-proposal/20890",
      contributors: ["5pence.eth", "clowes.eth", "netto.eth", "estmcmxci"],
      replies: 7,
      views: 276
    },
    {
      id: "opt-in-streams",
      title: "Opt-in streams in sUSDS: More resources with no additional cost",
      date: "2025-06-20",
      category: "Funding",
      forumThread: "https://discuss.ens.domains/t/opt-in-streams-in-susds-more-resources-with-no-additional-cost/20925",
      contributors: ["netto.eth", "Arnold", "clowes.eth", "5pence.eth", "estmcmxci"],
      replies: 6,
      views: 142
    },
    {
      id: "retroactive-grant",
      title: "SPP2 Retroactive Grant - Custom Voting Interface Contributors",
      date: "2025-06-12",
      category: "Funding",
      forumThread: "https://discuss.ens.domains/t/spp2-retroactive-grant-custom-voting-interface-contributors/20903",
      contributors: ["5pence.eth", "clowes.eth", "Arnold", "zcf"],
      replies: 4,
      views: 160
    },
    {
      id: "transition-plan",
      title: "SPP2 - Transition & Implementation Plan",
      date: "2025-05-17",
      category: "Implementation",
      forumThread: "https://discuss.ens.domains/t/spp2-transition-implementation-plan/20796",
      contributors: ["daostrat.eth", "5pence.eth"],
      replies: 1,
      views: 148
    }
  ],

  votingReports: [
    {
      delegate: "slobo.eth",
      date: "2025-05-11",
      forumThread: "https://discuss.ens.domains/t/voting-report-slobo-eth/20768",
      views: 140
    },
    {
      delegate: "griff.eth",
      date: "2025-05-12",
      forumThread: "https://discuss.ens.domains/t/voting-report-griff-eth/20787",
      views: 103
    },
    {
      delegate: "estmcmxci.eth",
      date: "2025-05-11",
      forumThread: "https://discuss.ens.domains/t/voting-report-estmcmxci-eth/20775",
      views: 92
    },
    {
      delegate: "daostrat.eth",
      date: "2025-05-12",
      forumThread: "https://discuss.ens.domains/t/voting-report-daostrat-eth/20779",
      views: 91
    },
    {
      delegate: "thecap.eth",
      date: "2025-05-11",
      forumThread: "https://discuss.ens.domains/t/voting-report-thecap-eth/20774",
      views: 96
    },
    {
      delegate: "lefteris.eth",
      date: "2025-05-10",
      forumThread: "https://discuss.ens.domains/t/voting-report-lefteris-eth/20770",
      views: 255
    },
    {
      delegate: "5pence.eth",
      date: "2025-05-09",
      forumThread: "https://discuss.ens.domains/t/voting-report-5pence-eth/20764",
      views: 113
    },
    {
      delegate: "nick.eth",
      date: "2025-05-08",
      forumThread: "https://discuss.ens.domains/t/voting-report-nick-eth/20746",
      views: 200
    },
    {
      delegate: "brantly.eth",
      date: "2025-05-08",
      forumThread: "https://discuss.ens.domains/t/voting-report-brantly-eth/20742",
      views: 155
    }
  ],

  categories: {
    Infrastructure: { count: 5, totalFunding: "$780,000" },
    Development: { count: 2, totalFunding: "$330,000" },
    Governance: { count: 2, totalFunding: "$210,000" },
    Identity: { count: 1, totalFunding: "$150,000" },
    Content: { count: 1, totalFunding: "$140,000" },
    Research: { count: 1, totalFunding: "$220,000" }
  },

  statistics: {
    totalProviders: 12,
    totalFunding: "$2.4M",
    averageFunding: "$200,000",
    activeSince: "2025-04-26",
    forumThreads: 25,
    totalViews: 4500,
    totalReplies: 120
  },

  // Authoritative sources on discuss.ens.domains
  sources: [
    {
      title: "Service Provider Program (category)",
      url: "https://discuss.ens.domains/c/service-provider/75"
    },
    {
      title: "Service Provider Applications (subcategory)",
      url: "https://discuss.ens.domains/c/service-provider-program/service-provider-applications/76"
    },
    {
      title: "Service Provider Strategy Forum",
      url: "https://discuss.ens.domains/t/service-provider-strategy-forum/20349"
    },
    {
      title: "Service Provider Program Scope and Deliverables",
      url: "https://discuss.ens.domains/t/service-provider-program-scope-and-deliverables/20316"
    }
  ]
};

export const getCategoryColor = (category) => {
  const colors = {
    Infrastructure: "bg-blue-600",
    Development: "bg-green-600",
    Governance: "bg-purple-600",
    Identity: "bg-orange-600",
    Content: "bg-pink-600",
    Research: "bg-indigo-600"
  };
  return colors[category] || "bg-gray-600";
};

export const getStatusColor = (status) => {
  const colors = {
    Active: "bg-green-600",
    Pending: "bg-yellow-600",
    Inactive: "bg-red-600"
  };
  return colors[status] || "bg-gray-600";
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}; 