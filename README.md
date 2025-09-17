# BPM Counter

A responsive web application for measuring beats per minute (BPM) by tapping to the rhythm.

## Features

- 🎵 Tap to measure BPM in real-time
- 📱 Mobile-responsive design with touch support
- 🖥️ Desktop support with spacebar input
- ⚡ Modern React with TypeScript
- 🐳 Docker containerization
- 🚀 GitHub Actions CI/CD pipeline

## Usage

### Mobile
- Tap the large circular button to the beat of your music

### Desktop
- Press the spacebar to the beat of your music
- Press ESC to reset

The app calculates BPM after at least 2 taps and shows the result in real-time.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Docker

```bash
# Build Docker image
docker build -t bpm-counter .

# Run container
docker run -p 3000:80 bpm-counter
```

## Deployment

The app includes a GitHub Actions workflow that:
1. Runs tests and linting on all pushes and PRs
2. Builds and pushes Docker images to Docker Hub on main branch pushes

## Tech Stack

- React 19 with TypeScript
- Vite for fast development and building
- Modern CSS with responsive design
- Docker with multi-stage builds
- GitHub Actions for CI/CD
- Nginx for production serving
