import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

export default class FindBeerCommand extends Command {
    constructor(client: CommandoClient) {
        const commandName = "findbeer";
        super(client, {
            aliases: ["fb"],
            description: "Look up a beer on Untappd by name or ID",
            examples: [`${commandName}`],
            group: "untappd",
            guildOnly: true,
            memberName: "find-beer",
            name: commandName,
        });
    }

    public async run(message: CommandMessage, args: object, fromPattern: boolean): Promise<(Message|Message[])> {
        return message.channel.send("WIP!");
    }
}
