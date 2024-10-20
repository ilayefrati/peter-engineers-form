import logo from "./logo.svg";
import "./App.css";
import Header from "./Header";
import ContactInfo from "./ContactInfo";
import FirstPage from "./FirstPage";
import SecondPage from "./SecondPage";
import { TableContextProvider } from "./TableContextProvider";
import ThirdPage from "./ThirdPage";
import ForthPage from "./ForthPage";

function App() {
  return (
    <>
      <Header />
      <div className="classic-page">
        <FirstPage />
        <TableContextProvider>
          <SecondPage />
          <ThirdPage />
          <ForthPage />
        </TableContextProvider>
      </div>
      <ContactInfo />
    </>
  );
}

export default App;
