import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 h-14 flex items-center">
        <span className="font-semibold text-lg">ServerDesk</span>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
