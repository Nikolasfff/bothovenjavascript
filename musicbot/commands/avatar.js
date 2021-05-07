module.exports = {
    name: "avatar",
    description: "Brodcast someone's avatar",

    async execute(message, args, Discord, client) {

        let member = message.mentions.users.first() || message.author

        let avatar = member.displayAvatarURL({size: 1024})


        const embed = new Discord.MessageEmbed()
        .setImage(avatar)
        .setColor("RANDOM")
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL() )

        message.channel.send(embed);
    }
}