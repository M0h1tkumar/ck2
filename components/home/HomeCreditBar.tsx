'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function HomeCreditBar() {
  const [isOpen, setIsOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const popoverId = "home-credits-popover";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!shellRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggleCredits() {
    setIsOpen((current) => !current);
  }

  return (
    <div ref={shellRef} className="credit-shell">
      <button
        type="button"
        className="credit-bar"
        onClick={toggleCredits}
        title="Toggle website credits"
        aria-label="Toggle website credits"
        aria-expanded={isOpen}
        aria-controls={popoverId}
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
        id={popoverId}
        className={`credit-popover${isOpen ? " is-open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="credit-popover__eyebrow">Website Credits</div>
        <div className="credit-popover__role">Development</div>
        <strong className="credit-popover__people">CN10XoC / Coding Ninjas</strong>
        <div className="credit-popover__note">
          Core website engineering, interaction logic, and implementation.
        </div>
      </div>
    </div>
  );
}
