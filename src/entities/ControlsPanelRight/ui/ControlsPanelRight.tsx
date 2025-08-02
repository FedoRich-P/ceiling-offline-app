import styles from './ControlsPanelRight.module.scss';
import {useAppDispatch, useAppSelector} from "@/shared/hooks/redux/hooks.ts";
import {
    colorSelector,
    lineWidthSelector,
    modeSelector,
    setColor,
    setLineWidth,
    setMode
} from "@/app/redux/slices/tools.ts";
import {deleteMarkupIcon, markupIconsSelector} from "@/app/redux/slices/markup.ts";
import {DRAW_COLORS, LINE_WIDTHS} from "@/shared/constants/drawing.ts";
import {ICONS_TYPES} from "@/shared/constants/controlsIcons.tsx";
import {pointsSelector} from "@/app/redux/slices/roomConstructor.ts";
import {saveRoomAndCanvas} from "@/shared/hooks/useRoomSync.ts";
import {v4 as uuidv4} from 'uuid';
import clsx from "clsx";

type ControlsPanelRightProps = {
    className?: string;
};

export function ControlsPanelRight({ className }: ControlsPanelRightProps) {
    const dispatch = useAppDispatch();
    const toolMode = useAppSelector(modeSelector);
    const selectedWidth = useAppSelector(lineWidthSelector);
    const selectedColor = useAppSelector(colorSelector);
    const icons = useAppSelector(markupIconsSelector);
    const points = useAppSelector(pointsSelector);

    const handleSave = async () => {
        const canvas = document.querySelector('canvas');
        if (!(canvas instanceof HTMLCanvasElement)) return alert('❌ Canvas не найден');

        const roomData = {
            name: 'Комната ' + uuidv4(),
            points,
        };

        try {
            await saveRoomAndCanvas(roomData, canvas);
            alert('✅ Сохранено в IndexedDB и добавлено в очередь на синхронизацию');
        } catch (e) {
            console.error('❌ Ошибка сохранения', e);
            alert('❌ Ошибка при сохранении');
        }
    };

    const handleSelectAddIconMode = (mode: string) => {
        dispatch(setMode(toolMode === mode ? 'none' : mode as any));
    };

    return (
        <aside className={clsx(styles.wrapper, className)} role="complementary" aria-label="Панель инструментов">
            <button onClick={handleSave} className={styles.saveButton}>
                💾 Сохранить комнату
            </button>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Режим рисования</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => dispatch(setMode('pencil'))}
                        className={`${styles.iconButton} ${toolMode === 'pencil' ? styles.active : ''}`}
                    >
                        ✏️ Карандаш
                    </button>
                    <button
                        onClick={() => dispatch(setMode('line'))}
                        className={`${styles.iconButton} ${toolMode === 'line' ? styles.active : ''}`}
                    >
                        📏 Линейка
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Цвет</h3>
                <div className={styles.colorPicker}>
                    {DRAW_COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => dispatch(setColor(c))}
                            className={`${styles.colorButton} ${selectedColor === c ? styles.selected : ''}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Толщина</h3>
                <select
                    value={selectedWidth}
                    onChange={(e) => dispatch(setLineWidth(Number(e.target.value)))}
                    style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ccc' }}
                >
                    {LINE_WIDTHS.map(w => (
                        <option key={w} value={w}>{w}px</option>
                    ))}
                </select>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Освещение</h3>
                <div className={styles.iconGrid}>
                    {ICONS_TYPES.filter(i => i.type === 'light' || i.type === 'chandelier').map(icon => (
                        <button
                            key={icon.type}
                            className={`${styles.iconButton} ${toolMode === icon.mode ? styles.active : ''}`}
                            onClick={() => handleSelectAddIconMode(icon.mode)}
                        >
                            {icon.icon}
                            <div style={{ fontSize: 12, marginTop: 4 }}>{icon.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Карнизы</h3>
                <div className={styles.iconGrid}>
                    {ICONS_TYPES.filter(i => i.type.startsWith('cornice')).map(icon => (
                        <button
                            key={icon.type}
                            className={`${styles.iconButton} ${toolMode === icon.mode ? styles.active : ''}`}
                            onClick={() => handleSelectAddIconMode(icon.mode)}
                        >
                            {icon.icon}
                            <div style={{ fontSize: 12, marginTop: 4 }}>{icon.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className={clsx(styles.section, styles.dops)}>
                <h3 className={styles.sectionTitle}>Добавленные элементы</h3>
                <div className={styles.iconList}>
                    {icons.length === 0 && <p style={{ fontSize: 14, color: '#666' }}>Нет добавленных элементов.</p>}
                    {icons.map(ico => {
                        const iconData = ICONS_TYPES.find(i => i.type === ico.type);
                        const label = iconData ? iconData.label : ico.type;
                        return (
                            <div key={ico.id} className={styles.iconItem}>
                                <span>{iconData?.icon} {label}</span>
                                <button onClick={() => dispatch(deleteMarkupIcon(ico.id))}>×</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}


// import { useAppDispatch, useAppSelector } from '../app/redux/hooks';
// import {
//     modeSelector,
//     lineWidthSelector,
//     setMode,
//     setLineWidth,
//     colorSelector,
//     setColor
// } from '../features/tools/toolsSlice';
// import { addMarkupIcon, markupIconsSelector, deleteMarkupIcon } from '../features/markup/markupSlice';
// import IconButton from '../shared/ui/IconButton';
// import { FaLightbulb, FaRulerCombined } from 'react-icons/fa';
// import { LuLampCeiling } from 'react-icons/lu';
// import { DRAW_COLORS, LINE_WIDTHS } from '../shared/constants/drawing';
//
// export default function ControlsPanelRight() {
//     const dispatch = useAppDispatch();
//     const toolMode = useAppSelector(modeSelector);
//     const selectedWidth = useAppSelector(lineWidthSelector);
//     const selectedColor = useAppSelector(colorSelector);
//     const icons = useAppSelector(markupIconsSelector);
//
//     return (
//         <div className="space-y-4">
//             <button onClick={() => dispatch(setMode(toolMode))} className="bg-blue-500 text-white px-3 py-1 rounded w-full">
//                 Назад
//             </button>
//
//             <div className="flex gap-2">
//                 <button
//                     onClick={() => dispatch(setMode('pencil'))}
//                     className={`px-3 py-1 rounded ${toolMode === 'pencil' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                 >
//                     ✏️ Карандаш
//                 </button>
//                 <button
//                     onClick={() => dispatch(setMode('line'))}
//                     className={`px-3 py-1 rounded ${toolMode === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                 >
//                     📏 Линейка
//                 </button>
//             </div>
//
//             <div>
//                 <label className="block mb-1">Цвет:</label>
//                 <div className="flex gap-1">
//                     {DRAW_COLORS.map((c) => (
//                         <button
//                             key={c}
//                             onClick={() => dispatch(setColor(c))}
//                             className={`w-6 h-6 rounded-full border-2 ${selectedColor === c ? 'border-black' : 'border-gray-300'}`}
//                             style={{ backgroundColor: c }}
//                         />
//                     ))}
//                 </div>
//             </div>
//
//             <div>
//                 <label className="block mb-1">Толщина:</label>
//                 <select
//                     value={selectedWidth}
//                     onChange={(e) => dispatch(setLineWidth(Number(e.target.value)))}
//                     className="border px-2 py-1 rounded w-full"
//                 >
//                     {LINE_WIDTHS.map((w) => (
//                         <option key={w} value={w}>
//                             {w}px
//                         </option>
//                     ))}
//                 </select>
//             </div>
//
//             <div>
//                 <p className="font-medium">Добавить иконку:</p>
//                 <div className="grid grid-cols-3 gap-2">
//                     <IconButton
//                         icon={<FaLightbulb size={20} />}
//                         label="Свет"
//                         onClick={() => dispatch(addMarkupIcon({ type: 'light', x: 100, y: 100 }))}
//                     />
//                     <IconButton
//                         icon={<LuLampCeiling size={20} />}
//                         label="Люстра"
//                         onClick={() => dispatch(addMarkupIcon({ type: 'chandelier', x: 100, y: 200 }))}
//                     />
//                     <IconButton
//                         icon={<FaRulerCombined size={20} />}
//                         label="Карниз"
//                         onClick={() => dispatch(addMarkupIcon({ type: 'cornice', x: 100, y: 300 }))}
//                     />
//                 </div>
//             </div>
//
//             {icons.map((ico) => (
//                 <div key={ico.id} className="flex justify-between items-center px-2 py-1 bg-gray-100 rounded">
//                     <span>{ico.type}</span>
//                     <button
//                         onClick={() => dispatch(deleteMarkupIcon(ico.id))}
//                         className="text-red-600 hover:text-red-800 px-2"
//                     >
//                         ×
//                     </button>
//                 </div>
//             ))}
//         </div>
//     );
// }
