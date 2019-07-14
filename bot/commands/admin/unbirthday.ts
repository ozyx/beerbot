import { GuildMember, Message } from "discord.js";
import { Command, CommandMessage, CommandoClient, FriendlyError } from "discord.js-commando";
import { Logger } from "../../utility/logger";

export default class UnbirthdayCommand extends Command {

    constructor(client: CommandoClient) {
        const commandName = "unbirthday";
        super(client, {
            aliases: ["unbday"],
            description: "Celebrate a member's unbirthday.",
            examples: [`${commandName} [username]`],
            group: "admin",
            guildOnly: true,
            memberName: "unbday",
            name: commandName,
            ownerOnly: true,
        });
    }

    public async run(message: CommandMessage, args: object): Promise<(Message | Message[])> {
        const unbdayBoi: GuildMember | undefined = message.mentions.members.first();
        if (!unbdayBoi) {
            throw new FriendlyError("User was not provided. Please @ them");
        }

        let nickname = unbdayBoi.nickname;
        if (!nickname) {
            throw new FriendlyError(`It never was ${unbdayBoi.user}'s birthday!`);
        }

        nickname = nickname.replace(/\s?🎂\s?/g, "");

        await unbdayBoi.setNickname(nickname, "We're done celebrating now.");
        Logger.log(`Birthday ended for ${nickname}`);

        return message.channel.send(`Hope you enjoyed your birthday, ${unbdayBoi.user}!`);
    }
}
