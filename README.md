# Progress OS v2 - Personal AI/ML Progress Tracker

A minimal, keyboard-first progress tracking application designed for deep work, knowledge capture, and systematic learning. Built with Next.js, TypeScript, and a focus on offline-first functionality.

## Features

### 🎯 Core Progress Tracking

- **Tracker Management**: Create and manage multiple learning tracks
- **Task Organization**: Break down goals into actionable tasks with effort estimation
- **Progress Visualization**: Real-time progress bars and completion tracking
- **Milestone System**: Organize tasks into meaningful milestones

### 🧠 Knowledge Capture

- **Reflection System**: Capture insights when completing tasks
- **Note Taking**: Add code snippets, links, and reflections to tasks
- **Wiki Interface**: Searchable knowledge base of all captured notes
- **Tag System**: Organize notes by type (reflection, snippet, link)

### ⏰ Deep Work Mode

- **Pomodoro Timer**: 50-minute work sessions with 10-minute breaks
- **Task Binding**: Timer tied to specific tasks for focused work
- **Session Logging**: Track actual vs estimated time
- **Post-Session Reflection**: Capture what blocked you and what insights emerged

### 🧩 Spaced Repetition

- **Quiz System**: Built-in quiz items for knowledge retention
- **SM-2 Algorithm**: Scientifically-backed spaced repetition scheduling
- **Adaptive Intervals**: Questions resurface based on your performance
- **Progress Tracking**: Monitor retention rates and review schedules

### 🏔️ Mountain Visualization

- **Visual Progress Map**: See your journey as a mountain climb
- **Base Camps**: Milestones represented as base camps
- **Task Nodes**: Individual tasks light up as you complete them
- **Summit Achievement**: Special flag when you reach 100% completion

### ⌨️ Keyboard-First Design

- **Global Shortcuts**: Navigate without touching the mouse
- **Focus Management**: Proper keyboard navigation and focus indicators
- **Accessibility**: WCAG 2.1 compliant with high contrast design
- **Minimal Interface**: Black/white theme for distraction-free work

### 📊 Progress Intelligence

- **Velocity Tracking**: Monitor your completion rate over time
- **Forecast Estimates**: Predict when you'll complete your goals
- **Bottleneck Detection**: Identify what's slowing you down
- **Streak Tracking**: Maintain momentum with completion streaks

### 🔄 Data Management

- **Offline-First**: All data stored locally in IndexedDB
- **Import/Export**: Backup and restore your progress
- **Migration System**: Automatic upgrades between versions
- **Data Validation**: Ensures data integrity across sessions

## Preloaded Content

The app comes with a comprehensive **AI/ML Mastery Roadmap** designed for frontend developers transitioning to AI/ML engineering:

### Milestones

1. **Math Foundations** - Linear algebra, probability, statistics, optimization
2. **ML Core** - Supervised learning, regression, classification, evaluation
3. **Deep Learning** - Neural networks, CNNs, transformers
4. **Medical AI Specialization** - Medical imaging, segmentation, clinical NLP
5. **Projects** - Kaggle competitions, end-to-end pipelines, deployment

### Features

- 20+ pre-written tasks with execution instructions
- Mindset prompts for each learning area
- Reflection questions to deepen understanding
- 25+ quiz items for spaced repetition
- Real-world project suggestions

## Keyboard Shortcuts

| Shortcut | Action                  |
| -------- | ----------------------- |
| `n`      | Create new tracker      |
| `t`      | Create new task         |
| `f`      | Focus search            |
| `d`      | Start Deep Work timer   |
| `Space`  | Toggle task completion  |
| `Esc`    | Close modal/cancel      |
| `?`      | Show keyboard shortcuts |

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Storage**: IndexedDB via idb-keyval
- **Charts**: Recharts for data visualization
- **Search**: Fuse.js for full-text search
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd progress-os-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run tests
npm run test:coverage # Run tests with coverage

# Linting
npm run lint         # Check for linting errors
npm run lint:fix     # Fix linting errors
```

## Architecture

### Data Model

- **AppState**: Root state with trackers, snapshots, and quiz items
- **Tracker**: Container for related tasks and milestones
- **Task**: Individual work items with notes and metadata
- **Milestone**: Groupings of tasks with target dates
- **Note**: Knowledge capture with type classification
- **QuizItem**: Spaced repetition items with scheduling data

### Key Components

- **Dashboard**: Main overview with tracker cards and stats
- **TrackerPage**: Detailed view of tasks and progress
- **DeepWorkTimer**: Pomodoro timer with task binding
- **ReflectionModal**: Knowledge capture interface
- **MountainMap**: Visual progress representation
- **QuizCard**: Spaced repetition interface
- **WikiList**: Searchable knowledge base

### Utilities

- **Progress Calculation**: Weighted and count-based progress
- **Forecast Engine**: Velocity tracking and completion estimates
- **Spaced Repetition**: SM-2 algorithm implementation
- **Migration System**: Version upgrade handling
- **Keyboard Shortcuts**: Global shortcut management

## Design Principles

### Minimal & Focused

- Black/white color scheme for minimal distraction
- Clean typography with generous spacing
- Focus on content over decoration

### Keyboard-First

- All functionality accessible via keyboard
- Logical tab order and focus management
- Global shortcuts for common actions

### Offline-First

- No external dependencies or API calls
- All data stored locally
- Works without internet connection

### Progressive Enhancement

- Core functionality works without JavaScript
- Enhanced features for modern browsers
- Graceful degradation for older browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

### Phase 1: Core Features ✅

- [x] Theme transformation to black/white
- [x] Enhanced data model
- [x] Preloaded AI/ML roadmap
- [x] Keyboard navigation
- [x] Deep Work timer
- [x] Reflection system
- [x] Progress intelligence
- [x] Mountain visualization

### Phase 2: Advanced Features (Planned)

- [ ] Advanced analytics dashboard
- [ ] Custom roadmap templates
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Plugin system for extensions

### Phase 3: AI Integration (Future)

- [ ] LLM-powered task suggestions
- [ ] Automated progress insights
- [ ] Smart scheduling recommendations
- [ ] Natural language task creation

---

Built with ❤️ for focused learning and systematic progress tracking.
