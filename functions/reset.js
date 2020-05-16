module.exports = {
	name: "reset",
	async execute(param) {
		const defConfig = param.defConfig;
		const ConfigDB = param.ConfigDB;
		const configKeys = Object.keys(param.config);

		configKeys.forEach(async aKey => {
			try {
				// Create new row on config.sqlite
				const newConfig = await ConfigDB.create({
					name: aKey,
					input: defConfig[aKey]
				});
			} catch (error) {
				// Edit the value in config.sqlite with the one from config.js
				if (error.name === "SequelizeUniqueConstraintError") {
					await ConfigDB.update(
						{ input: defConfig[aKey] },
						{ where: { name: aKey } }
					);
				}
			}
		});
		return param.configSync.execute(param);
	}
};
