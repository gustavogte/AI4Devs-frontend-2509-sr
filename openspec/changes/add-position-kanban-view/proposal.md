# Change: Add Position Kanban View

## Why
Recruiters need a visual, intuitive interface to manage candidates through the hiring process for each position. A Kanban-style board provides an efficient way to track candidate progress across interview stages and allows quick updates by dragging cards between columns.

## What Changes
- Add a new position detail page with Kanban board interface
- Display position title with back navigation to positions list
- Render interview stages as columns with candidate cards
- Implement drag-and-drop functionality to move candidates between stages
- Display candidate full name and average score on cards
- Ensure responsive design for mobile devices (vertical column layout)
- Integrate with existing API endpoints for fetching position data, candidates, and updating candidate stages

## Impact
- Affected specs: `position-management` (new capability)
- Affected code: 
  - New component: `frontend/src/components/PositionKanban.tsx`
  - New service methods: `frontend/src/services/positionService.js` (or TypeScript equivalent)
  - Route update: `frontend/src/App.js` or `App.tsx` to add `/positions/:id` route
  - Navigation update: `frontend/src/components/Positions.tsx` to link to detail view

