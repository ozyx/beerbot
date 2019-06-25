import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient, FriendlyError } from "discord.js-commando";

export default class ClapCommand extends Command {

    constructor(client: CommandoClient) {
        const commandName = "clap";
        super(client, {
            aliases: ["c"],
            description: "👏 PUT 👏 CLAPS 👏 AROUND 👏 EACH 👏 WORD 👏",
            examples: [`${commandName} {message}`],
            group: "fun",
            guildOnly: true,
            memberName: "clap",
            name: commandName,
        });
    }

    /**
     * Have the bot say something in all claps and surrounded
     * in clap emojis. Only for the truly obnoxious.
     * @param message The commandc message object
     * @param args The words
     */
    public async run(message: CommandMessage, args: object): Promise<(Message | Message[])> {
        if (!args) {
            throw new FriendlyError("Message cannot be empty");
        }

        const newMessage: string[] = [];
        for (const word of args.toString().split(" ")) {
            newMessage.push(word.toUpperCase());
        }

        // Ensure that the message the bot sends is within the length limit on Discord
        while (newMessage.join(":clap:").length > 2000) {
            newMessage.pop();
        }

        await message.delete();

        // 👏 PUT 👏 CLAPS 👏 AROUND 👏 EACH 👏 WORD 👏
        let finalMessage: string = newMessage.join(":clap:");
        finalMessage = ":clap:" + finalMessage + ":clap:";

        return message.channel.send(finalMessage);
    }
}
