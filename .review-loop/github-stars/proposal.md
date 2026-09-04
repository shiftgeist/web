# GitHub Stars Catalogue

## Status: DRAFT

## Terms

- A GitHub list is a user-curated GitHub collection of starred repositories.
- A star snapshot contains public starred repository metadata and GitHub list membership.
- The catalogue is static site data that the manual update command creates.
- An interest is a topic that the local model infers from starred repositories.
- A favorite tool is a starred repository that the local model selects for the catalogue.
- A daily-driver tool is a favorite tool that the local model identifies as regular-use software.

## Gate 1: star-snapshot

Scope: Add one explicit package script that creates a local star snapshot.
The script uses authenticated GitHub GraphQL requests through `gh`.
The script paginates all starred repositories and all GitHub list items.
The script supports about 5,000 starred repositories and dozens of GitHub lists.
The script stores raw responses outside committed site data.
The script excludes private repositories before it creates site data.
The normal Astro build and deployment do not call GitHub.

```gherkin
Scenario: Manual update fetches every public starred repository
  Given the authenticated GitHub account has more than 100 public starred repositories
  When the user runs the explicit GitHub stars update command
  Then the script follows every starred repository cursor
  And the star snapshot includes every public starred repository exactly once
```

```gherkin
Scenario: Manual update keeps GitHub list membership
  Given a public starred repository belongs to one or more GitHub lists
  When the script creates the star snapshot
  Then the snapshot records each GitHub list name and membership
```

```gherkin
Scenario: Private repository data never reaches site data
  Given the authenticated GitHub account has a private starred repository
  When the script creates the star snapshot
  Then the script excludes that repository from generated site data
  And the static site exposes no private repository metadata
```

```gherkin
Scenario: GitHub access failure preserves generated catalogue data
  Given a generated catalogue exists
  And GitHub authentication fails or GitHub returns an API error
  When the user runs the update command
  Then the command fails with an actionable error
  And the command keeps the existing generated catalogue unchanged
```

```gherkin
Scenario: Normal build does not fetch GitHub data
  Given the GitHub CLI has no authenticated session
  When the user runs the normal Astro build command
  Then the build does not call GitHub
  And the build uses existing generated catalogue data
```

## Gate 2: local-classification

Scope: Extend the manual update command with local model calls.
The command sends public repository names, descriptions, topics, and GitHub list membership to the local model.
The command processes bounded batches that fit the model context window.
The command generates interests, favorite tools, and daily-driver tools as validated static catalogue data.
The command writes output only after it validates every model response.

```gherkin
Scenario: Local model groups starred projects into interests
  Given the star snapshot has public starred repositories
  When the update command classifies the snapshot
  Then the local model groups repositories into named interests
  And each interest links to its selected public repositories
```

```gherkin
Scenario: Local model selects favorite and daily-driver tools
  Given the star snapshot has public starred repositories and GitHub list membership
  When the update command classifies the snapshot
  Then the catalogue includes a bounded favorite tool set
  And the catalogue includes a bounded daily-driver tool set
  And each selected tool has a repository name, description, and GitHub URL
```

```gherkin
Scenario: GitHub lists inform local classification
  Given a public starred repository belongs to a GitHub list
  When the local model classifies that repository
  Then the command supplies the GitHub list name as classification context
  And the generated catalogue retains the result without publishing GitHub list membership
```

```gherkin
Scenario: Invalid local model output preserves generated catalogue data
  Given a generated catalogue exists
  And the local model returns invalid JSON or an incomplete classification
  When the user runs the update command
  Then the command fails with an actionable error
  And the command keeps the existing generated catalogue unchanged
```

```gherkin
Scenario: Update command never runs local model during deployment
  Given the production deployment runs the normal Astro build command
  When the deployment builds the site
  Then the build does not start a local model request
  And the build does not require a local model runtime
```

```gherkin
Scenario: Update command uses the chosen local model runtime
  Given the local model runtime is [??? Ollama on its default local endpoint, or another runtime? | rec: Ollama on its default local endpoint]
  When the user runs the explicit GitHub stars update command
  Then the command sends classification requests to that local runtime
  And the command documents the required local model configuration
```

## Gate 3: catalogue-page

Scope: Add a static `/tools` page that reads generated catalogue data.
The page shows interests, favorite tools, and daily-driver tools.
The page links each tool to its GitHub repository.
The page adds no client-side GitHub request or local model request.
The page does not extend `/` because `homepage-landing` already owns that route.

```gherkin
Scenario: Visitor can inspect generated interests
  Given generated catalogue data contains interests
  When a visitor opens `/tools`
  Then the page presents every generated interest
  And the page links each displayed repository to GitHub
```

```gherkin
Scenario: Visitor can inspect favorite tools
  Given generated catalogue data contains favorite tools
  When a visitor opens `/tools`
  Then the page presents a favorite tools section
  And each tool shows its name and description
```

```gherkin
Scenario: Visitor can inspect daily-driver tools
  Given generated catalogue data contains daily-driver tools
  When a visitor opens `/tools`
  Then the page presents a daily-driver tools section
  And each tool shows its name and description
```

```gherkin
Scenario: Empty catalogue section remains understandable
  Given generated catalogue data has no entries for one catalogue section
  When a visitor opens `/tools`
  Then the page identifies that section as unavailable
  And the page remains valid and readable
```

```gherkin
Scenario: Catalogue page has no runtime data dependency
  Given a visitor opens `/tools`
  When the page renders in production
  Then the browser makes no GitHub API request
  And the browser makes no local model request
```

## Open Questions

- [ ] Which local model runtime should the command use? — rec: Ollama on its default local endpoint
