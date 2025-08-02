import { Stage, Layer, Line } from "react-konva";
import clsx from "clsx";
import styles from "./DuplicateEditor.module.scss";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux/hooks.ts";
import { pointsSelector } from "@/app/redux/slices/roomConstructor.ts";
import { deleteMarkupIcon, strokesSelector } from "@/app/redux/slices/markup.ts";

import GridBackground from "@/shared/components/GridBackground/ui/GridBackground.tsx";
import { PointLabels } from "@/shared/components/PointLabels/ui/PointLabels.tsx";
import { ICONS_TYPES } from "@/shared/constants/controlsIcons.tsx";
import { MarkupIcon } from "../../MarkupIcon/ui/MarkupIcon.tsx";
import { useCanvasHandlers } from "../model/useCanvasHandlers.ts";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "@/shared/constants/canvasSizes.ts";
import {DeleteIconButton} from "@/shared/components/DeleteIconButton/DeleteIconButton.tsx";

interface DuplicateEditorProps {
    className?: string;
}

export const DuplicateEditor = ({ className }: DuplicateEditorProps) => {
    const dispatch = useAppDispatch();
    const points = useAppSelector(pointsSelector);
    const strokes = useAppSelector(strokesSelector);

    const {
        toolMode,
        isDrawing,
        currentStroke,
        toolColor,
        toolWidth,
        icons,
        selectedIconId,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    } = useCanvasHandlers();

    return (
        <div className={clsx(styles.wrapper, className)}>
            <Stage
                width={CANVAS_WIDTH} height={CANVAS_HEIGHT}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer listening={false}>
                    <GridBackground width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                </Layer>

                <Layer>
                    <Line
                        points={points.flatMap((p) => [p.x, p.y])}
                        stroke="black"
                        strokeWidth={2}
                        closed
                    />
                    <PointLabels points={points} />
                    {strokes.map((stroke) => (
                        <Line
                            key={stroke.id}
                            points={stroke.points}
                            stroke={stroke.color}
                            strokeWidth={stroke.width}
                            lineCap="round"
                            lineJoin="round"
                        />
                    ))}
                    {isDrawing && (
                        <Line
                            points={currentStroke}
                            stroke={toolColor}
                            strokeWidth={toolWidth}
                            lineCap="round"
                            lineJoin="round"
                        />
                    )}
                </Layer>

                <Layer>
                    {icons.map((icon) => {
                        const IconComponent = ICONS_TYPES.find((i) => i.type === icon.type)?.icon;
                        return (
                            <MarkupIcon
                                key={icon.id}
                                id={icon.id}
                                x={icon.x}
                                y={icon.y}
                                IconComponent={IconComponent}
                            />
                        );
                    })}
                </Layer>
            </Stage>

            {selectedIconId && !toolMode.startsWith("add") && (
                <DeleteIconButton
                    onClick={() => dispatch(deleteMarkupIcon(selectedIconId))}
                />
            )}
        </div>
    );
};
