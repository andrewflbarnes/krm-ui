import AppRouter from "./AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { BreadcrumberProvider } from "./hooks/breadcrumb";
import { KingsProvider } from "./hooks/kings";

const queryClient = new QueryClient()

export default function App() {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
    }}>
      <QueryClientProvider client={queryClient}>
        <BreadcrumberProvider>
          <KingsProvider>
            <AppRouter />
          </KingsProvider>
        </BreadcrumberProvider>
      </QueryClientProvider>
    </div>
  )
}
