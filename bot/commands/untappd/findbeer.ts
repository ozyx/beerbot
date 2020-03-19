import { CollectorFilter, DMChannel, GroupDMChannel, Message, MessageReaction, RichEmbed, TextChannel } from "discord.js";
import { Command, CommandMessage, CommandoClient, FriendlyError } from "discord.js-commando";
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
        const { CLIENTID, CLIENTSECRET } = process.env;

        if (CLIENTID === undefined) {
            throw new Error("CLIENTID environment variable must be defined!");
        }

        if (CLIENTSECRET === undefined) {
            throw new Error("CLIENTSECRET environment variable must be defined!");
        }

        this.CLIENTID = CLIENTID;
        this.CLIENTSECRET = CLIENTSECRET;

        this.authString = `client_id=${this.CLIENTID}&client_secret=${this.CLIENTSECRET}`;
        this.baseUrl = "https://api.untappd.com/v4/";
    }

    public async run(message: CommandMessage, args: object, fromPattern: boolean): Promise<(Message | Message[])> {
        if (!args) {
            throw new FriendlyError("Missing arguments-- please specify your search query!");
        }

        const queryString = args.toString();
        const options = {
            uri: `${this.baseUrl}/search/beer?${this.authString}&q=${queryString}&limit=10`,
        };

        try {
            let result = await request.get(options);
            result = JSON.parse(result);

            if (result.meta.code !== 200) {
                throw new FriendlyError("Request not successful :confused:");
            }

            if (result.response.found === 0) {
                throw new FriendlyError("Sorry, wasn't able to find anything by that name...");
            }

            let beerMessage: RichEmbed = new RichEmbed();

            if (result.response.found === 1) {
                beerMessage = this.prepareBeerEmbed(result.response.beers.items[0]);
                return message.channel.send(beerMessage);
            } else {
                try {
                    const item = await this.getUserChoice(result.response.beers.items, message.channel, message.member.id);

                    if (!item) {
                        return Promise.reject();
                    } else {
                        beerMessage = this.prepareBeerEmbed(item);
                    }
                    return message.channel.send(beerMessage);
                } catch (error) {
                    return message.channel.send(error.details);
                }
            }
        } catch (error) {
            return message.channel.send(error.message);
        }
    }

    private async getUserChoice(items: IUntappdItem[], channel: TextChannel | DMChannel | GroupDMChannel, memberId: string): Promise<IUntappdItem | undefined> {
        let count: number = items.length;

        if (count > 10) {
            count = 10;
        }

        try {

            channel.startTyping();
            const message: Message | Message[] = await channel.send(this.prepareBeerListEmbed(items, count));
            channel.stopTyping();

            if (!(message instanceof Array)) {
                for (let i = 0; i < count; i++) {
                    await message.react(emojiReacts[i]);
                }

                const filter: CollectorFilter = (reaction, user) => emojiReacts.indexOf(reaction.emoji.name) > -1 && user.id === memberId;
                try {
                    const choice = await message.awaitReactions(filter, { time: 10000, max: 1, errors: ["time"] });

                    const hasReacted: boolean = choice.size > 0;
                    let result: IUntappdItem | undefined;

                    if (hasReacted) {
                        let j: number = 0;
                        while (j < emojiReacts.length && emojiReacts[j] !== choice.array()[0].emoji.toString()) {
                            j++;
                        }
                        if (j < emojiReacts.length) {
                            result = items[j];
                        }
                        await message.delete();
                    }

                    return result;
                } catch (err) {
                    await message.clearReactions();
                }
            }
        } catch (err) {
            // TODO: this feels... gross
            return undefined;
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
