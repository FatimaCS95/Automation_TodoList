describe('Task Deletion', () => {
  const testUsername = `task_deleter_${Date.now()}`;
  const testPassword = 'password123';
  const taskToDelete = 'Cancel unused subscription';
  const dueDate = '12/01/2025';

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

  it('should delete an existing task', () => {
    cy.get('[data-cy="task-description-input"]').type(taskToDelete);
    cy.get('[aria-labelledby="task-category-label"]').click();
    cy.get('ul[role="listbox"]').contains('Chores').click();
    cy.get('[data-cy="task-due-date-input"]').type(dueDate);
    cy.get('[data-cy="task-submit-button"]').click();
    cy.get('table').should('contain', taskToDelete);

    const testId = taskToDelete.replace(/\s+/g, '-').toLowerCase();
    cy.get(`[data-cy="delete-button-${testId}"]`).click();
    cy.get('table').should('not.contain', taskToDelete);
  });
});