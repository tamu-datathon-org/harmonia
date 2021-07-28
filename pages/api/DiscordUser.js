const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    authId: {type: String, required: true },
    discordId: { type: String, required: true },
    username: { type: String, required: true }
});

const DiscordUser = module.exports = mongoose.models.User || mongoose.model('User', UserSchema);