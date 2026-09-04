# Homepage Landing

## Status: READY

## Gate 1: homepage-landing

Scope: Replace the gallery link on `/` with a small personal landing page.
The page presents Felix Hungenberg as a software developer and engineering designer.
The gate keeps the shared site layout and its existing interactions.
The gate adds no project list, contact link, content collection, or dependency.

```gherkin
Scenario: Visitor understands the site's owner and role
  Given a visitor opens the homepage at `/`
  When the page renders
  Then the page identifies Felix Hungenberg
  And the page presents him as a software developer
  And the page presents him as an engineering designer
```

```gherkin
Scenario: Homepage has a clear document structure
  Given a visitor opens the homepage
  When the page renders
  Then the page has one main content region
  And the page has a level-one heading
```

```gherkin
Scenario: Homepage replaces the WIP gallery link
  Given a visitor opens the homepage
  When the page renders
  Then the page does not show the "Gallery Demo" link
```

```gherkin
Scenario: Landing content fits a narrow screen
  Given a visitor opens the homepage on a narrow viewport
  When the page renders
  Then the landing content remains readable
  And the page does not cause horizontal overflow
```

## Gate 2: playwright-cli-browser

Scope: Make a local browser available to Playwright CLI for the final UI review.
The gate changes no homepage behavior or application dependency.

```gherkin
Scenario: Playwright CLI opens the homepage on desktop
  Given the Astro dev server exposes the homepage
  When Playwright CLI opens the homepage on a desktop viewport
  Then the browser starts successfully
  And Playwright CLI can inspect the rendered homepage
```

```gherkin
Scenario: Playwright CLI opens the homepage on a narrow viewport
  Given the Astro dev server exposes the homepage
  When Playwright CLI opens the homepage on a narrow viewport
  Then the browser starts successfully
  And Playwright CLI can inspect the rendered homepage
```

## Open Questions
