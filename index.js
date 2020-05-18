// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DEPENDENCIES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// #dependencies
console.log("[Loading Dependencies]");
const Discord = require("discord.js");
const { Util, MessageAttachment } = require("discord.js");
const client = new Discord.Client();
const server = require("./server.js");
const Sequelize = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const defConfig = require("./config.json");
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

// #configDB
const configDB = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "config.sqlite"
});
const ConfigDB = configDB.define("config", {
	name: {
		type: Sequelize.STRING,
		unique: true
	},
	input: Sequelize.STRING
});

// #blockedDB
const blockedDB = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "blocked.sqlite"
});
const BlockedDB = blockedDB.define("blocked", {
	userID: {
		type: Sequelize.STRING,
		unique: true
	},
	modID: Sequelize.STRING,
	reason: Sequelize.STRING
});

// #tagDB
const tagDB = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "tag.sqlite"
});
const TagDB = tagDB.define("tag", {
	name: {
		type: Sequelize.STRING,
		unique: true
	},
	content: Sequelize.STRING
});

// #threadDB
const threadDB = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "thread.sqlite"
});
const ThreadDB = configDB.define("thread", {
	userID: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	channelID: {
		type: Sequelize.STRING,
		unique: true
	},
	threadTitle: Sequelize.STRING
});

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
const activities = [];
function addActivities(getPrefix, threads) {
	if(getPrefix) {
		activities.push(`${threads.length} Threads | ${getPrefix.input}commands`);
		activities.push(`Send me a message | ${getPrefix.input }help`);
		activities.push(`Schick mir eine Nachricht | ${getPrefix.input}helpDE`);
		activities.push(`Bana mesaj gönder | ${getPrefix.input}helpTR`);
		activities.push(`나에게 메세지를 보내 | ${getPrefix.input}helpKR`);
		activities.push(`Me mande uma mensagem | ${getPrefix.input}helpPT`);
		activities.push(`Envoyez-moi un message | ${getPrefix.input}helpFR`);
		activities.push(`Пришлите мне сообщение | ${getPrefix.input}helpRU`);
		activities.push(`给我发一条信息 | ${getPrefix.input}helpCHS`);
		activities.push(`給我發一條信息 | ${getPrefix.input}helpCHT`);
		activities.push(`Envíeme un mensaje | ${getPrefix.input}helpES`);
	} else {
		activities.push(`- Restart Me -`);
	}
}

// #parameter
const param = {
	Discord,
	MessageAttachment,
	moment,
	client,
	ConfigDB,
	ThreadDB,
	TagDB,
	BlockedDB,
	config,
	defConfig,
	activities,
}
// add every functions to param object
client.functions.forEach(fn => param[fn.name] = client.functions.get(fn.name));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~READY~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

client.on('ready', async () => {
	console.log("[Syncing Database]");
	await BlockedDB.sync();
	await ConfigDB.sync();
	await TagDB.sync();
	await ThreadDB.sync();
	// cant make the bot waiting this guy below to finish pfft
	await param.configSync.execute(param);

	console.log(`Logged in as ${client.user.tag}!`);
	// when i use local variable (config.maintenance), the configSync() is still in process that's why i use database value for this.
	const getMaintenance = await ConfigDB.findOne({ where: { name: "maintenance" } }).catch(
		error => {console.log(error)}
	);
	const getPrefix = await ConfigDB.findOne({ where: { name: "prefix" } }).catch(
		error => {console.log(error)}
	);
	const threads = await ThreadDB.findAll({ attributes: ["userID"] }).catch(
		error => {console.log(error)}
	);

	let isMaintenance;
	if(!getMaintenance) {
		isMaintenance = "0";
	} else {
		isMaintenance = await getMaintenance.input;
	}

	addActivities(getPrefix, threads);

	if (isMaintenance == "0") {
		let index = 0;
		setInterval(() => {
			client.user.setActivity(activities[index]);
			index++;
			if (index == activities.length) index = 0;
		}, 7000);
	} else {
		// using timeout since i can't make the bot wait for configSync() function to finish :(
		setTimeout(()=> {
			client.user.setActivity("~ Under Maintenance ~");
		}, 10000);
	}
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
				const isThread = await ThreadDB.findOne({ where: { userID: message.author.id } });
				if(!isThread) {
					// User didn't have any open thread
					return;
				} else if(config.maintenance == "1" && authorID != config.botOwnerID) {
					// Maintenance mode enabled
					return message.channel.send(maintenanceEmbed);
				} else {
					// User have open thread and maintenance mode disabled
					return param.userReply.execute(param, message, isThread);
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

					const now = Date.now();
					const timestamps = cooldowns.get(command.name);
					const cooldownAmount = config.cooldown * 1000;

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

				const now = Date.now();
				const timestamps = cooldowns.get(command.name);
				const cooldownAmount = config.cooldown * 1000;

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

client.login(process.env.TOKEN);
require("https")
	.createServer()
	.listen();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
