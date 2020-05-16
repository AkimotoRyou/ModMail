module.exports = {
	name: 'helpde',
	aliases: ['hilfe'],
	level: 'User',
	guildOnly: false,
	args: false,
	usage: false,
	description: 'Anleitung zur Verwendung des Bots anzeigen.',
	note: false,
	async execute(param, message, args) {
		const config = param.config;
		const prefix = config.prefix;
		const getEmbed = param.getEmbed;

		const helpEmbed = getEmbed.execute(param, config.info_color, "Anweisung", `In Direktnachrichten, Verwenden Sie \`${config.prefix}new Dein Threadtitel hier\`, um einen neuen Thread zu erstellen (es wird **Thread Created!** Angezeigt). Sie müssen nach dem Erstellen Ihres Threads keinen Befehl mehr verwenden. Beschreiben Sie anschließend Ihr Problem.`);

		return message.channel.send(helpEmbed);

	}
};
