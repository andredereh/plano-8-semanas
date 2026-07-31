import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PlanPage from "./pages/PlanPage";
import WeightPage from "./pages/WeightPage";
import NutritionPage from "./pages/NutritionPage";
import WeeklyReportPage from "./pages/WeeklyReportPage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./_core/hooks/useAuth";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, refresh } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={refresh} />;
  }

  return <>{children}</>;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/plano"} component={PlanPage} />
      <Route path={"/nutricao"} component={NutritionPage} />
      <Route path={"/peso"} component={WeightPage} />
      <Route path={"/relatorio"} component={WeeklyReportPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <AuthGate>
            <Router />
          </AuthGate>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
