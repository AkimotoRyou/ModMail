module.exports = {
	name: "isBlocked",
	async execute(param, userID) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const db = param.db;
		const blockPrefix = param.dbPrefix.block;
		const isBlocked = await db.get(blockPrefix + userID);

		if(isBlocked) {
			return true;
		}
		else {
			return false;
		}
	},
};
