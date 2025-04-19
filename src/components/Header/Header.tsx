import styles from "./header.module.scss"
import { ApplicationDetailsType } from "../../types";
import ApplicationDetails from "../../Data/Data.json";

const appDetails: ApplicationDetailsType = ApplicationDetails;

const Header = () => {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>{appDetails.applicationName}</h1>
        </div>
    )
}

export default Header;