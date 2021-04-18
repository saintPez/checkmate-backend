const passport = require('passport')
const createError = require('http-errors')

const signin = (req, res, next) => {
  passport.authenticate('local-signin', (error, user, options) => {
    if (error) return next(createError(500, error))
    if (!user) return next(createError(401, options))
    req.logIn(user, (err) => {
      if (err) {
        return next(createError(500, error))
      }
      return res.json({ success: true, user })
    })
  })(req, res, next)
}

const signup = (req, res, next) => {
  passport.authenticate('local-signup', (error, user, options) => {
    if (error) next(createError(500, error))
    if (!user) return next(createError(401, options))
    req.logIn(user, (err) => {
      if (err) return next(createError(500, error))
      return res.status(201).json({ success: true, user })
    })
  })(req, res, next)
}

const facebook = (req, res, next) => {
  passport.authenticate('facebook', (error, user, options) => {
    if (error) next(createError(500, error))
    if (!user) return next(createError(401, options))
    req.logIn(user, (err) => {
      if (err) return next(createError(500, error))
      return res.status(201).json({ success: true, user })
    })
  })(req, res, next)
}

const facebookCallback = passport.authenticate('facebook', {
  successRedirect: '/auth/user',
  failureRedirect: '/auth/signin',
})

const logIn = (req, res, next) => {
  req.logIn(req.user, (err) => {
    if (err) return next(next(createError(401, 'Missing authorization')))
    next()
  })
}

module.exports = {
  signin,
  signup,
  facebook,
  facebookCallback,
  logIn,
}
