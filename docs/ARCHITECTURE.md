# Architecture Decision Record 001 — Shared Identity, Independent Projects

**Decision:** every meaningful experiment or product gets its own repository. TESSERA is the shared Design System repository with internal npm workspaces for its own packages. Personal Website and Jonas Lab consume TESSERA independently.

### Packages
- `@tessera/tokens`: framework-neutral semantic CSS and a self-hosted Latin variable font entry. Fontsource packages are runtime dependencies so font URLs resolve after packaging.
- `@tessera/motion`: framework-neutral JSON timing/easing/distance tokens and generated CSS. `npm run build` regenerates the CSS, and tests check its parity with the authoritative JSON.
- `@tessera/ui`: React components, Motion for React primitives and shared styles. Motion remains an external runtime dependency in emitted JavaScript.

### Local development
Both applications have relative `file:../tessera/packages/*` dependencies on the sibling TESSERA folder. Run `npm ci` and `npm run build` in `tessera` before installing either application. npm may copy or link local packages. When changes do not appear in the website, rebuild TESSERA and reinstall the website dependencies.

Each project supplies its own lockfile. Use `npm ci` for subsequent clean installs, building the Design System before installing the website. The website's React Vite plugin deduplicates `react` and `react-dom` so linked UI imports share its renderer runtime. A Vite resolution regression test checks this boundary.

The Design System root `tsconfig.json` enables the automatic React JSX runtime for source components and Storybook examples. The UI's build configuration also enables this runtime for published JavaScript output. Keep both paths covered when changing the toolchain.

Storybook explicitly prebundles `react` and `react-dom` through `viteFinal` so its development renderer receives browser-compatible CommonJS interop. A browser-module transformation regression covers the React default import used by the renderer.

`MotionProvider` follows the operating system or forces reduced motion with `reducedMotion="always"`. Both explicit reduction and an unknown initial preference disable content transforms, layout indicators and control gestures. Content is visible in initial server HTML. React motion controls own their transforms, while framework-neutral `.jl-interactive` remains available to CSS consumers.

`ActionLink` and `ProjectCard` accept a typed `renderLink` function. The website composes React Router links through that boundary, preserving browser modifier keys and anchor semantics. The UI package keeps its existing plain-anchor/static-card behavior and stays independent of routing libraries.

Personal Website and Jonas Lab use `BrowserRouter` for project and experiment IDs. The lab stores category state in query parameters. Navigation updates titles, route heading focus and scroll position. Production hosts must provide an `index.html` fallback for application routes while preserving static asset responses.

### Deployment/publishing (not implemented)
Replace local `file:` dependencies with versioned registry dependencies after package publishing. Keep experiments separately deployed as necessary. Link them via stable URLs, and later evaluate route proxy vs iframe vs direct embed based on isolation, security, routing and performance.

### Constraints
No enforced single framework. Do not import `@tessera/ui` from non-React frontends. CI, release automation, translation tooling, Storybook screenshots and E2E tests are subsequent tasks.

### Identity compatibility
The package migration is documented in the [root README](../README.md#package-migration). TESSERA uses the `@tessera` package scope and `tessera-workspace` workspace name. Component APIs and framework-neutral visual/motion values preserve version 0.2 behavior. Existing `--jl-*` tokens, `.jl-*` classes and `data-jl-theme` remain stable compatibility interfaces for consumers.
