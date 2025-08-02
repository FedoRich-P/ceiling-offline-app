import Konva from "konva";
import {v4 as uuidv4} from "uuid";
import {
    addMarkupIcon, addStroke,
    currentStrokeSelector,
    iconLabelsSelector,
    isDrawingSelector,
    markupIconsSelector, selectedIconIdSelector, setCurrentStroke, setIsDrawing, setSelectedIconId
} from "@/app/redux/slices/markup.ts";
import {useAppDispatch, useAppSelector} from "@/shared/hooks/redux/hooks.ts";
import {colorSelector, lineWidthSelector, modeSelector} from "@/app/redux/slices/tools.ts";
import {ICONS_TYPES} from "@/shared/constants/controlsIcons.tsx";
import type {MarkupIconType} from "@/shared/types/point.ts";

export const useCanvasHandlers = () => {
    const dispatch = useAppDispatch();
    const toolMode = useAppSelector(modeSelector);
    const toolColor = useAppSelector(colorSelector);
    const toolWidth = useAppSelector(lineWidthSelector);
    const isDrawing = useAppSelector(isDrawingSelector);
    const currentStroke = useAppSelector(currentStrokeSelector);
    const icons = useAppSelector(markupIconsSelector);
    const iconLabels = useAppSelector(iconLabelsSelector);
    const selectedIconId = useAppSelector(selectedIconIdSelector);

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        const pos = stage?.getPointerPosition();

        if (e.target.name() === "icon-group") {
            dispatch(setSelectedIconId(e.target.id()));
            return;
        }

        if (toolMode.startsWith("add") && pos) {
            const iconType = ICONS_TYPES.find(i => i.mode === toolMode)?.type;
            if (iconType) {
                dispatch(addMarkupIcon({ type: iconType as MarkupIconType, x: pos.x, y: pos.y }));
            }
            return;
        }

        if ((toolMode === "pencil" || toolMode === "line") && pos) {
            dispatch(setIsDrawing(true));
            dispatch(setCurrentStroke([pos.x, pos.y]));
            dispatch(setSelectedIconId(null));
        } else {
            dispatch(setSelectedIconId(null));
        }
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isDrawing) return;
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) {
            dispatch(setCurrentStroke([...currentStroke, pos.x, pos.y]));
        }
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;

        dispatch(setIsDrawing(false));

        let points = currentStroke;
        if (toolMode === 'line' && currentStroke.length >= 4) {
            points = [...currentStroke.slice(0, 2), ...currentStroke.slice(-2)];
        }

        dispatch(addStroke({
            id: uuidv4(),
            points,
            color: toolColor,
            width: toolWidth,
        }));

        dispatch(setCurrentStroke([]));
    };

    return {
        toolMode,
        toolColor,
        toolWidth,
        isDrawing,
        currentStroke,
        icons,
        iconLabels,
        selectedIconId,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
};

// import Konva from "konva";
// import { setSelectedIconId } from "../../markupSlice.ts";
// import { useAppDispatch } from "../../../../app/redux/hooks.ts";
// import { useDrawing } from "./useDrawing.ts";
// import {useMarkupIcons} from "./useMarkupIcons.ts";
//
// export const useCanvasHandlers = () => {
//     const dispatch = useAppDispatch();
//     const drawing = useDrawing();
//     const icons = useMarkupIcons();
//
//     const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
//         const stage = e.target.getStage();
//         const pos = stage?.getPointerPosition();
//
//         let clickedIconGroup: Konva.Group | null = null;
//         let currentNode: Konva.Node | null = e.target;
//
//         while (currentNode && currentNode !== stage) {
//             if (currentNode.name() === "icon-group" && currentNode instanceof Konva.Group) {
//                 clickedIconGroup = currentNode;
//                 break;
//             }
//             currentNode = currentNode.parent;
//         }
//
//         if (clickedIconGroup) {
//             const iconId = clickedIconGroup.id();
//             if (icons.icons.some(i => i.id === iconId)) {
//                 icons.handleIconClick(iconId, e);
//                 return;
//             }
//         }
//
//         if (drawing.toolMode.startsWith("add") && pos) {
//             icons.tryAddIcon(pos.x, pos.y);
//             return;
//         }
//
//         if ((drawing.toolMode === "pencil" || drawing.toolMode === "line") && pos) {
//             drawing.startDrawing(pos.x, pos.y);
//             dispatch(setSelectedIconId(null));
//         } else {
//             dispatch(setSelectedIconId(null));
//         }
//     };
//
//     const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
//         const pos = e.target.getStage()?.getPointerPosition();
//         if (pos) drawing.draw(pos.x, pos.y);
//     };
//
//     const handleMouseUp = () => {
//         drawing.stopDrawing();
//     };
//
//     return {
//         ...drawing,
//         ...icons,
//         handleMouseDown,
//         handleMouseMove,
//         handleMouseUp,
//     };
// };