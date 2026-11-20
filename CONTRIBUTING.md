# Contribute to TESSERA

Use Node.js 22.12 or later on the 22.x release line, Node.js 24, or Node.js 26 or later, and npm 10.9 or later. Run `npm ci` at the monorepo root.

## Make a change

1. Use existing tokens for component styling and motion. Keep theme and motion CSS importable without React.
2. Add or update a Storybook story for the changed states. Verify keyboard focus, narrow layouts and reduced motion where relevant.
3. Run `npm run build`, `npm run typecheck`, `npm test`, `npm run build-storybook` and `npm run smoke:package`.
4. Run `npm run changeset` for a consumer-facing change and select `@tessera-system/tessera`. Use a patch for fixes, a minor for compatible features, and a major for breaking stable releases. Before `1.0.0`, use a minor version for breaking changes and call them out in the changelog.

## Release

1. Review pending changesets and run `npm run version-packages`. Review the generated versions, dependency ranges, changelogs and lockfile, then run the checks above.
2. Run the dependency checks below. Pack the public workspace and inspect the manifest, exports, licenses and contents.

   ```sh
   npm pack --workspace @tessera-system/tessera
   ```

3. Run `npm run smoke:package` to pack and install the built workspace in separate CSS-only and React fixtures. It verifies optional peer isolation, CSS and fonts, JSON, type declarations and server rendering from the installed package.
4. Confirm `npm whoami` uses an account with publish access to the `@tessera-system` scope and check the prepared package version on the public registry. An unpublished package lookup confirms only that it is not publicly listed. Obtain explicit publishing approval and satisfy npm authentication and 2FA before any upload.
5. Publish the verified tarball with `npm publish <tarball> --access public`. Verify the registry version before replacing local workspace dependencies in applications.

GitHub repository visibility and npm publication are separate maintainer decisions.

## Continuous integration

GitHub Actions runs build, tests, type checking, Storybook, a local package smoke check and two dependency audits on pull requests and pushes to `main`.

| Dependency check | Failure threshold |
|---|---|
| `npm audit --omit=dev --audit-level=low` | Low or higher in the production dependency tree. |
| `npm audit --include=dev --audit-level=high` | High or critical in the full tree, including tooling. |

Both commands report lower-severity findings in their selected trees. Registry errors fail the corresponding check. Review lower-severity tooling findings during release preparation and upgrade affected dependencies where feasible.
