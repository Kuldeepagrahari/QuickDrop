import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import CreateRoom from "./pages/CreateRoom.jsx";
import JoinRoom from "./pages/JoinRoom.jsx";
import Room from "./pages/Room.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />

                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/create-room"
                            element={<CreateRoom />}
                        />

                        <Route
                            path="/join-room"
                            element={<JoinRoom />}
                        />

                        <Route
                            path="/room/:roomId"
                            element={<Room />}
                        />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;