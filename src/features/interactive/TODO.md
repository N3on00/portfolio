# Interactive Mode TODO

## Scope owned by this module

- 2D room scene and navigation
- Interactive objects and hint system
- PC popup and project exploration overlays

## Parallel work suggestions

- Done: the route now explains the future room mode explicitly instead of pretending a toy implementation is already the final value
- Done: the room concept is constrained by a feature spec focused on project evidence, architecture context, and process clarity
- Next: decide whether Phaser actually improves delivery enough to justify the additional runtime complexity
- Next: implement the room only once the final object list and guided flow are fixed around real portfolio value

## Guardrails

- Keep game logic out of shared modules
- Consume shared content instead of hardcoding portfolio data here
- Expose a stable module entrypoint for the app shell
