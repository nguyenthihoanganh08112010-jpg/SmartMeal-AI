# SmartMeal AI repository instructions

Whenever you make a meaningful change to SmartMeal AI:

1. Modify the required source files.

2. Update relevant technical documentation under /docs when the
   implementation changes behavior, data, architecture, tests,
   UI flow, or product rules.

3. Append one entry to /prompt-log/PROMPT_LOG.md containing:
   - Date
   - Task ID
   - User request summary
   - AI/Codex task performed
   - Files changed
   - Implementation result
   - Tests performed
   - Evidence IDs
   - Git commit hash, when available

4. Update /prompt-log/CHANGELOG_AI.md with a concise description
   of AI-assisted changes.

5. Never invent evidence, test results, screenshots, or approval.

6. If a test was not executed, mark it NOT VERIFIED.

7. Do not write secrets, passwords, API keys, access tokens,
   personal user data, or private health data into the repository.

8. Before committing:
   - run available tests;
   - check changed files;
   - ensure documentation matches implementation.

9. Commit related code and documentation together.

10. Use descriptive commit messages, for example:
    feat(ai-chat): add multiple meal recommendations
    fix(diary): delete individual dish only
    docs(prompt-log): record diary deletion update

11. Prefer creating a branch / pull request for meaningful changes
    rather than modifying the protected production branch directly.

12. Never alter approved SmartMeal product requirements merely to
    make the implementation easier. If implementation and PRD conflict,
    report the conflict.
