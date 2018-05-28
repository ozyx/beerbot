const { OWNERS, BEERBOT_TOKEN } = process.env;
import * as path from "path";
import { CommandoClient } from "discord.js-commando";

// TODO: Find a better way to check if these are undefined.
if (OWNERS === undefined) {
    throw new Error("OWNERS environment variable must be defined!");
}

if (BEERBOT_TOKEN === undefined) {
    throw new Error("BEERBOT_TOKEN environment variable must be defined!");
}

const client: CommandoClient = new CommandoClient({
    owner: OWNERS.split(","),
});

client.registry.registerDefaults()
    .registerCommandsIn(path.join(__dirname, "commands"));

client.on("ready", () => {
    console.log(`[READY] Logged in as ${client.user.tag}! (${client.user.id})`);
});

client.login(BEERBOT_TOKEN);

process.on("unhandledRejection", err => {
	console.error("[FATAL] Unhandled Promise Rejection.", err);
	process.exit(1);
});