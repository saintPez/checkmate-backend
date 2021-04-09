const { Router } = require('express')
const { signin, signup, logIn } = require('../controller/auth')

const router = Router()

router.post('/signin', signin)

router.post('/signup', signup)

router.get('/user', logIn, (req, res) => {
  res.status(200).json({ success: true, user: req.user })
})

module.exports = router
