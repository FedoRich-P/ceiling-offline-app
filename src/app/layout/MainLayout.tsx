import { Outlet, NavLink } from 'react-router';
import styles from './MainLayout.module.scss';
import RoomStats from "@/shared/components/RoomStats/ui/RoomStats.tsx";
import DimensionsTable from "@/entities/DimensionsTable/ui/DimensionsTable.tsx";
import {PATHS} from "@/app/routes/paths.ts";

export function MainLayout() {
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <nav className={styles.nav} aria-label="Навигация">
                    <NavLink className={styles.link} to={PATHS.BASE}>Базовый план</NavLink>
                    <NavLink className={styles.link} to={PATHS.EDITOR}>План с допами</NavLink>
                    <button className={styles.link}> Сохранить заказ </button>
                </nav>
            </header>

            <main className={styles.main} role="main">
                <Outlet />
            </main>

            <footer className={styles.footer} aria-label="Статистика и размеры">
                <RoomStats/>
                <DimensionsTable className={'flex-1'}/>
            </footer>
        </div>
    );
}
