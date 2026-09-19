/* eslint-disable @next/next/no-img-element -- icon vectors exported from the design */
import Image from "next/image";
import { vectors } from "@/content/assets";
import type { Project } from "@/types/content";

/**
 * One Featured Projects card. Shared by the static grid (up to three cards) and
 * the scrolling strip (more than three), so both render exactly the same design.
 */
export function ProjectCard({
  project,
  tabIndex,
}: {
  project: Project;
  /** -1 for the strip's duplicate copy, which is decorative. */
  tabIndex?: number;
}) {
  // A project without a real destination is a card, not a link: "#" only jumped to the top of the page.
  const href = project.href && project.href !== "#" ? project.href : undefined;
  const Card = href ? "a" : "div";
  return (
    <Card
      href={href}
      tabIndex={href ? tabIndex : undefined}
      style={{ backgroundColor: project.tint }}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[31px] text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink lg:rounded-[40px]"
    >
      <span className="absolute top-4 right-4 flex size-[62px] items-center justify-center rounded-full bg-black transition-colors duration-300 ease-out-quint group-hover:bg-pink group-focus-visible:bg-pink lg:top-5 lg:right-5 lg:size-20">
        <img
          src={vectors.arrowUpRightLarge}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="size-[31px] transition-transform duration-300 ease-out-quint group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1 lg:size-10"
        />
      </span>
      <div className="absolute top-[22%] left-[18px] flex w-[85%] flex-col gap-[18px] lg:left-6 lg:gap-6">
        <h3 className="font-body text-[25px] font-medium leading-none text-black/50 lg:text-[clamp(24px,2.2vw,32px)]">{project.title}</h3>
        <p className="font-body text-[15.5px] leading-none text-black/50 lg:text-[clamp(16px,1.4vw,20px)]">{project.description}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-t-[31px] lg:rounded-t-[40px]">
        {/*
          Lazy even in the scrolling strip: every copy of a card asks for the same URL,
          so once the first copy has loaded the others paint from memory, with no pop-in.
          Widths follow the layout: one card per row below sm (40px panel padding each
          side), two from sm, three from lg in a 1224px row. The old "33vw from md"
          undershot the two-column tablet layout and served blurry images there.
        */}
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(min-width: 1440px) 400px, (min-width: 1024px) 30vw, (min-width: 640px) calc(50vw - 52px), calc(100vw - 80px)"
          className="object-cover transition-transform duration-700 ease-out-quint group-hover:scale-[1.04]"
        />
      </div>
    </Card>
  );
}
