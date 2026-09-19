import Image from "next/image";
import { cn } from "@/lib/cn";
import type { WorkCard } from "@/types/content";

/*
 * Masonry that keeps the design's exact proportions at every width.
 * The grid's row unit is 1% of a column's width (container-query units), so
 * a tall card spans 125 rows (400 x 500 at 1440), a square one 100, and
 * every item carries 3 more rows for the 12px gap. Cards are assigned to a
 * column by index (i % columns) and dense auto-placement stacks each column
 * independently, which is how the reference falls: 1 & 4, 2 & 5, 3 & 6.
 */
const COLUMN_MD = ["md:col-start-1", "md:col-start-2"];
const COLUMN_LG = ["lg:col-start-1", "lg:col-start-2", "lg:col-start-3"];

export function WorkGrid({ cards }: { cards: WorkCard[] }) {
  return (
    <section className="gutter pt-[clamp(48px,6.1vw,88px)] pb-[clamp(64px,8.3vw,120px)]">
      <div className="@container mx-auto max-w-[1224px]">
        <ul className="grid grid-cols-1 auto-rows-[calc(100cqw/100)] gap-x-3 gap-y-0 [grid-auto-flow:row_dense] md:grid-cols-2 md:auto-rows-[calc((100cqw_-_12px)/200)] lg:grid-cols-3 lg:auto-rows-[calc((100cqw_-_24px)/300)]">
          {cards.map((card, i) => (
            <li
              key={card.id}
              className={cn(
                "grid col-start-1",
                COLUMN_MD[i % 2],
                COLUMN_LG[i % 3],
                card.size === "tall" ? "row-span-[128] grid-rows-[125fr_3fr]" : "row-span-[103] grid-rows-[100fr_3fr]",
              )}
            >
              <WorkCardView card={card} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Tag top-left, title bottom-left, 32px insets. On hover or keyboard focus the
 * description's grid row grows from 0fr to 1fr, which lifts the title by
 * exactly the description's height - one transition drives both movements.
 * Touch devices (no hover) show the description permanently.
 */
function WorkCardView({ card }: { card: WorkCard }) {
  const classes =
    "group relative row-start-1 overflow-hidden rounded-[4px] bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink";
  const inner = (
    <>
      <Image
        src={card.image}
        alt={card.alt}
        fill
        sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

      {/* 32px insets from xl, where columns reach the design's 400px; 24px below that. */}
      <span className="absolute top-6 left-6 bg-pink px-3 py-1.5 font-body text-[13px] uppercase leading-none text-white md:text-[14px] xl:top-8 xl:left-8">
        {card.tag}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex flex-col p-6 xl:p-8">
        {/* 28px at 1440; may shrink to 18px in the three-column range so the design's line breaks hold at 1024. */}
        <h3 className="font-display text-[22px] leading-[1.15] text-white lg:text-[clamp(18px,1.95vw,28px)]">
          {card.title.map((line, i) => (
            <span key={line} className="block">
              {line}
              {i < card.title.length - 1 && " "}
            </span>
          ))}
        </h3>
        {card.description && (
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out-quint group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr] motion-reduce:transition-none">
            <div className="min-h-0 overflow-hidden">
              <p className="translate-y-2 pt-2 font-body text-[15px] leading-[22px] text-white/70 opacity-0 transition-[opacity,transform] duration-500 ease-out-quint group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100 motion-reduce:transition-none md:text-[16px] md:leading-[24px]">
                {card.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return card.href ? (
    <a href={card.href} className={classes}>
      {inner}
    </a>
  ) : (
    <article className={classes}>{inner}</article>
  );
}
