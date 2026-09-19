import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import type { Project, SectionHeading as Heading } from "@/types/content";
import { ProjectCard } from "./ProjectCard";
import { ProjectsMarquee } from "./ProjectsMarquee";

/** Up to this many cards fit the design's static grid; more switch to the scrolling strip. */
const GRID_MAX = 3;

/**
 * Mobile frame (880:1855): 40px side padding, left-aligned heading, cards
 * stacked at 310 x 387 with a 62px arrow badge. Desktop: centred heading,
 * three 400 x 500 cards.
 */
export function Projects({ eyebrow, lines, items }: Heading & { items: Project[] }) {
  const marquee = items.length > GRID_MAX;
  return (
    <section
      id="projects"
      className={cn(
        "rounded-[32px] bg-ink px-10 py-10 lg:mt-[clamp(64px,8.3vw,120px)] lg:gutter lg:rounded-[50px] lg:py-[clamp(64px,8.3vw,120px)]",
        // The strip runs under the whole dark panel and is cut only at its edge.
        marquee && "overflow-x-clip",
      )}
    >
      <SectionHeading eyebrow={eyebrow} lines={lines} align="center-lg" tone="light" className="mb-8 lg:mb-[clamp(48px,8.3vw,120px)]" />

      {marquee ? (
        <ProjectsMarquee items={items} />
      ) : (
        /* Three-up only from lg; narrower cards collide with the 80px arrow badge. */
        <ul className="mx-auto grid max-w-[1224px] gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
          {items.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
