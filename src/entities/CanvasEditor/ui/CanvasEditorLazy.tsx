import {lazy} from "react";

export const CanvasEditorLazy = lazy(() =>
    import('./CanvasEditor').then(module => ({ default: module.CanvasEditor }))
);