import {db} from "@/shared/db/db.ts";

export async function saveCanvasImage(roomId: number, canvas: HTMLCanvasElement) {
    return new Promise<void>((resolve, reject) => {
        canvas.toBlob(async blob => {
            if (!blob) return reject('Canvas export failed');
            await db.images.add({
                roomId,
                imageBlob: blob,
                createdAt: Date.now(),
                synced: false,
            });
            resolve();
        }, 'image/png');
    });
}

export async function getImagesForRoom(roomId: number) {
    return db.images.where('roomId').equals(roomId).toArray();
}

export async function deleteImagesForRoom(roomId: number) {
    return db.images.where('roomId').equals(roomId).delete();
}
