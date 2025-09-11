export interface Match {
    id: number;
    state: boolean;
    create_date: Date;
    update_date: Date;
    view_admin: boolean;
    user1_id: number;
    user1_name: string;
    user1_phone: string;
    user1_description: string;
    user1_birthdate: Date;
    user1_photos: string[];
    user1_reaction: string;
    user2_id: number;
    user2_name: string;
    user2_phone: string;
    user2_description: string;
    user2_birthdate: Date;
    user2_photos: string[];
    user2_reaction: string;
}