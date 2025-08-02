import type {Diagonal, Point} from "../types/point.ts";

export function calculateSegmentLengths(points: Point[]) {
    const segments: { name: string; length: number }[] = [];

    for (let i = 0; i < points.length; i++) {
        const start = points[i];
        const end = points[(i + 1) % points.length]; // замыкаем

        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const name = `${start.name ?? String.fromCharCode(65 + i)}${end.name ?? String.fromCharCode(65 + (i + 1) % points.length)}`;
        segments.push({ name, length: Math.round(distance) });
    }

    return segments;
}

type NamedLength = {
    name: string;
    length: number;
    isDiagonal?: boolean;
};

export function calculateAllLengths(points: Point[], diagonals: Diagonal[]): NamedLength[] {
    const segments = calculateSegmentLengths(points);

    const diagSegments = diagonals.map(d => {
        const from = points[d.from];
        const to = points[d.to];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const name = `${from.name ?? String.fromCharCode(65 + d.from)}${to.name ?? String.fromCharCode(65 + d.to)}`;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return { name, length: Math.round(distance), isDiagonal: true };
    });

    return [...segments, ...diagSegments];
}