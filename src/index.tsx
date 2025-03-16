import React from "react";
import ReactDOM from "react-dom/client";
import App  from "./App"; // ✅ Use named import
import "./styles/global.css"; // Import global styles

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
