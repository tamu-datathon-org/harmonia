import nextConnect from 'next-connect'
import passport from 'passport'
import session from 'express-session';
import { authenticatedRoute } from '../../libs/middleware'
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const Discord = require('discord.js');

const db = mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true})

const UserSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  username: { type: String, required: true },
  discriminator: {type: String, required: true },
  authId: {type: String, required: true }
});

const DiscordUser = mongoose.models.User || mongoose.model('User', UserSchema);

const handler = nextConnect();

handler.get(authenticatedRoute(async (req, res) => {
  try {
    if (req.query.userAuthId) {
      const userAuthId = req.query.userAuthId;
      const user = await DiscordUser.find({ 'authId': userAuthId });
      res.json({ userAuthId: userAuthId,
                 discordInfo: user[0].username + "#" + user[0].discriminator });
    } else if (req.query.discordInfo) {
      const discordInfo = req.query.discordInfo;
      const user = await DiscordUser.find({ 'username': discordInfo });
      res.json({ userAuthId: user[0].authId,
                 discordInfo: discordInfo + "#" + user[0].discriminator});
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
}));

export default handler;