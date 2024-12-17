describe('Login',{testIsolation:false},() =>{
    it('Visitar la página Swag Labs', () =>{
        cy.visit('https://www.saucedemo.com/');
    });

    it('Mostrar Login', () =>{
        cy.title().should('eq','Swag Labs');
        cy.get('#user-name[placeholder="Username"]').should('be.visible');
        cy.get('#password[placeholder="Password"]').should('be.visible');
        cy.get('#login-button').should('be.visible');
        cy.get('#login-button').should('be.enabled');

        cy.wait(2000)
    });

    it('Mostrar Credenciales', () =>{
        cy.get('#login_credentials h4').contains('Accepted usernames are:').should('be.visible');
        cy.get('#login_credentials').should('include.text','standard_user');
        cy.get('#login_credentials').should('contain.text', 'standard_user');
        cy.get('#login_credentials').should('contain.text', 'locked_out_user');
        cy.get('#login_credentials').should('contain.text', 'problem_user');
        cy.get('#login_credentials').should('contain.text', 'performance_glitch_user');
        cy.get('#login_credentials').should('contain.text', 'error_user');
        cy.get('#login_credentials').should('contain.text', 'visual_user');
        cy.get('.login_password h4').contains('Password for all users:').should('be.visible');
        cy.get('.login_password').should('contain.text', 'secret_sauce');

    });

    it('Validar campos obligatorios',()=>{
        cy.get('#password').type('secret_sauce')
        cy.get('#login-button').click();
        cy.get('h3').contains('Epic sadface: Username is required').should('be.visible')
        cy.get('#password').clear();
        cy.get('#user-name').type('standard_user')
        cy.get('#login-button').click();
        cy.get('h3').contains('Epic sadface: Password is required').should('be.visible')

   })

   it('Notificar credenciales incorrectas',()=>{
    cy.get('#user-name').clear();
    cy.get('#user-name').type('macarena_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click();
    cy.get('h3').contains('Epic sadface: Username and password do not match any user in this service').should('be.visible')

})

   /*it('Iniciar sesión con el usuario “standard_user”',()=>{
        cy.get('#user-name').clear();
        cy.get('#password').clear();
        cy.get('#user-name').type('standard_user')
        cy.get('#password').type('secret_sauce')
        cy.get('#login-button').click();

    })*/

        it('Iniciar sesión con el usuario “standard_user”', () => {
            const admin = 'standard_user';
            const password = 'secret_sauce';
            cy.login(admin, password);
        });

    it('Salir de sesión con el usuario “standard_user”',()=>{
        cy.get('#react-burger-menu-btn').click();
        cy.get('#logout_sidebar_link').click();

    })


});