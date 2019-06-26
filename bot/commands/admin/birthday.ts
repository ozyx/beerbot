import { GuildMember, Message } from "discord.js";
import { Command, CommandMessage, CommandoClient, FriendlyError } from "discord.js-commando";

export default class BirthdayCommand extends Command {

    constructor(client: CommandoClient) {
        const commandName = "birthday";
        super(client, {
            aliases: ["bday"],
            description: "Celebrate a member's birthday.",
            examples: [`${commandName} [username]`],
            group: "admin",
            guildOnly: true,
            memberName: "bday",
            name: commandName,
            ownerOnly: true,
        });
    }

    public async run(message: CommandMessage, args: object): Promise<(Message | Message[])> {
        const bdayBoi: GuildMember | undefined = message.mentions.members.first();
        if (!bdayBoi) {
            throw new FriendlyError("User was not provided. Please @ them");
        }

        // Save original nickname
        const originalNick = bdayBoi.nickname || bdayBoi.displayName;

        // Make sure user's nickname is not already containing the decorations
        if (!originalNick.startsWith("🎂") && !originalNick.endsWith("🎂")) {

            await bdayBoi.setNickname(`🎂 ${originalNick} 🎂`, "COME ON AND CELEBRATE!");
            console.log(`${new Date()}: Nickname changed`);

            // Reset nickname at midnight
            setTimeout(() => {
                bdayBoi.setNickname(originalNick);
                console.log(`${new Date()}: Nickname reset`);
            }, this.msUntilMidnight());
        }

        return message.channel.send(`🎂 HAPPY 🎂 BIRTHDAY 🎂 ${bdayBoi.user} !!! 🎂`);
    }

    private msUntilMidnight(): number {
        const midnight = new Date().setHours(24, 0, 0, 0);
        const ms = midnight - new Date().getTime();
        console.log(`${new Date()}: Time until midnight ${ms / 1000 / 60}:${ms / 1000 / 60 / 60}:${ms / 1000 / 60 / 60 / 60}`);
        return ms;
    }
}
