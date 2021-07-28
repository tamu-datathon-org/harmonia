import nextConnect from 'next-connect'
import passport from 'passport'
import session from 'express-session';
import { authenticatedRoute } from '../../libs/middleware'
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');

const db = mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true})

const UserSchema = new mongoose.Schema({
  authId: {type: String, required: true },
  discordId: { type: String, required: true },
  username: { type: String, required: true }
});

const DiscordUser = mongoose.models.User || mongoose.model('User', UserSchema);

db.then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));

// serialize user into request object
passport.serializeUser((user, done) => {
  console.log("SERIALIZE");
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("DESERIALIZE");
  const user = await DiscordUser.findOne({ discordId: id }); //findById() <-- this finds by mongodbId instead of discordId, tried casting discordId to mongoId
  if(user)
    done(null, user);
});

passport.use(new DiscordStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CLIENT_REDIRECT,
  scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
  done(null, profile);
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

handler.get(passport.authenticate('discord', {
    failureRedirect: '/forbidden'
}), authenticatedRoute(async (req, res, tdUser) => {
  console.log("GOT HERE");
  try { 
    const profile = req.user;
    console.log("tdUser", tdUser);
    console.log("discord username:", profile.id);
    const user = await DiscordUser.findOne({ discordId: profile.id });
    console.log(user);
    if(user) { // if user is found
      console.log("User exists.");
      //done(null, user);
    } else {
      console.log("User does not exist.");
      const newUser = await DiscordUser.create({
          discordId: profile.id,
          username: profile.username,
          authId: tdUser.authId
      });
      const savedUser = await newUser.save();
      //done(null, savedUser);
    }
    res.statusCode = 302;
    res.setHeader("Location", "http://localhost:3000/discord/");
    res.end();
    console.log(req.user.username);
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
    //done(err, null);
  }
}));

export default handler;