/* global cy */
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'Ben Parka',
      username: 'ben',
      password: 'salasala'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Default start page is shown (Login button)', function() {
    cy.contains('Blogs')
    cy.contains('login')
    cy.contains('Blogs app by JR, Fullstackopen in University of Helsinki 2020')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
    cy.contains('cancel')
  })

  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('ben')
    cy.get('#password').type('salasala')
    cy.get('#login-button').click()

    cy.contains('Ben Parka logged in')
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong username or password')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')
    cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
  })

  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'ben', password: 'salasala' })
    })

    it('login cmd shows new blog button', function() {
      cy.contains('new blog')
    })

    it('A blog can be created', function() {
      cy.contains('Ben Parka logged in')

      cy.contains('new blog').click()
      cy.get('#title').type('Cypress is a fine tool')
      cy.get('#author').type('Jorma R')
      cy.get('#url').type('http://jorma.com')
      cy.contains('create').click()

      // info message
      cy.contains('a new blog Cypress is a fine tool by Ben Parka added')

      //list
      cy.contains('Cypress is a fine tool Jorma R')
        .contains('view')
    })

    it('A blog can be liked', function() {
      cy.createBlog({
        title: 'Cypress is a fine tool',
        author: 'Jorma R',
        url: 'http://jorma.com'
      })

      cy.contains('Cypress is a fine tool Jorma R')
        .contains('view').click()
      cy.contains('Like').click()

      cy.contains('likes: 1')
    })

    it('A blog can be removed by adder', function() {
      cy.createBlog({
        title: 'Cypress is a fine tool',
        author: 'Jorma R',
        url: 'http://jorma.com'
      })
      cy.contains('Cypress is a fine tool Jorma R')
        .contains('view').click()

      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'Cypress is a fine tool')
    })

    it('A blog cannot be removed by other than adder', function() {
      cy.createBlog({
        title: 'Cypress is a fine tool',
        author: 'Jorma R',
        url: 'http://jorma.com'
      })
      cy.contains('logout').click()

      const user = {
        name: 'Pena Parka',
        username: 'pena',
        password: 'salasala'
      }
      cy.request('POST', 'http://localhost:3001/api/users/', user)
      cy.login({ username: 'pena', password: 'salasala' })
      cy.visit('http://localhost:3000')

      cy.contains('Cypress is a fine tool Jorma R')
        .contains('view').click()
        .should('not.contain', 'remove')
    })

    it('Blogs are listed with most liked first', function() {

      cy.createBlog({
        title: 'Cypress is a fine tool',
        author: 'Jorma R',
        url: 'http://jorma.com'
      })
      cy.createBlog({
        title: 'A lot liked blog',
        author: 'JR',
        url: 'http://jorma.com'
      })
      cy.createBlog({
        title: 'Not at all liked blog',
        author: 'JR',
        url: 'http://jorma.com'
      })

      cy.contains('Cypress is a fine tool Jorma R')
        .contains('view').click()
      cy.get('.togglableContent').contains('Cypress is a fine tool')
        .contains('Like').click()  // 1
      cy.get('.togglableContent').contains('Cypress is a fine tool')
        .contains('hide').click()

      cy.contains('A lot liked blog')
        .contains('view').click()
      cy.get('.togglableContent').contains('A lot liked blog')
        .contains('Like').click() // 1
      cy.get('.togglableContent').contains('A lot liked blog')
        .contains('hide').click()

      cy.contains('A lot liked blog')
        .contains('view').click()
      cy.get('.togglableContent').contains('A lot liked blog')
        .contains('Like').click() //2
      cy.get('.togglableContent').contains('A lot liked blog')
        .contains('hide').click()

      cy.contains('A lot liked blog')
        .contains('view').click()
      cy.get('.togglableContent').contains('A lot liked blog')
        .contains('Like').click() // 3

      cy.contains('Cypress is a fine tool Jorma R')
        .contains('view').click()

      cy.contains('Not at all liked blog')
        .contains('view').click()

      cy.get('div.togglableContent')
        .contains('A lot liked blog')
        //.contains('likes: 3') // oli kerran 2, jopa view-hide ketjulla
        .parent()
        .next()
        .children('div.togglableContent')
        .contains('Cypress is a fine tool Jorma R')
        //.contains('likes: 1')
        .parent()
        .next()
        .children('div.togglableContent')
        .contains('Not at all liked blog')
        //.contains('likes: 0')

    })
  })
})