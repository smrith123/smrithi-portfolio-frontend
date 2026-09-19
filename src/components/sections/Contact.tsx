"use client";

/* eslint-disable @next/next/no-img-element -- icon vectors exported from the design */
import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { vectors } from "@/content/assets";
import { submitContact } from "@/lib/api";
import { cn } from "@/lib/cn";
import type { ContactContent } from "@/types/content";

type Status = "idle" | "pending" | "sent" | "error";

/* Mobile frame (880:2124): 15px body, 12px vertical / 16px horizontal input padding, 119px message box. */
const field =
  "w-full rounded-[12px] border border-pink-light bg-transparent px-4 py-3 font-body text-[15px] text-black lg:px-5 lg:text-[clamp(16px,1.4vw,20px)] " +
  "placeholder:text-black/40 transition-[border-color,box-shadow] duration-200 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/30";

const label = "font-body text-[15px] text-black/80 lg:text-[clamp(16px,1.4vw,20px)]";

export function Contact({ contact }: { contact: ContactContent }) {
  const [status, setStatus] = useState<Status>("idle");
  const id = useId();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("pending");
    try {
      await submitContact({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative isolate overflow-hidden pt-12 pb-12 lg:pt-[clamp(80px,8.8vw,127px)] lg:pb-[clamp(96px,10vw,140px)]">
      <Image src={contact.background} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-10 lg:opacity-[0.09]" />

      <div className="gutter grid gap-8 lg:grid-cols-[minmax(0,506px)_minmax(0,653px)] lg:justify-between lg:gap-[65px]">
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="flex flex-col gap-4 lg:gap-6">
            <SectionHeading eyebrow={contact.eyebrow} lines={contact.lines} />
            <p className="max-w-[506px] font-body text-[15px] leading-[24px] text-black/50 lg:text-[clamp(16px,1.4vw,20px)] lg:leading-[1.4]">{contact.description}</p>
          </div>
          <ul className="flex flex-col gap-2 lg:gap-0">
            <li>
              <a
                href={contact.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-body text-[15px] text-pink hover:underline lg:gap-1.5 lg:py-1 lg:text-[clamp(16px,1.4vw,20px)]"
              >
                <img src={vectors.instagram} alt="" width={36} height={36} loading="lazy" className="size-[22px] lg:size-9" />
                {contact.instagram.handle}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 font-body text-[15px] text-pink hover:underline lg:gap-1.5 lg:py-1 lg:text-[clamp(16px,1.4vw,20px)]"
              >
                <img src={vectors.mailLarge} alt="" width={36} height={36} loading="lazy" className="size-[22px] lg:size-9" />
                {contact.email}
              </a>
            </li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 lg:gap-3">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-[13px]">
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <label htmlFor={`${id}-name`} className={label}>
                {contact.form.nameLabel}
              </label>
              <input id={`${id}-name`} name="name" type="text" autoComplete="name" required placeholder={contact.form.namePlaceholder} className={field} />
            </div>
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <label htmlFor={`${id}-email`} className={label}>
                {contact.form.emailLabel}
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                required
                placeholder={contact.form.emailPlaceholder}
                className={field}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 lg:gap-1.5">
            <label htmlFor={`${id}-message`} className={label}>
              {contact.form.messageLabel}
            </label>
            <textarea
              id={`${id}-message`}
              name="message"
              required
              rows={4}
              placeholder={contact.form.messagePlaceholder}
              className={cn(field, "min-h-[119px] resize-y lg:min-h-[237px]")}
            />
          </div>
          <Button
            type="submit"
            rounded
            disabled={status === "pending"}
            className="mt-2 w-full disabled:opacity-70 lg:mt-0"
            icon={<img src={vectors.arrowUpRightSubmit} alt="" width={20} height={20} loading="lazy" className="size-4 lg:size-5" />}
          >
            {status === "pending" ? "Sending…" : contact.form.submitLabel}
          </Button>
          <p role="status" aria-live="polite" className="min-h-6 font-body text-[15px] text-black/70 lg:text-[16px]">
            {status === "sent" && "Thanks, your message is on its way."}
            {status === "error" && "Something went wrong. Please email directly instead."}
          </p>
        </form>
      </div>
    </section>
  );
}
