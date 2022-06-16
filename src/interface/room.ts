import { RoomMember } from './room-member';

export interface Room {
    id: string;
    memberList: RoomMember[];
}
