import { Headphones } from "lucide-react";
import { Section } from "@/components/Section";
import { TetrioWidget } from "@/components/tetrio/TetrioWidget";
import { Button } from "@/components/ui/button";

export function OffDuty() {
  return (
    <Section id="off-duty" title="Off duty">
      <div className="grid items-start gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
        <div className="space-y-6 md:pt-2">
          <p className="max-w-[44ch] text-xl leading-relaxed">
            Away from the soldering iron and the textbooks, I play competitive Tetris on TETR.IO.
          </p>
          <p className="max-w-[44ch] text-muted-foreground">
            It&rsquo;s the same skill as debugging: read the stack fast, plan a few pieces ahead, and don&rsquo;t panic when it
            gets high. The board here plays by the same rules: 7-bag, SRS rotation, hold and a five-piece preview.
          </p>
          <div className="flex items-start gap-3 rounded-xl border bg-muted p-4">
            <Headphones className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              There&rsquo;s almost always something playing on Spotify while I work, and while I play.
            </p>
          </div>
          <Button asChild variant="outline">
            <a href="https://ch.tetr.io/u/batryzhan" target="_blank" rel="noopener noreferrer">
              My TETR.IO profile
            </a>
          </Button>
        </div>

        <TetrioWidget className="w-full md:w-fit md:justify-self-end" />
      </div>
    </Section>
  );
}
