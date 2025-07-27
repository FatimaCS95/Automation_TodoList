// cypress/e2e/tasks/create.cy.js

describe('Task Creation', () => {
  
  const testUsername = `task_creator_${Date.now()}`;
  const testPassword = 'password123';
  const category = 'Work'; // This category will now exist in the DB
  const dueDate = '10/15/2025';

  before(() => {
    cy.request('POST', '/api/user/register', { username: testUsername, password: testPassword });
  });

  beforeEach(() => {
    cy.request('POST', '/api/user/login', { username: testUsername, password: testPassword })
      .then((response) => {
        window.localStorage.setItem('token', response.body.token);
      });
    cy.visit('/');
  });

  it('should create a new task with a due date', () => {
    const taskDescription = 'Finish project proposal';
    cy.get('[data-cy="task-description-input"]').type(taskDescription);
    cy.get('[aria-labelledby="task-category-label"]').click();
    
    // This will now find and click 'Work' successfully
    cy.get('ul[role="listbox"]').contains(category).click();
    
    cy.get('[data-cy="task-due-date-input"]').type(dueDate);
    cy.get('[data-cy="task-submit-button"]').click();

    cy.get('table')
      .should('be.visible')
      .and('contain', taskDescription)
      .and('contain', category)
      .and('contain', dueDate);
  });
});