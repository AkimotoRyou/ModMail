module.exports = {
	name: 'helpchs',
	aliases: ['助攻'],
	level: 'User',
	guildOnly: false,
	args: false,
	usage: false,
	description: '显示如何使用操作这个系统的说明.',
	note: false,
	async execute(param, message, args) {
		const config = param.config;
		const prefix = config.prefix;
		const getEmbed = param.getEmbed;

		const helpEmbed = getEmbed.execute(param, config.info_color, "指令", `在“直接消息”中，使用\`${config.prefix}new 您的线程标题在这里\`创建一个新线程（显示“**Thread Created!**”）。创建线程后，无需使用任何命令。然后描述你的问题。`);

		return message.channel.send(helpEmbed);

	}
};
