import nextConnect from 'next-connect'
import passport from 'passport'
import session from 'express-session';
import { authenticatedRoute } from '../../libs/middleware'
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

handler.get(authenticatedRoute(async (req, res, tdUser) => {
  try {
    const client = new Discord.Client();
    client.login(process.env.DISCORDBOT_TOKEN); // harmonia token
    const guild = new Discord.Guild(client, guildId);
    try {
      const guildFetchPromise = guild.fetch();
      const user = await DiscordUser.findOne({ authId: tdUser.authId });
      await guildFetchPromise;
      const discUser = await guild.members.fetch(user.discordId);
      const isMember = discUser.roles.cache.has(process.env.ROLE_ID)
      if (discUser) {
        return res.status(200).json({isInServer : true, isMember})
      }
    }
    catch(err) {
      console.log(err);
      res.status(200).json({isInServer : false, isMember : false})
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
}));

export default handler;