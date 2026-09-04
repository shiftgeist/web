# Time Progress

## Gate 1: core-computation

Scope: Pure computation only - period resolution (day/week/month/year),
schedule-based counting (`total`/`weekdays` presets, or a custom
schedule), elapsed/remaining/percentage, and hours/minutes/seconds
formatting. No UI, no CLI entry point (deferred to a follow-up change).

```gherkin
Scenario: Month period respects the real calendar length
  Given the reference time is in February of a leap year
  When resolving a "month" period
  Then the period spans 29 days
```

```gherkin
Scenario Outline: Week period starts on the configured day
  Given the reference time is a <weekday>
  And weekStartsOn is Monday
  When resolving a "week" period
  Then the period start is the Monday of that week

  Examples:
    | weekday   |
    | Wednesday |
    | Sunday    |
    | Monday    |
```

```gherkin
Scenario: Unsupported period unit is rejected
  When resolving a period with an unsupported unit
  Then the system throws an error
```

```gherkin
Scenario: Weekdays schedule excludes Saturday by default
  Given the "weekdays" schedule (09:00-17:00, Monday-Friday; Saturday and Sunday excluded by default)
  And the reference time is a Saturday
  When computing progress for a "day" period
  Then the total duration is 0
```

```gherkin
Scenario: Invalid schedule window is rejected
  Given a schedule where endHour is less than or equal to startHour
  When computing progress with that schedule
  Then the system throws an error
```

```gherkin
Scenario Outline: Elapsed time reflects how far into the day's window the reference time falls
  Given the "<schedule>" schedule
  And the reference time is <time> on a <day>
  When computing progress for a "day" period
  Then the total duration is <total>
  And the elapsed duration is <elapsed>
  And the percentage is <percentage>

  Examples:
    | schedule | day       | time  | total | elapsed | percentage |
    | total    | Wednesday | 12:00 | 24h   | 12h     | 50         |
    | weekdays | Wednesday | 13:00 | 8h    | 4h      | 50         |
```

```gherkin
Scenario: Zero-total period reports percentage as not applicable
  Given the "weekdays" schedule
  And the reference time is a Saturday
  When computing progress for a "day" period
  Then the total duration is 0
  And the percentage is null, not NaN
```

```gherkin
Scenario: Hours are not capped at 24
  Given a remaining duration greater than 24 hours
  When formatting it as hours, minutes, and seconds
  Then the hours component exceeds 23
  And there is no separate days component
```

```gherkin
Scenario: Percentage is returned unrounded
  Given a period that is exactly one third elapsed
  When computing progress
  Then the percentage keeps full floating-point precision
  And rounding for display is left to the caller
```

```gherkin
Scenario: Daylight-saving-time transition day is not assumed to be 24 hours
  Given a counted day spans a daylight-saving-time transition
  When computing that day's window duration
  Then the duration reflects the true 23 or 25 hour elapsed wall-clock time, not a fixed 24 hours
```

```gherkin
Scenario: The module does not manage its own reactivity
  Given the time-progress module
  When it is called twice with different reference times
  Then each call returns an independent, correct result
  And neither call starts a timer, touches the DOM, or performs process or console I/O
```
