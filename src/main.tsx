import { createRoot } from "react-dom/client";
import "./integrations/amplify/configure";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.js';

Amplify.configure(awsExports);

createRoot(document.getElementById("root")!).render(<App />);
