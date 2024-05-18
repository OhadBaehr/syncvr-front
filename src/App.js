import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hello from "./components/Hello"
import PageBlock from "./components/PageBlock"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/block" element={<PageBlock />}/>
        <Route exact path="/hello" element={<Hello />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App; 
