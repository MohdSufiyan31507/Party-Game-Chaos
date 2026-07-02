import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-4 text-center text-white">
        <section>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-surge">
            Loading
          </p>
          <h1 className="mt-4 text-4xl font-black">Checking your chaos pass...</h1>
        </section>
      </main>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
