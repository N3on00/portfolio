import { classicModeDefinition } from "@features/classic/classic-mode.contract";
import { classicRenderDocument } from "@features/classic/classic-mode.runtime";
import { Eyebrow, Heading, Stack, Surface, Text } from "@shared/ui/react";
import { ClassicRenderDocumentView } from "./classic-render-document";

export function ClassicModeScreen() {
  return (
    <Surface as="section" padding="lg" aria-labelledby="classic-mode-title">
      <Stack gap="lg">
        <Stack gap="sm">
          <Eyebrow>Classic runtime foundation</Eyebrow>
          <Heading as="h2" size="section" id="classic-mode-title">
            {classicModeDefinition.label}
          </Heading>
          <Text tone="muted" size="lg">
            This is the direct portfolio view: fast to scan, easy to trust, and built from the same shared content source as every other mode.
          </Text>
        </Stack>

        <ClassicRenderDocumentView document={classicRenderDocument} />

        <Surface as="article" padding="sm">
          <Stack gap="xs">
            <Eyebrow>Why this exists</Eyebrow>
            <Heading as="h3" size="card">
              The portfolio should already work without the room
            </Heading>
            <Text tone="muted">
              {classicModeDefinition.label} is the reliable path for recruiters, collaborators, and anyone who wants the clearest version first.
            </Text>
          </Stack>
        </Surface>
      </Stack>
    </Surface>
  );
}
