const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

const { admin_id, prefix, token } = require('./config.json');

// command file imports
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const exec = require('child_process').exec;

client.once('ready', () => {
    console.log('Ready!');
    exec('dir',
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
});

client.login(token);

// Listen for messages
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (!(message.author in admin_id)) {
        message.channel.send('Thanks');
    }

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
        switch (command) {
            case 'addadmin':
                admin_id.push(message.mentions.users.first().id);
                break;
            default:
                console.log(message.content);
        }
    } else {
        try {
            client.commands.get(command).execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command');
        }
    }
});