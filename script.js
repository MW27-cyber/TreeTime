const MONTH_NAMES = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december"
];

function formatMonth(dateStr) {
  const [year, month] = dateStr.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  function open(src, alt, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
  }

  function close() {
    lightbox.hidden = true;
    lightboxImg.src = "";
  }

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !lightbox.hidden) close();
  });

  return open;
}

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  const emptyState = document.getElementById("empty-state");
  const openLightbox = setupLightbox();

  let photos = [];
  try {
    const res = await fetch("photos.json");
    photos = await res.json();
  } catch (err) {
    photos = [];
  }

  if (!photos.length) {
    emptyState.hidden = false;
    return;
  }

  photos
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach(photo => {
      const card = document.createElement("article");
      card.className = "card";

      const img = document.createElement("img");
      img.src = `photos/${photo.file}`;
      img.alt = photo.caption || `Boom in ${formatMonth(photo.date)}`;
      img.loading = "lazy";
      img.addEventListener("click", () => {
        openLightbox(img.src, img.alt, `${formatMonth(photo.date)} — ${photo.caption || ""}`);
      });

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.innerHTML = `
        <p class="month">${formatMonth(photo.date)}</p>
        <p class="caption">${photo.caption || ""}</p>
      `;

      card.appendChild(img);
      card.appendChild(meta);
      gallery.appendChild(card);
    });
}

loadGallery();
