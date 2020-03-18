/* tslint:disable:max-classes-per-file */
import { Message, User } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { promisify } from "util";

const setTimeoutPromise = promisify(setTimeout);

class HarkMessage {
    public line: string;
    public delay: number;

    constructor(line: string, delay: number) {
        this.line = line;
        this.delay = delay;
    }
}

export default class HarkCommand extends Command {

    private static hark: HarkMessage[] = [
        new HarkMessage("Let Neptune strike ye dead, Winslow!", 3000),
        new HarkMessage("Haaaaark!", 4000),
        new HarkMessage("Hark, Triton, Hark!", 4000),
        new HarkMessage("Bellow, bid our father, the sea king,", 4000),
        new HarkMessage("rise from the depths, full foul in his fury,", 4000),
        new HarkMessage("black waves teeming with salt-foam,", 4000),
        new HarkMessage("to smother this young mouth with pungent slime,", 5000),
        new HarkMessage("to choke ye, engorging yer organs", 4000),
        new HarkMessage("till ye turn blue and bloated", 2000),
        new HarkMessage("with bilge and brine and can scream no more.", 3000),
        new HarkMessage("Only when he, crowned in cockle shells", 5000),
        new HarkMessage("with slithering tentacled tail and steaming beard,", 5000),
        new HarkMessage("take up his fell, be-finned arm,", 4000),
        new HarkMessage("his coral-tined trident screeches", 3000),
        new HarkMessage("banshee-like in the tempest", 2000),
        new HarkMessage("and plunges right through yer gullet,", 5000),
        new HarkMessage("bursting ye,", 2000),
        new HarkMessage("a bulging bladder no more,", 3000),
        new HarkMessage("but a blasted bloody film now,", 3000),
        new HarkMessage("a nothing for the Harpies and the souls of dead sailors", 5000),
        new HarkMessage("to peck and claw and feed upon,", 3000),
        new HarkMessage("only to be lapped up and swallowed", 3000),
        new HarkMessage("by the infinite waters of the dread emperor himself,", 6000),
        new HarkMessage("forgotten to any man,", 4000),
        new HarkMessage("to any time,", 2000),
        new HarkMessage("forgotten to any God or devil,", 3000),
        new HarkMessage("forgotten even to the sea,", 3000),
        new HarkMessage("for any stuff or part of Winslow,", 4000),
        new HarkMessage("even any scantling of your soul,", 3000),
        new HarkMessage("is Winslow no more,", 3000),
        new HarkMessage("but is now itself the sea.", 0),
    ];

    constructor(client: CommandoClient) {
        const commandName = "hark";
        super(client, {
            description: "Haaaark!!",
            examples: [`${commandName}`],
            group: "fun",
            guildOnly: true,
            memberName: "hark",
            name: commandName,
            ownerOnly: true,
            throttling: { usages: 1, duration: 60 * 15 },
        });
    }

    public async run(message: CommandMessage, args: object): Promise<(Message | Message[])> {

        const harker: User = message.mentions.users.first() || message.author;
        const winslow = /Winslow/gi;

        message.channel.startTyping();
        for (const harkMessage of HarkCommand.hark) {
            await message.channel.send(harkMessage.line.replace(winslow, harker.username));
            message.channel.stopTyping();
            message.channel.startTyping();
            await setTimeoutPromise(harkMessage.delay);
        }
        message.channel.stopTyping(true);

        return Promise.resolve([]);
    }
}
