import {lazy} from "react";

export const ControlsPanelRightLazy = lazy(() =>
    import('./ControlsPanelRight').then(module => ({ default: module.ControlsPanelRight }))
);