import "./global.css";
import App from "./App.tsx";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./i18n.ts";

const client = new QueryClient();

async function deferRender() {
  if (process.env.NODE_ENV != "development") return;
  const { worker } = await import("./mocks/browser.js");
  worker.start();
}

deferRender().then(() => {
  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={client}>
      <StrictMode>
        <Suspense fallback="loading...">
          <App />
        </Suspense>
      </StrictMode>
    </QueryClientProvider>
  );
});
