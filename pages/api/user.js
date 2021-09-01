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
  authId: {type: String, required: true }
});

const DiscordUser = mongoose.models.User || mongoose.model('User', UserSchema);

const handler = nextConnect();

  handler.get(async (req, res, tdUser) => {
    try {
      const userAuthId = req.query.userAuthId;
      const query = await DiscordUser.find({ 'authId': userAuthId });
      res.json({ userInfo: query[0].username + "#" + query[0].discriminator });
    }
    catch(err) {
      console.log(err);
      res.status(500).send(err);
    }
});

export default handler;