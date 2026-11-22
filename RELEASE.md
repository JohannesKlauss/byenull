# Releasing

The three public packages are versioned independently with Changesets. The
website and root workspace are private and are not published.

Before the first release, verify that the npm names `byenull`,
`byenull-testing`, and `byenull-oxlint` are available to the publishing account.
Configure each package on npm to trust the GitHub Actions workflow
`release.yml` in `JohannesKlauss/byenull`. For new packages, follow npm's
instructions for creating a trusted publisher before the initial publish, or
publish the first versions locally with an authorized npm account and then
configure trusted publishing. See [npm's trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).

To release the current initial versions, merge the release preparation to
`main`, then run the **Publish packages** workflow on `main` from GitHub Actions.
It tests and builds the packages, publishes versions absent from npm, and pushes
the resulting package tags. The workflow requires Actions to have permission to
write repository contents. It does not publish automatically on push.

For later releases:

1. Run `pnpm changeset` when making a releasable change and commit the generated
   changeset with the change.
2. Run `pnpm version-packages` to consume pending changesets and update package
   versions, internal peer ranges, and changelogs. Commit and merge the result
   to `main` after review.
3. Run the **Publish packages** workflow on `main`. If publication fails partway
   through, inspect npm and the workflow log before rerunning it; published
   versions cannot be replaced.

For a local first publish, run `pnpm test`, `pnpm build`, and `pnpm release`
from a clean checkout authenticated to npm, then push the generated tags with
`git push --follow-tags`. Use pnpm/Changesets to publish: it resolves workspace
peer dependency ranges in the published manifests.
