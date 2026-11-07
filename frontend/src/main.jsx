import { CssBaseline } from "@mui/material";

import {
  ThemeProviderCustom,
} from "./context/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <ThemeProviderCustom>

      <CssBaseline />

      <App />

    </ThemeProviderCustom>

  </React.StrictMode>
);