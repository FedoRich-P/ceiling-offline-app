import {Line} from "react-konva";
import type {Diagonal, Point} from "@/shared/types/point.ts";
import {Fragment} from "react";

type Props = {
    diagonals: Diagonal[],
    points: Point[]
};

export function Diagonals({diagonals, points}: Props) {
    return <>
        {
            diagonals.map((d, idx) => {
                const from = points[d.from];
                const to = points[d.to];
                return (
                    <Fragment key={`diag-${idx}`}>
                        <Line
                            points={[from.x, from.y, to.x, to.y]}
                            stroke="blue"
                            strokeWidth={2}
                            dash={[10, 5]}
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
                    </Fragment>
                );
            })
        }
    </>;
};