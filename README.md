<div align="center">
<h1>ÖdülGit</h1>

<p> An on-chain bounty platform to bolster developer community</p>

<img src="./apps/web/public/Odulgit-Logo.png" width="50%" height="50%"></img>

[![License: LGPL v3](https://img.shields.io/npm/l/odul
)](./LICENSE) [![NPM Version](https://img.shields.io/npm/v/odul
)](https://www.npmjs.com/package/odul) [![Odulgit Frontend](https://github.com/odulgit/odulgit/actions/workflows/ghpages.yml/badge.svg)](https://github.com/odulgit/odulgit/actions/workflows/ghpages.yml)
</div>

### Demo Page
- WebPage: [odulgit.net/odulgit/](https://odulgit.net/odulgit/)
- tweet: https://twitter.com/kidneyweakx/status/1726114026768540040
- Video: [https://youtu.be/](https://youtu.be/)
- Contract Address:
  - Sepolia Address: https://sepolia.etherscan.io/address/0xC359132E29bf040aA546b4de51B06D6e4B772628#code
  - Scroll Sepolia Address: https://sepolia.scrollscan.com/address/0xC359132E29bf040aA546b4de51B06D6e4B772628#code
  - Chiado Testnet Address: https://gnosis-chiado.blockscout.com/address/0xC359132E29bf040aA546b4de51B06D6e4B772628#code
  - Aribitrum Stylus Address: https://stylus-testnet-explorer.arbitrum.io/address/0xC359132E29bf040aA546b4de51B06D6e4B772628#code
  - Polygon ZKEVM Address: https://testnet-zkevm.polygonscan.com/address/0xC359132E29bf040aA546b4de51B06D6e4B772628#code

### Abstract
OdulGit is actually an on-chain dev-centric tool designed for developers. There’re 3 key elements of it.
First, bounty as the incentive for developer community. Anyone on GitHub could list the issue with reward.  
Second, as every issues is awarded, the real contributors could be engaged more precisely by the project owner. (of course, in that way, we believe the sybil attack could be mitigated.
Third, the pull request is verified and voted  by DAO, a group of code owners, to facilitate the pull request reviewing process and make it more objective

### Problem Statement
- Bounty as the incentive for developer community.
- Code owners/contributors as a DAO to verify pull request.
- Precise engagement with those who contribute to the community between Web2 and Web3.

### Solution
- Verify SHA1 commit on-chain, can avoid spam commits
- Use `IPFS and Filecoin` store git codebase
- Use `walletconnect` connect CLI tool and developer source version control platform


### Build & Installation

> OdulGit is a monorepo managed using turbo. You can find the source code for each package in the `apps` and `packages` directory.

- `apps/odul` is the CLI tool built from yargs.
- `apps/web` is the web frontend. It is built using [Next.js](https://nextjs.org/) and [ui.shadcn](https://ui.shadcn.com/).
- `packages/git-contract` solidity contract verify commit
  - core: DAO, Bounty, Git
  - Git: init, push, merge, verify commit
  - Bounty: give bounty and set issues
  - DAO: make contributors review codebase
- `packages/storage-helper` ipfs and filecoin environment. Provide filecoin deal contract and upload on lotus function.

1. Install all peer dependencies
```
pnpm install
```

2. Build All need
```
pnpm build
```

3. Use npm link to use CLI
```
cd apps/odul
npm link
```

### Technical Architechure

> FlowChart Overview

```mermaid
flowchart LR 
	name[odul-git] --> CLI
	subgraph A[CLI Graph]
		CLI --> Basic
		CLI --> Common
		CLI --> Advanced
		%% Basic
		
		Basic --> Clone
		subgraph clone
			Clone --> search-idx
			Clone --> fetch-pack
		end
		Basic --> Push
		subgraph push
			Push --> bundle
			Push --> gc[send-pack]
			Push --> PR
		end

		%% Common
		Common --> Sign
		Common --> Migrate
		subgraph sign
			Sign --> ECDSA
			Sign --> Wallet[Wallet Connect]
		end
		subgraph migrate
			Migrate --> fetch
			Migrate --> gc
		end

		%% Adanvanced
		Advanced --> Sync[sync with github]
		subgraph sync
			Sync --> merge[merge from github]
		end
	end
	PR --> verifySHA1
	
	name --> Contract
	subgraph contract
		Contract --> GitFactory
		Contract --> Tree[Git SHA1 Tree]
		Contract --> CodeBase
		Contract --> Bounty

		subgraph gitfactory		
			GitFactory --> RepoAddress
		end
		subgraph tree
			Tree --> storeRoot[tree root store- first commit]
			Tree --> verifySHA1[verify commit parent]
			Tree --> storeHead[Now Main Branch Head Ref]
		end
		subgraph codebase
			CodeBase --> IPFS[ipfs folder CID]
			CodeBase --> Celestia[celestia file id]		
		end
		subgraph bounty
			Bounty --> OpenI[Open Issue]
			Tree --> Merge
			Merge --> CloseI[Close Issue]
			Bounty --> CloseI
			CloseI --> Mint[Mint ERC20/721]
		end
	end
	
	name --> Frontend
	subgraph frontend

		Frontend --> Page1[1. Clone / Code Page]
		subgraph page1
				Page1 --get address--> C1[Contract Address]
				C1 --> RepoAddress
				Page1 --get idx--> C2[Contract Store IDX]
				C2 --> storeHead
		end

		Frontend --> Page2[2. Issue / Bounty]
		subgraph page2
				Page2 --Open Issue--> C3[Git Contract]
				C3 --> OpenI
		end
		Frontend --> Page3[3. PR / Link Issue]
		subgraph page3
				Page3 --Open PR--> Link[link bounty and bundle location]
				Page3 --Review--> C4[Git Contract]
				C4 --> Merge
		end
		Frontend --> Page4[4. Bug Bounty]
		subgraph page4
			Page4 --> secret[secret push]
			secret --> C5[ZK verify]
			C5 --> Merge
		end
	end
```
