# Overview

This is a Discord music bot built with JavaScript, Discord.js v14, and Shoukaku for Lavalink music functionality. The bot provides comprehensive music features including multi-platform support (YouTube, Spotify, SoundCloud), audio filters, advanced queue management with loop/shuffle/seek capabilities, previous track history, and 24/7 voice channel functionality. The project has been organized into a proper Discord bot folder structure with enhanced nowplaying progress tracking, comprehensive command suite, and improved support documentation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for development and production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Discord Integration**: Discord.js v14 for bot functionality and interaction handling
- **Music Engine**: Shoukaku (Lavalink client) for high-quality audio streaming and playback
- **Audio Processing**: Custom filter system with 40+ audio filters including bass boost, nightcore, and spatial audio effects

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL) for scalable cloud hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Local Storage**: JSON files for 24/7 channel persistence and bot configuration data
- **Session Storage**: In-memory storage for music queues and temporary bot state

## Authentication and Authorization
- **Discord Bot Authentication**: Token-based authentication using Discord Bot Token
- **Permission System**: Discord guild permissions and role-based access control
- **Voice Channel Validation**: Real-time verification of user voice channel membership
- **Command Restrictions**: Per-command permission checking for music controls

## Music System Architecture
- **Queue Management**: Custom queue system with track ordering, loop modes, and shuffle functionality
- **Multi-Platform Support**: YouTube, Spotify, and SoundCloud integration through Lavalink
- **Audio Processing**: Real-time audio filters with dynamic application and removal
- **Session Persistence**: 24/7 mode for persistent voice channel connections
- **Interactive Controls**: Button-based music controls with embed-rich responses

# External Dependencies

## Discord Services
- **Discord.js**: Official Discord API library for bot functionality and event handling
- **Discord Developer Portal**: Bot registration, permissions, and application management

## Audio and Music Services
- **Lavalink**: External audio processing server for music streaming and effects
- **YouTube**: Primary music source through Lavalink integration
- **Spotify**: Track metadata and playlist support
- **SoundCloud**: Alternative music platform integration

## Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with automatic migrations
- **PostgreSQL**: Relational database for user data and persistent storage

## Development and Build Tools
- **Vite**: Fast build tool with hot module replacement for development
- **TypeScript**: Static type checking across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **PostCSS**: CSS processing with autoprefixer for browser compatibility

## UI and Component Libraries
- **Radix UI**: Headless UI primitives for accessible component foundation
- **shadcn/ui**: Pre-built component library with consistent design patterns
- **Lucide React**: Modern icon library with tree-shaking support
- **TanStack Query**: Powerful data synchronization for React applications

## Utility Libraries
- **clsx & tailwind-merge**: Dynamic className composition and optimization
- **date-fns**: Modern date utility library for time formatting
- **zod**: Runtime type validation for API responses and form data
- **nanoid**: Secure URL-friendly unique ID generator