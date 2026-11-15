import { Section } from "@/components/Section";
import { SpotifyPlayer } from "@/components/SpotifyPlayer";
import { TetrisRain } from "@/components/TetrisRain";
import { Button } from "@/components/ui/button";

export function OffDuty() {
  return (
    <Section id="off-duty" title="Off duty">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-14">
        <div className="space-y-5">
          <p className="max-w-[46ch] text-xl leading-relaxed">
            When I&rsquo;m not engineering or studying, I&rsquo;m usually playing Tetris on TETR.IO, and a few other games
            besides.
          </p>
          <p className="max-w-[46ch] text-muted-foreground">
            It&rsquo;s the same skill as debugging: read the stack fast, plan a few pieces ahead, and don&rsquo;t panic when
            it gets high.
          </p>
          <Button asChild variant="outline">
            <a href="https://ch.tetr.io/u/batryzhan" target="_blank" rel="noopener noreferrer">
              My TETR.IO profile
            </a>
          </Button>
        </div>

        <SpotifyPlayer />
      </div>

      <TetrisRain className="mt-10 w-full overflow-hidden rounded-xl border bg-muted" />
    </Section>
  );
}
