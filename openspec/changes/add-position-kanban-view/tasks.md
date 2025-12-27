## 1. Implementation

### 1.1 API Service Layer
- [ ] 1.1.1 Add `getPositionInterviewFlow(positionId)` method to position service
- [ ] 1.1.2 Add `getPositionCandidates(positionId)` method to position service
- [ ] 1.1.3 Add `updateCandidateStage(candidateId, applicationId, interviewStepId)` method to candidate service

### 1.2 Component Development
- [ ] 1.2.1 Create `PositionKanban.tsx` component with TypeScript
- [ ] 1.2.2 Implement position title header with back arrow navigation
- [ ] 1.2.3 Create Kanban column component for interview stages
- [ ] 1.2.4 Create candidate card component displaying name and score
- [ ] 1.2.5 Implement drag-and-drop functionality using react-beautiful-dnd or similar library
- [ ] 1.2.6 Add loading states for API calls
- [ ] 1.2.7 Add error handling and user feedback

### 1.3 Styling and Responsive Design
- [ ] 1.3.1 Style Kanban board with Bootstrap classes
- [ ] 1.3.2 Implement horizontal column layout for desktop
- [ ] 1.3.3 Implement vertical column layout for mobile (full width)
- [ ] 1.3.4 Style candidate cards with score visualization (green circles or similar)
- [ ] 1.3.5 Ensure proper spacing and visual hierarchy

### 1.4 Routing and Navigation
- [ ] 1.4.1 Add route `/positions/:id` in App.js/App.tsx
- [ ] 1.4.2 Update Positions component to navigate to detail view on "Ver proceso" click
- [ ] 1.4.3 Implement back navigation using React Router's useNavigate hook

### 1.5 Testing
- [ ] 1.5.1 Write unit tests for PositionKanban component
- [ ] 1.5.2 Test drag-and-drop functionality
- [ ] 1.5.3 Test API integration and error handling
- [ ] 1.5.4 Test responsive behavior on mobile viewport
- [ ] 1.5.5 Test navigation flows

