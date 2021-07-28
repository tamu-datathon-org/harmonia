import nextConnect from 'next-connect'
import passport from 'passport'
import session from 'express-session';
const DiscordStrategy = require('passport-discord').Strategy;
const db = require('./database');
const DiscordUser = require('./DiscordUser')

db.then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));

// serialize user into request object
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = DiscordUser.findById(id);
    if(user)
      done(null, user);
});

passport.use(new DiscordStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CLIENT_REDIRECT,
  scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await DiscordUser.findOne({ discordId: profile.id });
    if(user) // if user is found
      done(null, user);
    else {
      const newUser = await DiscordUser.create({
          discordId: profile.id,
          username: profile.username
      });
      const savedUser = await newUser.save();
      done(null, savedUser);
    }
  }
  catch(err) {
    console.log(err);
    done(err, null);
  }
}));

const handler = nextConnect();

handler.use(session({
  secret: 'some random secret',
  cookie: {
    maxAge: 60000 * 60 * 24
  },
  saveUninitialized: false
}));

handler.use(passport.initialize());
handler.use(passport.session());

handler.get('/api/auth', passport.authenticate('discord', {
    failureRedirect: '/forbidden'
}), (req, res) => {
    //res.statusCode = 302;
    //res.setHeader("Header", "http://localhost:3000/discord/");
    //res.end();
    res.send(200);
});

export default handler;