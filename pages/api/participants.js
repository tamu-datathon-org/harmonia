import nextConnect from 'next-connect'
import { authenticatedRoute } from '../../libs/middleware'
const { eachOfLimit } = require('async');
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

const guildId = { id: process.env.GUILD_ID }; // unique id for server in discord

const handler = nextConnect();

handler.get(authenticatedRoute(async (req, res) => {
    try {
        const client = new Discord.Client();
        await client.login(process.env.DISCORDBOT_TOKEN); // harmonia token
        const guild = new Discord.Guild(client, guildId);
        const participantRole = guild.roles.cache.find(role => role.name === "member");
        const allParticipants = [];
        try {
            const guildFetchPromise = guild.fetch();
            const users = await DiscordUser.find();
            await guildFetchPromise;
            await eachOfLimit(users, 10, (user) => {
                // eslint-disable-next-line prettier/prettier
                const member = await guild.members.fetch(user.discordId);
                if (member?.role?.id === participantRole.id)
                    allParticipants.push(user?.username + "#" + user?.discriminator);
            });
            res.status(200).json({ participants: allParticipants });
        }
        catch(err) {
          console.log(err);
          res.status(200).json({ participants: allParticipants });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}));

export default handler;