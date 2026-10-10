"use strict";

// Edite apenas este número para atualizar todos os links de contato do site.
// Formato: código do país + DDD + número, somente dígitos.
const WHATSAPP_NUMBER = "5511995271188";
const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Conheci seu trabalho pelo site e gostaria de saber mais sobre o serviço de Personal Chef.";

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileMenuLinks = mobileMenu ? [...mobileMenu.querySelectorAll("a")] : [];

function buildWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll(".js-whatsapp").forEach((link) => {
  const selectedPlan = link.dataset.plan;
  const message = selectedPlan
    ? `${DEFAULT_WHATSAPP_MESSAGE} Tenho interesse no formato ${selectedPlan}.`
    : DEFAULT_WHATSAPP_MESSAGE;

  link.href = buildWhatsAppUrl(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

function setMenuState(isOpen, returnFocus = false) {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);

  if (isOpen) {
    mobileMenuLinks[0]?.focus();
  } else if (returnFocus) {
    menuToggle.focus();
  }
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  setMenuState(isOpen);
});

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenuState(false, true);
  }
});

document.addEventListener("click", (event) => {
  if (
    menuToggle?.getAttribute("aria-expanded") === "true" &&
    !header?.contains(event.target)
  ) {
    setMenuState(false);
  }
});

const desktopMediaQuery = window.matchMedia("(min-width: 64rem)");
desktopMediaQuery.addEventListener("change", (event) => {
  if (event.matches) setMenuState(false);
});

document.querySelectorAll(".benefit-panel__toggle").forEach((button) => {
  const panel = button.closest(".benefit-panel");
  const description = document.getElementById(button.getAttribute("aria-controls"));

  button.addEventListener("click", () => {
    const willOpen = button.getAttribute("aria-expanded") !== "true";

    button.setAttribute("aria-expanded", String(willOpen));
    panel.classList.toggle("is-open", willOpen);
    description.hidden = !willOpen;
  });
});

document.querySelectorAll("[data-accordion] button").forEach((button) => {
  const panel = document.getElementById(button.getAttribute("aria-controls"));
  panel?.setAttribute("aria-hidden", "true");

  button.addEventListener("click", () => {
    const item = button.closest(".accordion__item");
    const willOpen = button.getAttribute("aria-expanded") !== "true";

    button.setAttribute("aria-expanded", String(willOpen));
    panel?.setAttribute("aria-hidden", String(!willOpen));
    item?.classList.toggle("is-open", willOpen);
  });
});

function markMissingImage(image) {
  image.classList.add("is-missing");
}

document.querySelectorAll(".asset-image, .brand__image").forEach((image) => {
  image.addEventListener("error", () => markMissingImage(image), { once: true });

  if (image.complete && image.naturalWidth === 0) {
    markMissingImage(image);
  }
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = [...document.querySelectorAll(".reveal")];

if (!reduceMotion && "IntersectionObserver" in window) {
  document.body.classList.add("reveal-ready");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

let scrollTicking = false;

function updateHeaderState() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateHeaderState);
  },
  { passive: true }
);

updateHeaderState();

const yearElement = document.querySelector("[data-current-year]");
if (yearElement) yearElement.textContent = new Date().getFullYear();
