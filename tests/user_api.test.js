const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('when there is initially one user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany()

        const passwordHash = await bcrypt.hash('admin123', 10)
        const user = new User({ username: 'admin', name: 'Administrator', passwordHash })

        await user.save()
     })

    test('creation succeds with a valid user', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "kentucky", 
            name: "Kentucky", 
            password: "kentucky123"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation of a user with no username fails with status code 400', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUserNoUsername = {
            name: "User no username", 
            password: "usernousername123"
        }

        await api
            .post('/api/users')
            .send(newUserNoUsername)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    
    test('creation of a user with no password fails with status code 400', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUserNoPwd = {
            username: "usernopwd", 
            name: "User no pwd"
        }

        await api
            .post('/api/users')
            .send(newUserNoPwd)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation of a user with username shorter than 3 char fails with code 400', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUserShortUsername = {
            username: "ac", 
            name: "Albert Brighton Coughnessy", 
            password: "albert123"
        }

        await api
            .post('/api/users')
            .send(newUserShortUsername)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation of a user with pwd shorter than 3 char fails with code 400', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUserShortPwd = {
            username: "albert", 
            name: "Albert Brighton Coughnessy", 
            password: "ac"
        }

        await api
            .post('/api/users')
            .send(newUserShortPwd)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation of a user with an existing username failes with code 400', async () => {
        const usersAtStart = await helper.usersInDb()
        const existingUser = usersAtStart[0]

        const newUser = {
            username: existingUser.username, 
            name: "Rocky Balboa", 
            password: "rocky123"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

})


