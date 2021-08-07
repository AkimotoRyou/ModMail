module.exports = {
	name: "thread",
	aliases: [],
	level: "Moderator",
	guildOnly: true,
	args: true,
	reqConfig: ["mainServerID"], // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const locale = param.locale;
		const firstArg = args.shift().toLowerCase();

		if(locale.info.includes(firstArg)) {
			const mainServerID = config.mainServerID;
			const mainServer = await client.guilds.cache.get(mainServerID);

			const userID = args.shift();
			const dbKey = threadPrefix + userID;
			const isThread = await db.get(dbKey);
			const threadInfo = locale.threadInfo;

			const noThreadEmbed = getEmbed.execute(param, "", config.error_color, locale.notFound, locale.noThread.user);

			if (!isThread) {
				console.log("> Thread not found.");
				return replyChannel.send(noThreadEmbed);
			}
			else {
				const threadData = [];
				const member = await mainServer.members.fetch(userID);

				const temp = isThread.split("-");
				const channelID = temp.shift();
				threadData.push(`${temp.join("-")}`);
				if (member) {
					threadData.push(`**${threadInfo.userTag}** : \`${member.user.tag}\``);
				}
				else {
					threadData.push(`**${threadInfo.userTag}** : ${threadInfo.noUser}`);
				}
				threadData.push(`**${threadInfo.userID}** : \`${userID}\``);
				threadData.push(`**${threadInfo.threadCh}** : <#${channelID}>`);

				const threadInfoEmbed = getEmbed.execute(param, "", config.info_color, threadInfo.title, threadData.join("\n"));
				return replyChannel.send(threadInfoEmbed);
			}
		}
		else if(locale.list.includes(firstArg)) {
			let pageNumber = args.shift();

			const threadlist = await db.list(threadPrefix);
			let pages = Math.floor(threadlist.length / 20);
			if (threadlist.length % 20 != 0) {
			// add 1 number of pages if residual quotient is not 0 (15%10=5 -> 5 > 0)
				pages += 1;
			}
			if (threadlist.length == 0) {
				pageNumber = 0;
			}
			else if(!pageNumber || isNaN(pageNumber) || pageNumber <= 0) {
			// user didn't gave input or input is not a number or input is below or same as 0
				pageNumber = 1;
			}
			else if(pageNumber > pages) {
			// input is higher than the number of pages
				pageNumber = pages;
			}

			const pagedList = locale.pagedList(pages, pageNumber);
			const listArray = threadlist.map(key => {
				const cleanKey = key.slice(threadPrefix.length);
				return `🔹 <@${cleanKey}> (\`${cleanKey}\`)`;
			});
			const firstIndex = Math.abs((pageNumber - 1) * 20);
			const listString = listArray.slice(firstIndex, firstIndex + 20).join("\n") || locale.emptyList;

			const listEmbed = getEmbed.execute(param, "", config.info_color, pagedList.threadList, listString, "", pagedList.footer);
			return replyChannel.send(listEmbed);
		}
	},
};
