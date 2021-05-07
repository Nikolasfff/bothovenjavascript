// DisTube example bot, definitions, properties and events details in the Documentation page.
const Discord = require('discord.js'),
    DisTube = require('distube'),
    client = new Discord.Client(),
config = {
    prefix: ".",
    token: process.env.TOKEN || "ODM2MTUwMDYzNjc5Nzk5Mjk3.YIZzbg.Ve0_E8skx32X2Ro6Ld0b613UjcA"
};
const db = require('quick.db');
// Create a new DisTube
const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });

const webhookClient = new Discord.WebhookClient('836482000033677322', '8DrETuADByw_1eOtOc46Gb7P8V3OKTzbEYyfmKmTm83IipU_3xGEZSY_rFJTerUzGXKH');

const embed = new Discord.MessageEmbed()
    .setDescription("**```🤖Bothoven UP```**")
	.setColor('fcff00');

webhookClient.send('', {
	embeds: [embed],
});





client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: '',
        activity: {
            type: 'PLAYING',
            name: '.help',
        }
        
    });
    //client.user.setStatus('dnd')
    client.api.applications(client.user.id).guilds('836275080932884520').commands.post({
        data: {
            name: "info",
            description: "🤖Bot Info Command",

           
        }
    });

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;
        
        
        if(command == "info") {
            const embed = new Discord.MessageEmbed()
                .setColor('#2b53d6')
                .setDescription("**\n<:info:836836503531028490>Bothoven Version\n`1.0.0`\n\n<:discord_bot_dev:836836331916492821>Developers\n<@484316098989260810> & <@665832146656690189>\n\n<:Discord:837196478760878101>Invite Link\n[Click Here](https://discord.com/api/oauth2/authorize?client_id=836150063679799297&permissions=8&scope=bot%20applications.commands)\n\nPrefix\n`.`**")
                .setAuthor(client.user.username + ` info`, client.user.displayAvatarURL(), 'https://discord.com/api/oauth2/authorize?client_id=836150063679799297&permissions=8&scope=bot%20applications.commands') 
               // .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL() )
        client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction, embed)
                }
            });
        }
    });


});


async function createAPIMessage(interaction, content) {
    const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();
    
    return { ...apiMessage.data, files: apiMessage.files };
}



client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    if (command == "play")
        distube.play(message, args.join(" "));

    if (["repeat", "loop"].includes(command))
        distube.setRepeatMode(message, parseInt(args[0]));

    if (command == "stop") {
        distube.stop(message);
        message.channel.send("Stopped the music!");
    }

    if (command == "skip")
        distube.skip(message);

    if (command == "queue") {
        let queue = distube.getQueue(message);
        message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));
    }

    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        let filter = distube.setFilter(message, command);
        message.channel.send("Current queue filter: " + (filter || "Off"));
    }
});

client.on('message', (message) => {
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    if (command == "autoplay") {
        let mode = distube.toggleAutoplay(message);
        message.channel.send("Set autoplay mode to `" + (mode ? "On" : "Off") + "`");
    }
});

client.on('message', (message) => {
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    if (command == "loop") {
        let mode = distube.setRepeatMode(message);
        message.channel.send("Set Loop to `" + (mode ? "On" : "Off") + "`");
    }
});
client.on('message', (message) => {
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    if (command == "volume")
        distube.setVolume(message, args[0]);
});




// Queue status template
const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

// DisTube event listeners, more in the documentation page
distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("An error encountered: " + e);
});
/*
//help command
client.on('message', message => {
    let args = message.content.substring(config.prefix.length).split(" ");

    switch(args[0]) {
      
        case 'help':
            const embed = new Discord.MessageEmbed()
                 
                .setColor("#2e3235")
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription("**```🤖Bothoven Commands```**")
                .addField('Prefix', '**`.`**', true)                 
                .addField('play', '**`<link/query>`**', true)   
                .addField('loop', '** **', true)                
                .addField('skip', '** **', true)                
                .addField('queue', '**`playSong`\n`addSong`\n`playList`\n`searchResult`\n`searchCancel`**', true)                
                .addField('autoplay', '**`on/off`**', true)  
                .addField('volume', '**`0-100`**', true)  
                .addField('clear', '**`number`\n`Manage Messages Permission`**', true)                
                .addField('stop', '** **', true)  
                .addField('filter','**`3d`\n`bassboost`\n`echo`\n`karaoke`\n`nightcore`\n`vaporwave`**', true)
                //.addField('Invite the bot','**[`Click Here`](https://discord.com/api/oauth2/authorize?client_id=836150063679799297&permissions=8&scope=bot%20applications.commands)**', true)
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL() )
   

                    

            message.channel.send(embed);
            break;
        }    

        
}); */


//clear Cmd
client.on('message', message => {
    let MessageArr = message.content.split(" ");
      let cmd = MessageArr[0];
      let args = MessageArr.slice(1);
    if(cmd === ".clear"){
    
    
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        return message.reply("You can't delete messages....").then(m => m.delete(5000));
    }
    
    // Check if args[0] is a number
    if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
        return message.reply("Yeah.... That's not a numer? I also can't delete 0 messages by the way.").then(m => m.delete(5000));
    }
    
    // Maybe the bot can't delete messages
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
        return message.reply("Sorryy... I can't delete messages.").then(m => m.delete(5000));
    }
    
    let deleteAmount;
    
    if (parseInt(args[0]) > 100) {
        deleteAmount = 100;
    } else {
        deleteAmount = parseInt(args[0]);
    }
    
    message.channel.bulkDelete(deleteAmount, true)
        .catch(err => message.reply(`Something went wrong... ${err}`));
    
    
    }
})



const fs = require('fs');
client.commands = new Discord.Collection();
 
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
 
    client.commands.set(command.name, command);
}

client.on('message', message => {
 
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
 
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'help') {
        client.commands.get('help').execute(message, args, Discord, client);
    } 
  
});
client.on('message', message => {
 
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
 
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'avatar') {
        client.commands.get('avatar').execute(message, args, Discord, client);
    } 
  
});
client.on('message', message => {
 
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
 
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'ping') {
        client.commands.get('ping').execute(message, args, Discord, client);
    } 
  
});
client.on('message', message => {
 
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
 
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'setprefix') {
        client.commands.get('setprefix').execute(message, args, Discord, client);
    } 
  
});



/*
client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    let prefix = await db.get(`prefix_${message.guild.id}`);
    if(prefix === null) prefix = config.prefix;

    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) return;


        try {
            client.commands.get(command).execute(message, args, Discord, client);

        } catch (error){
            console.error(error);
        }
    }
})

*/



client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'stats') {
        const embed = new Discord.MessageEmbed()
        .setColor('BLACK')
        .setAuthor(client.user.tag, client.user.displayAvatarURL())
        .setDescription(`**🧮 Server count: \`${client.guilds.cache.size}\`**`)
        /*return message.channel.send(`**Server count: \`${client.guilds.cache.size}\`**`);*/
        message.channel.send(embed)
    }
});



client.login(config.token);