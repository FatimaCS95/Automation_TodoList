// cypress/support/commands.js

/**
 * A custom command to efficiently log in to the application.
 * Uses cy.session() to cache and restore the session,
 * avoiding the need to re-login before every test.
 * @example cy.login('username', 'password')
 */


Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/login');
    // NOTE: You must add these data-cy attributes to your Login.jsx component
    cy.get('[data-cy="login-username-input"]').type(username);
    cy.get('[data-cy="login-password-input"]').type(password);
    cy.get('[data-cy="login-submit-button"]').click();
    
    // Assert that the login was successful and we are on the main page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('h2').should('contain', 'Add a Task');
  });
});

/**
 * A custom command for selecting an option from a Material-UI dropdown.
 * @example cy.selectMuiDropdown('task-category-label', 'Personal')
 */
Cypress.Commands.add('selectMuiDropdown', (labelId, optionText) => {
  cy.get(`[aria-labelledby="${labelId}"]`).click();
  cy.get('ul[role="listbox"]').should('be.visible').contains(optionText).click();
});

/**
 * A custom command to create a new task.
 * This makes setting up test data for edit/delete tests clean and repeatable.
 * @example cy.createTask('My new task', 'Personal')
 */
Cypress.Commands.add('createTask', (description, category) => {
  // NOTE: You must add these data-cy attributes to your TaskForm.jsx component
  cy.get('[data-cy="task-description-input"]').type(description);
  cy.selectMuiDropdown('task-category-label', category);
  cy.get('[data-cy="task-submit-button"]').click();

  // Assert that the task now exists in the table
  cy.get('[data-cy="tasks-table-body"]').should('contain', description);
});

