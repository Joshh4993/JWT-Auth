import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import CreateProject from "./components/CreateProject";
import CreateSPToken from "./components/CreateSPToken";
import ViewSPToken from "./components/ViewSPToken";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project/create" element={<CreateProject />} />
        <Route path="/sptoken/create" element={<CreateSPToken />} />
        <Route path="/sptoken/:sptokenId" element={<ViewSPToken />} />
        <Route path="/dashboard" element={
          <>
            <Navbar />
            <Dashboard />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;