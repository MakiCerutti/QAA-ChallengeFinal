describe('Login',{testIsolation:false},() =>{
    it('Visitar la página Swag Labs', () =>{
        cy.visit('https://www.saucedemo.com/');
    });

   it('Iniciar sesión con el usuario “standard_user”',()=>{
        cy.get('#user-name').clear();
        cy.get('#password').clear();
        cy.get('#user-name').type('standard_user')
        cy.get('#password').type('secret_sauce')
        cy.get('#login-button').click();

    })

    it('Validar que hay productos disponibles para comprar',()=>{
        cy.get('#inventory_container').should('exist');
        cy.get('.inventory_list').should('exist').and('not.be.empty'); 
        cy.get('.inventory_item').should('have.length.greaterThan', 0); 
        cy.get('.inventory_item')
          .each(($product) => {
            cy.wrap($product).find('button').should('contain', 'Add to cart');
          });
      });

      it('Mostrar una imagen única a irrepetible para cada producto', () => {
    
        cy.get('.inventory_item_img img').should('have.length.greaterThan', 0) .then(($images) => {
            
            const imageSrcs = [];
    
            $images.each((index, img) => {
              const src = img.getAttribute('src');
              imageSrcs.push(src);
            });
    
            const uniqueSrcs = [...new Set(imageSrcs)];
            expect(uniqueSrcs.length).to.equal(imageSrcs.length);
          });
      });


    it('Comprar una mochila, remera y buzo. Y validar que se incremente el contador del carrito',()=>{
        cy.get('#item_4_title_link').contains('Sauce Labs Backpack').should('be.visible').click();
        cy.get('#add-to-cart').contains('Add to cart').should('be.visible').click();
        cy.get('.shopping_cart_badge').should('contain', '1')
        cy.get('#remove').contains('Remove').should('be.visible')
        cy.get('#back-to-products').click();
        cy.get('#item_3_title_link').contains('Test.allTheThings() T-Shirt (Red)').should('be.visible').click();
        cy.get('#add-to-cart').contains('Add to cart').should('be.visible').click();
        cy.get('.shopping_cart_badge').should('contain', '2')
        cy.get('#remove').contains('Remove').should('be.visible')
        cy.get('#back-to-products').click();
        cy.get('#add-to-cart-sauce-labs-bolt-t-shirt').contains('Add to cart').should('be.visible').click();
        cy.get('.shopping_cart_badge').should('contain', '3')
        cy.get('#remove-sauce-labs-bolt-t-shirt').contains('Remove').should('be.visible')
    })


    it('Hacer el checkout',()=>{
        cy.get('.shopping_cart_link').should('be.visible').click();
        cy.get('#checkout').contains('Checkout').should('be.visible').click();
    })


    it('Mostrar la pantalla "Checkout: Your Information"',()=>{
        cy.get('span').contains('Checkout: Your Information')
        cy.get('#first-name[placeholder="First Name"]').should('be.visible');
        cy.get('#last-name[placeholder="Last Name"]').should('be.visible');
        cy.get('#postal-code[placeholder="Zip/Postal Code"]').should('be.visible');
        cy.get('#continue').should('be.visible');
        cy.get('#continue').should('be.enabled');
        cy.get('#cancel').should('be.visible');
        cy.get('#cancel').should('be.enabled');
    })

    it('Validar campos obligatorios de la información para el Checkout',()=>{
        cy.get('#last-name').type('Perez')
        cy.get('#postal-code').type('4700')
        cy.get('#continue').click();
        cy.get('h3').contains('Error: First Name is required').should('be.visible')
        cy.get('.error-button').should('be.visible').click()
        cy.get('#first-name').type('Juan')
        cy.get('#last-name').clear();
        cy.get('#continue').click();
        cy.get('h3').contains('Error: Last Name is required').should('be.visible')
        cy.get('.error-button').should('be.visible').click()
        cy.get('#postal-code').clear();
        cy.get('#last-name').type('Perez')
        cy.get('#continue').click();
        cy.get('h3').contains('Error: Postal Code is required').should('be.visible')
    })

    it('Cancelar el envío de la información para el Checkout y validar que retorna a la página "Tu carrito"',()=>{
        cy.get('#first-name').clear();
        cy.get('#last-name').clear();
        cy.get('#postal-code').clear();
        cy.get('#first-name').type('Juan')
        cy.get('#last-name').type('Perez')
        cy.get('#postal-code').type('4700')
        cy.get('#cancel').click()
        cy.url().should('eq', 'https://www.saucedemo.com/cart.html');
        cy.get('span').contains('Your Cart').should('be.visible');
    })

    it('Retornar a la página "Checkout: Overview"',()=>{
        cy.get('#checkout').click();
        cy.get('#first-name').type('Juan')
        cy.get('#last-name').type('Perez')
        cy.get('#postal-code').type('4700')
        cy.get('#continue').click();
        cy.get('span').contains('Checkout: Overview').should('be.visible');
    })

    it('Validar que se visualiza la pantalla de "Checkout: Overview"',()=>{
        cy.get('span').contains('Checkout: Overview').should('be.visible');
        
        cy.get('[data-test="inventory-item"]').should('have.length', 3); 

        cy.get('[data-test="item-4-title-link"]').should('be.visible');
        cy.get('[data-test="inventory-item-name"]').contains('Sauce Labs Backpack').should('be.visible');
        cy.get('[data-test="inventory-item-desc"]').contains('carry.allTheThings()').should('be.visible');
        cy.get('[data-test="inventory-item-price"]').contains('$29.99').should('be.visible');
        cy.get('[data-test="item-3-title-link"]').should('be.visible');
        cy.get('[data-test="inventory-item-name"]').contains('Test.allTheThings() T-Shirt (Red)').should('be.visible');
        cy.get('[data-test="inventory-item-desc"]').contains('This classic Sauce Labs t-shirt').should('be.visible');
        cy.get('[data-test="inventory-item-price"]').contains('$15.99').should('be.visible');
        cy.get('[data-test="item-1-title-link"]').should('be.visible');
        cy.get('[data-test="inventory-item-name"]').contains('Sauce Labs Bolt T-Shirt').should('be.visible');
        cy.get('[data-test="inventory-item-desc"]').contains('Get your testing superhero on').should('be.visible');
        cy.get('[data-test="inventory-item-price"]').contains('$15.99').should('be.visible');

        cy.get('[data-test="payment-info-label"]').contains('Payment Information:').should('be.visible');
        cy.get('[data-test="payment-info-value"]').should('not.be.empty').and('be.visible')
        cy.get('[data-test="shipping-info-label"]').contains('Shipping Information:').should('be.visible');
        cy.get('[data-test="shipping-info-value"]').should('not.be.empty').and('be.visible')
        cy.get('[data-test="total-info-label"]').contains('Price Total').should('be.visible')
        cy.get('.summary_subtotal_label').should('be.visible')
        cy.get('[data-test="tax-label"]').should('be.visible')
        cy.get('[data-test="total-label"]').should('be.visible')
        cy.get('#cancel').contains('Cancel').should('be.visible').should('be.enabled')
        cy.get('#finish').contains('Finish').should('be.visible').should('be.enabled')
    
    })

    it('Validar que el item total esté calculado correctamente:',()=>{
        let totalCalculated = 0;

    cy.get('[data-test="inventory-item-price"]')
      .each(($el) => {
    
        const priceText = $el.text().replace('$', '').trim();
        const price = parseFloat(priceText);

        
        totalCalculated += price;
      })
      .then(() => {
        
        const roundedTotalCalculated = Math.round(totalCalculated * 100) / 100;

        
        cy.get('[data-test="subtotal-label"]')
          .invoke('text')
          .then((subtotalText) => {
           
            const subtotal = parseFloat(subtotalText.replace('Item total: $', '').trim());

            
            const roundedSubtotal = Math.round(subtotal * 100) / 100;

            
            expect(roundedSubtotal).to.eq(roundedTotalCalculated);
          });
      });
    
        })

    it('Validar que el total a pagar esté calculado correctamente:',()=>{
    cy.get('[data-test="subtotal-label"]')
    .invoke('text')
    .then((subtotalText) => {
    
      const subtotal = parseFloat(subtotalText.replace('Item total: $', '').trim());

      cy.get('[data-test="tax-label"]')
        .invoke('text')
        .then((taxText) => {
          
          const tax = parseFloat(taxText.replace('Tax: $', '').trim());

          cy.get('[data-test="total-label"]')
            .invoke('text')
            .then((totalText) => {
              
              const total = parseFloat(totalText.replace('Total: $', '').trim());

              
              const expectedTotal = subtotal + tax;

              const roundedExpectedTotal = Math.round(expectedTotal * 100) / 100;
                const roundedTotal = Math.round(total * 100) / 100;

                
                expect(roundedTotal).to.eq(roundedExpectedTotal);
            });
        });
    });

    })

    it('Finalizar la compra y validar que se visualiza un mensaje',()=>{
        cy.get('#finish').click();
        cy.get('span').contains('Checkout: Complete!').should('be.visible')
        cy.get('.pony_express').should('be.visible')
        cy.get('h2').contains('Thank you for your order!').should('be.visible')
        cy.get('.complete-text').contains('Your order has been dispatched, and will arrive just as fast as the pony can get there!').should('be.visible')
        cy.get('#back-to-products').contains('Back Home').should('be.enabled');
    
    })

    it('Retornar al home al finalizar la compra',()=>{
        cy.get('#back-to-products').click()
        cy.get('.title').contains('Products').should('be.visible')
    
    })

    it('Validar que se visualiza deshabilitado el botón "Checkout" al no tener productos en el carrito',()=>{
       cy.get('.shopping_cart_container').click()
       cy.get('.cart_item').should('have.length', 0);
       cy.get('checkout').should('be.disabled');
    
    }) 

    it('Salir de sesión',()=>{
        cy.get('#react-burger-menu-btn').click()
        cy.get('#logout_sidebar_link').contains('Logout').should('be.visible').click();
        cy.get('#login-button').should('be.visible');
     
     }) 

});