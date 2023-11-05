const passport = require('passport')
const local = require('passport-local')
const jwt = require('passport-jwt')
//const Users = require('../DAOs/models/mongo/user.model.js');
const Users = require('../services/service.users.js');
const Roles = require('../DAOs/models/mongo/role.model.js');
const Carts = require('../DAOs/dbManagers/CartsDao.js');
const { getHashedPassword, comparePassword } = require('../utils/bcrypt')
const {generateToken} = require('../utils/jwt')
const cookieExtractor = require('../utils/cookieExtractor')
const MailingService = require('../services/mailing.js');
const GithubStrategy = require('passport-github2')
const GoogleStrategy = require('passport-google-oauth20');
const { v4: uuidv4 } = require('uuid');
const { CLIENTE_ID_GITHUB, CLIENT_SECRET_GITHUB, CLIENT_CALLBACK_GITHUB, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL} = require('../public/js/config');
const UserDto = require('../DTO/user.dto.js');
const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const cartManager = new Carts();

const initilizePassport = () => {
  passport.use(
    'register', //nombre de la estrategia
    new LocalStrategy( // instancia de la clase
      { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        const { name, lastname, email, age } = req.body;
        try {
          const user = await Users.getUserByEmail(username);
          if (user) {
            console.log('Usuario ya existe')
            return done(null, false)
          }
          let newCart = await cartManager.createCart();
          let role='user';
          if (email === 'admincoder@coder.com' && password === 'adminCod3r123') {
              role = 'admin';
          }
          roleName = await Roles.findOne({roleName: role});
    
          const userRegister = {
            name,
            lastname,
            email,
            age,
            password: getHashedPassword(password),
            cart: newCart.toString(),
            role:roleName._id.toString(),
          }
          const userInfo = new UserDto(userRegister);
          console.log(userInfo);
          const newUser = await Users.createUser(userInfo)
          const userId = newUser._id.toString();

          // Generar el código
          const uniqueCode = uuidv4();
          console.log('Código único:', uniqueCode);

          // Generar token
          const token = generateToken({userId, uniqueCode});

          console.log(token);

          //// Enviar mail
          const mailer = new MailingService();
          const mail = await mailer.sendSimpleMail({
              from: "CoderTest",
              to: "kjvelandia8@gmail.com",
              subject:"Cuenta de usuario registrado",
              html:`<div> 
                      <div>Felicidades has quedado registrado </div>
                      <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
                  <a
                      href="http://localhost:3000/api/users/confirm/${ token }"
                      target="_blank"
                  >Confirmar Cuenta</a>
                  </div>`

          })

          console.log(mail +" //Registro de usuario"); 
          ////


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
          const user = await Users.getUserByEmail(username)
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
        clientID: CLIENTE_ID_GITHUB,
        clientSecret: CLIENT_SECRET_GITHUB,
        callbackURL: CLIENT_CALLBACK_GITHUB
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile)
          const user = await Users.getUserByEmail(profile._json.email)
          let role='user';
          if (profile._json.email === 'admincoder@coder.com') {
              role = 'admin';
          }
          roleName = await Roles.findOne({roleName: role});
          let newCart = await cartManager.createCart();
          console.log(user)
          if (!user) {
            const userRegister = {
              name: profile._json.name,
              lastname: '',
              email: profile._json.email,
              age: '',
              password: '',
              cart: newCart._id.toString(),
              role: roleName,
              picture: profile._json.avatar_url,
            }
            const userInfo = new UserDto(userRegister);
            console.log(userInfo);
            const newUser = await Users.createUser(userInfo)
            const userId = newUser._id.toString();
              // Generar el código
            const uniqueCode = uuidv4();
            console.log('Código único:', uniqueCode);

            // Generar token
            const token = generateToken({userId, uniqueCode});

            console.log(token);

            //// Enviar mail
            const mailer = new MailingService();
            const mail = await mailer.sendSimpleMail({
                from: "CoderTest",
                to: "kjvelandia8@gmail.com",
                subject:"Cuenta de usuario registrado",
                html:`<div> 
                        <div>Felicidades has quedado registrado </div>
                        <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
                    <a
                        href="http://localhost:3000/api/users/confirm/${ token }"
                        target="_blank"
                    >Confirmar Cuenta</a>
                    </div>`

            })

            console.log(mail +" //Registro de usuario");
            ////
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
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ['profile'],
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const userEmail = profile.emails[0].value; 
            const user = await Users.getUserByEmail(userEmail)
            let role='user';
            if (profile._json.email === 'admincoder@coder.com') {
                role = 'admin';
            }
            roleName = await Roles.findOne({roleName: role});
            let newCart = await cartManager.createCart();
            if (!user) {
                const userRegister = {
                  name: profile._json.given_name,
                  lastname: profile._json.familiy_name,
                  email: userEmail,
                  age: '',
                  password: '',
                  cart: newCart._id.toString(),
                  role: roleName,
                  picture: profile._json.picture,
                }
                const userInfo = new UserDto(userRegister);
                console.log(userInfo);
                const newUser = await Users.createUser(userInfo)
                const userId = newUser._id.toString();
                  // Generar el código
                const uniqueCode = uuidv4();
                console.log('Código único:', uniqueCode);

                // Generar token
                const token = generateToken({userId, uniqueCode});

                console.log(token);

                //// Enviar mail
                const mailer = new MailingService();
                const mail = await mailer.sendSimpleMail({
                    from: "CoderTest",
                    to: "kjvelandia8@gmail.com",
                    subject:"Cuenta de usuario registrado",
                    html:`<div> 
                            <div>Felicidades has quedado registrado </div>
                            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
                        <a
                            href="http://localhost:3000/api/users/confirm/${ token }"
                            target="_blank"
                        >Confirmar Cuenta</a>
                        </div>`

                })

                console.log(mail +" //Registro de usuario");
                ////
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
    const user = await Users.getUserByID(id)
    done(null, user)
  })

}

module.exports = initilizePassport