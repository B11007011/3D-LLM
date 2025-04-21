import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ProjectAssistant from "@/pages/3DProjectAssistant";
import ConsoleDemo from "@/pages/ConsoleDemo";
import ModelLoadingDemo from "@/pages/ModelLoadingDemo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ProjectAssistant} />
      <Route path="/console" component={ConsoleDemo} />
      <Route path="/model-loading" component={ModelLoadingDemo} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
