import Dexie, {type Table} from 'dexie';
import type {Diagonal} from "@/shared/types/point.ts";

export type DisplayDiagonal = { name: string; length: number };

export interface RoomData {
    id?: number;
    name: string;
    diagonals: Diagonal[];
    displayDiagonals: DisplayDiagonal[];
    area: number;
    perimeter: number;
    corners: number;
    lengths: { name: string; length: number }[];
    updatedAt: number;
    synced: boolean;
}

export interface CanvasImage {
    id?: number;
    roomId: number;
    imageBlob: Blob;
    createdAt: number;
    synced: boolean;
}

class CeilingDB extends Dexie {
    rooms!: Table<RoomData, number>;
    images!: Table<CanvasImage, number>;

    constructor() {
        super('CeilingDatabase');
        this.version(3).stores({
            rooms: '++id,name,updatedAt,synced',
            images: '++id,roomId,createdAt',
        });
    }
}

export const db = new CeilingDB();
