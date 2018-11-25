import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import figlet = require("figlet");

export default class AsciiCommand extends Command {

    constructor(client: CommandoClient) {
        const commandName = "ascii";
        super(client, {
            aliases: ["a"],
            description: "Turn text into Ascii Art!",
            examples: [`${commandName} {message}`],
            group: "fun",
            guildOnly: true,
            memberName: "ascii",
            name: commandName,
        });
    }

    public async run(message: CommandMessage, args: object): Promise<(Message | Message[])> {

        let finalMessage: string = figlet.textSync(args, {});

        if (finalMessage === "") {
            // do something
        }

        finalMessage = "```" + finalMessage + "```";

        await message.delete();

        return message.channel.send(finalMessage);
    }
}
