import Header from './components/Header/Header';
import Chatbot from './components/Chatbot/Chatbot';
import AskAIComponent from "./components/AskAIComponent/AskAIComponent";
import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.chatBotMain}>
      <Header />
      <AskAIComponent />
      <Chatbot />
    </div>
  )
}

export default App
