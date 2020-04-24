module.exports = {
	name: 'helpfr',
  aliases: ['aide'],
  level: 'User',
  guildOnly: false,
	args: false,
  usage: false,
	description: 'Afficher les instructions sur l\'utilisation du bot.',
	note: false,
	async execute(param, message, args){
    const config = param.config;
    const prefix = config.prefix;
    const getEmbed = param.getEmbed;

		const helpEmbed = getEmbed.execute(param, config.info_color, "Instruction", `En message privé, utilisez \`${config.prefix}new le sujet de votre problème\` pour créer un nouveau ticket (**Thread Created!** s'affiche). Vous n'avez pas besoin d'utiliser de commande après la création du ticket. Décrivez ensuite votre problème.`);

    return message.channel.send(helpEmbed);

  }
};
