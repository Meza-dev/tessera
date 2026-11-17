# Architecture Decision Record 001 — Shared Identity, Independent Projects

**Decision:** every meaningful experiment or product gets its own repository. The Design System is a separate repository with internal npm workspaces for its own packages. The portfolio is a second repository.

### Packages
- `@jonas-lab/tokens`: framework-neutral semantic CSS and a self-hosted Latin variable font entry. Fontsource packages are runtime dependencies so font URLs resolve after packaging.
- `@jonas-lab/motion`: framework-neutral JSON timing/easing/distance tokens and generated CSS. `npm run build` regenerates the CSS, and tests check its parity with the authoritative JSON.
- `@jonas-lab/ui`: React components, Motion for React primitives and shared styles. Motion remains an external runtime dependency in emitted JavaScript.

### Local development
The portfolio has relative `file:` dependencies on the sibling Design System folder. Run `npm install && npm run build` in the Design System before installing the portfolio. `npm install` may copy or link local packages; when changes do not appear in the website, rebuild and reinstall its dependencies.

Lockfiles are supplied for both projects. Use `npm ci` for subsequent clean installs, building the Design System before installing the website. The website's React Vite plugin deduplicates `react` and `react-dom` so linked UI imports share its renderer runtime. A Vite resolution regression test checks this boundary.

The Design System root `tsconfig.json` enables the automatic React JSX runtime for source components and Storybook examples. The UI's build configuration also enables this runtime for published JavaScript output. Keep both paths covered when changing the toolchain.

Storybook explicitly prebundles `react` and `react-dom` through `viteFinal` so its development renderer receives browser-compatible CommonJS interop. A browser-module transformation regression covers the React default import used by the renderer.

`MotionProvider` follows the operating system or forces reduced motion with `reducedMotion="always"`. Both explicit reduction and an unknown initial preference disable content transforms, layout indicators and control gestures. Content is visible in initial server HTML. React motion controls own their transforms, while framework-neutral `.jl-interactive` remains available to CSS consumers.

`ActionLink` and `ProjectCard` accept a typed `renderLink` function. The website composes React Router links through that boundary, preserving browser modifier keys and anchor semantics. The UI package keeps its existing plain-anchor/static-card behavior and stays independent of routing libraries.

The portfolio uses `BrowserRouter` for its pages and experiment IDs, with category state in query parameters. Navigation updates titles, route heading focus and scroll position. Production hosts must provide an `index.html` fallback for application routes while preserving static asset responses.

### Deployment/publishing (not implemented)
Replace local `file:` dependencies with versioned registry dependencies after package publishing. Keep experiments separately deployed as necessary. Link them via stable URLs, and later evaluate route proxy vs iframe vs direct embed based on isolation, security, routing and performance.

### Constraints
No enforced single framework. Do not import `@jonas-lab/ui` from non-React frontends. CI, release automation, translation tooling, Storybook screenshots and E2E tests are subsequent tasks.
