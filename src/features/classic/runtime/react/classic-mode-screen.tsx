import { classicModeDefinition } from "@features/classic/classic-mode.contract";
import { classicRenderDocument } from "@features/classic/classic-mode.runtime";
import { Eyebrow, Heading, HintShell, Stack, Surface, Text } from "@shared/ui/react";
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
            The mode now renders the same shared classic document used by the renderer pipeline, while shared UI still owns only presentation primitives.
          </Text>
        </Stack>

        <HintShell label="Shared stays generic">
          <Text>
            Shared UI owns shells, spacing and typography helpers. Section ordering, scan priority and block composition stay in the classic feature.
          </Text>
        </HintShell>

        <ClassicRenderDocumentView document={classicRenderDocument} />

        <Stack gap="sm" aria-label="Classic delivery checklist">
          {classicModeDefinition.checklist.map((item) => (
            <Surface key={item.id} as="article" padding="sm">
              <Stack gap="xs">
                <Eyebrow>{item.status}</Eyebrow>
                <Heading as="h3" size="card">
                  {item.label}
                </Heading>
              </Stack>
            </Surface>
          ))}
        </Stack>
      </Stack>
    </Surface>
  );
}
