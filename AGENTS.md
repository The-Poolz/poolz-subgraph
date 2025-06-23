# Repository Agent Guidelines

The instructions in this file apply to all files in this repository.

- **Indentation:** Use two spaces for each indentation level. Avoid tabs.
- **Package manager:** Use `yarn` for installing dependencies (`yarn install`).
- **Build:** After modifying subgraph code, run `yarn codegen && yarn build` to regenerate types and build artifacts.
- **Testing:** Run the unit tests with `yarn test` and ensure they pass before committing.
- **Tests location:** Place new tests in the `tests` directory alongside the existing matchstick tests.
