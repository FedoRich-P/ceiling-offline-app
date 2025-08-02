export type Point = {
    x: number;
    y: number;
    name?: string;
    isDiagonal?: boolean;
}

export type Diagonal = {
    from: number;
    to: number;
}

export type ToolMode =
    |'pencil'
    | 'line'
    | 'select'
    | 'addLight'
    | 'addChandelier'
    | 'addCorniceOverlay'
    | 'addCorniceHidden1'
    | 'addCorniceHidden2'
    | 'none';

export type MarkupIconType = 'light' | 'chandelier' | 'cornice_overlay' | 'cornice_hidden1' | 'cornice_hidden2';