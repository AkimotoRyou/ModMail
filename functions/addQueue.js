module.exports = {
	name: "addQueue",
	async execute(param, message, args) {
		const QueueDB = param.QueueDB;
		const config = param.config;
		const getEmbed = param.getEmbed;

		const data = [];

		const newQueue = await QueueDB.create({
			userID: message.author.id,
			messageID: message.id
		});
		console.log(`${message.author.tag} thread are queued.`);

		const queueList = await QueueDB.findAll();
		data.push(`**Queue Number** : ${queueList.length}`);
		const embed = getEmbed.execute(param, config.info_color, "Thread Queued", data.join('\n'));
		return message.channel.send(embed);
	}
}