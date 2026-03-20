import { useEffect, useRef } from "react";

export function InteractiveModeScreen() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let active = true;
    let destroy: (() => void) | undefined;

    void import("../phaser/interactive-phaser-game").then(({ createInteractivePhaserGame }) => {
      if (!active || !containerRef.current) {
        return;
      }

      const game = createInteractivePhaserGame(containerRef.current);
      destroy = () => game.destroy(true);
    });

    return () => {
      active = false;
      destroy?.();
    };
  }, []);

  return <div ref={containerRef} className="interactive-phaser-stage" aria-label="Interactive Phaser portfolio scene" />;
}
