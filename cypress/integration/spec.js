describe('Sapper template app', () => {
	beforeEach(() => {
		cy.server()
		cy.visit('/')
	});

	it('has the correct <h1>', () => {
		cy.contains('h1', 'Senior Systems Engineer')
	});

	it('navigates to /til', () => {
		// cy.route('til/*', 'fixture:getTIL').as('getTIL')
		cy.get('nav a.nav-item[href="/til/"]').click()
		// cy.get('nav a.nav-item').and('have.attr', 'href')
		//   .and('eq', '/til')
		// 	.contains('Today I').click();
		// cy.wait(2000);
		// cy.wait('@getTIL');
		cy.url().should('include', 'til');
		// cy.get('a.list-group-item').contains('First').click();
	});

	it('navigates to /projects', () => {
	  cy.get('nav a').contains('Projects').click();
	  cy.url().should('include', '/projects');
	});

	it('navigates to /curated', () => {
		cy.get('nav a.nav-item[href="/curated/"]').click()
		cy.url().should('include', '/curated');
		cy.get('a.list-group-item[href="/curated/awesome"]').click()
		cy.url().should('include', '/curated/awesome');
		cy.get('a.list-group-item').its('length').should('be.gt', 0)
	  });
});