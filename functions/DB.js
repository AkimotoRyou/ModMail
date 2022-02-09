/*
	* ~~~~~~~~~~~~~~~~~~~~~~~ Start of ReplDB Section ~~~~~~~~~~~~~~~~~~~~~~~~~~
	* ReplDB - Uncomment this section and comment Sequelize section to use.
	* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Remove / char to comment, add it to uncomment ➡️ */

const Database = require("@replit/database");
const ReplDB = new Database();

// Character pattern used to separate data that are stored in one variable.
const separator = "[=]";
// Database prefix, used to indicate what category the data belong to since ReplDB doesn't allow multiple table creation.
const dbPrefix = {
	block: "blc.",
	config: "cfg.",
	tag: "tag.",
	thread: "thr.",
};
const del = async (dbKey) => {
	return await ReplDB.delete(dbKey);
};
const list = async (prefix) => {
	const output = await ReplDB.list(prefix);
	// Slicing the prefix to create clean output.
	return output.map(key => key.slice(prefix.length));
};
const empty = async () => {
	return await ReplDB.empty();
};
const sync = () => {
	return;
};
const block = {
	async set(userID, modID, reason) {
		const dbKey = dbPrefix.block + userID;
		const value = `${modID}${separator}${reason}`;
		return await ReplDB.set(dbKey, value);
	},
	async get(target) {
		const dbKey = dbPrefix.block + target;
		let dbData = await ReplDB.get(dbKey);
		dbData = dbData.split(separator);
		return {
			userID: target,
			modID: dbData.shift(),
			reason: dbData.join(separator),
		};
	},
	async del(target) {
		return await del(dbPrefix.block + target);
	},
	async list() {
		return await list(dbPrefix.block);
	},
};
const config = {
	async set(name, value) {
		const dbKey = dbPrefix.config + name;
		return await ReplDB.set(dbKey, value);
	},
	async get(target) {
		const dbKey = dbPrefix.config + target;
		const dbData = await ReplDB.get(dbKey);
		return {
			name: target,
			value: dbData,
		};
	},
	async del(target) {
		return await del(dbPrefix.config + target);
	},
	async list() {
		return await list(dbPrefix.config);
	}
};
const tag = {
	async set(name, modID, content) {
		const dbKey = dbPrefix.tag + name;
		const value = `${modID}${separator}${content}`;
		return await ReplDB.set(dbKey, value);
	},
	async get(target) {
		const dbKey = dbPrefix.tag + target;
		let dbData = await ReplDB.get(dbKey);
		dbData = dbData.split(separator);
		return {
			name: target,
			modID: dbData.shift(),
			content: dbData.join(separator),
		};
	},
	async del(target) {
		return await del(dbPrefix.tag + target);
	},
	async list() {
		return await list(dbPrefix.tag);
	}
};
const thread = {
	async set(userID, channelID, language, title) {
		const dbKey = dbPrefix.thread + userID;
		const value = `${channelID}${separator}${language}${separator}${title}`;
		return await ReplDB.set(dbKey, value);
	},
	async get(target) {
		const dbKey = dbPrefix.thread + target;
		let dbData = await ReplDB.get(dbKey);
		dbData = dbData.split(separator);
		return {
			userID: target,
			channelID: dbData.shift(),
			language: dbData.shift(),
			title: dbData.join(separator),
		};
	},
	async del(target) {
		return await del(dbPrefix.thread + target);
	},
	async list() {
		return await list(dbPrefix.thread);
	}
};
/* ~~~~~~~~~~~~~~~~~~~~~~~~~ End of ReplDB Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*
	* ~~~~~~~~~~~~~~~~~~~~~~ Start of Sequelize Section ~~~~~~~~~~~~~~~~~~~~~~~~
	* Sequelize - Uncomment this section and comment ReplDB section to use.
	* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Remove / char to comment, add it to uncomment ➡️ *

const Sequelize = require("sequelize");
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "database.sqlite"
});
const Block = sequelize.define("block", {
	userID: {
		type: Sequelize.STRING,
		unique: true,
	},
	modID: Sequelize.STRING,
	reason: Sequelize.TEXT,
});
const Config = sequelize.define("config", {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	value: Sequelize.STRING,
}, {
	timestamps: false,
});
const Tag = sequelize.define("tag", {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	modID: Sequelize.STRING,
	content: Sequelize.TEXT,
});
const Thread = sequelize.define("thread", {
	userID: {
		type: Sequelize.STRING,
		unique: true,
	},
	channelID: Sequelize.STRING,
	language: Sequelize.STRING,
	title: Sequelize.TEXT,
});
const sync = async function() {
	return await sequelize.sync();
};
const empty = async function() {
	return await sequelize.sync({ force: true });
};
const block = {
	async set(inputUID, inputMID, inputReason) {
		const blockData = await Block.findOne({ where: { userID: inputUID } });
		if (blockData) {
			return await Block.Update({ modID: inputMID, reason: inputReason }, { where: { userID: inputUID } });
		}
		return await Block.create({ userID: inputUID, modID: inputMID, reason: inputReason });
	},
	async get(target) {
		return await Block.findOne({ where: { userID: target } });
	},
	async del(target) {
		return await Block.destroy({ where: { userID: target } });
	},
	async list() {
		const blockList = await Block.findAll({ attributes: ["userID"] });
		return blockList.map(key => key.userID);
	},
};
const config = {
	async set(inputName, inputValue) {
		const configData = await Config.findOne({ where: { name: inputName } });
		if (configData) {
			return await Config.Update({ value: inputValue }, { where: { name: inputName } });
		}
		return await Config.create({ name: inputName, value: inputValue });
	},
	async get(target) {
		return await Config.findOne({ where: { name: target } });
	},
	async del(target) {
		return await Config.destroy({ where: { name: target } });
	},
	async list() {
		const configList = await Config.findAll({ attributes: ["name"] });
		return configList.map(key => key.name);
	},
};
const tag = {
	async set(inputName, inputMID, inputContent) {
		const tagData = await Tag.findOne({ where: { name: inputName } });
		if (tagData) {
			return await Tag.Update({ modID: inputMID, content: inputContent }, { where: { name: inputName } });
		}
		return await Tag.create({ name: inputName, modID: inputMID, content: inputContent });
	},
	async get(target) {
		return await Tag.findOne({ where: { name: target } });
	},
	async del(target) {
		return await Tag.destroy({ where: { name: target } });
	},
	async list() {
		const tagList = await Tag.findAll({ attributes: ["name"] });
		return tagList.map(key => key.userID);
	},
};
const thread = {
	async set(inputUID, inputCID, inputLang, inputTitle) {
		const threadData = await Thread.findOne({ where: { userID: inputUID } });
		if (threadData) {
			return await Thread.Update({ channelID: inputCID, language: inputLang, title: inputTitle }, { where: { userID: inputUID } });
		}
		return await Thread.create({ userID: inputUID, channelID: inputCID, language: inputLang, title: inputTitle });
	},
	async get(target) {
		return await Thread.findOne({ where: { userID: target } });
	},
	async del(target) {
		return await Thread.destroy({ where: { userID: target } });
	},
	async list() {
		const threadList = await Thread.findAll({ attributes: ["userID"] });
		return threadList.map(key => key.userID);
	},
};
/* ~~~~~~~~~~~~~~~~~~~~~~~~ End of Sequelize Section ~~~~~~~~~~~~~~~~~~~~~~~~~*/

module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "DB",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	block, config, tag, thread, empty,
	/* For Sequelize */
	sync
	/* */
};
