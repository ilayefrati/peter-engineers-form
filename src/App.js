import logo from "./logo.svg";
import "./App.css";
import FirstPage from "./FirstPage";
import SecondPage from "./SecondPage";
import { TableContextProvider } from "./TableContextProvider";

function App() {
  return (
    <div className="App">
      <TableContextProvider>
        <FirstPage />
        <SecondPage />
      </TableContextProvider>
    </div>
  );
}

export default App;
