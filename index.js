// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DEPENDENCIES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// #dependencies
console.log("[Loading Dependencies]");
const Discord = require("discord.js");
const { MessageAttachment } = require("discord.js");
const client = new Discord.Client();
const keepAlive = require("./server.js");
const fs = require("fs");
const process = require("process");
const moment = require("moment");
const defConfig = require("./config.json");
const Database = require("@replit/database");
const db = new Database();
require("dotenv").config();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DATABASE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Database prefix, needed since replitDB save database in one file.
const dbPrefix = {
	block: "bck.",
	config: "cfg.",
	thread: "trd.",
	tag: "tag.",
};

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VARIABLES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

console.log("[Loading Variables]");

// #config (synced with database, saved in memory so the bot can access it faster)
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
	sent_color: "",
};

// #activities
const activity = {
	index: 0,
};

// #commandsCollection save commands in memory
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const cmd = require(`./commands/${file}`);
	client.commands.set(cmd.name, cmd);
}

// #functionsCollection save functions in memory
client.functions = new Discord.Collection();
const functionFiles = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
for (const file of functionFiles) {
	const func = require(`./functions/${file}`);
	client.functions.set(func.name, func);
}

// #cooldownCollection save cooldowns in memory
const cooldowns = new Discord.Collection();

// #parameter
const param = {
	activity,
	client,
	cmdName: "",
	commandName : "",
	config,
	cooldowns,
	db,
	dbPrefix,
	defConfig,
	Discord,
	isOwner : false,
	isAdmin : false,
	isModerator : false,
	MessageAttachment,
	moment,
	process,
};
// add every functions to param object
client.functions.forEach(fn => param[fn.name] = client.functions.get(fn.name));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~EVENT HANDLER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

fs.readdir("./events/", (err, files) => {
	if(err) return console.log(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		const eventName = event.name || file.split(".")[0];

		if(event.disabled) return console.log(`> ${eventName} is disabled.`);

		try {
			client[event.once ? "once" : "on"](eventName, async (...args) => await event.execute(param, ...args));
		}
		catch (error) {
			console.log(error.stack);
		}
	});
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOGIN~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

keepAlive();
client.login(process.env.TOKEN);
require("https").createServer().listen();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
