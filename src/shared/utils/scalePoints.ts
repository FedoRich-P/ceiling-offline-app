import type {Point} from "../types/point.ts";

const metersPerPixel = 0.01; // или centimetersPerPixel = 1

export function scalePoints(points: Point[]): Point[] {
    return points.map(p => ({
        x: p.x * metersPerPixel,
        y: p.y * metersPerPixel,
    }));
}