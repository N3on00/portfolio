import { interactiveModeDefinition } from "@features/interactive";
import { Eyebrow, Grid, Heading, Panel, Stack, Surface, Text } from "@shared/ui/react";

const plannedFlow = [
  {
    title: "1. Entry and intent",
    text: "The user enters your room because they want more context than a normal portfolio page can give. The first seconds explain what can be learned there: selected projects, trade-offs, and how you think while building.",
  },
  {
    title: "2. Guided first interaction",
    text: "One clear first object introduces the strongest project cluster. The room should not begin as a puzzle; it should begin as guided orientation.",
  },
  {
    title: "3. Evidence-driven exploration",
    text: "Each meaningful object should reveal one of three things: project proof, architecture reasoning, or personal working style. Anything else is noise.",
  },
  {
    title: "4. Direct conversion path",
    text: "At every point, the user should still be able to jump to repositories, project summaries, or contact actions without finishing the room.",
  },
];

const featureRules = [
  "No object exists only because it looks cool.",
  "Every interaction must map to portfolio evidence or decision context.",
  "The room must stay shorter and more readable than a small game level.",
  "The direct portfolio remains the primary path; the room is a supporting format.",
  "Phaser is only justified if spatial storytelling and pacing become materially better than a React-only version.",
];

const candidateFeatures = [
  {
    label: "Project station",
    text: "A PC or desk surface for the strongest two or three projects, with architecture notes, stack choices, and links out to the repositories.",
  },
  {
    label: "Architecture wall",
    text: "A focused explanation of how you structure projects, why you care about modularity, and how that showed up in real work like SpotOnSight and this portfolio.",
  },
  {
    label: "Process shelf",
    text: "A smaller area for documentation, deployment, iteration, and what you learned while shipping projects rather than only building demos.",
  },
];

export function InteractiveModeScreen() {
  return (
    <Surface as="section" padding="lg" aria-labelledby="interactive-mode-title">
      <Stack gap="lg">
        <Stack gap="sm">
          <Eyebrow>Interactive concept</Eyebrow>
          <Heading as="h2" size="section" id="interactive-mode-title">
            {interactiveModeDefinition.label}
          </Heading>
          <Text tone="muted" size="lg">
            This mode is intentionally not a playable room yet. It should ship only when it helps people understand your work better than the normal portfolio page.
          </Text>
        </Stack>

        <Panel as="article" tone="strong">
          <Stack gap="sm">
            <Eyebrow>What this mode is for</Eyebrow>
            <Heading as="h3" size="card">
              Explain selected work through space, not through gimmicks
            </Heading>
            <Text>
              The room should turn your strongest projects, architectural thinking, and working style into a guided experience with better context, pacing, and memorability.
            </Text>
          </Stack>
        </Panel>

        <Grid minItemWidth="16rem">
          {candidateFeatures.map((feature) => (
            <Panel key={feature.label} as="article" padding="sm">
              <Stack gap="xs">
                <Eyebrow>Candidate feature</Eyebrow>
                <Heading as="h3" size="card">
                  {feature.label}
                </Heading>
                <Text tone="muted">{feature.text}</Text>
              </Stack>
            </Panel>
          ))}
        </Grid>

        <Stack gap="sm" aria-label="Planned interactive flow">
          {plannedFlow.map((step) => (
            <Panel key={step.title} as="article" padding="sm">
              <Stack gap="xs">
                <Heading as="h3" size="card">
                  {step.title}
                </Heading>
                <Text>{step.text}</Text>
              </Stack>
            </Panel>
          ))}
        </Stack>

        <Panel as="article">
          <Stack gap="sm">
            <Eyebrow>Non-negotiable rules</Eyebrow>
            <ul className="interactive-concept-list">
              {featureRules.map((rule) => (
                <li key={rule}>
                  <Text>{rule}</Text>
                </li>
              ))}
            </ul>
          </Stack>
        </Panel>

        <Panel as="article">
          <Stack gap="sm">
            <Eyebrow>Technology decision</Eyebrow>
            <Heading as="h3" size="card">
              Phaser is possible, not mandatory
            </Heading>
            <Text>
              Phaser becomes the right choice only if the final room genuinely benefits from camera movement, object layering, spatial sequencing, or better game-loop ergonomics. If a lighter React-based implementation communicates the same value more clearly, that should win.
            </Text>
          </Stack>
        </Panel>
      </Stack>
    </Surface>
  );
}
