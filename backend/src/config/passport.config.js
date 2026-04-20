import passport from 'passport'
import { strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../src/modules/users/user.model'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSercet: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value
        const avatar = profile.photos[0]?.value

        let user = await User.findOne({ email })

        if (user) {
          if (!user.authProviders.includes("google")) {
            user.authProviders.push("google")
            user.googleId = profile.id
          }

          if (!user.avatar && avatar) {
            user.avatar = avatar
          }
          await user.save()
        } else {
          user = await User.create({
            username: profile.displayName,
            email,
            googleId: profile.id,
            authProviders: ['google'],
            avatar,
            isVerified: true
          })
        }
        return done(null, user)

      } catch (error) {
        done(error, null)
      }
    }
  )
)