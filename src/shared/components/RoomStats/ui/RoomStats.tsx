import {useAppSelector} from "../../../hooks/redux/hooks.ts";
import type {Point} from "../../../types/point.ts";
import {pointsSelector} from "@/app/redux/slices/roomConstructor.ts";
import {scalePoints} from "../../../utils/scalePoints.ts";
import {calculateArea, calculatePerimeter, countCorners} from "../../../utils/geometry.ts";

const RoomStats = () => {
    const points: Point[] = useAppSelector(pointsSelector);

    const scaledPoints = scalePoints(points);

    const area = calculateArea(scaledPoints).toFixed(2);
    const perimeter = calculatePerimeter(scaledPoints).toFixed(2);
    const corners = countCorners(points);

    return (
        <div className="p-4 bg-gray-100 rounded shadow flex-1">
            <h2 className="text-lg font-semibold mb-2">Параметры помещения</h2>
            <p>Площадь: {area} м²</p>
            <p>Периметр: {perimeter} м</p>
            <p>Углов: {corners}</p>
        </div>
    );
};

export default RoomStats;
