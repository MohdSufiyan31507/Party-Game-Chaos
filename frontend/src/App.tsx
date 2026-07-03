import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { RequireAuth } from "./components/layout/RequireAuth";
import { useRoom } from "./contexts/RoomContext";
import { routes } from "./routes";

const roomFlowPaths = [
  "/lobby",
  "/teams",
  "/games",
  "/categories",
  "/intro",
  "/play",
  "/round-result",
  "/leaderboard",
  "/winner",
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRoom } = useRoom();

  useEffect(() => {
    if (!activeRoom) return;
    if (!roomFlowPaths.some((path) => location.pathname.startsWith(path))) return;

    const code = activeRoom.code;
    let nextPath = `/lobby/${code}`;

    if (activeRoom.finalResult || activeRoom.status === "closed") {
      nextPath = `/winner/${code}`;
    } else if (activeRoom.gameplay?.isActive && activeRoom.gameplay.phase === "playing") {
      nextPath = `/play/${code}`;
    } else if (activeRoom.gameplay?.isActive && activeRoom.gameplay.phase === "round-result") {
      if (location.pathname.startsWith("/leaderboard")) return;
      nextPath = `/round-result/${code}`;
    } else if (activeRoom.selectedCategory) {
      nextPath = "/intro";
    } else if (activeRoom.selectedGameId) {
      nextPath = "/categories";
    } else if (activeRoom.status === "game-selection") {
      nextPath = "/games";
    } else if (activeRoom.status === "team-setup") {
      nextPath = `/teams/${code}`;
    }

    if (location.pathname !== nextPath) {
      navigate(nextPath, { replace: true });
    }
  }, [
    activeRoom?.code,
    activeRoom?.finalResult,
    activeRoom?.gameplay?.isActive,
    activeRoom?.gameplay?.phase,
    activeRoom?.selectedCategory,
    activeRoom?.selectedGameId,
    activeRoom?.status,
    location.pathname,
    navigate,
  ]);

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
