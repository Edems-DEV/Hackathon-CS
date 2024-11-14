import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "./App.css";
import Runners from "./components/features/Runners";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Runners />
    </QueryClientProvider>
  );
}

export default App;