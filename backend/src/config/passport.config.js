import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../modules/users/models/user.model.js'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        
        console.log(passport.strategies);

        const email = profile.emails[0].value
        const avatar = profile.photos[0]?.value

        let user = await User.findOne({ email })

        if (user) {
          if (!user.authProviders.includes("google")) {
            user.authProviders.push("google")
            user.googleId = profile.id
          }

          if (!user.avatar.url && avatar) {
            user.avatar.url = avatar
          }
          await user.save()
        } else {
          console.log(avatar);
          
          user = await User.create({
            username: profile.displayName,
            email,
            googleId: profile.id,
            authProviders: ['google'],
            avatar:{
              url:avatar
            },
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

export default passport;