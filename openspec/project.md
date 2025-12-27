# Project Context

## Purpose
LTI (Learning Tracking Initiative) - Talent Tracking System / Sistema de Seguimiento de Talento

A full-stack application for managing the complete talent acquisition and recruitment lifecycle. The system enables:
- Candidate management (profiles, education, work experience, resumes)
- Job position posting and management
- Application tracking and workflow management
- Interview scheduling and evaluation
- Company and employee management
- Interview flow configuration with multiple steps and types

The system supports recruiters and HR teams in tracking candidates through the entire hiring process from initial application to final interview stages.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode enabled)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **File Upload**: Multer
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Testing**: Jest with ts-jest
- **Development**: ts-node-dev for hot reloading

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Create React App
- **Routing**: React Router DOM v6
- **UI Framework**: Bootstrap 5, React Bootstrap
- **Icons**: React Bootstrap Icons
- **Date Picker**: React Datepicker
- **Testing**: Jest, React Testing Library, @testing-library/user-event

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL (containerized)
- **CORS**: Configured for localhost:3000

### Development Tools
- **Linting**: ESLint with Prettier
- **Type Checking**: TypeScript strict mode

## Project Conventions

### Code Style
- **Language**: TypeScript with strict mode enabled
- **Naming**: 
  - PascalCase for classes and interfaces
  - camelCase for variables, functions, and methods
  - Descriptive names that reflect domain concepts
- **Formatting**: Prettier configured with ESLint integration
- **File Organization**: 
  - Domain models in `domain/models/`
  - Application services in `application/services/`
  - Controllers in `presentation/controllers/`
  - Routes in `routes/`
- **Imports**: Organized by layer (domain → application → presentation)
- **Error Handling**: Try-catch blocks with proper error messages and status codes

### Architecture Patterns

The project follows **Domain-Driven Design (DDD)** principles with a layered architecture:

1. **Domain Layer** (`domain/models/`):
   - Contains business entities and value objects
   - Models represent core domain concepts: Candidate, Position, Application, Interview, etc.
   - Entities have identity (id) and encapsulate business logic
   - Models include methods for validation and persistence

2. **Application Layer** (`application/services/`):
   - Contains application services that orchestrate domain operations
   - Handles business logic that spans multiple entities
   - Validates input data before domain operations
   - Examples: `candidateService`, `positionService`, `fileUploadService`

3. **Presentation Layer** (`presentation/controllers/`):
   - HTTP request/response handling
   - Input validation and error handling
   - Delegates business logic to application services
   - Returns appropriate HTTP status codes and JSON responses

4. **Routes Layer** (`routes/`):
   - Defines API endpoints
   - Connects HTTP methods to controller functions
   - Examples: `candidateRoutes`, `positionRoutes`

