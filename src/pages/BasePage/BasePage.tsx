import styles from './BasePage.module.scss';
import {CanvasEditorLazy} from "@/entities/CanvasEditor/ui/CanvasEditorLazy.tsx";
import {Suspense} from "react";
import {ControlsPanelLeftLazy} from "@/entities/ControlsPanelLeft/ui/ControlsPanelLeftLazy.tsx";

export function BasePage() {
    return (
        <>
            <Suspense fallback={<div>Loading Canvas...</div>}>
                <ControlsPanelLeftLazy className={styles.panel} />
            </Suspense>
            <Suspense fallback={<div>Loading Canvas...</div>}>
                <CanvasEditorLazy  className={styles.canvas} />
            </Suspense>
        </>
    );
}