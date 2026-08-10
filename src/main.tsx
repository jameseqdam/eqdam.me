import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Static hosts (GitHub Pages) serve 404.html for deep links such as
// /work/navi-ai-agent. That page stashes the original URL and bounces to "/",
// so restore the path here before the router reads location.
const redirected = sessionStorage.getItem('redirect');
if (redirected) {
  sessionStorage.removeItem('redirect');
  try {
    const target = new URL(redirected);
    if (target.origin === window.location.origin && target.pathname !== window.location.pathname) {
      window.history.replaceState(null, '', target.pathname + target.search + target.hash);
    }
  } catch {
    // Ignore a malformed stash rather than blocking the app from booting.
  }
}

createRoot(document.getElementById("root")!).render(<App />);
