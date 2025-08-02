import { Line } from 'react-konva';

interface GridProps {
    width: number;
    height: number;
    cellSize?: number;
}

const GridBackground = ({ width, height, cellSize = 10 }: GridProps) => {
    const lines = [];

    for (let x = 0; x <= width; x += cellSize) {
        lines.push(
            <Line key={`v-${x}`} points={[x, 0, x, height]} stroke="#eee" strokeWidth={1} />
        );
    }

    for (let y = 0; y <= height; y += cellSize) {
        lines.push(
            <Line key={`h-${y}`} points={[0, y, width, y]} stroke="#eee" strokeWidth={1} />
        );
    }

    return <>{lines}</>;
};

export default GridBackground;
