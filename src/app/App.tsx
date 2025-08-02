import {RouterProvider} from "react-router";
import {router} from "@/app/routes/router.tsx";

function App() {
    return <RouterProvider router={router}/>
}
export default App;


// <>
//     <main className={styles.mainContent} role="main">
//         <ControlsPanelLeft className={styles.leftPanel}/>
//         <section className={styles.canvasSection}>
//             <CanvasEditor className={styles.canvas}/>
//             <DuplicateEditor className={styles.duplicate}/>
//         </section>
//         <ControlsPanelRight className={styles.rightPanel}/>
//     </main>
//
//     <footer className={styles.footer} aria-label="Статистика и размеры">
//         <RoomStats/>
//         <DimensionsTable/>
//     </footer>
// </>