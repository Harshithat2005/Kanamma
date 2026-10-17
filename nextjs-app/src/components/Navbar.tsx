"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Technology", href: "#ring-reveal" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "AI Intelligence", href: "#ai" },
  { label: "Impact", href: "#cta" },
  { label: "About Us", href: "#cta" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMobile = () => setMenuOpen(false);

  return (
    <>
      {/* ── FIXED NAVBAR ──────────────────────────── */}
      <nav
        id="navbar"
        className={`
          fixed top-0 left-0 right-0 z-[100]
          flex items-center justify-between
          px-6 md:px-12 py-4
          transition-all duration-400
          ${scrolled
            ? "bg-[rgba(254,250,248,0.88)] backdrop-blur-[20px] border-b border-rose/15"
            : "bg-transparent"
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex flex-col no-underline group">
          <span className="font-serif text-2xl font-medium tracking-wider text-plum">
            Kann<span className="text-rose">amma</span>
          </span>
          <small className="font-sans text-[0.52rem] tracking-[0.18em] uppercase text-warm-gray font-normal -mt-0.5">
            AI-Powered Maternal Healthcare
          </small>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex items-center gap-8 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[0.82rem] tracking-[0.12em] uppercase text-warm-gray no-underline hover:text-rose transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="/login"
          className="hidden lg:inline-block px-6 py-2.5 border border-rose rounded-full text-[0.8rem] tracking-[0.1em] uppercase text-rose no-underline hover:bg-rose hover:text-white hover:shadow-[0_4px_20px_rgba(200,135,122,0.35)] transition-all duration-300"
        >
          Login
        </a>

        {/* Hamburger Button */}
        <button
          className="lg:hidden relative w-8 h-6 bg-transparent border-none cursor-pointer z-[110]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className={`block w-full h-[1.5px] bg-plum rounded absolute left-0 transition-all duration-300
              ${menuOpen ? "top-[11px] rotate-45" : "top-[2px]"}`}
          />
          <span
            className={`block w-full h-[1.5px] bg-plum rounded absolute left-0 top-[11px] transition-all duration-300
              ${menuOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`block w-full h-[1.5px] bg-plum rounded absolute left-0 transition-all duration-300
              ${menuOpen ? "top-[11px] -rotate-45" : "top-[20px]"}`}
          />
        </button>
      </nav>

      {/* ── MOBILE OVERLAY MENU ───────────────────── */}
      <div
        className={`
          fixed inset-0 z-[99]
          bg-[rgba(254,250,248,0.95)] backdrop-blur-[30px]
          flex flex-col items-center justify-center gap-8
          transition-all duration-400
          ${menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
          }
        `}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={closeMobile}
            className="font-serif text-[1.6rem] font-normal text-plum no-underline hover:text-rose transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
        <a
          href="/login"
          onClick={closeMobile}
          className="mt-4 px-8 py-3 border border-rose rounded-full font-sans text-[0.85rem] tracking-[0.1em] uppercase text-rose no-underline hover:bg-rose hover:text-white transition-all duration-300"
        >
          Login
        </a>
      </div>
    </>
  );
}
