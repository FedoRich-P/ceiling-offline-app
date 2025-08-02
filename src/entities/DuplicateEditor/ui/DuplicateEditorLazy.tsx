import {lazy} from "react";

export const DuplicateEditorLazy = lazy(() =>
    import('./DuplicateEditor').then(module => ({ default: module.DuplicateEditor }))
);