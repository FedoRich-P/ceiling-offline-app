import {db} from "@/shared/db/db.ts";
import {scalePoints} from "@/shared/utils/scalePoints.ts";
import {calculateArea, calculatePerimeter, countCorners} from "@/shared/utils/geometry.ts";
import {calculateAllLengths} from "@/shared/utils/point.ts";
import {store} from "@/app/redux/store.ts";
import {diagonalsSelector, pointsSelector} from "@/app/redux/slices/roomConstructor.ts";
import type {Point} from "@/shared/types/point.ts";

export async function saveRoomAndCanvas(roomData: { name: string, points: Point[] }, canvas: HTMLCanvasElement) {
    const state = store.getState();
    const points = pointsSelector(state);
    const diagonals = diagonalsSelector(state);
    const scaledPoints = scalePoints(points);
    const lengths = calculateAllLengths(points, diagonals);

    const area = +calculateArea(scaledPoints).toFixed(2);
    const perimeter = +calculatePerimeter(scaledPoints).toFixed(2);
    const corners = countCorners(points);
    const formatedDiagonals = lengths
        .filter(diagonal => diagonal?.isDiagonal)
        .map(diagonal => ({
            name: diagonal.name,
            length: diagonal.length,
        }));

    // Сохраняем в IndexedDB в виде структурированного объекта
    const roomId = await db.rooms.add({
        name: roomData.name,
        diagonals: diagonals,
        displayDiagonals : formatedDiagonals,
        area,
        perimeter,
        corners,
        lengths,
        updatedAt: Date.now(),
        synced: false,
    });

    // Сохраняем изображение
    await new Promise<void>((resolve, reject) => {
        canvas.toBlob(async blob => {
            if (!blob) return reject('Failed to export canvas');
            await db.images.add({
                roomId,
                imageBlob: blob,
                createdAt: Date.now(),
                synced: false,
            });
            resolve();
        }, 'image/png');
    });

    // Регистрируем фон. синхронизацию
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
            await (registration as any).sync.register('sync-rooms');
            console.log('🔄 Background sync registered');
        } else {
            console.warn('❗️registration.sync не поддерживается');
        }
    } else {
        console.warn('❗️Background Sync не поддерживается');
    }
}
