// FILTERING
const filterBtns = document.querySelectorAll(".filter-btn");
const images = document.querySelectorAll(".gallery img");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");

    let category = btn.dataset.category;

    images.forEach(img => {
      img.style.display =
        category === "all" || img.dataset.category === category
          ? "block"
          : "none";
    });
  });
});

// LIGHTBOX FUNCTIONS
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".close");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentIndex = 0;
let imageArray = Array.from(images);

images.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index;
    showLightbox();
  });
});

function showLightbox() {
  lightbox.style.display = "flex";
  lightboxImg.src = imageArray[currentIndex].src;
  // Hide prev/next when at the ends
  if (currentIndex <= 0) {
    prevBtn.style.visibility = 'hidden';
  } else {
    prevBtn.style.visibility = 'visible';
  }
  if (currentIndex >= imageArray.length - 1) {
    nextBtn.style.visibility = 'hidden';
  } else {
    nextBtn.style.visibility = 'visible';
  }
}

closeBtn.onclick = () => (lightbox.style.display = "none");

nextBtn.onclick = () => {
  if (currentIndex < imageArray.length - 1) {
    currentIndex = currentIndex + 1;
    showLightbox();
  }
};

prevBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex = currentIndex - 1;
    showLightbox();
  }
};

// Close on background click
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.style.display = "none";
});

// TOUCH / SWIPE NAVIGATION (mobile)
let touchStartX = 0;
let touchCurrentX = 0;
const SWIPE_THRESHOLD = 50; // px

function handleSwipe() {
  const diff = touchCurrentX - touchStartX;
  if (Math.abs(diff) < SWIPE_THRESHOLD) return;
  if (diff < 0) {
    // swipe left -> next
    if (currentIndex < imageArray.length - 1) {
      currentIndex = currentIndex + 1;
      showLightbox();
    }
  } else {
    // swipe right -> prev
    if (currentIndex > 0) {
      currentIndex = currentIndex - 1;
      showLightbox();
    }
  }
}

// Touch events
lightbox.addEventListener('touchstart', (e) => {
  if (!lightbox || lightbox.style.display === 'none') return;
  if (e.touches && e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
  }
}, { passive: true });

lightbox.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches.length === 1) {
    touchCurrentX = e.touches[0].clientX;
  }
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  handleSwipe();
  touchStartX = touchCurrentX = 0;
});

// Pointer events fallback for browsers that support pointer events
let pointerDown = false;
lightbox.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'touch') {
    pointerDown = true;
    touchStartX = e.clientX;
    touchCurrentX = touchStartX;
  }
});
lightbox.addEventListener('pointermove', (e) => {
  if (pointerDown && e.pointerType === 'touch') {
    touchCurrentX = e.clientX;
  }
});
lightbox.addEventListener('pointerup', (e) => {
  if (pointerDown && e.pointerType === 'touch') {
    pointerDown = false;
    handleSwipe();
    touchStartX = touchCurrentX = 0;
  }
});
