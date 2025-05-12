import 'cypress-iframe';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('BigBasket Wallet Payment Automation', () => {
  const cookiesFile = 'cypress/cookies/bigbasket-cookies.json';

  before(() => {
    cy.task('doesFileExist', cookiesFile).then((exists) => {
      if (exists) {
        cy.readFile(cookiesFile).then((cookies) => {
          cookies.forEach(cookie => {
            cy.setCookie(cookie.name, cookie.value, {
              domain: cookie.domain,
              expiry: cookie.expiry,
              httpOnly: cookie.httpOnly,
              path: cookie.path,
              secure: cookie.secure,
            });
          });
        });
      } else {
        cy.visit('/');
        cy.wait(1000);
        cy.contains('button', 'Login/ Sign Up').click();

        cy.contains('Enter Phone number/ Email Id').type('8918920670');
        cy.wait(1000);
        cy.get('button').contains('Continue').click();

        cy.log('Waiting for you to enter OTP and complete login...');
        cy.contains('Got it', { timeout: 60000 }).should('be.visible');

        cy.wait(5000);
        cy.getCookies().then((cookies) => {
          cy.writeFile(cookiesFile, cookies);
        });
      }
    });
  });

  it('should navigate to Wallet and initiate payment', () => {
    cy.visit('/');
    cy.wait(3000);
    cy.contains('button', 'Got it').click({ force: true });

  cy.scrollTo('top', { duration: 500 });


  cy.get('button.MemberDropdown___StyledMenuButton-sc-ce95dd-1', { timeout: 10000 }).should('be.visible').click({ force: true });

  cy.wait(1000); // short buffer to let menu animate

// Click on "My Wallet" link inside dropdown
  cy.get('a[href="/member/wallet/?nc=md"]', { timeout: 10000 }).scrollIntoView().should('be.visible').click({ force: true });

    cy.wait(2000);
    cy.get('input[name="walletrechargeinput"]').clear();
    cy.wait(500);
    cy.get('input[name="walletrechargeinput"]').type('10', { delay: 200 }); // slower typing

    cy.wait(1500);
    cy.contains('button', 'Add money', { timeout: 10000 }).should('be.visible').click();

    // Wait for redirection to payment page
    cy.url({ timeout: 15000 }).should('include', '/wallet/recharge');
    cy.wait(10000); // allow iframe to load

    // Click on the Credit / Debit Card option inside iframe
    cy.iframe('iframe[src*="juspay.in/payment-page/client/bigbasket_web"]')
      .contains('Credit / Debit Card', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true });

    // Wait for the new page inside iframe to settle
    cy.wait(800);

    // Fill Card Number
    cy.iframe('iframe[name="HyperServices"]')
      .find('input[testid="edt_card_number"]', { timeout: 10000 })
      .scrollIntoView()
      .should('exist')
      .click({ force: true })
      .type('5268730006219768', { delay: 100, force: true });

    //  Fill Expiry (MM/YY)
    cy.iframe('iframe[name="HyperServices"]')
      .find('input[testid="edt_expiry_date"]', { timeout: 10000 })
      .scrollIntoView()
      .should('exist')
      .click({ force: true })
      .type('1231', { delay: 100, force: true }); 

    // Fill CVV
    cy.iframe('iframe[name="HyperServices"]')
      .find('input[testid="edt_cvv"]', { timeout: 10000 })
      .scrollIntoView()
      .should('exist')
      .click({ force: true })
      .type('449', { delay: 100, force: true });


    //Click the Pay button inside Juspay iframe
    cy.iframe('iframe[name="HyperServices"]')
    .find('div[testid="btn_pay"][aria-disabled="false"]', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true });


  //  Wait for "Opt out for now" to appear and click it
    cy.iframe('iframe[name="HyperServices"]')
      .contains('Opt out for now', { timeout: 30000 })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });

    cy.wait(10000)

    cy.iframe('iframe[name="HyperServices"]')
    .find('input[testid="edt_otp_field"]', { timeout: 60000 })
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true });


  cy.wait(20000)

  cy.iframe('iframe[name="HyperServices"]')
    .contains('SUBMIT OTP & PAY 10.0', { timeout: 60000 })
    .should('be.visible')
    .should(($btn) => {
      expect($btn).not.to.have.attr('aria-disabled', 'true');
    })
    .click({ force: true });

  });
});
