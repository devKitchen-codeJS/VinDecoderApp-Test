import { NavLink, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import { VariableDetailsPage } from "./pages/VariableDetailsPage/VariableDetailsPage";
import { VariablesPage } from "./pages/VariablesPage/VariablesPage";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "text-sm font-medium no-underline",
    isActive ? "text-accent" : "text-text-muted hover:text-text hover:no-underline",
  ].join(" ");
}

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="max-w-[960px] mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-baseline gap-2 font-mono text-lg font-bold tracking-wide text-text">
            <span className="text-accent">▍</span>VIN Decoder
          </div>
          <nav className="flex gap-6" aria-label="Основна навігація">
            <NavLink to="/" end className={navLinkClass}>
              Розшифровка
            </NavLink>
            <NavLink to="/variables" className={navLinkClass}>
              Змінні
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[960px] mx-auto px-4 pt-8 pb-12 sm:px-6 max-[480px]:px-4 max-[480px]:pt-6 max-[480px]:pb-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/variables" element={<VariablesPage />} />
          <Route path="/variables/:variableId" element={<VariableDetailsPage />} />
        </Routes>
      </main>

      <footer className="border-t border-border px-4 py-3 text-center text-xs text-text-muted">
        Дані надані NHTSA vPIC API
      </footer>
    </div>
  );
}
