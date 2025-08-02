import { useAppSelector } from "@/shared/hooks/redux/hooks.ts";
import { diagonalsSelector, pointsSelector } from "@/app/redux/slices/roomConstructor.ts";
import { calculateAllLengths } from "@/shared/utils/point.ts";
import clsx from "clsx";
import styles from "./DimensionsTable.module.scss";

interface DimensionsTableProps {
    className?: string;
}

const DimensionsTable = ({ className }: DimensionsTableProps) => {
    const points = useAppSelector(pointsSelector);
    const diagonals = useAppSelector(diagonalsSelector);
    const segments = calculateAllLengths(points, diagonals);

    return (
        <div className={clsx(styles.container, className)}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                <tr>
                    <th className={styles.cell}>Отрезок</th>
                    <th className={styles.cell}>Длина (см)</th>
                </tr>
                </thead>
                <tbody>
                {segments.map((seg, i) => (
                    <tr key={i}>
                        <td className={clsx(styles.cell, styles.segmentName)}>{seg.name}</td>
                        <td className={styles.cell}>{seg.length}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DimensionsTable;
