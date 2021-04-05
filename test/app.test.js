const { api, sequelize } = require('./utils')

beforeAll(() => sequelize.sync({ force: true }).then())

afterAll(() => sequelize.close())

describe('GENERAL TEST', () => {
  test('GET "/"', async () => {
    const res = await api.get('/').expect(200).expect('Content-Type', /json/)
    expect(res.body).toEqual({})
  })
})

describe('AUTH TEST', () => {
  test('GET "api/auth/signup"', () => {
    return new Promise((resolve, reject) => {
      api
        .get('/api/auth/signup')
        .send({
          email: 'test@test.com',
          password: 'test',
          username: 'test',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(201)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body.user).toHaveProperty('createdAt')
          expect(res.body.user).toHaveProperty('email')
          expect(res.body.user).toHaveProperty('id')
          expect(res.body.user).toHaveProperty('password')
          expect(res.body.user).toHaveProperty('updatedAt')
          expect(res.body.user).toHaveProperty('username')
          return resolve()
        })
        .catch((err) => {
          return reject(err)
        })
    })
  })
})
