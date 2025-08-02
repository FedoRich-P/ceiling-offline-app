import {createBrowserRouter} from "react-router";
import {Suspense} from "react";
import {BasePageLazy} from "@/pages/BasePage/BasePageLazy.tsx";
import {EditorPageLazy} from "@/pages/EditorPage/EditorPageLazy.tsx";
import {MainLayout} from "@/app/layout/MainLayout.tsx";
import {PATHS} from "@/app/routes/paths.ts";

export const router = createBrowserRouter([
    {
        path: PATHS.BASE,
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<div>Loading Base Page...</div>}>
                        <BasePageLazy />
                    </Suspense>
                ),
            },
            {
                path: PATHS.EDITOR,
                element: (
                    <Suspense fallback={<div>Loading Duplicate Page...</div>}>
                        <EditorPageLazy />
                    </Suspense>
                ),
            },
        ],
    },
]);