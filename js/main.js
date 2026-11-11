const WA = "255655776993";

const menu = document.getElementById("m");
const menuButton = document.getElementById("burger");

if (menu && menuButton) {
  const closeMenu = () => {
    menu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Fungua menyu");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menu.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Funga menyu" : "Fungua menyu");
  });

  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
}

document.querySelectorAll("[data-wa-link]").forEach(link => {
  link.href = "https://wa.me/" + WA;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

document.querySelectorAll("[data-year]").forEach(element => {
  element.textContent = new Date().getFullYear();
});

const marqueeText = document.getElementById("hero-marquee-text");
if (marqueeText) {
  const phrase = "Umoja ✦ Elimu ✦ Mshikamano ✦ Maadili ✦ Vijana ✦ ";
  const repetitions = 8;
  marqueeText.textContent = phrase.repeat(repetitions);

  document.fonts.ready.then(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const loopLength = marqueeText.getComputedTextLength() / repetitions;
    let previousTime = 0;
    let offset = 0;

    const moveWords = time => {
      if (reducedMotion.matches) return;
      if (previousTime) offset = (offset + (time - previousTime) * 0.03) % loopLength;
      marqueeText.setAttribute("startOffset", String(-offset));
      previousTime = time;
      requestAnimationFrame(moveWords);
    };

    requestAnimationFrame(moveWords);
  });
}

document.querySelectorAll("form[data-wa]").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const message = Array.from(form.querySelectorAll("[name]"))
      .map(field => {
        const label = form.querySelector(`label[for="${field.id}"]`)?.textContent || field.name;
        return label.replace(/\s*\(.*?\)\s*/g, "").trim() + ": " + (field.value.trim() || "-");
      })
      .join("\n");
    const url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(form.dataset.wa + "\n" + message);
    const whatsappWindow = window.open(url, "_blank");
    const status = form.querySelector("[data-form-status]");

    if (!whatsappWindow) {
      if (status) status.textContent = "WhatsApp haikufunguka. Ruhusu dirisha jipya kwenye kivinjari kisha ujaribu tena.";
      return;
    }

    whatsappWindow.opener = null;
    if (status) status.textContent = "Ujumbe wako uko tayari. Ukague na uutume kupitia WhatsApp.";
    form.reset();
  });
});
