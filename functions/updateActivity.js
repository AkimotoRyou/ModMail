module.exports = {
	name: "updateActivity",
	async execute(param) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const prefix = config.prefix;
		const activity = param.activity;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;

		const threads = await db.list(threadPrefix);
		const threadServer = client.guilds.cache.get(config.threadServerID);
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
		const activities = [
			`${threads.length}/${maxThreads} Active threads | ${prefix}commands`,
			`Send me a message | ${prefix}help`,
			`Schick mir eine Nachricht | ${prefix}helpDE`,
			`Bana mesaj gönder | ${prefix}helpTR`,
			`나에게 메세지를 보내 | ${prefix}helpKR`,
			`Me mande uma mensagem | ${prefix}helpPT`,
			`Envoyez-moi un message | ${prefix}helpFR`,
			`Пришлите мне сообщение | ${prefix}helpRU`,
			`给我发一条信息 | ${prefix}helpCHS`,
			`給我發一條信息 | ${prefix}helpCHT`,
			`Envíeme un mensaje | ${prefix}helpES`,
		];

		if (config.maintenance == 0) {
			client.user.setActivity(activities[activity.index]);
			activity.index++;
			if (activity.index == activities.length) activity.index = 0;
		}
		else {
			client.user.setActivity("~ Under Maintenance ~");
		}
		console.log(`> Activity Updated. Index : ${activity.index}`);
	},
};
