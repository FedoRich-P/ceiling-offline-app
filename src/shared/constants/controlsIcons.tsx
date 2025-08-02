import { FaLightbulb, FaRulerCombined } from 'react-icons/fa';
import { LuLampCeiling } from 'react-icons/lu';
import type {ReactElement} from "react";

export interface IconTypeData {
    type: 'light' | 'chandelier' | 'cornice_overlay' | 'cornice_hidden1' | 'cornice_hidden2';
    icon: ReactElement;
    label: string;
    mode: string;
}

export const ICONS_TYPES = [
    { type: 'light', icon: <FaLightbulb color="orange" size={20} />, label: 'Свет', mode: 'addLight' },
    { type: 'chandelier', icon: <LuLampCeiling color="gold" size={20} />, label: 'Люстра', mode: 'addChandelier' },
    { type: 'cornice_overlay', icon: <FaRulerCombined color="gray" size={20} />, label: 'Карниз накладной', mode: 'addCorniceOverlay' },
    { type: 'cornice_hidden1', icon: <FaRulerCombined color="darkgray" size={20} />, label: 'Карниз скрытый 1', mode: 'addCorniceHidden1' },
    { type: 'cornice_hidden2', icon: <FaRulerCombined color="lightgray" size={20} />, label: 'Карниз скрытый 2', mode: 'addCorniceHidden2' },
];