**Design Principles**:
- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY (Don't Repeat Yourself)**: Centralized validation and common logic
- **Separation of Concerns**: Clear boundaries between layers
- **Dependency Injection**: Prisma client injected via Express middleware

**Current Architecture Notes**:
- Models directly use PrismaClient (consider abstracting to repositories for better DIP compliance)
- Services instantiate domain models directly (consider using factories)
- Some validation logic could be further centralized

### Testing Strategy

**Backend Testing**:
- **Framework**: Jest with ts-jest preset
- **Test Environment**: Node.js
- **Test Files**: Located alongside source files with `.test.ts` extension
- **Coverage**: Tests for services and controllers
- **Test Structure**: 
  - Unit tests for services
  - Integration tests for controllers
  - Mock Prisma client for database operations

**Frontend Testing**:
- **Framework**: Jest with React Testing Library
- **Test Files**: Located alongside components
- **Approach**: Component testing with user interaction simulation
- **Coverage**: Component rendering, user interactions, form submissions

**Testing Best Practices**:
- Test business logic in services
- Test HTTP handling in controllers
- Mock external dependencies (database, file system)
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Git Workflow
[To be defined by the team - consider adding branch naming conventions, commit message format, PR requirements]

## Domain Context

### Core Entities

**Candidate**: Represents a job candidate with personal information, education history, work experience, and resumes. Candidates can apply for multiple positions.

**Position**: Represents a job opening posted by a company. Includes job description, requirements, salary range, location, and is associated with an interview flow.

**Application**: Represents a candidate's application to a position. Tracks the current stage in the interview process and application date.

**Interview**: Represents a scheduled interview between a candidate and an employee. Linked to an application and interview step, includes date, result, score, and notes.

**InterviewFlow**: Defines a sequence of interview steps that positions follow. Each flow contains multiple ordered interview steps.

**InterviewStep**: A single step in an interview flow, associated with an interview type. Steps have an order index and can be associated with multiple applications.

**InterviewType**: Categories of interviews (e.g., Technical, HR, Final).

**Company**: Organizations that post positions and employ staff.

**Employee**: Staff members of companies who conduct interviews.

**Education**: Educational background records for candidates (institution, title, dates).

**WorkExperience**: Professional experience records for candidates (company, position, dates, description).

**Resume**: Uploaded CV/resume files associated with candidates.

### Business Rules
- Candidates must have unique email addresses
- Maximum of 3 education records per candidate
- Applications track progress through interview steps
- Positions are associated with interview flows that define the hiring process
- File uploads (resumes) are limited to PDF and DOCX, max 10MB
- Phone numbers follow Spanish format: (6|7|9)XXXXXXXX

### Domain Relationships
- Candidate → Education (one-to-many)
- Candidate → WorkExperience (one-to-many)
- Candidate → Resume (one-to-many)
- Candidate → Application (one-to-many)
- Position → Application (one-to-many)
- Position → Company (many-to-one)
- Position → InterviewFlow (many-to-one)
- InterviewFlow → InterviewStep (one-to-many)
- InterviewStep → InterviewType (many-to-one)
- Application → InterviewStep (many-to-one, tracks current step)
- Interview → Application (many-to-one)
- Interview → InterviewStep (many-to-one)
- Interview → Employee (many-to-one)
- Company → Employee (one-to-many)
- Company → Position (one-to-many)

## Important Constraints

### Technical Constraints
- **Database**: PostgreSQL required (via Docker Compose)
- **Ports**: 
  - Backend: 3010
  - Frontend: 3000
  - Database: 5432
- **File Upload**: Max 10MB, PDF and DOCX only
- **CORS**: Configured for localhost:3000 only
- **TypeScript**: Strict mode enabled, ES5 target
- **Node.js**: Requires compatible version for Prisma and TypeScript

### Business Constraints
- Email addresses must be unique per candidate
- Maximum 3 education records per candidate
- Phone numbers must follow Spanish format if provided
- Interview steps must be completed in order (defined by orderIndex)
- Positions can be in Draft or Published status
- Applications track current interview step progress

### Data Constraints
- String length limits enforced at database level (VarChar constraints)
- Dates must be valid DateTime format
- Required fields: firstName, lastName, email for candidates
- Optional fields: phone, address, description fields

## External Dependencies

### Database
- **PostgreSQL**: Primary database, containerized via Docker Compose
- **Connection**: Configured via DATABASE_URL environment variable
- **ORM**: Prisma Client for type-safe database access

### File Storage
- **Local File System**: Resume files stored in `uploads/` directory
- **File Upload Service**: Multer middleware handles multipart/form-data

### API Documentation
- **Swagger**: API documentation available via swagger-ui-express
- **Specification**: OpenAPI/Swagger format (see `backend/api-spec.yaml`)

### Development Dependencies
- **Docker**: Required for local database setup
- **Node.js**: Runtime environment
- **npm**: Package manager

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `DB_PASSWORD`: Database password (Docker)
- `DB_USER`: Database user (Docker)
- `DB_NAME`: Database name (Docker)
- `DB_PORT`: Database port (Docker)
