export interface Team {
    id: string;
    name: string;
}

export interface Meeting {
    id: string; 
    team_id: string;
    start_datetime: string; 
    end_datetime: string;   
    description: string;
    room: string;
    team?: Team; 
}

export interface NewMeetingDto {
    team_id: string;
    start_datetime: string;
    end_datetime: string;
    description: string;
    room: string;
}