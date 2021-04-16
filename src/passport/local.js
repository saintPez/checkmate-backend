const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const bcrypt = require('bcrypt')

const User = require('../models/user')

passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ where: { email: email } })
      if (user) return done(null, false, { message: 'Email already in use' })
      const salt = await bcrypt.genSalt(10)
      const newUser = await User.create({
        email,
        password: await bcrypt.hash(password, salt),
        username: req.body.username,
      })
      return done(null, newUser)
    }
  )
)

passport.use(
  'local-signin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      const user = await User.findOne({ where: { email: email } })
      if (!user || !(await bcrypt.compare(password, user?.password)))
        return done(null, false, { message: 'Wrong email or password' })
      return done(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ where: { id: id } })
  done(null, user)
})
