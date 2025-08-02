import { Text } from 'react-konva';

type Props = {
    points: { x: number; y: number; name?: string }[];
}

export function PointLabels({ points }: Props) {
    return (
        <>
            {points.map((p, i) => (
                <Text
                    key={i}
                    x={p.x - 15}
                    y={p.y - 25}
                    text={p.name || String.fromCharCode(65 + i)}
                    fontSize={14}
                    fill="black"
                />
            ))}
        </>
    );
}
