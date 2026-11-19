# Contribute to TESSERA

Use Node.js 22.12 or later on the 22.x release line, Node.js 24, or Node.js 26 or later, and npm 10.9 or later. Run `npm ci` at the monorepo root.

## Make a change

1. Use existing tokens for component styling and motion. Keep theme and motion CSS importable without React.
2. Add or update a Storybook story for the changed states. Verify keyboard focus, narrow layouts and reduced motion where relevant.
3. Run `npm run build`, `npm run typecheck`, `npm test` and `npm run build-storybook`.
4. Run `npm run changeset` for a consumer-facing change and select the affected public workspaces. Use a patch for fixes, a minor for compatible features, and a major for breaking stable releases. Before `1.0.0`, use a minor version for breaking changes and call them out in the changelog.

## Release

1. Review pending changesets and run `npm run version-packages`. Review the generated versions, dependency ranges, changelogs and lockfile, then run the checks above.
2. Run `npm audit` and `npm audit --omit=dev`. Pack the public workspaces and inspect the manifests, exports, licenses and contents.

   ```sh
   npm pack --workspace @tessera/tokens --workspace @tessera/motion --workspace @tessera/react
   ```

3. Install the three resulting tarballs together in a separate React 19 application. Verify TypeScript, startup, CSS and Geist assets, and motion behavior.
4. Confirm `npm whoami` uses an account with publish access to the `@tessera` scope, and check the exact names and versions on the public registry. An unpublished package lookup confirms only that it is not publicly listed. Obtain explicit publishing approval and satisfy npm authentication and 2FA before any upload.
5. Publish the verified tarballs with `npm publish <tarball> --access public` in this order: tokens, motion, React. Verify all three registry versions, then replace the applications' local dependencies with registry versions and test each application in its own repository.

GitHub repository visibility and npm publication are separate maintainer decisions.
