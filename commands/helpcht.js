module.exports = {
	name: 'helpcht',
	aliases: ['助攻'],
	level: 'User',
	guildOnly: false,
	args: false,
	usage: false,
	description: '顯示如何使用操作這個系統的說明.',
	note: false,
	async execute(param, message, args) {
		const config = param.config;
		const prefix = config.prefix;
		const getEmbed = param.getEmbed;

		const helpEmbed = getEmbed.execute(param, config.info_color, "指令", `在“直接消息”中，使用\`${config.prefix}new 您的線程標題在這裡\`創建一個新線程（顯示“**Thread Created!**”）。創建線程後，無需使用任何命令。然後描述你的問題。`);

		return message.channel.send(helpEmbed);

	}
};
