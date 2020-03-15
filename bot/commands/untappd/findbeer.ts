import { Collection, CollectorFilter, DMChannel, GroupDMChannel, Message, MessageReaction, RichEmbed, TextChannel } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import * as request from "request-promise-native";
import { IBeer, IBrewery, IUntappdItem } from "./beer-search-response";
import { emojiReacts } from "./config";

export default class FindBeerCommand extends Command {

    private CLIENTID: string | undefined;
    private CLIENTSECRET: string | undefined;
    private baseUrl: string;
    private authString: string;

    constructor(client: CommandoClient) {
        const commandName = "findbeer";

        super(client, {
            aliases: ["fb"],
            description: "Look up a beer on Untappd by name",
            examples: [`${commandName}`],
            group: "untappd",
            guildOnly: true,
            memberName: "find-beer",
            name: commandName,
        });

        // TODO: Validate these
        this.CLIENTID = process.env.CLIENTID;
        this.CLIENTSECRET = process.env.CLIENTSECRET;

        this.authString = `client_id=${this.CLIENTID}&client_secret=${this.CLIENTSECRET}`;
        this.baseUrl = "https://api.untappd.com/v4/";
    }

    public async run(message: CommandMessage, args: object, fromPattern: boolean): Promise<(Message | Message[])> {
        if (!args) {
            // TODO: throw error
        }

        const queryString = args.toString();
        const options = {
            uri: `${this.baseUrl}/search/beer?${this.authString}&q=${queryString}&limit=10`,
        };

        await request.get(options).then((result: any) => {

            result = JSON.parse(result);

            if (result.meta.code !== 200) {
                // TODO: throw error
            }

            if (result.response.found === 0) {
                // TODO: throw error
            }

            let beerMessage: RichEmbed = new RichEmbed();

            if (result.response.found === 1) {
                beerMessage = this.prepareBeerEmbed(result.response.beers.items[0]);
            } else {
                this.getUserChoice(result.response.beers.items, message.channel, message.member.id).then((item: IUntappdItem | undefined) => {
                    if (!item) {
                        // TODO: error
                    } else {
                        beerMessage = this.prepareBeerEmbed(item);
                    }
                });
            }
            return message.channel.send(beerMessage);
        }, (reason: any) => {
            return message.channel.send(reason.details);
        });

        return message.channel.send("i am error");
    }

    private async getUserChoice(items: IUntappdItem[], channel: TextChannel | DMChannel | GroupDMChannel, memberId: string): Promise<IUntappdItem | undefined> {
        let count: number = items.length;

        if (count > 10) {
            count = 10;
        }

        try {

            await channel.startTyping();
            const message: Message | Message[] = await channel.send(this.prepareBeerListEmbed(items, count));
            await channel.stopTyping();

            if (message instanceof Array) {
                // do nothing
            } else {
                for (let i = 0; i < count; i++) {
                    try {
                        await message.react(emojiReacts[i]);
                    } catch (err) {
                        // TODO: error
                    }
                }

                const filter: CollectorFilter = (reaction, user) => reaction.emoji.name in emojiReacts && user === memberId;

                const choice: Collection<string, MessageReaction> = await message.awaitReactions(filter, { time: 10000, max: 1 });
                const hasReacted: boolean = choice.size > 0;
                let result: IUntappdItem;

                if (hasReacted) {
                    let j: number = 0;
                    while (j < emojiReacts.length && emojiReacts[j] !== choice.array()[0].emoji.toString()) {
                        j++;
                    }
                    if (j < emojiReacts.length) {
                        result = items[j];
                    }
                }

                return new Promise<IUntappdItem>((resolve, reject) => {
                    if (hasReacted) {
                        resolve(result);
                    } else {
                        reject(/*TODO:*/ "");
                    }
                });
            }
        } catch (err) {
            // TODO: error
        }
    }

    /**
     * Prepare a rich embed message of beer info to send to discord channel
     * @param item the UntappdItem
     */
    private prepareBeerEmbed(item: IUntappdItem): RichEmbed {
        const beer: IBeer = item.beer;
        const brewery: IBrewery = item.brewery;

        const embed = new RichEmbed()
            .setTitle(beer.beer_name)
            .setURL(`https://untappd.com/b/bid/${beer.bid}`)
            .setColor("0x76EEC6")
            .setTimestamp()
            .setAuthor("Untappd");

        embed.addField("Brewery", brewery.brewery_name);

        // These aren't guaranteed to exist on a beer entry, so we first check.
        if (beer.beer_label !== undefined) { embed.setImage(beer.beer_label); }
        if (beer.beer_description !== undefined) { embed.setDescription(beer.beer_description); }
        if (beer.beer_style !== undefined) { embed.addField("Style", beer.beer_style, true); }
        if (beer.beer_abv !== undefined) { embed.addField("ABV", `${beer.beer_abv}%`, true); }

        return embed;
    }

    /**
     * Prepare a rich embed message of beer names for search results with
     * more than one result
     * @param items the list of Untappd items
     * @param count the count of items (10 is max value)
     */
    private prepareBeerListEmbed(items: IUntappdItem[], count: number) {
        const embed = new RichEmbed()
            .setTitle("Beer Search Results")
            .setColor("0x76EEC6")
            .setTimestamp()
            .setAuthor("Untappd");

        for (let i = 0; i < count; i++) {
            embed.addField(emojiReacts[i], items[i].beer.beer_name);
        }

        return embed;
    }
}
