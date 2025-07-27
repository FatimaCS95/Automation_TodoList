describe('Login Functionality', () => {
  const testUsername = `testuser_${Date.now()}`;
  const testPassword = 'password123';

  before(() => {
    cy.request('POST', '/api/user/register', { username: testUsername, password: testPassword });
  });

  it('should fail with invalid credentials', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-username-input"]').type(testUsername);
    cy.get('[data-cy="login-password-input"]').type('wrongpassword');
    cy.get('[data-cy="login-submit-button"]').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Login failed. Please check your credentials.');
    });
  });

  it('should succeed with valid credentials', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-username-input"]').type(testUsername);
    cy.get('[data-cy="login-password-input"]').type(testPassword);
    cy.get('[data-cy="login-submit-button"]').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('h2').should('contain', 'Add a Task');
  });
});
