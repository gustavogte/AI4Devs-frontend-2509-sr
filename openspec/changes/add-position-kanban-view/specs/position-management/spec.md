## ADDED Requirements

### Requirement: Position Detail Kanban View
The system SHALL provide a Kanban-style interface for viewing and managing candidates in the hiring process for a specific position.

#### Scenario: Display position Kanban board
- **WHEN** a user navigates to a position detail page
- **THEN** the position title is displayed at the top of the page
- **AND** a back arrow is shown to the left of the title to return to the positions list
- **AND** columns are displayed representing each interview stage from the position's interview flow
- **AND** candidate cards are displayed in the column corresponding to their current interview step
- **AND** each candidate card displays the candidate's full name and average score

#### Scenario: Navigate to position detail
- **WHEN** a user clicks the "Ver proceso" button on a position card in the positions list
- **THEN** the user is navigated to the position detail Kanban view
- **AND** the URL reflects the position ID (e.g., `/positions/1`)

#### Scenario: Drag candidate to new stage
- **WHEN** a user drags a candidate card from one column to another
- **THEN** the candidate card is visually moved to the new column
- **AND** the candidate's stage is updated via API call to PUT /candidates/:id/stage
- **AND** the new interview step ID is sent in the request body
- **AND** the UI reflects the updated stage after successful API response
- **AND** an error message is displayed if the API call fails

#### Scenario: Load position interview flow
- **WHEN** the position detail page loads
- **THEN** the system fetches interview flow data from GET /positions/:id/interviewFlow
- **AND** columns are created for each interview step in the order specified by orderIndex
- **AND** the position name from the response is displayed as the page title

#### Scenario: Load position candidates
- **WHEN** the position detail page loads
- **THEN** the system fetches candidate data from GET /positions/:id/candidates
- **AND** each candidate card is placed in the column matching their currentInterviewStep
- **AND** candidates with no current step are handled appropriately (e.g., placed in first column or shown separately)

#### Scenario: Mobile responsive layout
- **WHEN** the page is viewed on a mobile device (viewport width < 768px)
- **THEN** the Kanban columns are displayed vertically
- **AND** each column occupies the full width of the viewport
- **AND** candidate cards remain draggable between columns

#### Scenario: Display candidate score
- **WHEN** a candidate card is rendered
- **THEN** the candidate's average score is displayed on the card
- **AND** the score is displayed as a visual indicator (e.g., green circles, numeric value, or both)
- **AND** candidates with a score of 0 or no score are handled appropriately

#### Scenario: Handle loading states
- **WHEN** interview flow or candidate data is being fetched
- **THEN** a loading indicator is displayed
- **AND** the Kanban board is not rendered until data is available

#### Scenario: Handle API errors
- **WHEN** an API call fails (network error, 404, 500, etc.)
- **THEN** an error message is displayed to the user
- **AND** the user can retry the operation or navigate away
- **AND** the error does not crash the application

