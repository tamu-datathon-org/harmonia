import nextConnect from 'next-connect'
import passport from 'passport'
import session from 'express-session';
import { authenticatedRoute } from '../../libs/middleware'
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const Discord = require('discord.js');

const db = mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true});

const UserSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  username: { type: String, required: true },
  discriminator: {type: String, required: true }, 
  authId: {type: String, required: true }
});

const DiscordUser = mongoose.models.User || mongoose.model('User', UserSchema);

// serialize user into request object
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await DiscordUser.findOne({ discordId: id }); //originally findById() <-- this finds by mongodbId instead of discordId (tries casting discordId to mongoId)
  if(user)
    done(null, user);
});

passport.use(new DiscordStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CLIENT_REDIRECT,
  scope: ['identify', 'guilds.join']
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

const guildId = { id: process.env.GUILD_ID }; // unique id for server in discord

handler.get(passport.authenticate('discord', {
    failureRedirect: '/forbidden'
}), authenticatedRoute(async (req, res, tdUser) => {
  try {
    const client = new Discord.Client();
    client.login(process.env.DISCORDBOT_TOKEN); // harmonia token
    const guild = new Discord.Guild(client, guildId);
    const disc_user = new Discord.User(client, req.user);
    const guildAddPromise = guild.addMember(disc_user, { accessToken: req.user.accessToken, nick: tdUser.firstName });
    const profile = req.user;
    const user = await DiscordUser.findOne({ authId: tdUser.authId });
    if (!user) { // if user does not exist in database, create them
      const newUser = await DiscordUser.create({
        discordId: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        authId: tdUser.authId
      });
    } else {
      await DiscordUser.updateOne({
        authId: tdUser.authId 
      }, {
        $set: {
          discordId: profile.id,
          username: profile.username,
          discriminator: profile.discriminator
        }
      });

    } 
    await guildAddPromise;
    res.statusCode = 302;
    res.setHeader("Location", "/guild/");
    res.end();
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
}));

export default handler;