import logo from "./logo.svg";
import "./App.css";
import FirstPage from "./FirstPage";
import SecondPage from "./SecondPage";
import { TableContextProvider } from "./TableContextProvider";
import ThirdPage from "./ThirdPage";

function App() {
  return (
    <div className="App">
      <TableContextProvider>
        <FirstPage />
        <SecondPage />
      </TableContextProvider>
      <ThirdPage/>
    </div>
  );
}

export default App;
