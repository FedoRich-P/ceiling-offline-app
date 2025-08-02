import { memo } from 'react';
import { Circle, Layer, Stage } from 'react-konva';
import Konva from 'konva';
import clsx from 'clsx';

import { Diagonals } from './Diagonals.tsx';
import { Lines } from './Lines.tsx';
import GridBackground from '@/shared/components/GridBackground/ui/GridBackground.tsx';
import { PointLabels } from '@/shared/components/PointLabels/ui/PointLabels.tsx';
import SegmentLabels from '@/shared/components/SegmentLabels/ui/SegmentLabels.tsx';

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux/hooks.ts';
import {
    addPoint,
    diagonalsSelector,
    pointsSelector,
    selectedPointIndexSelector,
    setSelectedPoint,
    updatePoint,
} from '@/app/redux/slices/roomConstructor.ts';
import type { Point } from '@/shared/types/point.ts';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/shared/constants/canvasSizes.ts';

import styles from './CanvasEditor.module.scss';

interface CanvasEditorProps {
    className?: string;
}

export const CanvasEditor = memo(({ className }: CanvasEditorProps) => {
    const dispatch = useAppDispatch();
    const points: Point[] = useAppSelector(pointsSelector);
    const selectedIndex = useAppSelector(selectedPointIndexSelector);
    const diagonals = useAppSelector(diagonalsSelector);

    const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        const pointer = stage?.getPointerPosition();
        if (pointer) {
            dispatch(addPoint({ x: pointer.x, y: pointer.y }));
        }
    };

    function handleCircleClick(e: Konva.KonvaEventObject<MouseEvent>, i: number) {
        e.cancelBubble = true;
        dispatch(setSelectedPoint(i));
    }

    function handleCircleMove(e: Konva.KonvaEventObject<MouseEvent>, i: number) {
        dispatch(updatePoint({ index: i, point: { x: e.target.x(), y: e.target.y() } }));
    }

    return (
        <div className={clsx(styles.wrapper, className)}>
            <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onClick={handleClick}>
                {/* Сетка */}
                <Layer listening={false}>
                    <GridBackground width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                </Layer>

                {/* Основной слой */}
                <Layer>
                    <Lines points={points} diagonals={diagonals} />
                    {points.map((p, i) => (
                        <Circle
                            key={i}
                            x={p.x}
                            y={p.y}
                            radius={6}
                            fill={selectedIndex === i ? 'orange' : 'red'}
                            onClick={(e) => handleCircleClick(e, i)}
                            draggable
                            onDragMove={(e) => handleCircleMove(e, i)}
                        />
                    ))}
                    <PointLabels points={points} />
                    <SegmentLabels points={points} />
                    <Diagonals diagonals={diagonals} points={points} />
                </Layer>
            </Stage>
        </div>
    );
});
