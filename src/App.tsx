import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { RouteList } from "./pages/RouteList";
import { RouteDetail } from "./pages/RouteDetail";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<RouteList />} />
          <Route path="route/:id" element={<RouteDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
