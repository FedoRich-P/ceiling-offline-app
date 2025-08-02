import {Line} from "react-konva";
import type {Diagonal, Point} from "@/shared/types/point.ts";
import {useAppSelector} from "@/shared/hooks/redux/hooks.ts";
import {colorSelector, lineWidthSelector} from "@/app/redux/slices/tools.ts";

type Props = {
    diagonals: Diagonal[],
    points: Point[]
};

export function Lines({diagonals, points}: Props) {
    const selectedColor  = useAppSelector(colorSelector);
    const selectedWidth  = useAppSelector(lineWidthSelector);
    return <>
        {points.length > 1 && (
            <>
                <Line
                    points={points.flatMap((p) => [p.x, p.y])}
                    stroke={selectedColor ? selectedColor : "blue"}
                    closed
                    strokeWidth={selectedWidth ? selectedWidth : 2}
                />
                {diagonals.map((d, i) => {
                    const a = points[d.from];
                    const b = points[d.to];
                    return <Line
                        key={i}
                        points={[a.x, a.y, b.x, b.y]}
                        stroke="blue"
                        dash={[10, 5]}
                        strokeWidth={2}
                    />;
                })}
            </>

        )}
    </>
};