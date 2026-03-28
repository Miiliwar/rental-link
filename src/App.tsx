import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import RequireCompleteProfile from './components/RequireCompleteProfile';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchPage from './pages/Search';
import CompleteProfile from './pages/CompleteProfile';
import ListItem from './pages/ListItem';
import BookingStart from './pages/BookingStart';
import Admin from './pages/Admin';
import RequireAdmin from './components/RequireAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="account/complete" element={<CompleteProfile />} />
          <Route
            path="list"
            element={
              <RequireCompleteProfile intent="lender">
                <ListItem />
              </RequireCompleteProfile>
            }
          />
          <Route
            path="rent"
            element={
              <RequireCompleteProfile intent="renter">
                <BookingStart />
              </RequireCompleteProfile>
            }
          />
          <Route
            path="admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
