describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Nicolas', 
      username: 'nicolas', 
      password: "nicolas123"
    }
    const user2 = {
      name: 'Administrator', 
      username: 'admin', 
      password: 'admin123'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('log in form is shown by default', function() {
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('nicolas')
      cy.get('#password').type('nicolas123')
      cy.get('#login-button').click()

      cy.contains('Nicolas logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('nicolas') 
      cy.get('#password').type('nicolas122')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'nicolas', password: 'nicolas123' })
    })
    
    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog test')
      cy.get('#author').type('cypress')
      cy.get('#url').type('cypress.com')
      cy.contains('create').click()
      cy.contains('a blog test by cypress')
    })
    
    describe('and several blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'a blog test 1', 
          author: 'cypress', 
          url: 'ablogtest1'
        })
        cy.createBlog({
          title: 'a blog test 2', 
          author: 'cypress', 
          url: 'ablogtest2'
        })
        cy.createBlog({
          title: 'a blog test 3', 
          author: 'cypress', 
          url: 'ablogtest3'
        })
      })

      it('users can like a blog', function() {
        cy.contains('a blog test 1')
          .contains('show')
          .click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('a user that created a blog can delete id', function() {
        cy.contains('a blog test 3')
          .contains('Remove')
          .click()
        cy.get('html').should('not.contain', 'a blog test 3')
      })

      it('shows blogs ordered by likes', function() {
        cy.contains('a blog test 1')
          .contains('show')
          .click()
        cy.contains('like').click()
        cy.contains('hide').click()
        cy.wait(500)
        cy.contains('a blog test 2')
          .contains('show')
          .click()
        cy.contains('like').click()
        cy.wait(500)
        cy.contains('like').click()
        cy.wait(500)
        cy.contains('like').click()
        cy.wait(500)
        cy.contains('hide').click()
        cy.wait(500)
        cy.contains('a blog test 3')
          .contains('show')
          .click()
        cy.contains('like').click()
        cy.wait(500)
        cy.contains('like').click() 
        cy.wait(500)
        cy.contains('like').click()
        cy.wait(500)
        cy.contains('like').click()
        cy.wait(500)
        cy.contains('like').click()
        cy.wait(500)
        cy.contains('hide').click()
        cy.wait(500)

        cy.get('.blog').eq(0).should('contain', 'a blog test 3')
        cy.get('.blog').eq(1).should('contain', 'a blog test 2')
        cy.get('.blog').eq(2).should('contain', 'a blog test 1')
      })
    })
  })

  describe('when another user is logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'nicolas', password: 'nicolas123' })
      cy.createBlog({
        title: 'a blog test 1', 
        author: 'cypress', 
        url: 'ablogtest1'
      })
      cy.contains('Logout').click()
      cy.login({ username: 'admin', password: 'admin123' })
    })

    it('doesnt show the Remove button of blogs from other users', function() {
      cy.get('html').should('not.contain', 'Remove')
    })
  })
})
