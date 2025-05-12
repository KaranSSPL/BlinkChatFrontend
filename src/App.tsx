import Header from './components/Header/Header';
import Chatbot from './components/Chatbot/Chatbot';
import AskAIComponent from "./components/AskAIComponent/AskAIComponent";
import styles from './App.module.scss';
import { v4 as uuidv4 } from "uuid";

function App() {

  const sessionId = uuidv4();
  sessionStorage.setItem("sessionId", sessionId);

  return (
    <div className={styles.chatBotMain}>
      <Header />
      <AskAIComponent />
      <Chatbot />
    </div>
  )
}

export default App
