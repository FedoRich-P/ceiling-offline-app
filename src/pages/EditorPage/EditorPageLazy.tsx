import {lazy} from "react";

export const EditorPageLazy = lazy(() =>
    import('./EditorPage').then(module => ({ default: module.EditorPage }))
);