module.exports = {
	name: "configSync",
	async execute(param) {
		const defConfig = param.defConfig;
		const config = param.config;
		const db = param.db;
		const configPrefix = param.dbPrefix.config;

		console.log("[Syncing Configuration]");
		const configKeys = Object.keys(config);
		const dbKeys = await db.list(configPrefix);
		const syncPromise = new Promise(resolve => {
			try {
				async function forLoop() {
					for (let i = 0; i < configKeys .length; i++) {
						const dbKey = configPrefix + configKeys[i];
						if(!dbKeys.includes(dbKey)){
							console.log(`Resetting ${dbKey} value to ${defConfig[configKeys[i]]}.`);
							await db.set(dbKey, defConfig[configKeys[i]]);
						}
						db.get(dbKey).then(async value => {
							console.log(`Syncing ${configKeys[i]}: ${value}`);
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
