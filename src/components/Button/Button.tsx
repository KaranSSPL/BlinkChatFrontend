import { ReactNode } from "react";
import styles from "./Button.module.scss"

interface ButtonProps {
  onClick: any;
  children: ReactNode;
  variant?: 'clear' | 'regenerate' | 'copy';
}

const Button: React.FC<ButtonProps> = ({ onClick, variant = 'clear', children }) => (
  <div className={styles.button}>
    <button onClick={onClick} className={` ${styles[variant]}`}>
      {children}
    </button>
  </div>
);

export default Button;
