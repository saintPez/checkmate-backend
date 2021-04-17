const { api, sequelize, agent } = require('./utils')

beforeAll(() => sequelize.sync({ force: true }).then())

afterAll(() => sequelize.close())

describe('AUTH TEST', () => {
  test('GET "api/user" without signin', () => {
    return new Promise((resolve, reject) => {
      api
        .get('/api/user')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(401)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toStrictEqual({
            success: false,
            status: 401,
            name: 'UnauthorizedError',
            message: 'Missing authorization',
          })
          return resolve()
        })
        .catch((err) => {
          return reject(err)
        })
    })
  })

  test('POST "api/auth/signup"', () => {
    return new Promise((resolve, reject) => {
      api
        .post('/api/auth/signup')
        .send({
          email: 'test@test.com',
          password: 'test',
          name: 'test',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(201)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('success', true)
          expect(res.body.user).toHaveProperty('id')
          return resolve()
        })
        .catch((err) => {
          return reject(err)
        })
    })
  })

  test('POST "api/auth/signin"', () => {
    return new Promise((resolve, reject) => {
      agent
        .post('/api/auth/signin')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('success', true)
          expect(res.body.user).toHaveProperty('id')
          return resolve()
        })
        .catch((err) => {
          return reject(err)
        })
    })
  })

  test('GET "api/user" with signin', () => {
    return new Promise((resolve, reject) => {
      agent
        .get('/api/user')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('success', true)
          expect(res.body.user).toHaveProperty('id')
          return resolve()
        })
        .catch((err) => {
          return reject(err)
        })
    })
  })
})
