// handles 'auth/redirect' route for our oauth2 app
import nextConnect from 'next-connect'
import passport from 'passport'
import session from 'express-session';
const DiscordStrategy = require('passport-discord').Strategy;

passport.use(new DiscordStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CLIENT_REDIRECT,
  scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile.username);
  console.log(profile.id);
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

handler.get(passport.authenticate('discord'));

export default handler;