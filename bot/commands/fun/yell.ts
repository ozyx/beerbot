import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

export default class YellCommand extends Command {

    private static letterConverter: Map<string, string> = new Map([
        ["a", ":regional_indicator_a:"],
        ["b", ":regional_indicator_b:"],
        ["c", ":regional_indicator_c:"],
        ["d", ":regional_indicator_d:"],
        ["e", ":regional_indicator_e:"],
        ["f", ":regional_indicator_f:"],
        ["g", ":regional_indicator_g:"],
        ["h", ":regional_indicator_h:"],
        ["i", ":regional_indicator_i:"],
        ["j", ":regional_indicator_j:"],
        ["k", ":regional_indicator_k:"],
        ["l", ":regional_indicator_l:"],
        ["m", ":regional_indicator_m:"],
        ["n", ":regional_indicator_n:"],
        ["o", ":regional_indicator_o:"],
        ["p", ":regional_indicator_p:"],
        ["q", ":regional_indicator_q:"],
        ["r", ":regional_indicator_r:"],
        ["s", ":regional_indicator_s:"],
        ["t", ":regional_indicator_t:"],
        ["u", ":regional_indicator_u:"],
        ["v", ":regional_indicator_v:"],
        ["w", ":regional_indicator_w:"],
        ["x", ":regional_indicator_x:"],
        ["y", ":regional_indicator_y:"],
        ["z", ":regional_indicator_z:"],
        ["!", ":exclamation:"],
        ["?", ":question:"],
        [" ", " "],
    ]);

    constructor(client: CommandoClient) {
        const commandName = "yell";
        super(client, {
            aliases: ["y"],
            description: "Yell some text!",
            examples: [`${commandName} {message}`],
            group: "fun",
            guildOnly: true,
            memberName: "yell",
            name: commandName,
        });
    }

    /**
     * Converts a user's message into big block emoji letters
     * and sends it as a response.
     * Useful when you have something to say loudly, but you're only
     * on the internet.
     * @param message the message which triggered this command
     * @param args optional arguments
     */
    public async run(message: CommandMessage, args: object): Promise<(Message | Message[])> {
        const newMessage: string[] = [];

        [...args.toString()].forEach((c) => {
            if (YellCommand.letterConverter.has(c)) {
                const converted: string | undefined = YellCommand.letterConverter.get(c);
                if (converted !== undefined) {
                    newMessage.push(converted);
                }
            }
        });

        return message.channel.send(newMessage.join(" "));
    }
}
