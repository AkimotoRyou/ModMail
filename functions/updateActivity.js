module.exports = {
	name: "updateActivity",
	async execute(param) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const prefix = config.prefix;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const locale = client.locale.get(config.language);

		const threads = await db.list(threadPrefix);
		const threadServerID = config.threadServerID;
		let threadServer = false;
		if(threadServerID && threadServerID !== "empty") {
			threadServer = await client.guilds.fetch(config.threadServerID);
		}
		let maxThreads = "";
		if (threadServer) {
			const categoryChannel = threadServer.channels.cache.get(config.categoryID);
			if (categoryChannel) {
				const childSize = categoryChannel.children.size;
				const threadSize = threads.length;
				maxThreads = 50 - (childSize - threadSize);
			}
			else {
				maxThreads = 0;
			}
		}
		else {
			maxThreads = 0;
		}
		const activity = locale.activity(prefix, threads.length, maxThreads);

		if (config.maintenance == 0) {
			client.user.setActivity(activity.default);
		}
		else {
			client.user.setActivity(activity.maintenance);
		}
		console.log("> Activity Updated.");
	},
};
