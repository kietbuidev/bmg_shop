export class DataForEmail {
    thumbnail: string;
    description?: string;
    hotel_deals?: any[];
    flight_section?: {
        check_in?: string;
        start_point?: string;
        end_point?: string;
        link_url?: string;
    };
    hotel_link: string;
    flight_link: string;
    post?: DataPostEmail;
}

export class DataPostEmail {
    thumbnail: string;
    post_title: string;
    post_description: string;
    url_link: string;
}