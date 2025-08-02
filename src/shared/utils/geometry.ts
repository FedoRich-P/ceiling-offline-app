// Евклидово расстояние между двумя точками
import type {Point} from "../types/point.ts";

export function distance(p1: Point, p2: Point): number {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

// Периметр (сумма длин сторон)
export function calculatePerimeter(points: Point[]): number {
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
        const next = (i + 1) % points.length;
        perimeter += distance(points[i], points[next]);
    }
    return perimeter;
}

// Площадь по формуле Шу́ха (алгебраическая формула многоугольника)
export function calculateArea(points: Point[]): number {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i].x * points[j].y - points[j].x * points[i].y;
    }
    return Math.abs(area) / 2;
}

// Количество углов (тупо длина массива)
export function countCorners(points: Point[]): number {
    return points.length;
}
