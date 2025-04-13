
describe('Google Drive Integration', () => {
  beforeEach(() => {
    // Login as admin first
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('adminpassword');
    cy.get('button[type="submit"]').click();
    
    // Navigate to the API Keys page
    cy.visit('/admin/api-keys');
  });

  it('should upload a service account key and display it as active', () => {
    // Create a dummy service account JSON
    const dummyServiceAccount = {
      type: 'service_account',
      project_id: 'test-project',
      private_key_id: 'abc123',
      private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us/Ow8\n-----END PRIVATE KEY-----\n',
      client_email: 'service-account@test-project.iam.gserviceaccount.com',
      client_id: '123456789',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/service-account%40test-project.iam.gserviceaccount.com',
      scopes: ['https://www.googleapis.com/auth/drive']
    };
    
    // Open the Google Drive edit modal
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
    
    // Verify upload success toast
    cy.contains('Integration successful').should('be.visible');
    
    // Verify the status pill is updated to Active
    cy.contains('tr', 'Google Drive')
      .contains('.bg-green-50', 'Active')
      .should('be.visible');
  });

  it('should display service account information in the drawer', () => {
    // Open the Google Drive view drawer
    cy.contains('tr', 'Google Drive')
      .contains('button', 'View')
      .click();
    
    // Verify service account email is displayed
    cy.contains('Service Account').should('be.visible');
    cy.contains('service-account@test-project.iam.gserviceaccount.com').should('be.visible');
  });

  it('should fix missing permissions when Fix button is clicked', () => {
    // Open the Google Drive view drawer
    cy.contains('tr', 'Google Drive')
      .contains('button', 'View')
      .click();
    
    // If permission is missing, click Fix
    cy.get('body').then($body => {
      if ($body.find('button:contains("Fix")').length > 0) {
        cy.contains('button', 'Fix').click();
        cy.contains('Permission fixed').should('be.visible');
        cy.contains('✓ Manager').should('be.visible');
      }
    });
  });

  it('should test the connection and show success', () => {
    // Open the Google Drive view drawer
    cy.contains('tr', 'Google Drive')
      .contains('button', 'View')
      .click();
    
    // Click Test Connection
    cy.contains('button', 'Test Connection').click();
    
    // Verify success toast
    cy.contains('Connection successful').should('be.visible');
  });

  it('should revoke integration when revoke button is clicked', () => {
    // Open the Google Drive edit modal
    cy.contains('tr', 'Google Drive')
      .contains('button', 'Edit')
      .click();
    
    // Click Revoke Integration
    cy.contains('button', 'Revoke Integration').click();
    
    // Confirm revocation
    cy.contains('button', 'Yes, revoke integration').click();
    
    // Verify revoke success toast
    cy.contains('Integration revoked').should('be.visible');
    
    // Verify the status pill is updated to Missing key
    cy.contains('tr', 'Google Drive')
      .contains('.bg-red-50', 'Missing key')
      .should('be.visible');
  });
});
