module.exports = {
	name: "threadlist",
	async execute(param, message, args) {
		const moment = param.moment;
		const client = param.client;
		const config = param.config;
		const ThreadDB = param.ThreadDB;
		const getEmbed = param.getEmbed;

		let pageNumber = args.shift();

		const threadlist = await ThreadDB.findAll({ attributes: ["userID", "createdAt"] });
		let pages = Math.floor(threadlist.length / 20);
		if (threadlist.length % 20 != 0) {
			// add 1 number of pages if residual quotient is not 0 (15%10=5 -> 5 > 0)
			pages += 1;
		}
		if (threadlist.length == 0) {
			pageNumber = 0;
		} else if(!pageNumber || isNaN(pageNumber) || pageNumber <= 0) {
			// user didn't gave input or input is not a number or input is below or same as 0
			pageNumber = 1;
		} else if(pageNumber > pages) {
			// input is higher than the number of pages
			pageNumber = pages;
		}

		const listArray = threadlist.map(thread =>`🔹 **[${moment(thread.createdAt).format("D MMM YYYY")}]** <@${thread.userID}> (\`${thread.userID}\`)`);
		const firstIndex = Math.abs((pageNumber - 1) * 20);
		let listString = listArray.slice(firstIndex, firstIndex + 20).join("\n") || `\`List empty.\``;
		if (pages > 1) {
			listString += `\n\`Page ${pageNumber} from ${pages} pages\``;
		} else {
			listString += `\n\`Page ${pageNumber} from ${pages} page\``;
		}

		const listEmbed = getEmbed.execute(param, config.info_color, "Open Threads", listString);
		return message.channel.send(listEmbed);

	}
};
