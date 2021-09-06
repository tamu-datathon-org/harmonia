import nextConnect from 'next-connect'
import { authenticatedRoute } from '../../libs/middleware'
const mongoose = require('mongoose');

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
    const users = await DiscordUser.find();
    //const numUsers = await DiscordUser.countDocuments().then();
    var allUsers = [];
    var i = 0;
    while (users[i] != undefined) {
      allUsers.push(users[i].username + "#" + users[i].discriminator);
      i += 1;
    }
    res.json({discordUsers : allUsers});
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
}));

export default handler;