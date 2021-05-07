module.exports = {
    name: "ping",
    description: "test command",

    async execute(message, args, Discord, client) {


        const ping = new Discord.MessageEmbed()
        .setColor('BLACK')
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL()/*, `https://discord.com/users/${message.author.id}`*/)
        .setDescription(`> **Your ping is \`${client.ws.ping}\` ms.**\n\n`/*🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`*/)
        //.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL() )
        

        message.channel.send(ping);
    }
}