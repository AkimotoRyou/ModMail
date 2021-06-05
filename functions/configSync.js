module.exports = {
	name: "configSync",
	async execute(param) {
		const defConfig = param.defConfig;
		const config = param.config;
		const ConfigDB = param.ConfigDB;
		const user = param.client.user;

		console.log("[Syncing Configuration]");
		const configKeys = Object.keys(config);
		const syncPromise = new Promise(resolve => {
			try {
				async function forLoop() {
					for (let i = 0; i < configKeys .length; i++) {
						ConfigDB.get(configKeys[i]).then(async value => {
							if(!value) {
								console.log(`Resetting ${configKeys[i]} value.`);
								await ConfigDB.set(configKeys[i], defConfig[configKeys[i]]);
								value = await ConfigDB.get(configKeys[i]);
							}
							console.log(`Syncing ${configKeys[i]}...`);
							config[configKeys[i]] = value || "empty";
						});
					}
					resolve();
				}
				forLoop();
			} catch (error) {
				return console.log(error);
			}
		});
		syncPromise.then(() => {
			console.log("[Synced]");
		});
	}
};
