import styles from './AskAIComponent.module.scss';
import SparkleIcon from '../../assets/sparkel.png';
import {ApplicationDetailsType} from "../../types"
import ApplicationDetails from "../../Data/Data.json"

const title: ApplicationDetailsType = ApplicationDetails;

const AskAIComponent = () => {
    return (
        <div className={styles.AskAiContainer}>
            <img src={SparkleIcon} alt="Sparkle Icon" className={styles.sparkleIcon} />
            <h1 className={styles.ask_title}>{title.aiTitle}</h1>
        </div>
    );
};

export default AskAIComponent;
