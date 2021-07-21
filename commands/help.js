module.exports = {
	name: "help",
	aliases: ["h", "?", "助攻", "helpch", "hilfe", "helpde", "ayuda", "helpes", "aide", "helpfr", "도움", "helpkr", "ajuda", "helppt", "помощь", "helpru", "yardım", "helptr"],
	level: "User",
	guildOnly: false,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	usage: ["<command name>"],
	description: "Short instruction on how to create a new thread or info on a specific command.",
	note: "Command name case is insensitive (upper case and lower case are same).",
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const data = [];
		const commands = param.client.commands;
		const config = param.config;
		const prefix = config.prefix;
		const getEmbed = param.getEmbed;
		const commandName = param.cmdName;
		replyChannel = message.channel;

		const notCmdEmbed = getEmbed.execute(param, "", config.warning_color, "Not a Command", `That's not a valid command name or alias.\nUse \`${prefix}commands\` to show available commands.`);
		let helpEmbed;

		if(!args.length) {
			switch(commandName) {
			case "助攻" : // fallthrough
			case "helpch" : {
				helpEmbed = getEmbed.execute(param, "", config.info_color, "指令", `在“直接消息”中，使用\`${prefix}new 您的线程标题在这里\`创建一个新线程（显示“**Thread Created!**”）。创建线程后，无需使用任何命令。然后描述你的问题。`);
				break;
			}
			case "hilfe" : // fallthrough
			case "helpde" : {
				helpEmbed = getEmbed.execute(param, "", config.info_color, "Anweisung", `In Direktnachrichten, Verwenden Sie \`${prefix}new Dein Threadtitel hier\`, um einen neuen Thread zu erstellen (es wird **Thread Created!** Angezeigt). Sie müssen nach dem Erstellen Ihres Threads keinen Befehl mehr verwenden. Beschreiben Sie anschließend Ihr Problem.`);
				break;
			}
			case "ayuda" : // fallthrough
			case "helpes" : {
				helpEmbed = getEmbed.execute(param, "", config.info_color, "Instrucción", `En un mensaje privado, utilice \`${prefix}new el tema de su problema\` para crear un nuevo ticket (se muestra **Thread Created!**). No necesita usar ningún comando después de la creación del ticket. Luego describe su problema.`);
				break;
			}
			case "aide" : // fallthrough
			case "helpfr" : {
				helpEmbed = getEmbed.execute(param, "", config.info_color, "Instruction", `En message privé, utilisez \`${prefix}new le sujet de votre problème\` pour créer un nouveau ticket (**Thread Created!** s'affiche). Vous n'avez pas besoin d'utiliser de commande après la création du ticket. Décrivez ensuite votre problème.`);
				break;
			}
			case "도움" : // fallthrough
			case "helpkr" : {
				helpEmbed = getEmbed.execute(param, "", config.info_color, "훈령", `직접 메시지에서\`${prefix}new 스레드 제목은 여기\`를 사용하여 새 스레드를 만듭니다 (**Thread Created!**가 표시됨). 스레드가 작성된 후 명령을 사용할 필요가 없습니다. 그런 다음 문제를 설명하십시오.`);
				break;
			}
			case "ajuda" : // fallthrough
			case "helppt" : {
				helpEmbed = getEmbed.execute(param, "", config.info_color, "Instrução", `Na mensagem direta, usar \`${prefix}new Título do assunto\` para criar um novo tópico (**Thread Created!** é exibido). Não precisa de usar nenhum comando depois de criar o seu tópico. Em seguida, descreva o seu problema.`);
				break;
			}
			case "помощь" : // fallthrough
			case "helpru" : {
				helpEmbed = getEmbed.execute(param, "", config.info_color, "инструкция", `В прямом сообщении используйте \`${prefix}new Ваше название темы здесь\`, чтобы создать новую тему (**Thread Created!** Отображается). Вам не нужно использовать какую-либо команду после создания вашего потока. Тогда опишите свою проблему.`);
				break;
			}
			case "yardım" : // fallthrough
			case "helptr" : {
				helpEmbed = getEmbed.execute(param, "", config.info_color, "Talimat", `Doğrudan Mesaj'da, yeni bir bilet oluşturmak için \`${prefix}new konuyu buraya yazın\` yazın ve gönderin (**Thread Created!** görüntülenir). Konuyu oluşturduktan sonra herhangi bir komut kullanmanıza gerek yoktur. Daha sonra sorununuzu açıklayın.`);
				break;
			}
			default: {
				helpEmbed = getEmbed.execute(param, "", config.info_color, "Instruction", `In Direct Message, use \`${prefix}new Your thread title here\` to create a new thread (**Thread Created!** will be displayed). You don't need to use any command after your thread created. Describe your issue afterward.`);
				break;
			}
			}
			return replyChannel.send(helpEmbed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

		if(!command) {
			console.log("> Not a command name or alias.");
			return replyChannel.send(notCmdEmbed);
		}

		data.push(`**Name** : ${command.name}`);
		if (command.aliases) data.push(`**Aliases** : ${command.aliases.join(", ")}`);
		if (command.level) data.push(`**Required Level** : ${command.level}`);
<<<<<<< HEAD
		data.push(`**Guild Only** : ${command.guildOnly}`);
		if (command.reqConfig) data.push(`**Required Config** : ${command.reqConfig.map(key => `\`${key}\``).join(", ")}`);
=======
		if(command.guildOnly) {
			data.push("**Direct Message** : false");
		}
		else {
			data.push("**Direct Message** : true");
		}
>>>>>>> d2f9d550a17c80193425c3e5027cdf13aed67d0c
		const usages = [];
		if(!command.args) usages.push(`\`${prefix}${command.name}\``);
		if(command.usage) {
			command.usage.forEach(key => {
				usages.push(`\`${prefix}${command.name} ${key}\``);
			});
		}
		data.push(`**Usage** : ${usages.join(", ")}`);
		if (command.description) data.push(`**Description** : ${command.description}`);
		if (command.note) data.push(`**Note** : \`${command.note}\``);

		const dataEmbed = getEmbed.execute(param, "", config.info_color, "Command Info", data.join("\n"));
		return replyChannel.send(dataEmbed);
	},
};
