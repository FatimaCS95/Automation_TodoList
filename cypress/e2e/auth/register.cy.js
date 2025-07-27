describe('User Registration', () => {
  const testUsername = `testuser_${Date.now()}`;
  const testPassword = 'password123';

  it('should allow a new user to register successfully', () => {
    cy.visit('/register');
    cy.get('[data-cy="register-username-input"]').type(testUsername);
    cy.get('[data-cy="register-password-input"]').type(testPassword);
    cy.get('[data-cy="register-submit-button"]').click();

    cy.url().should('include', '/login');
    cy.get('h2').should('contain', 'Login');
  });
});