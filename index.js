// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DEPENDENCIES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// #dependencies
console.log("[Loading Dependencies]");
const Discord = require("discord.js");
const { Util, MessageAttachment } = require("discord.js");
const client = new Discord.Client();
const keepAlive = require("./server.js");
const fs = require("fs");
const moment = require("moment");
const defConfig = require("./config.json");
const Database = require("@replit/database");
const db = new Database();
require("dotenv").config();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VARIABLES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

console.log("[Loading Variables]");

// #config (synced with database)
const config = {
	prefix: "",
	botOwnerID: "",
	cooldown: "",
	maintenance: "",
	mainServerID: "",
	threadServerID: "",
	categoryID: "",
	logChannelID: "",
	botChannelID: "",
	adminRoleID: "",
	modRoleID: "",
	mentionedRoleID: "",
	info_color: "",
	warning_color: "",
	error_color: "",
	received_color: "",
	sent_color: ""
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DATABASE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const dbPrefix = {
	block: "bck.",
	config: "cfg.",
	thread: "trd.",
	tag: "tag.",
}

/* Database Structure
	~ Block ~
		bck.userID = modID-reason
	~ Config~
		cfg.configName = value
	~ Thread ~
		trd.userID = channelID-threadTitle
	~ Tag ~
		tag.tagName = content
*/

// For debugging purpose, deleting all keys in the database.
// db.list().then(keys => keys.forEach(async key => {await db.delete(key)}));
// db.list(dbPrefix.block).then(keys => keys.forEach(async key => {await db.delete(key)}));
// db.list(dbPrefix.config).then(keys => keys.forEach(async key => {await db.delete(key)}));
// db.list(dbPrefix.thread).then(keys => keys.forEach(async key => {await db.delete(key)}));
// db.list(dbPrefix.tag).then(keys => keys.forEach(async key => {await db.delete(key)}));

// #commandsCollection
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const cmd = require(`./commands/${file}`);
	client.commands.set(cmd.name, cmd);
}

// #functionsCollection
client.functions = new Discord.Collection();
const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionFiles) {
	const func = require(`./functions/${file}`);
	client.functions.set(func.name, func);
}

// #cooldownCollection
const cooldowns = new Discord.Collection();

// #activities
const activity = {
	index: 0
};

// #parameter
const param = {
	Discord,
	MessageAttachment,
	moment,
	client,
	db,
	dbPrefix,
	config,
	defConfig,
	activity,
}
// add every functions to param object
client.functions.forEach(fn => param[fn.name] = client.functions.get(fn.name));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~READY~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

