import {MdDelete} from 'react-icons/md';
import clsx from 'clsx';
import styles from './DeleteIconButton.module.scss';

type Props = {
    label?: string;
    onClick: () => void;
    className?: string;
};

export function DeleteIconButton({
                                     label = 'Удалить иконку',
                                     onClick,
                                     className,
                                 }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={clsx(styles.button, className)}
        >
            <MdDelete className={styles.icon}/>
            <span className={styles.label}>{label}</span>
        </button>
    );
}
