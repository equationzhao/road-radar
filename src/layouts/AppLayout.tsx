import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="h-screen w-screen flex flex-col bg-stone-950">
      <Outlet />
    </div>
  );
}
