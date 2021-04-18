const passport = require('passport')
const { Strategy: FacebookStrategy } = require('passport-facebook')

const { Op } = require('sequelize')

const User = require('../models/user')
const Provider = require('../models/provider')

const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } = require('../env')

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const provider = await Provider.findOne({
        where: {
          [Op.and]: [{ provider: 'facebook' }, { provider_id: profile.id }],
        },
      })
      if (provider)
        return done(
          null,
          await User.findOne({ where: { id: provider.user_id } })
        )

      const newUser = await User.create({
        username: profile.displayName,
        avatar: profile.photos[0].value,
      })
      await Provider.create({
        user_id: newUser.id,
        provider: profile.provider,
        provider_id: profile.id,
        name: profile.displayName,
      })

      done(null, newUser)
    }
  )
)
