import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SetPin from "./pages/SetPin";
import LockScreen from "./pages/LockScreen";
import ChatsList from "./pages/ChatsList";
import NewChat from "./pages/NewChat";
import ChatRoom from "./pages/ChatRoom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/chats" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/set-pin" element={<SetPin />} />
          <Route path="/lock" element={<LockScreen />} />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <ChatsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-chat"
            element={
              <ProtectedRoute>
                <NewChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
