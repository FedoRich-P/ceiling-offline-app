import {lazy} from "react";

export const BasePageLazy = lazy(() =>
    import('./BasePage').then(module => ({ default: module.BasePage }))
);