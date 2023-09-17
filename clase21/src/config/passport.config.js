const passport = require('passport')
const local = require('passport-local')
const GithubStrategy = require('passport-github2')
const jwt = require('passport-jwt')
const Users = require('../DAOs/models/user.model');
const { getHashedPassword, comparePassword } = require('../utils/bcrypt')
const cookieExtractor = require('../utils/cookieExtractor')
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const clientSecret = process.env.CLIENT_SECRET_GITHUB;
const clientIDGoogle = process.env.GOOGLE_CLIENT_ID;
const clientSecretGoogle = process.env.GOOGLE_CLIENT_SECRET;


const initilizePassport = () => {
  passport.use(
    'register', //nombre de la estrategia
    new LocalStrategy( // instancia de la clase
      { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        const { name, lastname, email } = req.body
        console.log(name, lastname, email)
        try {
          const user = await Users.findOne({email:username})
          if (user) {
            console.log('Usuario ya existe')
            return done(null, false)
          }

          const userInfo = {
            name,
            lastname,
            email,
            password: getHashedPassword(password),
          }
          console.log(userInfo)
          const newUser = await Users.create(userInfo)
          console.log(newUser)
          done(null, newUser)
        } catch (error) {
          done(`Error al crear el usuario: ${error}`)
        }
      }
    )
  )

  passport.use(
    'login', //nombre de la estrategia
    new LocalStrategy(
      { usernameField: 'email' }, async (username, password, done) => {
        try {
          const user = await Users.findOne({ email: username })
          if (!user) {
            console.log("User doesn't exist")
            return done(null, false)
          }

          if (!comparePassword(password, user.password)) return done(null, false)

          return done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

passport.use(
    'github', //nombre de la estrategia
    new GithubStrategy(
      {
        clientID: "Iv1.40ec8ba414efaa03",
        clientSecret: clientSecret,
        callbackURL: "http://localhost:3000/api/sessions/githubcallback"
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile)

          const user = await Users.findOne({ email: profile._json.email })

          if (!user) {
            const userInfo = {
              name: profile._json.name,
              lastname: '',
              email: profile._json.email,
              password: '',
            }

            const newUser = await Users.create(userInfo)
            return done(null, newUser)
          }

          done(null, user)
        } catch (error) {
          done(null, error)
        }
      }
    )
  )


passport.use('google', new GoogleStrategy({
      clientID: clientIDGoogle,
      clientSecret: clientSecretGoogle,
      callbackURL: "http://localhost:3000/api/sessions/googlecallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const user = await Users.findOne({ lastname: profile._json.familiy_name })
            
            if (!user) {
                const userInfo = {
                  name: profile._json.given_name,
                  lastname: profile._json.familiy_name,
                  email: '',
                  password: '',
                }
    
            const newUser = await Users.create(userInfo)
            return done(null, newUser)
            }
            done(null, user)
        } catch (error) {
            done(null, error)
        }
      
    }
  ));

passport.use(
    'jwt', //nombre de la estrategia
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'mySecret',
      }, async (jwt_payload, done) => {
        try {
          done(null, jwt_payload)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id)
    done(null, user)
  })
}

module.exports = initilizePassport