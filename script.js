const MONTH_NAMES = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december"
];

function formatMonth(dateStr) {
  const [year, month] = dateStr.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  const emptyState = document.getElementById("empty-state");

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
