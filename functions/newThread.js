module.exports = {
	name: "newThread",
	async execute(param, message, args) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const MessageAttachment = param.MessageAttachment;
		const client = param.client;
		const config = param.config;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const getEmbed = param.getEmbed;
		const updateActivity = param.updateActivity;
		const author = message.author;

		const mainServer = await client.guilds.fetch(config.mainServerID);
		const threadServer = await client.guilds.fetch(config.threadServerID);
		const logChannel = await threadServer.channels.cache.get(config.logChannelID);
		const mentionedRoleID = config.mentionedRoleID;
		const categoryID = config.categoryID;

		let mentionedRole = "";
		if (mentionedRoleID == "everyone" || mentionedRoleID == "here") {
			mentionedRole = "@" + mentionedRoleID;
		}
		else if (config.mentionedRoleID != null && config.mentionedRoleID != "empty") {
			mentionedRole = "<@&" + mentionedRoleID + ">";
		}

		const channelName = author.tag.replace(/[^0-9a-z]/gi, "") + `-${author.id}`;
		const newChannel = await threadServer.channels.create(channelName, { type: "text" });
		await newChannel.setParent(categoryID).then(chnl => chnl.lockPermissions());

		const threadTitle = args.join(" ");
		const member = await mainServer.members.fetch(author.id);
		const memberRoles = await member.roles.cache.filter(role => role.name != "@everyone").map(role => `<@&${role.id}>` || "none").join(", ");
		const newThread = param.locale.newThread(param.moment, threadTitle, member, memberRoles);

		const logEmbed = getEmbed.execute(param, "", config.info_color, newThread.title, threadTitle, "", author);
		logChannel.send(logEmbed);

		const dmEmbed = getEmbed.execute(param, "", config.info_color, newThread.created.title, newThread.created.description, "", mainServer);
		author.send(dmEmbed);

		const newThreadEmbed = getEmbed.execute(param, "", config.info_color, newThread.title, `${threadTitle}\n${newThread.info}`, "", author, author.displayAvatarURL());
		await newChannel.send(mentionedRole, newThreadEmbed);
		if (message.attachments.size > 0) {
			await message.attachments.forEach(async atch => {
				const attachment = new MessageAttachment(atch.url);
				await newChannel.send(attachment);
			});
		}

		await db.set(threadPrefix + author.id, `${newChannel.id}-${args.join(" ")}`).then(() => console.log("> Thread Created!"));
		await updateActivity.execute(param);

	},
};
