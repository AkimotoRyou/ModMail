module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "dbSync",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	async execute(param) {
		// Syncing config values.
		const { DB, client, config, defaultConfig, reset, cmdDataList, tagList, updateActivity } = param;
		/* For Sequelize, ReplDB doesn't need to be synced thus the function just return undefined. */
		await DB.sync();
		/* */
		const keys = Object.keys(defaultConfig);
		for (const key of keys) {
			const dbData = await DB.config.get(key);
			if (!dbData || !dbData.value) await reset.execute(param, key);
			else config[key] = dbData.value;
			console.log(`> ${key} value synced (${dbData?.value || "-"}).`);
		}
		// Syncing blocked users list.
		const dbBlock = await DB.block.list();
		if (dbBlock.length !== 0) {
			param.blockList = dbBlock;
			console.log("> BlockList synced.");
		}
		const dbTag = await DB.tag.list();
		if (dbTag.length !== 0) {
			for (const key of dbTag) {
				const dbData = await DB.tag.get(key);
				tagList[key] = dbData.content;
			}
			console.log("> TagList synced.");
		}
		// Syncing active threads list.
		const dbThread = await DB.thread.list();
		if (dbThread.length !== 0) {
			const data = [];
			for (const key of dbThread) {
				const dbData = await DB.thread.get(key);
				data.push(dbData);
			}
			param.threadList = data;
			console.log("> ThreadList synced.");
		}
		// Syncing commands id.
		const globalCommands = await client.application?.commands?.fetch();
		const threadServer = client.guilds.cache.get(config.threadServerID);
		const guildCommands = await threadServer?.commands?.fetch();
		if (globalCommands && globalCommands.size !== 0) {
			for (const key of globalCommands) {
				const [, data] = key;
				const getData = cmdDataList.find(cmd => cmd.name == data.name);
				if (getData && data) {
					getData.id = data.id;
					console.log(`> Synced ${data.name} global command id.`);
				}
			}
		}
		if (guildCommands && guildCommands.size !== 0) {
			for (const key of guildCommands) {
				const [, data] = key;
				const getData = cmdDataList.find(cmd => cmd.name == data.name);
				if (getData && data) {
					getData.id = data.id;
					console.log(`> Synced ${data.name} guild command id.`);
				}
			}
		}
		await updateActivity.execute(param);
	},
};
