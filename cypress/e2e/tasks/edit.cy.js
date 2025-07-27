describe('Task Editing', () => {
  const testUsername = `task_editor_${Date.now()}`;
  const testPassword = 'password123';
  const originalDescription = 'Submit initial draft';
  const editedDescription = 'Submit FINAL draft and send email';
  const dueDate = '11/20/2025';

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

  it('should edit an existing task', () => {
    cy.get('[data-cy="task-description-input"]').type(originalDescription);
    cy.get('[aria-labelledby="task-category-label"]').click();
    cy.get('ul[role="listbox"]').contains('Personal').click();
    cy.get('[data-cy="task-due-date-input"]').type(dueDate);
    cy.get('[data-cy="task-submit-button"]').click();
    cy.get('table').should('contain', originalDescription);

    const testId = originalDescription.replace(/\s+/g, '-').toLowerCase();
    cy.get(`[data-cy="edit-button-${testId}"]`).click();
    cy.get('[data-cy="edit-task-input"]').clear().type(editedDescription);
    cy.get('[data-cy="save-edit-button"]').click();

    cy.get('table').should('contain', editedDescription);
    cy.get('table').should('not.contain', originalDescription);
    cy.get('table').should('contain', dueDate);
  });
});