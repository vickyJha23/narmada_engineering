import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')!

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// `pnpm build` prerenders every route to static HTML, so in production we
// hydrate that markup instead of throwing it away and rendering from scratch.
if (root.hasChildNodes()) hydrateRoot(root, tree)
else createRoot(root).render(tree)
