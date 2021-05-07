const pagination = require('discord.js-pagination');

module.exports = {
    name: "help",
    description: "The help command, what do you expect?",

    async execute(message, args, Discord, client) {

        //Sort your commands into categories, and make seperate embeds for each category

        const Music = new Discord.MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL())
        .setColor("#2e3235")
        .setDescription("**```🤖Bothoven Music Commands```**")
        .addField('Prefix', '**`.`**', true)
        .addField('play', '**`<link/query>`**', true)
        .addField('loop', '** **', true)
        .addField('skip', '** **', true)
        .addField('queue', '**`playSong`\n`addSong`\n`playList`\n`searchResult`\n`searchCancel`**', true)
        .addField('autoplay', '**`on/off`**', true)
        .addField('volume', '**`0-100`**', true)
        .addField('stop', '** **', true)
        .addField('filter', '**`3d`\n`bassboost`\n`echo`\n`karaoke`\n`nightcore`\n`vaporwave`**', true)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL() )
        const Mod = new Discord.MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL())
        .setColor("#2e3235")
        .setDescription("**```🤖Bothoven Moderation & fun Commands```**")
        .addField('ping', '** **', true)
        .addField('clear', '**`number`**', true)
        .addField('stats', '** **', true)
        .addField('avatar', '** **', true)

        //.addField('setprefix', "** **", true)

        const Info = new Discord.MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL())
        .setColor("#2e3235")

        .setDescription("**```🤖Bothoven Info```\n<:info:836836503531028490>Bothoven Version\n1.0.0\n\n📞Support Server\n[Click Here](https://discord.gg/dh4PAbraAj)\n\n<:Discord:837196478760878101>Invite Link\n[Click Here](https://discord.com/api/oauth2/authorize?client_id=836150063679799297&permissions=8&scope=bot%20applications.commands)**")
        const pages = [
            Music,
            Mod,
            Info
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)
    }
}