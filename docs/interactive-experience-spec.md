# Interactive Experience Specification

## Purpose

The interactive mode is not meant to be a game for its own sake.

Its job is to do something the direct portfolio page cannot do as well:

- add context around selected projects
- make architectural thinking easier to grasp
- make your personality and working style more memorable without becoming childish

If it fails to improve those three things, it should stay unshipped.

## Entry flow

When a user lands on the website, they should first choose between two paths:

1. `Normal Portfolio View`
2. `Enter the Room Concept`

The direct portfolio view is the default recommendation.
The interactive room is an opt-in format for people who want richer context.

## Core user journey

### 1. Intent framing

The room starts by answering:

- what this space is
- why it exists
- what the user will get out of it

The opening should explicitly frame the room as a guided way to understand selected work, not as a puzzle or exploration sandbox.

### 2. Guided first step

The first interaction should be obvious and intentional.

Good example:

- the desk PC opens the strongest project cluster

Bad example:

- the user must click random objects until something useful happens

### 3. Focused exploration

Every meaningful object should belong to one of these buckets:

- `project evidence`: strongest projects, stack choices, architecture decisions, links out
- `architecture context`: how you think about modularity, maintainability, and system structure
- `process and working style`: documentation, iteration, deployment, learning, and delivery habits

If an object does not support one of those buckets, it should be removed.

### 4. Exit and conversion

The room must always provide a direct path to:

- the normal portfolio page
- repositories
- contact links

The user should never need to finish the room to reach the practical information.

## Recommended room structure

### Project station

- likely represented by a PC, monitor, or main desk setup
- contains only the strongest two or three projects
- each project view should explain:
  - what it is
  - why it matters
  - stack and architecture choices
  - links to repo or live output

### Architecture wall

- one surface for cross-project technical thinking
- should explain why you care about modularity, actor thinking, contracts, or maintainability
- should connect directly to real examples instead of abstract claims

### Process shelf

- one smaller area for repo hygiene, deployment, iteration, and documentation habits
- useful because it explains how you actually finish projects rather than only start them

## Feature rules

- no collectible mechanics
- no filler interactions
- no fake difficulty
- no hidden essential content
- no lore that is unrelated to the portfolio itself

## Technical direction

### What must stay true regardless of framework

- shared content remains the source of truth
- the interactive mode consumes feature contracts, not ad hoc UI state
- reaction routing stays declarative
- the room remains optional and additive

### Phaser decision

Phaser is a good option only if the final implementation truly benefits from:

- spatial composition
- camera movement or object layering
- stronger pacing and guided transitions
- cleaner interaction handling than a React-only implementation

If those gains are minor, React should remain the implementation path.

## Definition of success

The interactive mode is successful only if a user can say all of the following after using it:

- "I understand the strongest projects better now."
- "I understand how Patrik thinks about building software."
- "The room made the portfolio more memorable without slowing me down too much."
