import {useEffect, useState} from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux/hooks.ts';
import {
    addDiagonal,
    clearPoints,
    deletePoint,
    pointsSelector,
    renamePoint,
    selectedPointIndexSelector,
    undo,
} from '@/app/redux/slices/roomConstructor.ts';
import styles from './ControlsPanelLeft.module.scss';

interface ControlsPanelLeftProps {
    className?: string;
}

export function ControlsPanelLeft({ className }: ControlsPanelLeftProps) {
    const dispatch = useAppDispatch();
    const selectedIndex = useAppSelector(selectedPointIndexSelector);
    const points = useAppSelector(pointsSelector);

    const [newName, setNewName] = useState('');
    const [sel, setSel] = useState<number[]>([]);

    useEffect(() => {
        if (sel.length === 2) {
            dispatch(addDiagonal({ from: sel[0], to: sel[1] }));
            setSel([]);
        }
    }, [sel, dispatch]);

    const handleUndo = () => dispatch(undo());

    const handleDelete = () => {
        if (selectedIndex !== null) {
            dispatch(deletePoint(selectedIndex));
        }
    };

    const handleRename = () => {
        if (selectedIndex !== null && newName.trim()) {
            dispatch(renamePoint({ index: selectedIndex, name: newName.trim() }));
            setNewName('');
        }
    };

    const handleDiagonalSelect = (index: number) => {
        setSel((prev) => (prev.includes(index) ? prev : [...prev, index]));
    };

    return (
        <aside className={clsx(styles.wrapper, className)} role="complementary" aria-label="Панель инструментов">
            <button onClick={handleUndo} className={clsx(styles.button, styles.undo)}>
                Назад
            </button>

            <button
                onClick={handleDelete}
                className={clsx(styles.button, styles.delete)}
                disabled={selectedIndex === null}
            >
                Удалить точку
            </button>

            <div className={styles.renameGroup}>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Имя точки"
                    className="border px-2 py-1 rounded"
                />
                <button
                    onClick={handleRename}
                    className={clsx(styles.button, styles.rename)}
                    disabled={selectedIndex === null || !newName.trim()}
                >
                    Переименовать
                </button>
            </div>

            <button onClick={() => dispatch(clearPoints())} className={clsx(styles.button, styles.clear)}>
                Очистить всё
            </button>

            <div className={styles.diagonalSection}>
                <p className="font-medium">Добавить диагональ:</p>
                <div className={styles.diagonalButtons}>
                    {points.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => handleDiagonalSelect(i)}
                            className={clsx(
                                styles.pointButton,
                                sel.includes(i) && styles.pointButtonActive
                            )}
                        >
                            {p.name || String.fromCharCode(65 + i)}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}
