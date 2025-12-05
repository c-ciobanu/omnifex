import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import { Spinner } from "./components/ui/spinner";
import { authClient } from "./lib/auth-client";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./utils/orpc";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => <Spinner />,
  context: { auth: null },
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  },
});

function App() {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  return <RouterProvider router={router} context={{ auth: data }} />;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(<App />);
}
