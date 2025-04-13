
describe('API Keys Management', () => {
  beforeEach(() => {
    // Login as admin first
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('adminpassword');
    cy.get('button[type="submit"]').click();
    
    // Navigate to the API Keys page
    cy.visit('/admin/api-keys');
  });

  it('should display the API Keys Management page', () => {
    cy.contains('h1', 'API Keys Management').should('be.visible');
    cy.contains('button', 'Add New API Key').should('be.visible');
  });

  it('should open Google Drive integration drawer when View button is clicked', () => {
    // Find the Google Drive row and click the View button
    cy.contains('tr', 'Google Drive')
      .contains('button', 'View')
      .click();
    
    // Verify the drawer is open
    cy.contains('Google Drive Integration').should('be.visible');
    cy.contains('button', 'Test Connection').should('be.visible');
  });

  it('should open Google Drive integration modal when Edit button is clicked', () => {
    // Find the Google Drive row and click the Edit button
    cy.contains('tr', 'Google Drive')
      .contains('button', 'Edit')
      .click();
    
    // Verify the modal is open
    cy.contains('Edit Google Drive Integration').should('be.visible');
    cy.contains('button', 'Revoke Integration').should('be.visible');
  });

  it('should upload a dummy SA key and update status pill', () => {
    // Create a dummy service account JSON
    const dummyServiceAccount = {
      type: 'service_account',
      project_id: 'test-project',
      private_key_id: 'abc123',
      private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us/Ow8\n-----END PRIVATE KEY-----\n',
      client_email: 'test-service-account@test-project.iam.gserviceaccount.com',
      client_id: '123456789',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/test-service-account%40test-project.iam.gserviceaccount.com',
      scopes: ['https://www.googleapis.com/auth/drive']
    };
    
    // Find the Google Drive row and click the Edit button
    cy.contains('tr', 'Google Drive')
      .contains('button', 'Edit')
      .click();
    
    // Upload the dummy file
    cy.get('div[role="dialog"]').within(() => {
      cy.get('div').contains('Drag and drop').attachFile({
        fileContent: JSON.stringify(dummyServiceAccount),
        fileName: 'service-account.json',
        mimeType: 'application/json'
      });
      
      cy.contains('button', 'Upload').click();
    });
    
    // Verify the status pill is updated to Active
    cy.contains('tr', 'Google Drive')
      .contains('.bg-green-50', 'Active')
      .should('be.visible');
  });

  it('should test the connection and show a success toast', () => {
    // Open the drawer
    cy.contains('tr', 'Google Drive')
      .contains('button', 'View')
      .click();
    
    // Click the Test Connection button
    cy.contains('button', 'Test Connection').click();
    
    // Verify the success toast appears
    cy.contains('Connection successful').should('be.visible');
  });

  it('should revoke the integration and update status pill', () => {
    // Find the Google Drive row and click the Edit button
    cy.contains('tr', 'Google Drive')
      .contains('button', 'Edit')
      .click();
    
    // Click the Revoke Integration button
    cy.contains('button', 'Revoke Integration').click();
    
    // Confirm the revocation
    cy.contains('button', 'Yes, revoke integration').click();
    
    // Verify the status pill is updated to Missing key
    cy.contains('tr', 'Google Drive')
      .contains('.bg-red-50', 'Missing key')
      .should('be.visible');
  });
});
