module.exports = {
	name: "thread",
	aliases: false,
	level: "Moderator",
	guildOnly: true,
	args: true,
	reqConfig: ["mainServerID"], // Configs needed to run this command.
	usage: ["<info|i|?> <userID>", "<list|l> [page number]"],
	description: "Show a user thread information or list of open thread(s).",
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const firstArg = args.shift();

		if(firstArg == "info" || firstArg == "i" || firstArg == "?") {
			const mainServerID = config.mainServerID;
			const mainServer = await client.guilds.cache.get(mainServerID);

			const userID = args.shift();
			const dbKey = threadPrefix + userID;
			const isThread = await db.get(dbKey);

			const noThreadEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", "Couldn't find any thread asociated with that user id.");

			if (!isThread) {
				console.log("> Thread not found.");
				return replyChannel.send(noThreadEmbed);
			}
			else {
				const threadData = [];
				const member = mainServer.members.cache.get(userID);

				const temp = isThread.split("-");
				const channelID = temp.shift();
				threadData.push(`${temp.join("-")}`);
				if (member) {
					threadData.push(`**User Tag** : \`${member.user.tag}\``);
				}
				else {
					threadData.push("**User Tag** : `Couldn't find user at main server.`");
				}
				threadData.push(`**User ID** : \`${userID}\``);
				threadData.push(`**Thread Channel** : <#${channelID}>`);

				const threadInfoEmbed = getEmbed.execute(param, "", config.info_color, "Thread Information", threadData.join("\n"));
				return replyChannel.send(threadInfoEmbed);
			}
		}
		else if(firstArg == "list" || firstArg == "l") {
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

			const listArray = threadlist.map(key => {
				const cleanKey = key.slice(threadPrefix.length);
				return `🔹 <@${cleanKey}> (\`${cleanKey}\`)`;
			});
			const firstIndex = Math.abs((pageNumber - 1) * 20);
			let listString = listArray.slice(firstIndex, firstIndex + 20).join("\n") || "`List empty.`";
			if (pages > 1) {
				listString += `\n\`Page ${pageNumber} from ${pages} pages\``;
			}
			else {
				listString += `\n\`Page ${pageNumber} from ${pages} page\``;
			}

			const listEmbed = getEmbed.execute(param, "", config.info_color, "Open Threads", listString);
			return replyChannel.send(listEmbed);
		}
	},
};
