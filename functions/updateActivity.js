module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "updateActivity",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	async execute(param) {
		const { client, config, threadList } = param;
		const { maintenance, threadServerID } = config;
		const locale = param.locale[config.language];
		let activity;

		if (!locale) {
			activity = "Invalid Locale";
		}
		else if (maintenance === "1") {
			activity = locale.activity.maintenance;
		}
		else if (threadServerID && threadServerID !== "-") {
			const threadServer = await client.guilds.fetch(config.threadServerID);
			const categoryChannel = threadServer.channels.cache.get(config.categoryID);
			if (categoryChannel) {
				const childSize = categoryChannel.children.size;
				const threadSize = threadList.length;
				const maxThreads = 50 - (childSize - threadSize);
				activity = locale.activity.thread(threadList.length, maxThreads);
			}
		}
		else {
			activity = locale.activity.ready;
		}
		await client.user.setActivity(activity);
		console.log("> Activity Updated.");
	},
};
