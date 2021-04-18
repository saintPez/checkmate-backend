const { Router } = require('express')
const {
  signin,
  signup,
  facebook,
  facebookCallback,
  logIn,
} = require('../controller/auth')

const router = Router()

router.get('/signin', (req, res) => {
  res.render('signin')
})
router.post('/signin', signin)

router.post('/signup', signup)

router.post('/facebook', facebook)

router.get('/facebook/callback', facebookCallback)

router.get('/user', logIn, (req, res) => {
  res.status(200).json({ success: true, user: req.user })
})

module.exports = router
