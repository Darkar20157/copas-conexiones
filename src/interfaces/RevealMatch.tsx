export interface RevealMatch {
    match_id: number;
    state: boolean;
    create_date: string;
    update_date: string;
    view_admin: boolean;
    other_user_id: number;
    match_name: string;
    match_photos: string[];
    gender: string;
    birthdate: string;
    description: string;
}