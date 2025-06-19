# X Oracle 🚀

> A comprehensive blockchain oracle solution providing decentralized data feeds, VRF (Verifiable Random Functions), and request-response services.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.12-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue.svg)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Monorepo Structure](#monorepo-structure)
- [Quick Start](#quick-start)
- [Submodules](#submodules)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

X Oracle is a decentralized oracle network that provides reliable, tamper-proof data to smart contracts. Built as a monorepo, it includes smart contracts, core services, CLI tools, and web interfaces for managing oracle operations.

### Key Features

- 🔗 **Data Feeds**: Real-time price feeds and market data
- 🎲 **VRF (Verifiable Random Functions)**: Cryptographically secure randomness
- 🔄 **Request-Response**: On-demand data requests
- 🏗️ **Smart Contracts**: Deployable oracle infrastructure
- 🖥️ **CLI Tools**: Command-line interface for management
- 🌐 **Web Interface**: User-friendly dashboard
- 🔌 **API Services**: RESTful APIs for integration

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │   Core Services │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Database      │    │   Blockchain    │
                       │   (PostgreSQL)  │    │   (Contracts)   │
                       └─────────────────┘    └─────────────────┘
```

## 📁 Monorepo Structure

| Package                      | Description                         | Tech Stack          | Status |
| ---------------------------- | ----------------------------------- | ------------------- | ------ |
| [`contracts/`](./contracts/) | Smart contracts for oracle services | Solidity, Hardhat   | ✅     |
| [`core/`](./core/)           | Core oracle services and workers    | Node.js, TypeScript | ✅     |
| [`cli/`](./cli/)             | Command-line interface              | Node.js, TypeScript | ✅     |
| [`vrf/`](./vrf/)             | Verifiable Random Functions         | TypeScript, ECVRF   | ✅     |
| [`api/`](./api/)             | REST API for price feeds            | NestJS, TypeScript  | ✅     |
| [`open/`](./open/)           | Referral system API                 | NestJS, Prisma      | ✅     |
| [`fe/`](./fe/)               | Web frontend dashboard              | Next.js, React      | ✅     |

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.12
- **Yarn** package manager
- **PostgreSQL** database
- **Redis** cache server
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd x-oracle
   ```

2. **Install dependencies for all packages**

   ```bash
   # Install contracts dependencies
   cd contracts && yarn install && cd ..

   # Install core dependencies
   cd core && yarn install && cd ..

   # Install CLI dependencies
   cd cli && yarn install && cd ..

   # Install VRF dependencies
   cd vrf && yarn install && cd ..

   # Install API dependencies
   cd api && yarn install && cd ..

   # Install open API dependencies
   cd open && yarn install && cd ..

   # Install frontend dependencies
   cd fe && yarn install && cd ..
   ```

3. **Set up environment variables**

   ```bash
   # Copy example environment files
   cp contracts/.env.example contracts/.env
   cp core/.env.example core/.env
   cp cli/.env.example cli/.env
   cp api/.env.example api/.env
   cp open/.env.example open/.env
   cp fe/.env.dev fe/.env.local
   ```

4. **Set up databases**

   ```bash
   # Start PostgreSQL and Redis
   brew services start postgresql
   brew services start redis

   # Set up database schemas
   cd api && npx prisma generate && npx prisma db push && cd ..
   cd open && npx prisma generate && npx prisma db push && cd ..
   ```

## 📦 Submodules

### 🔗 Contracts (`/contracts`)

Smart contracts for oracle services including data feeds, VRF, and request-response functionality.

<details>
<summary><strong>Quick Commands</strong></summary>

```bash
cd contracts

# Compile contracts
yarn compile

# Run tests
yarn test

# Deploy to local network
yarn deploy:localhost:prepayment
yarn deploy:localhost:vrf
yarn deploy:localhost:rr
yarn deploy:localhost:aggregator

# Build package
yarn build
```

</details>

<details>
<summary><strong>Key Features</strong></summary>

- **Data Feed Aggregators**: Price feed contracts
- **VRF Contracts**: Verifiable random number generation
- **Request-Response**: On-demand data requests
- **Prepayment System**: Gas fee management
- **Multi-network Support**: Deploy to various networks

</details>

**[📖 Full Documentation](./contracts/README.md)**

---

### ⚙️ Core (`/core`)

Core oracle services including workers, listeners, and queue management.

<details>
<summary><strong>Quick Commands</strong></summary>

```bash
cd core

# Build the project
yarn build

# Start workers
yarn start:worker:vrf
yarn start:worker:dataFeed
yarn start:worker:rr

# Start listeners
yarn start:listener:vrf
yarn start:listener:rr

# Run tests
yarn test
```

</details>

<details>
<summary><strong>Key Features</strong></summary>

- **Worker Services**: Process oracle requests
- **Listener Services**: Monitor blockchain events
- **Queue Management**: BullMQ integration
- **Multi-service Support**: VRF, Data Feed, Request-Response

</details>

**[📖 Full Documentation](./core/README.md)**

---

### 🖥️ CLI (`/cli`)

Command-line interface for managing oracle operations and configurations.

<details>
<summary><strong>Quick Commands</strong></summary>

```bash
cd cli

# Build the CLI
yarn build

# Run CLI commands
yarn cli --help

# Run tests
yarn test

# Lint code
yarn lint
```

</details>

<details>
<summary><strong>Key Features</strong></summary>

- **Configuration Management**: Set up oracle parameters
- **Service Communication**: Connect to API, Fetcher, Delegator
- **Network Management**: Multi-chain support
- **Interactive Commands**: User-friendly CLI interface

</details>

**[📖 Full Documentation](./cli/README.md)**

---

### 🎲 VRF (`/vrf`)

Verifiable Random Functions implementation based on ECVRF standard.

<details>
<summary><strong>Quick Commands</strong></summary>

```bash
cd vrf

# Build the package
yarn build

# Run tests
yarn test

# Lint code
yarn lint
```

</details>

<details>
<summary><strong>Key Features</strong></summary>

- **ECVRF Implementation**: Standards-compliant VRF
- **Cryptographic Security**: Elliptic curve cryptography
- **Proof Generation**: Verifiable random number proofs
- **TypeScript Support**: Full type definitions

</details>

**[📖 Full Documentation](./vrf/README.md)**

---

### 🌐 API (`/api`)

REST API service for price feeds and oracle data access.

<details>
<summary><strong>Quick Commands</strong></summary>

```bash
cd api

# Install dependencies
yarn install

# Generate Prisma client
npx prisma generate

# Start development server
yarn start:dev

# Build for production
yarn build

# Start production server
yarn start:prod
```

</details>

<details>
<summary><strong>Key Features</strong></summary>

- **RESTful API**: HTTP endpoints for data access
- **Swagger Documentation**: Auto-generated API docs
- **Database Integration**: Prisma ORM with PostgreSQL
- **Queue Processing**: Background job handling

</details>

**[📖 Full Documentation](./api/README.md)**

---

### 🔗 Open API (`/open`)

Referral system API with social referral features.

<details>
<summary><strong>Quick Commands</strong></summary>

```bash
cd open

# Install dependencies
yarn install

# Generate Prisma client
npx prisma generate

# Update database schema
npx prisma db push

# Start development server
yarn start:dev

# Build for production
yarn build
```

</details>

<details>
<summary><strong>Key Features</strong></summary>

- **Referral System**: User referral tracking
- **Social Integration**: Social media referral features
- **Database Management**: Prisma with PostgreSQL
- **NestJS Framework**: Scalable API architecture

</details>

**[📖 Full Documentation](./open/README.md)**

---

### 🎨 Frontend (`/fe`)

Web-based dashboard for oracle management and monitoring.

<details>
<summary><strong>Quick Commands</strong></summary>

```bash
cd fe

# Start development server
yarn dev

# Build for production
yarn build:prod

# Start production server
yarn start

# Lint code
yarn lint
```

</details>

<details>
<summary><strong>Key Features</strong></summary>

- **Modern UI**: Next.js with Tailwind CSS
- **Web3 Integration**: Wallet connection with RainbowKit
- **Real-time Data**: Live oracle feed updates
- **Multi-language**: Internationalization support
- **Responsive Design**: Mobile-friendly interface

</details>

**[📖 Full Documentation](./fe/README.md)**

---

## 🛠️ Development

### Local Development Setup

1. **Start all services**

   ```bash
   # Terminal 1: Start PostgreSQL and Redis
   brew services start postgresql
   brew services start redis

   # Terminal 2: Start API services
   cd api && yarn start:dev

   # Terminal 3: Start core services
   cd core && yarn start:worker:vrf

   # Terminal 4: Start frontend
   cd fe && yarn dev
   ```

2. **Deploy contracts locally**

   ```bash
   cd contracts
   npx hardhat node --hostname 127.0.0.1 --no-deploy

   # In another terminal
   yarn deploy:localhost:prepayment
   yarn deploy:localhost:vrf
   yarn deploy:localhost:rr
   ```

### Testing

```bash
# Run tests for all packages
cd contracts && yarn test && cd ..
cd cli && yarn test && cd ..
cd vrf && yarn test && cd ..
cd api && yarn test && cd ..
cd open && yarn test && cd ..
```

### Linting

```bash
# Lint all packages
cd contracts && yarn lint && cd ..
cd cli && yarn lint && cd ..
cd vrf && yarn lint && cd ..
cd core && yarn lint && cd ..
cd api && yarn lint && cd ..
cd open && yarn lint && cd ..
cd fe && yarn lint && cd ..
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**

   ```bash
   # Run tests
   yarn test

   # Run linting
   yarn lint
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Write **comprehensive tests**
- Update **documentation** for new features
- Use **conventional commits** for commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [GitHub Wiki](https://github.com/your-org/x-oracle/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-org/x-oracle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/x-oracle/discussions)

---

<div align="center">

**Built with ❤️ by the X Oracle Team**

[![GitHub stars](https://img.shields.io/github/stars/your-org/x-oracle?style=social)](https://github.com/your-org/x-oracle)
[![GitHub forks](https://img.shields.io/github/forks/your-org/x-oracle?style=social)](https://github.com/your-org/x-oracle)
[![GitHub issues](https://img.shields.io/github/issues/your-org/x-oracle)](https://github.com/your-org/x-oracle/issues)

</div>
