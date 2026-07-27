You are working on the Sisyphus Academy project.

Repository:

- Origin: mors119/sisyphus-academy
- Upstream: FrilLab/sisyphus-academy

IMPORTANT

The GitHub Issues are tracked in:
mors119/sisyphus-academy

However,

ALL code contributions MUST be prepared for:

FrilLab/sisyphus-academy

The final Pull Request target must always be:

base:
FrilLab/sisyphus-academy/main

Never create a PR against mors119/main.

────────────────────────────────────────

Development Order

Always work on exactly ONE issue.

Complete them in this order:

#12
↓

#9
↓

#10
↓

#11
↓

#2
↓

#3
↓

#4
↓

#5
↓

#6
↓

#7
↓

#8

Never skip ahead.

If the current issue is incomplete,
do not start the next issue.

────────────────────────────────────────

Before starting work

1. Check git status.

If there are unrelated local modifications,

STOP

and report them.

Do not modify unrelated work.

2. Fetch latest changes.

Synchronize

origin/main

and

upstream/main

using fast-forward only.

3. Read the GitHub Issue completely.

Repository:

mors119/sisyphus-academy

Read:

- issue body
- comments
- linked issues

Understand the issue before changing code.

────────────────────────────────────────

Implementation Rules

Always follow AGENTS.md.

Always follow Issue #2 UI rules.

Reuse existing code before creating new code.

Never introduce:

- duplicated components
- duplicated hooks
- duplicated utilities
- duplicated styles

If a reusable implementation exists,

extend it.

Do not replace it.

────────────────────────────────────────

Backend Rules

When working on backend issues:

- keep Controller thin
- business logic belongs in Service
- persistence belongs in Repository
- DTO and Entity remain separated
- write tests with new behavior

────────────────────────────────────────

Frontend Rules

Always use shared UI.

Never create feature-specific:

- Button
- Input
- Card
- Dialog
- Layout

Use the shared implementation.

If something is missing,

extend shared/ui.

Never build a local duplicate.

────────────────────────────────────────

Brand Rules

Canonical colors:

--sis: #1186ce;
--sisy: #ffcd49;

Never introduce competing primary colors.

Never hardcode colors.

Use semantic tokens.

────────────────────────────────────────

Issue Scope

Solve ONLY the requested issue.

Do not solve future issues.

If another issue blocks implementation,

STOP

and explain exactly why.

────────────────────────────────────────

Code Quality

Prefer:

less code

over

more abstractions.

Remove obsolete code whenever it becomes unnecessary.

Avoid speculative implementations.

────────────────────────────────────────

Testing

Run every relevant test.

Fix failing tests caused by your changes.

Do not modify unrelated tests.

────────────────────────────────────────

Completion

After implementation:

1. Review the entire diff.

2. Remove dead code.

3. Remove duplicated code.

4. Ensure formatting passes.

5. Ensure tests pass.

────────────────────────────────────────

Commit

Create a focused commit message.

Follow Conventional Commits.

Examples:

feat(auth):
refactor(api):
fix(ui):
test(service):

────────────────────────────────────────

Pull Request

Push the branch.

Create a Pull Request against

FrilLab/sisyphus-academy

NOT

mors119/sisyphus-academy

The PR should:

- reference the issue
- explain what changed
- explain why
- include testing performed

Close the issue using:

Closes #<issue>

────────────────────────────────────────

Most Important Rule

Never optimize for writing more code.

Always optimize for:

- consistency
- maintainability
- simplicity
- reuse
