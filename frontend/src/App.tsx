import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { RequireAuth } from "./components/layout/RequireAuth";
import { routes } from "./routes";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routes.map(({ path, component: Page, fullScreen }) => (
          <Route
            key={path}
            path={path}
            element={
              fullScreen ? (
                <Page />
              ) : (
                <RequireAuth>
                  <AppLayout>
                    <Page />
                  </AppLayout>
                </RequireAuth>
              )
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
}
