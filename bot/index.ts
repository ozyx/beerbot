import { CommandoClient } from "discord.js-commando";
import * as path from "path";
import { Logger } from "./utility/logger";

// Get environment variables
const { OWNERS, BEERBOT_TOKEN } = process.env;

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

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ["util", "Utility"],
        ["commands", "Command Management"],
        ["info", "Discord Information"],
        ["untappd", "Untappd commands"],
        ["fun", "Just for fun!"],
        ["admin", "Admin commands"],
    ])
    .registerDefaultCommands({
        eval_: false,
    })
    .registerCommandsIn(path.join(__dirname, "commands"));

client.on("ready", () => {
    Logger.log(`[READY] Logged in as ${client.user.tag}! (${client.user.id})`);
});

client.on("disconnect", (event) => {
    Logger.log(`[DISCONNECT] Disconnected with code ${event.code}.`);
    process.exit(0);
});

client.on("commandRun", (command) => Logger.log(`[COMMAND] Ran command ${command.groupID}:${command.memberName}.`));

client.login(BEERBOT_TOKEN);

process.on("unhandledRejection", (err) => {
    Logger.log("[FATAL] Unhandled Promise Rejection.", err);
    process.exit(1);
});