client.on('ready', async () => {
	console.log("[Syncing Database]");
	// cant make the bot waiting this guy below to finish pfft
	await param.configSync.execute(param);

	console.log(`Logged in as ${client.user.tag}!`);
	setTimeout(async ()=> {
		await param.updateActivity.execute(param);
	}, 5000);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~NEW GUILD~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

client.on('guildCreate', async guild => {
	const ownerID = config.botOwnerID;
	if(ownerID) {
		const newServerEmbed = param.getEmbed.execute(param, config.info_color, "Joined a Guild", `[**${guild.name}**] (\`${guild.id}\`)`);
		client.users.cache.get(ownerID).send(newServerEmbed);
	}
	console.log(`Joined [${guild.name}] guild.`);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~MESSSAGES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

client.on('message', async message => {
	if(message.author.bot) return;
	let now = Date.now();
	let timestamps, cooldownAmount;

	// Activity Cooldown
	if (!cooldowns.has("botActivity")) {
		cooldowns.set("botActivity", new Discord.Collection());
	}
	now = Date.now();
	timestamps = cooldowns.get("botActivity");
	// 7 Seconds
	cooldownAmount = 7000;
	if (!timestamps.has("botActivity")) {
		await param.updateActivity.execute(param);
	}
	timestamps.set("botActivity", now);
	setTimeout(() => timestamps.delete("botActivity"), cooldownAmount);

	try {
		const authorID = message.author.id;
		const maintenanceEmbed = param.getEmbed.execute(param, config.error_color, "Maintenance", "All functions are disabled.");

		let args, commandName = "";

		// checking whether user use prefix or mention the bot
		const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`);
		if (!prefixRegex.test(message.content)) {
			// user didn't use prefix or mention the bot
			if(message.guild != null) {
				// message are inside a guild
				return;
			} else {
				// Direct Message
				const isThread = await db.get(dbPrefix.thread + message.author.id);
				if(!isThread) {
					// User didn't have any open thread
					return;
				} else if(config.maintenance == "1" && authorID != config.botOwnerID) {
					// Maintenance mode enabled
					return message.channel.send(maintenanceEmbed);
				} else {
					// User have open thread and maintenance mode disabled
					const temp = isThread.split("-");
					const thread = {
						channelID: temp.shift(),
						threadTitle: temp.join("-")
					}
					return param.userReply.execute(param, message, thread);
				}
			}
		} else {
			const [, matchedPrefix] = message.content.match(prefixRegex);
			args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
			commandName = args.shift().toLowerCase();
		}
		// finding command that was triggered
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// user using prefix or mention bot, command name is invalid
		if (!command) return;
		console.log(`${message.author.tag}(${message.author.id}) called ${commandName} command.`);

		// cooldown more than 0
		if (config.cooldown > 0) {
			if (message.guild != null) {
				if(config.botChannelID != "empty" && message.channel.id != config.botChannelID && message.guild.id == config.mainServerID && message.guild.id != config.threadServerID) {
					return;
				} else {
					if (!cooldowns.has(command.name)) {
						cooldowns.set(command.name, new Discord.Collection());
					}

					now = Date.now();
					timestamps = cooldowns.get(command.name);
					cooldownAmount = config.cooldown * 1000;

					if (timestamps.has(message.author.id)) {
						const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

						if (now < expirationTime) {
							// Uncomment this if you want the bot send message when the cooldown isn\'t over
							/*
							const timeLeft = (expirationTime - now) / 1000;
							const embed = param.getEmbed.execute(param, config.info_color, "Cooldown", `${timeLeft.toFixed(1)} second(s).`)
							return message.reply(embed);
							*/
							return;
						}
					}

					timestamps.set(message.author.id, now);
					setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
				}
			} else {
				if (!cooldowns.has(command.name)) {
					cooldowns.set(command.name, new Discord.Collection());
				}

				now = Date.now();
				timestamps = cooldowns.get(command.name);
				cooldownAmount = config.cooldown * 1000;

				if (timestamps.has(message.author.id)) {
					const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

					if (now < expirationTime) {
						// Uncomment this if you want the bot send message when the cooldown isn\'t over
						/*
						const timeLeft = (expirationTime - now) / 1000;
						const embed = param.getEmbed.execute(param, config.info_color, "Cooldown", `${timeLeft.toFixed(1)} second(s).`)
						return message.reply(embed);
						*/
						return;
					}
				}

				timestamps.set(message.author.id, now);
				setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
			}
		}

		// maintenance mode
		if(config.maintenance == "1") {
			if(message.guild == null && authorID != config.botOwnerID) {
				// in Direct Message and not bot owner
				return message.channel.send(maintenanceEmbed);
			} else if(config.mainServerID == "empty" && config.threadServerID == "empty") {
				// the mainServerID and threadServerID empty
				if(authorID != config.botOwnerID && !message.member.hasPermission('ADMINISTRATOR')) {
					// not bot owner and doesn't have ADMINISTRATOR permission
					return message.channel.send(maintenanceEmbed);
				}
			} else if(config.mainServerID != "empty" && config.threadServerID != "empty") {
				// mainServerID and threadServerID isn't empty
				if(message.guild.id == config.mainServerID || message.guild.id == config.threadServerID) {
					// inside mainServerID or threadServerID
					if(authorID != config.botOwnerID && !message.member.hasPermission('ADMINISTRATOR') && !(await param.roleCheck.execute(message, config.adminRoleID))) {
						// not bot owner and user doesn't have ADMINISTRATOR permission nor have Admin role
						if(config.botChannelID != "empty" && message.channel.id != config.botChannelID) {
							return;
						} else {
							return message.channel.send(maintenanceEmbed);
						}
					}
				} else if(authorID != config.botOwnerID) {
					// outside mainServerID and threadServerID
					// not bot owner
					return message.channel.send(maintenanceEmbed);
				}
			}
		}

		// command is guildOnly, user trigger it inside Direct Message
		if(command.guildOnly && message.channel.type !== 'text' && message.author.id != config.botOwnerID) {
			const noDMEmbed = param.getEmbed.execute(param, config.error_color, "Command Unavailable", "This command can't be used inside Direct Message.");
			return message.channel.send(noDMEmbed);
		}

		// command need arguments to run, user did't gave any
		if(command.args && !args.length) {
			let description = "You didn't provide any arguments."

			if(command.usage) {
				description += `\n**Usage** : \`${config.prefix}${command.name} ${command.usage}\``;
			}
			if(command.note) {
				description += `\n**Note** : \`${command.note}\``;
			}

			const noArgsEmbed = param.getEmbed.execute(param, config.warning_color, "Missing Arguments", description);
			return message.channel.send(noArgsEmbed);
		}

		// command handler
		// trying to execute the command
		await command.execute(param, message, args);
	} catch (error) {
		// catching error -> log it in console -> send error message to user
		console.log(error);
		const errorEmbed = param.getEmbed.execute(param, config.error_color, "An Error Occured.", `**Contact bot Owner** : <@${config.botOwnerID}>\n**Error Name** : \`${error.name}\`\n**Error Message** : \`${error.message}\``);
		return message.channel.send(errorEmbed);
	}

});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOGIN~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

keepAlive();
client.login(process.env.TOKEN);
require("https").createServer().listen();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
