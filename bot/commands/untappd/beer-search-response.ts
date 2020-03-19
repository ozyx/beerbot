
export interface IUntappdItem {
    checkin_count?: number;
    have_had?: boolean;
    your_count?: number;
    beer: IBeer;
    brewery: IBrewery;
}

export interface IBeer {
    bid: number;
    beer_name: string;
    beer_label?: string;
    beer_abv?: number;
    beer_ibu?: number;
    beer_description?: string;
    created_at: string;
    beer_style?: string;
    auth_rating?: number;
    wish_list?: boolean;
    in_production?: number;
}

export interface IBrewery {
    brewery_id: number;
    brewery_name: string;
    brewery_slug: string;
    brewery_label?: string;
    country_name: string;
    contact?: any;
    location?: any;
}
