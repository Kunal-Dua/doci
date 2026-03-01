import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Document from "./pages/Document";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Document />}></Route>
                    <Route path="/signin" element={<Signin />}></Route>
                    <Route path="/signup" element={<Signup />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
