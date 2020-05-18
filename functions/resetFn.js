module.exports = {
	name: "reset",
	async execute(param) {
		const defConfig = param.defConfig;
		const ConfigDB = param.ConfigDB;
		const configKeys = Object.keys(param.config);

		const resetPromise = new Promise(resolve => {
			async function forLoop() {
				for (let i = 0; i < configKeys.length; i++) {
					try {
						// Create new row on config.sqlite
						console.log(`Trying to add ${configKeys[i]} to Database`);
						await ConfigDB.create({
							name: configKeys[i],
							input: defConfig[configKeys[i]]
						});
					} catch (error) {
						// Edit the value in config.sqlite with the one from config.js
						if (error.name === "SequelizeUniqueConstraintError") {
							console.log(`Updating ${configKeys[i]} to ${defConfig[configKeys[i]]}`);
							await ConfigDB.update(
								{ input: defConfig[configKeys[i]] },
								{ where: { name: configKeys[i] } }
							);
						}
					}
				}
				resolve();
			}
			forLoop();
		});
		resetPromise.then(() => {
			return param.configSync.execute(param);
		});
	}
};
