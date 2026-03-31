'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type CreditEntry = {
  tag: string;
  name: string;
};

type ContactEntry = {
  tag: string;
  name: string;
  phone: string;
  href: string;
};

const creditEntries: CreditEntry[] = [
  { tag: "Development", name: "Bhabesh Behera, Mohit Kumar, Rohit Gupta" },
  { tag: "Design", name: "Mrikhil Mohanty, Pratham Srivastava" },
  { tag: "Maintenance", name: "Manish Prakash Sahu" },
  { tag: "Coordination", name: "Saswat Barai" },
  { tag: "Guidance", name: "P. Sai Krishna, Asish Kumar Samantray, Subinay Das" },
  { tag: "Special Thanks", name: "Ritu Dey, Soham Ghosh" },
];

const contactEntries: ContactEntry[] = [
  {
    tag: "Official Contact",
    name: "Subinay Das",
    phone: "+91 7008539718",
    href: "tel:+917008539718",
  },
  {
    tag: "Official Contact",
    name: "P Sai Krishna",
    phone: "+91 7205433228",
    href: "tel:+917205433228",
  },
];

export function HomeCreditBar() {
  const [openPanel, setOpenPanel] = useState<"credits" | "info" | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const creditsPopoverId = "home-credits-popover";
  const infoPopoverId = "home-info-popover";
  const isCreditsOpen = openPanel === "credits";
  const isInfoOpen = openPanel === "info";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!shellRef.current?.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPanel(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function togglePanel(panel: "credits" | "info") {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  return (
    <div ref={shellRef} className="credit-overlay-cluster">
      <div className="credit-shell credit-shell--left">
        <button
          type="button"
          className="credit-bar credit-bar--info"
          onClick={() => togglePanel("info")}
          title="Toggle info"
          aria-label="Toggle info"
          aria-expanded={isInfoOpen}
          aria-controls={infoPopoverId}
        >
          <span className="credit-badge" aria-hidden="true">
            i
          </span>
          <span className="credit-text">Info</span>
        </button>

        <div
          id={infoPopoverId}
          className={`credit-popover credit-popover--left credit-popover--vertical${isInfoOpen ? " is-open" : ""}`}
          aria-hidden={!isInfoOpen}
        >
          <div className="credit-popover__header credit-popover__header--vertical">
            <div className="credit-popover__eyebrow">Official Contacts</div>
            <div className="credit-popover__title credit-popover__title--vertical">Chakravyuh Genesis 2026</div>
          </div>
          <div className="credit-popover__list credit-popover__list--vertical">
            {contactEntries.map((entry) => (
              <div key={entry.href} className="credit-entry credit-entry--contact">
                <div className="credit-entry__content">
                  <div className="credit-entry__tag">{entry.tag}</div>
                  <strong className="credit-entry__name">{entry.name}</strong>
                  <a className="credit-entry__phone" href={entry.href} aria-label={`Call ${entry.name} at ${entry.phone}`}>
                    {entry.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="credit-shell">
        <button
          type="button"
          className="credit-bar"
          onClick={() => togglePanel("credits")}
          title="Toggle website credits"
          aria-label="Toggle website credits"
          aria-expanded={isCreditsOpen}
          aria-controls={creditsPopoverId}
        >
          <span className="credit-text">Made by</span>
          <Image
            src="/Club Logo/CODING NINJAS.png"
            alt="Coding Ninjas Logo"
            width={28}
            height={28}
            className="credit-logo"
          />
          <span className="credit-text credit-highlight">CN10XoC</span>
        </button>

        <div
          id={creditsPopoverId}
          className={`credit-popover credit-popover--vertical${isCreditsOpen ? " is-open" : ""}`}
          aria-hidden={!isCreditsOpen}
        >
          <div className="credit-popover__header credit-popover__header--vertical">
            <div className="credit-popover__eyebrow">Website Credits</div>
            <div className="credit-popover__title credit-popover__title--vertical">Genesis Web Team</div>
          </div>
          <div className="credit-popover__list credit-popover__list--vertical">
            {creditEntries.map((entry) => (
              <div key={entry.tag} className="credit-entry credit-entry--vertical">
                <div className="credit-entry__content">
                  <div className="credit-entry__tag">{entry.tag}</div>
                  <strong className="credit-entry__name">{entry.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
