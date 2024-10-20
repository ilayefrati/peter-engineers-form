import logo from "./logo.svg";
import "./App.css";
import Header from "./Header";
import ContactInfo from "./ContactInfo";
import FirstPage from "./FirstPage";
import { TableContextProvider } from "./TableContextProvider";
import SumTable from './SumTable';
import ImagesUploader from './ImagesUploader';
import DataTable from './DataTable';

function App() {
  return (
    <>
      <Header />
      <div className="classic-page">
        <FirstPage />
        <TableContextProvider>
          <SumTable/>
          <ImagesUploader/>
          <DataTable/>
        </TableContextProvider>
      </div>
      <ContactInfo />
    </>
  );
}

export default App;
