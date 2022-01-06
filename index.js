// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DEPENDENCIES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

console.log("[Loading Dependencies]");
const defaultConfig = require("./defaultConfig.json");
const fs = require("fs");
const keepAlive = require("./server.js");
const process = require("process");
require("dotenv").config();
const { Client,	Collection,	Intents, MessageEmbed } = require("discord.js");

// Initialize bot client and the intents it's needed.
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.DIRECT_MESSAGES,
	],
	partials: [ "CHANNEL" ],
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VARIABLES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Variable to temporarily store bot configuration, blocked users id, and active threads so it can be accessed without invoking database commands.
const cmdDataList = [];
const config = {};
const blockList = [];
const tagList = {};
const threadList = [];
// Command cooldowns
client.cooldowns = new Collection();
// Variable to store dependencies, functions and variables to be easily accessed across files.
const param = {
	blockList,
	client,
	cmdDataList,
	Collection,
	config,
	defaultConfig,
	MessageEmbed,
	running: false,
	tagList,
	threadList,
	timestamp: "",
};

// Filtering command, event, function, and locale files from their respective folders.
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const functionFiles = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
const localeFiles = fs.readdirSync("./locale").filter(file => file.endsWith(".js"));

// Store language information in param client.
param["locale"] = {};
for (const file of localeFiles) {
	const locale = require(`./locale/${file}`);
	param.locale[locale.name] = locale;
	console.log(`> Stored ${locale.name} language to memory.`);
}

// Store commands code in bot client.
client.commands = new Collection();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Cycling through locale languages and store command in each language.
	Object.keys(param.locale).forEach(key => {
		const currentLang = param.locale[key];
		const localeName = currentLang.commands[command.name].name;
		cmdDataList.push({
			name: localeName,
			language: key,
			id: "-"
		});
		client.commands.set(localeName, command);
		console.log(`> Stored "${localeName}"[${command.name}] command to memory.`);
	});
}

// Store functions code in param variable.
for (const file of functionFiles) {
	const fn = require(`./functions/${file}`);
	param[fn.name] = fn;
	console.log(`> Stored ${fn.name} function to memory.`);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~EVENT HANDLER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Handling Discord Events.
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.disabled) continue;
	if (event.once) {
		client.once(event.name, async (...args) => await event.execute(param, ...args));
	}
	else {
		client.on(event.name, async (...args) => await event.execute(param, ...args));
	}
}
/* *
client
	.on("debug", console.log)
	.on("warn", console.log);
/* */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOGIN~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

keepAlive();
client.login(process.env.TOKEN);
require("https").createServer().listen();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
