import React from 'react';
import styles from './DotLoader.module.scss';

const DotLoader: React.FC = () => {
    return (
        <div className={styles.loading}>
            <span className={styles.loading__dot}></span>
            <span className={styles.loading__dot}></span>
            <span className={styles.loading__dot}></span>
        </div>
    );
};

export default DotLoader;
