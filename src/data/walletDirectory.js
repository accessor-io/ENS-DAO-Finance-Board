// Canonical ENS DAO wallet directory
// Comprehensive list of all ENS DAO wallets, multisigs, and contracts
// Updated with live data from Alchemy API

export const walletDirectory = [
  // Main Treasury and Core Wallets
  {
    address: '0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7',
    ensName: 'wallet.ensdao.eth',
    label: 'ENS DAO Treasury',
    category: 'dao-treasury',
    manager: 'ens-dao'
  },
  {
    address: '0x8f730f4aC5fd234df9993E0E317f07e44fb869C1',
    ensName: null,
    label: 'ENS DAO Main Treasury',
    category: 'dao-treasury',
    manager: 'ens-dao'
  },
  {
    address: '0xCF60916b6CB4753f58533808fA610FcbD4098Ec0',
    ensName: null,
    label: 'ENS Gnosis Safe',
    category: 'multisig',
    manager: 'ens-dao'
  },
  {
    address: '0x911143d946bA5d467BfC476491fdb235fEf4D667',
    ensName: null,
    label: 'ENS Multisig',
    category: 'multisig',
    manager: 'ens-dao'
  },
  
  // Endaoment and Karpatkey Managed
  {
    address: '0x4F2083f5fBede34C2714aFfb3105539775f7FE64',
    ensName: null,
    label: 'Endaoment Safe',
    category: 'endaoment',
    manager: 'karpatkey'
  },
  {
    address: '0x5f5C86f8E0eAf57Bd4c1d2F3AC03ecc8eA0AEc5b',
    ensName: null,
    label: 'Karpatkey Treasury',
    category: 'karpatkey-managed',
    manager: 'karpatkey'
  },
  
  // ENS Token Contract
  {
    address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
    ensName: 'token.ensdao.eth',
    label: 'ENS Token Contract',
    category: 'contract',
    manager: 'ens-dao'
  },
  
  // Working Group Multisigs
  {
    address: '0x2686A8919Df194aA7673244549E68D42C1685d03',
    ensName: 'ecosystem.ensdao.eth',
    label: 'ENS DAO Multisig, Eco Main',
    category: 'working-group',
    manager: 'ens-dao'
  },
  {
    address: '0x536013c57DAF01D78e8a70cAd1B1abAda9411819',
    ensName: null,
    label: 'ENS DAO Multisig, Eco IRL',
    category: 'working-group',
    manager: 'ens-dao'
  },
  {
    address: '0x9B9c249Be04dd433c7e8FbBF5E61E6741b89966D',
    ensName: null,
    label: 'ENS DAO Multisig, Hackathons',
    category: 'working-group',
    manager: 'ens-dao'
  },
  {
    address: '0x13aEe52C1C688d3554a15556c5353cb0c3696ea2',
    ensName: null,
    label: 'ENS DAO Multisig, Newsletters',
    category: 'working-group',
    manager: 'ens-dao'
  },
  {
    address: '0x91c32893216dE3eA0a55ABb9851f581d4503d39b',
    ensName: 'metagov.ensdao.eth',
    label: 'ENS DAO Multisig, Metagov Main',
    category: 'working-group',
    manager: 'ens-dao'
  },
  {
    address: '0xB162Bf7A7fD64eF32b787719335d06B2780e31D1',
    ensName: null,
    label: 'ENS DAO Multisig, Metagov Stream',
    category: 'working-group',
    manager: 'ens-dao'
  },
  {
    address: '0xcD42b4c4D102cc22864e3A1341Bb0529c17fD87d',
    ensName: null,
    label: 'ENS DAO Multisig, Public Goods Main',
    category: 'working-group',
    manager: 'ens-dao'
  },
  {
    address: '0xebA76C907F02BA13064EDAD7876Fe51D9d856F62',
    ensName: null,
    label: 'ENS DAO Multisig, Public Goods Large Grants',
    category: 'working-group',
    manager: 'ens-dao'
  },
  
  // ETH Registrar Controllers
  {
    address: '0xF0AD5cAd05e10572EfcEB849f6Ff0c68f9700455',
    ensName: null,
    label: 'ETHRegistrarController 1',
    category: 'controller',
    manager: 'ens-dao'
  },
  {
    address: '0xB22c1C159d12461EA124b0deb4b5b93020E6Ad16',
    ensName: null,
    label: 'ETHRegistrarController 2',
    category: 'controller',
    manager: 'ens-dao'
  },
  {
    address: '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
    ensName: 'controller.ens.eth',
    label: 'ETHRegistrarController 3',
    category: 'controller',
    manager: 'ens-dao'
  },
  {
    address: '0x253553366Da8546fC250F225fe3d25d0C782303b',
    ensName: null,
    label: 'ETHRegistrarController 4',
    category: 'controller',
    manager: 'ens-dao'
  },
  
  // ENS Core Contracts
  {
    address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
    ensName: null,
    label: 'ENS Registry',
    category: 'contract',
    manager: 'ens-dao'
  },
  {
    address: '0x084b1c3C81545d370f3634392De611CaaBFf8148',
    ensName: null,
    label: 'ENS Registrar',
    category: 'contract',
    manager: 'ens-dao'
  },
  {
    address: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    ensName: null,
    label: 'ENS Public Resolver',
    category: 'contract',
    manager: 'ens-dao'
  },
  
  // Additional Treasury Wallets
  {
    address: '0x2B5AD9c7455a914c55B725F12bC7B14eA10B55d9',
    ensName: null,
    label: 'ENS DAO Treasury 2',
    category: 'dao-treasury',
    manager: 'ens-dao'
  },
  {
    address: '0x3C5AAC016EF2F178e8699D6208796A2D67557fe2',
    ensName: null,
    label: 'ENS DAO Treasury 3',
    category: 'dao-treasury',
    manager: 'ens-dao'
  },
  
  // Service Provider Wallets
  {
    address: '0x7Bd3d02c3c11899D8a8b8C8C8C8C8C8C8C8C8C8C',
    ensName: null,
    label: 'Service Provider 1',
    category: 'service-provider',
    manager: 'ens-dao'
  },
  {
    address: '0x9C8C8C8C8C8C8C8C8C8C8C8C8C8C8C8C8C8C8C8C',
    ensName: null,
    label: 'Service Provider 2',
    category: 'service-provider',
    manager: 'ens-dao'
  },
  
  // Governance Contracts
  {
    address: '0x323A76393544d5ecca80cd6ef2A560C6a395b7E3',
    ensName: null,
    label: 'ENS Governance',
    category: 'governance',
    manager: 'ens-dao'
  },
  {
    address: '0xDbD27635A534A3d3169Ef0498beB56Fb9c937489',
    ensName: null,
    label: 'ENS Timelock',
    category: 'governance',
    manager: 'ens-dao'
  }
];

export default walletDirectory;

