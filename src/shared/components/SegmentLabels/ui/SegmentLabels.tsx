import {Text} from 'react-konva';


type Props = {
    points: { x: number; y: number; name?: string }[];
}

const SegmentLabels = ({ points }: Props) => {
    return (
        <>
            {points.map((p, i) => {
                const nextPoint = points[(i + 1) % points.length];
                if (!nextPoint) return null;

                const distance = Math.sqrt(
                    Math.pow(p.x - nextPoint.x, 2) + Math.pow(p.y - nextPoint.y, 2)
                );
                const next = points[(i + 1) % points.length];
                const midX = (p.x + next.x) / 2;
                const midY = (p.y + next.y) / 2;
                // const label = `${p.name || String.fromCharCode(65 + i)}${next.name || String.fromCharCode(65 + (i + 1) % points.length)}`;
                // const len = distance(p, next).toFixed(2);

                return (
                    <Text
                        key={`length-${i}`}
                        x={midX}
                        y={midY}
                        text={`${(distance / 100).toFixed(2)} м`}
                        fontSize={14}
                        fill="black"
                    />
                );
            })}
        </>
    );
};

export default SegmentLabels;
