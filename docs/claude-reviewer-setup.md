# Claude Reviewer setup

The `Claude pull request review` workflow runs a read-only review when a non-draft pull request targets `main` from a branch in this repository, and only while the repository is public. It reads the PR diff, sends that diff to Anthropic's Messages API, and posts or updates one conversation comment as the installed **Joan QA Portfolio Claude Reviewer** app.

The workflow does not check out or execute pull request code. Its installation token is scoped to this repository and to Contents read, Pull requests read, and Issues write. GitHub groups conversation comments with the Issues permission, which also allows issue updates. The workflow does not write code, create commits, approve or merge PRs, or run on fork PRs. Each review sends the diff to Anthropic and may incur API usage charges.

## One-time repository settings

After this workflow is merged into `main`, add these values in **Settings → Secrets and variables → Actions**:

| Name | Type | Value |
| --- | --- | --- |
| `CLAUDE_REVIEWER_APP_CLIENT_ID` | Variable | Client ID from the Claude Reviewer GitHub App settings |
| `CLAUDE_REVIEWER_APP_PRIVATE_KEY` | Secret | Contents of a newly generated `.pem` private key for that app |
| `ANTHROPIC_API_KEY` | Secret | API key from the Anthropic Console |

The app must remain installed only on this repository with Contents read, Pull requests read, and Issues read/write. Never commit or share the private key or API key. Optional variable `CLAUDE_REVIEWER_MODEL` overrides the default `claude-sonnet-5` model identifier.

This is an explicit exception to the project's external-AI boundary: only the public PR diff is sent to Anthropic for review. Do not put confidential employer material, private URLs, credentials, personal data, or unapproved CV content in a PR. The workflow skips reviews if the repository is private.

The current integration reviews the diff only; it does not run tests or inspect the full repository. Joan remains responsible for evaluating findings and merging changes.
