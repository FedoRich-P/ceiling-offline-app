import {lazy} from "react";

export const ControlsPanelLeftLazy = lazy(() =>
    import('./ControlsPanelLeft').then(module => ({ default: module.ControlsPanelLeft }))
);