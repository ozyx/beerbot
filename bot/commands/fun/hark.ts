import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { promisify } from 'util';

const setTimeoutPromise = promisify(setTimeout);

export default class HarkCommand extends Command {

    private static hark: Array<string> = [
        "Let Neptune strike ye dead, Winslow!",
        "Haaaaark!",
        "Hark, Triton, Hark!",
        "Bellow, bid our father, the sea king,",
        "rise from the depths, full foul in his fury,",
        "black waves teeming with salt-foam,",
        "to smother this young mouth with pungent slime,",
        "to choke ye, engorging yer organs",
        "till ye turn blue and bloated",
        "with bilge and brine and can scream no more.",
        "Only when he, crowned in cockle shells",
        "with slithering tentacled tail and steaming beard,",
        "take up his fell, be-finned arm,",
        "his coral-tined trident screeches",
        "banshee-like in the tempest",
        "and plunges right through yer gullet,",
        "bursting ye,",
        "a bulging bladder no more,",
        "but a blasted bloody film now,",
        "a nothing for the Harpies and the souls of dead sailors",
        "to peck and claw and feed upon,",
        "only to be lapped up and swallowed",
        "by the infinite waters of the dread emperor himself,",
        "forgotten to any man,",
        "to any time,",
        "forgotten to any God or devil,",
        "forgotten even to the sea,",
        "for any stuff or part of Winslow,",
        "even any scantling of your soul,",
        "is Winslow no more,",
        "but is now itself the sea.",
    ];

    constructor(client: CommandoClient) {
        const commandName = "hark";
        super(client, {
            aliases: ["a"],
            description: "Haaaark!!",
            examples: [`${commandName}`],
            group: "fun",
            guildOnly: true,
            memberName: "hark",
            name: commandName,
        });
    }

    public async run(message: CommandMessage, args: object): Promise<(Message | Message[])> {

        let harker = message.author.username;
        let winslow = /Winslow/gi;

        HarkCommand.hark.forEach((harkLine) => {
            await message.channel.send(harkLine.replace(winslow, harker));
            await setTimeoutPromise(100);
        })

        //await message.delete();

        return Promise.reslove(null);
    }
}

