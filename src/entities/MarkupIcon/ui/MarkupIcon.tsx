import { memo, type ReactNode } from "react";
import { Circle, Group } from "react-konva";
import { Html } from "react-konva-utils";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux/hooks.ts";
import {
    setSelectedIconId,
    updateMarkupIconPosition,
} from "@/app/redux/slices/markup.ts";
import styles from "./MarkupIcon.module.scss";
import Konva from "konva";

interface MarkupIconProps {
    id: string;
    x: number;
    y: number;
    IconComponent: ReactNode;
}

export const MarkupIcon = memo(({ id, x, y, IconComponent }: MarkupIconProps) => {
    const dispatch = useAppDispatch();
    const selected = useAppSelector((state) => state.markup.selectedIconId === id);
    const label = useAppSelector((state) => state.markup.labels[id] || "");

    const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.cancelBubble = true;
        dispatch(setSelectedIconId(id));
    };

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        dispatch(
            updateMarkupIconPosition({
                id,
                x: e.target.x(),
                y: e.target.y(),
            })
        );
    };

    return (
        <Group
            id={id}
            x={x}
            y={y}
            draggable
            onClick={handleClick}
            onDragEnd={handleDragEnd}
        >
            <Circle
                radius={20}
                fill="rgba(255,255,255,0.8)"
                stroke={selected ? "blue" : undefined}
                strokeWidth={selected ? 2 : 0}
            />
            <Html divProps={{ className: styles.iconWrapper }}>{IconComponent}</Html>

            {selected && (
                <Html divProps={{ className: styles.labelWrapper }}>
                    <input
                        type="text"
                        value={label}
                        readOnly
                        onClick={(e) => e.stopPropagation()}
                        className={styles.labelInput}
                    />
                </Html>
            )}
        </Group>
    );
});
