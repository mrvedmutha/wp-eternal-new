/**
 * Product Detail Page (PDP) — client-side interactions.
 *
 * Modules:
 *   1. Gallery thumbnail switching
 *   2. Accordion open / close
 *   3. Quantity stepper
 *   4. Variant switching (variable products, WC AJAX)
 *   5. Subscription purchase mode toggle + plan select
 *   6. Add-to-bag form (subscription months hidden input)
 */

declare const EternalPDP: {
	ajaxUrl: string;
	nonce: string;
	productId: number;
	priceDecimals: number;
	currencySymbol: string;
	variations: Array<{
		variation_id: number;
		attributes: Record<string, string>;
		price: number;
		image: string;
		image_srcset: string;
	}>;
	plans: Array<{
		months: number;
		label: string;
		contentsNote: string;
		finalPrice: number;
		mrp: number;
		symbol: string;
	}>;
};

document.addEventListener("DOMContentLoaded", () => {
	initGallery();
	initGalleryCarousel();
	initLightbox();
	initAccordion();
	initQtyStepper();
	initVariantSwitching();
	initSubscriptionToggle();
	initIngredientsSlider();
	captureVideoThumbnails();
});

// ─── 1. Gallery thumbnail switching ─────────────────────────────────────────

let currentGalleryIndex = 0;

function initGallery(): void {
	const gallery = document.querySelector<HTMLElement>("[data-gallery]");
	if (!gallery) return;

	const heroContainer = gallery.querySelector<HTMLElement>(
		"[data-lightbox-trigger]",
	);
	const heroImg = gallery.querySelector<HTMLImageElement>("[data-hero-img]");
	const thumbs = gallery.querySelectorAll<HTMLButtonElement>(
		".pdp-gallery__thumb",
	);
	const navPrev = gallery.querySelector<HTMLButtonElement>("[data-nav-prev]");
	const navNext = gallery.querySelector<HTMLButtonElement>("[data-nav-next]");
	const videoOverlay =
		gallery.querySelector<HTMLElement>("[data-video-overlay]");

	if (!heroImg || !thumbs.length) return;

	const showImage = (url: string, srcset: string): void => {
		if (videoOverlay) videoOverlay.hidden = true;
		heroImg.style.opacity = "0";
		setTimeout(() => {
			heroImg.src = url;
			if (srcset) heroImg.srcset = srcset;
			heroImg.style.opacity = "1";
		}, 100);
	};

	const updateGalleryImage = (index: number): void => {
		const thumb = thumbs[index];
		if (!thumb) return;

		thumbs.forEach((t) => t.classList.remove("is-active"));
		thumb.classList.add("is-active");
		currentGalleryIndex = index;
		if (heroContainer) {
			heroContainer.dataset.currentIndex = String(index);
		}

		if (thumb.dataset.type === "video") {
			// Show captured frame in hero if available
			const frameImg =
				thumb.querySelector<HTMLImageElement>("[data-video-frame]");
			if (frameImg && frameImg.src && !frameImg.hidden) {
				heroImg.style.opacity = "0";
				setTimeout(() => {
					heroImg.src = frameImg.src;
					heroImg.srcset = "";
					heroImg.style.opacity = "1";
				}, 100);
			}
			if (videoOverlay) videoOverlay.hidden = false;
			return;
		}

		const fullUrl = thumb.dataset.fullUrl ?? "";
		const fullSrcset = thumb.dataset.fullSrcset ?? "";
		if (!fullUrl) return;

		showImage(fullUrl, fullSrcset);
	};

	// Thumbnail clicks — images update hero, videos show preview + play overlay
	thumbs.forEach((thumb, index) => {
		thumb.addEventListener("click", () => {
			updateGalleryImage(index);
		});
	});

	// Clicking the hero area while a video is active opens the lightbox
	heroContainer?.addEventListener("click", (e) => {
		const target = e.target as HTMLElement;
		if (target.closest("[data-gallery-zoom]")) return;
		if (target.closest("[data-nav-prev]")) return;
		if (target.closest("[data-nav-next]")) return;
		const currentThumb = thumbs[currentGalleryIndex];
		if (currentThumb?.dataset.type === "video") {
			document.dispatchEvent(
				new CustomEvent("pdp:open-lightbox", {
					detail: { index: currentGalleryIndex },
				}),
			);
		}
	});

	// Nav buttons cycle through all items including video
	const adjacentIndex = (from: number, dir: 1 | -1): number => {
		const total = thumbs.length;
		return ((from + dir) + total) % total;
	};

	if (navPrev) {
		navPrev.addEventListener("click", (e) => {
			e.stopPropagation();
			updateGalleryImage(adjacentIndex(currentGalleryIndex, -1));
		});
	}

	if (navNext) {
		navNext.addEventListener("click", (e) => {
			e.stopPropagation();
			updateGalleryImage(adjacentIndex(currentGalleryIndex, 1));
		});
	}
}

// ─── 1b. Video thumbnail first-frame capture ────────────────────────────────

function captureVideoThumbnails(): void {
	const videoThumbs = document.querySelectorAll<HTMLButtonElement>(
		".pdp-gallery__thumb--video, .pdp-modal__thumb--video",
	);

	videoThumbs.forEach((thumb) => {
		const videoUrl = thumb.dataset.videoUrl;
		if (!videoUrl) return;

		const frameImg = thumb.querySelector<HTMLImageElement>("[data-video-frame]");
		if (!frameImg) return;

		const video = document.createElement("video");
		video.muted = true;
		video.playsInline = true;
		video.crossOrigin = "anonymous";

		const cleanup = (): void => {
			video.src = "";
		};

		video.addEventListener("loadeddata", () => {
			video.currentTime = 0.01;
		});

		video.addEventListener("seeked", () => {
			try {
				const canvas = document.createElement("canvas");
				canvas.width = video.videoWidth || 160;
				canvas.height = video.videoHeight || 200;
				const ctx = canvas.getContext("2d");
				ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
				const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
				frameImg.src = dataUrl;
				frameImg.hidden = false;

				// Also fill the matching carousel video slide frame
				if (thumb.classList.contains("pdp-gallery__thumb--video")) {
					const slotIndex = thumb.dataset.index;
					if (slotIndex !== undefined) {
						const carouselFrame =
							document.querySelector<HTMLImageElement>(
								`.pdp-gallery__carousel-slide[data-carousel-index="${slotIndex}"] .pdp-gallery__carousel-frame`,
							);
						if (carouselFrame) {
							carouselFrame.src = dataUrl;
							carouselFrame.hidden = false;
						}
					}
				}
			} catch {
				// Cross-origin taint or other error — keep dark thumb
			}
			cleanup();
		});

		video.addEventListener("error", cleanup);

		video.src = videoUrl;
		video.load();
	});
}

// ─── 1c. Gallery carousel (mobile ≤700px) ───────────────────────────────────

function initGalleryCarousel(): void {
	const mq = window.matchMedia("(max-width: 700px)");
	const heroContainer =
		document.querySelector<HTMLElement>(".pdp-gallery__hero");
	const thumbs = Array.from(
		document.querySelectorAll<HTMLButtonElement>(".pdp-gallery__thumb"),
	);

	if (!heroContainer || thumbs.length < 2) return;

	const heroImg =
		heroContainer.querySelector<HTMLImageElement>("[data-hero-img]");
	if (!heroImg) return;

	let track: HTMLDivElement | null = null;
	let isActive = false;
	// Separate tracker so the MutationObserver can distinguish nav-button
	// changes (made by initGallery before the attribute fires) from swipe
	// changes (made after setPos via syncThumbs).
	let carouselPos = 0;

	const cardWidth = (): number => heroContainer.offsetWidth;

	const setPos = (index: number, animated: boolean): void => {
		if (!track) return;
		track.style.transition = animated
			? "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
			: "none";
		track.style.transform = `translateX(${-index * cardWidth()}px)`;
	};

	const syncThumbs = (index: number): void => {
		carouselPos = index; // update before writing the attribute
		thumbs.forEach((t, i) => t.classList.toggle("is-active", i === index));
		const trigger = document.querySelector<HTMLElement>(
			"[data-lightbox-trigger]",
		);
		if (trigger) trigger.dataset.currentIndex = String(index);
		currentGalleryIndex = index;
	};

	const build = (): void => {
		if (isActive) return;
		isActive = true;

		heroImg.style.display = "none";

		track = document.createElement("div");
		track.className = "pdp-gallery__carousel-track";

		thumbs.forEach((thumb) => {
			if (thumb.dataset.type === "video") {
				const slide = document.createElement("div");
				slide.className =
					"pdp-gallery__carousel-slide pdp-gallery__carousel-slide--video";
				slide.dataset.carouselIndex = thumb.dataset.index ?? "";

				const frameImg = document.createElement("img");
				frameImg.className = "pdp-gallery__carousel-frame";
				frameImg.alt = "";
				frameImg.hidden = true;
				frameImg.draggable = false;

				const playIcon = document.createElement("div");
				playIcon.className = "pdp-gallery__carousel-play";
				playIcon.innerHTML =
					'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.5)"/><path d="M26 20L50 32L26 44V20Z" fill="white"/></svg>';

				slide.appendChild(frameImg);
				slide.appendChild(playIcon);
				track!.appendChild(slide);
			} else {
				const el = document.createElement("img");
				el.className = "pdp-gallery__hero-img";
				el.src = thumb.dataset.fullUrl ?? "";
				if (thumb.dataset.fullSrcset) el.srcset = thumb.dataset.fullSrcset;
				el.alt = thumb.getAttribute("aria-label") ?? "";
				el.draggable = false;
				track!.appendChild(el);
			}
		});

		heroContainer.insertBefore(track, heroContainer.firstChild);
		setPos(currentGalleryIndex, false);
		carouselPos = currentGalleryIndex;

		let startX = 0;
		let liveX = 0;
		let dragging = false;

		heroContainer.addEventListener(
			"touchstart",
			(e: TouchEvent) => {
				startX = e.touches[0].clientX;
				liveX = startX;
				dragging = true;
				if (track) track.style.transition = "none";
			},
			{ passive: true },
		);

		heroContainer.addEventListener(
			"touchmove",
			(e: TouchEvent) => {
				if (!dragging || !track) return;
				liveX = e.touches[0].clientX;
				const delta = liveX - startX;
				track.style.transform = `translateX(${-currentGalleryIndex * cardWidth() + delta}px)`;
			},
			{ passive: true },
		);

		heroContainer.addEventListener("touchend", () => {
			if (!dragging || !track) return;
			dragging = false;

			const delta = liveX - startX;
			const threshold = cardWidth() * 0.25;
			let newIndex = currentGalleryIndex;

			if (delta < -threshold && currentGalleryIndex < thumbs.length - 1) {
				newIndex = currentGalleryIndex + 1;
			} else if (delta > threshold && currentGalleryIndex > 0) {
				newIndex = currentGalleryIndex - 1;
			}

			setPos(newIndex, true);
			if (newIndex !== currentGalleryIndex) syncThumbs(newIndex);
		});
	};

	const destroy = (): void => {
		if (!isActive) return;
		isActive = false;
		track?.remove();
		track = null;
		heroImg.style.display = "";
		const thumb = thumbs[currentGalleryIndex];
		if (thumb?.dataset.type === "video") {
			const frameImg =
				thumb.querySelector<HTMLImageElement>("[data-video-frame]");
			if (frameImg && frameImg.src && !frameImg.hidden) {
				heroImg.src = frameImg.src;
				heroImg.srcset = "";
			}
		} else if (thumb) {
			heroImg.src = thumb.dataset.fullUrl ?? "";
			if (thumb.dataset.fullSrcset) heroImg.srcset = thumb.dataset.fullSrcset;
		}
	};

	// Keep carousel in sync when nav buttons update data-current-index.
	// Uses carouselPos instead of currentGalleryIndex because initGallery
	// writes currentGalleryIndex *before* firing the attribute change, which
	// would make the old guard (idx !== currentGalleryIndex) always false.
	const trigger = document.querySelector<HTMLElement>("[data-lightbox-trigger]");
	if (trigger) {
		new MutationObserver(() => {
			if (!isActive || !track) return;
			const idx = parseInt(trigger.dataset.currentIndex ?? "0", 10);
			if (!isNaN(idx) && idx !== carouselPos) {
				carouselPos = idx;
				setPos(idx, true);
				currentGalleryIndex = idx;
			}
		}).observe(trigger, {
			attributes: true,
			attributeFilter: ["data-current-index"],
		});
	}

	if (mq.matches) build();
	mq.addEventListener("change", () => (mq.matches ? build() : destroy()));
}

// ─── 1d. Lightbox Modal ──────────────────────────────────────────────────────

class PDPLightbox {
	private modal: HTMLElement | null = null;
	private backdrop: HTMLElement | null = null;
	private modalImg: HTMLImageElement | null = null;
	private modalVideo: HTMLVideoElement | null = null;
	private modalThumbs: NodeListOf<HTMLButtonElement> | null = null;
	private thumbsContainer: HTMLElement | null = null;
	private closeBtn: HTMLButtonElement | null = null;
	private navPrev: HTMLButtonElement | null = null;
	private navNext: HTMLButtonElement | null = null;
	private gradientLeft: HTMLElement | null = null;
	private gradientRight: HTMLElement | null = null;

	private currentIndex = 0;
	private totalImages = 0;
	private isOpen = false;
	private gradientTimer: number | null = null;
	private focusableElements: HTMLElement[] = [];
	private lastFocusedElement: HTMLElement | null = null;

	// Touch gesture support
	private touchStartX = 0;
	private touchEndX = 0;

	constructor() {
		this.modal = document.querySelector<HTMLElement>("[data-pdp-modal]");
		if (!this.modal) return;

		this.backdrop = this.modal.querySelector<HTMLElement>(
			"[data-modal-backdrop]",
		);
		this.modalImg =
			this.modal.querySelector<HTMLImageElement>("[data-modal-img]");
		this.modalVideo =
			this.modal.querySelector<HTMLVideoElement>("[data-modal-video]");
		this.modalThumbs =
			this.modal.querySelectorAll<HTMLButtonElement>(
				"[data-modal-thumb]",
			);
		this.thumbsContainer = this.modal.querySelector<HTMLElement>(
			"[data-modal-thumbs]",
		);
		this.closeBtn =
			this.modal.querySelector<HTMLButtonElement>("[data-modal-close]");
		this.navPrev = this.modal.querySelector<HTMLButtonElement>(
			"[data-modal-nav-prev]",
		);
		this.navNext = this.modal.querySelector<HTMLButtonElement>(
			"[data-modal-nav-next]",
		);
		this.gradientLeft = this.modal.querySelector<HTMLElement>(
			".pdp-modal__gradient--left",
		);
		this.gradientRight = this.modal.querySelector<HTMLElement>(
			".pdp-modal__gradient--right",
		);

		this.bindEvents();
	}

	private bindEvents(): void {
		// Zoom button opens lightbox at current image index
		const zoomBtn = document.querySelector<HTMLButtonElement>(
			"[data-gallery-zoom]",
		);
		if (zoomBtn) {
			zoomBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				const heroContainer = document.querySelector<HTMLElement>(
					"[data-lightbox-trigger]",
				);
				const index = parseInt(
					heroContainer?.dataset.currentIndex ?? "0",
					10,
				);
				this.open(index);
			});
		}

		// Video thumbnail click dispatches this event
		document.addEventListener("pdp:open-lightbox", (e: Event) => {
			const index = (e as CustomEvent<{ index: number }>).detail.index;
			this.open(index);
		});

		// Modal thumbnail clicks
		this.modalThumbs?.forEach((thumb) => {
			thumb.addEventListener("click", (e) => {
				e.stopPropagation();
				const idx = parseInt(thumb.dataset.index ?? "0", 10);
				this.updateItem(idx);
				this.showGradientsTemporarily();
			});
		});

		// Close button
		this.closeBtn?.addEventListener("click", () => this.close());

		// Backdrop click
		this.backdrop?.addEventListener("click", () => this.close());

		// Navigation buttons
		this.navPrev?.addEventListener("click", (e) => {
			e.stopPropagation();
			this.navigate("prev");
			this.showGradientsTemporarily();
		});

		this.navNext?.addEventListener("click", (e) => {
			e.stopPropagation();
			this.navigate("next");
			this.showGradientsTemporarily();
		});

		// Modal thumbnail clicks - removed as thumbnails are hidden

		// Keyboard navigation
		document.addEventListener("keydown", (e) => {
			if (!this.isOpen) return;

			switch (e.key) {
				case "ArrowLeft":
					e.preventDefault();
					this.navigate("prev");
					break;
				case "ArrowRight":
					e.preventDefault();
					this.navigate("next");
					break;
				case "Escape":
					this.close();
					break;
				case "Tab":
					this.handleTabKey(e);
					break;
			}
		});

		// Touch gestures
		if (this.modal) {
			this.modal.addEventListener(
				"touchstart",
				(e) => {
					this.touchStartX = e.changedTouches[0].screenX;
				},
				{ passive: true },
			);

			this.modal.addEventListener(
				"touchend",
				(e) => {
					this.touchEndX = e.changedTouches[0].screenX;
					this.handleGesture();
				},
				{ passive: true },
			);
		}
	}

	public open(index = 0): void {
		if (!this.modal || !this.modalImg) return;

		// Store last focused element
		this.lastFocusedElement = document.activeElement as HTMLElement;

		this.isOpen = true;
		this.currentIndex = index;

		// Get total from data attribute
		const heroContainer = document.querySelector<HTMLElement>(
			"[data-lightbox-trigger]",
		);
		this.totalImages = parseInt(
			heroContainer?.dataset.totalImages ?? "1",
			10,
		);

		// Update content (image or video) and sync thumb active state
		this.updateItem(index);
		this.syncModalThumbActive(index);

		// Show modal
		this.modal.hidden = false;
		document.body.style.overflow = "hidden";
		document.body.classList.add("pdp-modal-open");

		// Setup focus trap
		this.setupFocusTrap();

		// Focus close button
		setTimeout(() => this.closeBtn?.focus(), 100);

		// Show gradients temporarily on open (for touch devices)
		this.showGradientsTemporarily();
	}

	public close(): void {
		if (!this.modal) return;

		this.isOpen = false;
		this.modal.hidden = true;
		document.body.style.overflow = "";
		document.body.classList.remove("pdp-modal-open");

		// Stop modal video if playing
		if (this.modalVideo) {
			this.modalVideo.pause();
			this.modalVideo.src = "";
			this.modalVideo.hidden = true;
		}
		if (this.modalImg) {
			this.modalImg.hidden = false;
		}

		// Restore focus
		this.lastFocusedElement?.focus();

		// Clear gradient timer
		if (this.gradientTimer !== null) {
			clearTimeout(this.gradientTimer);
			this.gradientTimer = null;
		}
	}

	private navigate(direction: "prev" | "next"): void {
		if (direction === "prev") {
			this.currentIndex =
				this.currentIndex > 0
					? this.currentIndex - 1
					: this.totalImages - 1;
		} else {
			this.currentIndex =
				this.currentIndex < this.totalImages - 1
					? this.currentIndex + 1
					: 0;
		}
		this.updateItem(this.currentIndex);
	}

	private updateItem(index: number): void {
		const galleryThumbs = document.querySelectorAll<HTMLButtonElement>(
			".pdp-gallery__thumb",
		);
		const thumb = this.modalThumbs?.[index] || galleryThumbs[index];
		if (!thumb) return;

		const isVideo = thumb.dataset.type === "video";

		if (isVideo) {
			const videoUrl = thumb.dataset.videoUrl ?? "";
			if (!videoUrl || !this.modalVideo) return;

			// Hide image, show and play video
			if (this.modalImg) {
				this.modalImg.style.opacity = "0";
				this.modalImg.hidden = true;
			}
			this.modalVideo.src = videoUrl;
			this.modalVideo.hidden = false;
			this.modalVideo.play().catch(() => {});
		} else {
			const fullUrl = thumb.dataset.fullUrl ?? "";
			const fullSrcset = thumb.dataset.fullSrcset ?? "";
			if (!fullUrl || !this.modalImg) return;

			// Pause video, show image
			if (this.modalVideo) {
				this.modalVideo.pause();
				this.modalVideo.src = "";
				this.modalVideo.hidden = true;
			}
			this.modalImg.hidden = false;
			this.modalImg.style.opacity = "0";

			setTimeout(() => {
				if (!this.modalImg) return;
				this.modalImg.src = fullUrl;
				if (fullSrcset) this.modalImg.srcset = fullSrcset;
				this.modalImg.alt = thumb.getAttribute("aria-label") ?? "";
				this.modalImg.style.opacity = "1";
			}, 150);
		}

		this.currentIndex = index;
		this.syncModalThumbActive(index);
		this.preloadAdjacentImages(index);
	}

	private syncModalThumbActive(activeIndex: number): void {
		this.modalThumbs?.forEach((thumb) => {
			const idx = parseInt(thumb.dataset.index ?? "0", 10);
			thumb.classList.toggle("is-active", idx === activeIndex);
		});
		// Scroll active thumb into view
		const activeThumb = Array.from(this.modalThumbs ?? []).find(
			(t) => parseInt(t.dataset.index ?? "0", 10) === activeIndex,
		);
		if (activeThumb) this.scrollThumbIntoView(activeThumb);
	}

	private scrollThumbIntoView(thumb: HTMLElement): void {
		if (!this.thumbsContainer) return;

		const containerRect = this.thumbsContainer.getBoundingClientRect();
		const thumbRect = thumb.getBoundingClientRect();

		const offset =
			thumbRect.left -
			containerRect.left -
			containerRect.width / 2 +
			thumbRect.width / 2;

		this.thumbsContainer.scrollBy({
			left: offset,
			behavior: "smooth",
		});
	}

	private preloadAdjacentImages(currentIndex: number): void {
		const indicesToPreload = [currentIndex - 1, currentIndex + 1];

		const galleryThumbs = document.querySelectorAll<HTMLButtonElement>(
			".pdp-gallery__thumb",
		);

		indicesToPreload.forEach((idx) => {
			if (idx >= 0 && idx < this.totalImages) {
				const thumb = this.modalThumbs?.[idx] || galleryThumbs[idx];
				if (!thumb || thumb.dataset.type === "video") return;
				const url = thumb.dataset.fullUrl;
				if (url) {
					const img = new Image();
					img.src = url;
				}
			}
		});
	}

	private showGradientsTemporarily(): void {
		if (!this.modal) return;

		// Clear existing timer
		if (this.gradientTimer !== null) {
			clearTimeout(this.gradientTimer);
		}

		// Add class to show gradients
		this.modal.classList.add("pdp-modal--gradient-visible");

		// Remove after 3 seconds
		this.gradientTimer = window.setTimeout(() => {
			this.modal?.classList.remove("pdp-modal--gradient-visible");
			this.gradientTimer = null;
		}, 3000);
	}

	private handleGesture(): void {
		const swipeThreshold = 50;
		const diff = this.touchStartX - this.touchEndX;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swiped left - next image
				this.navigate("next");
			} else {
				// Swiped right - previous image
				this.navigate("prev");
			}
			this.showGradientsTemporarily();
		}
	}

	private setupFocusTrap(): void {
		if (!this.modal) return;

		// Get all focusable elements
		const focusableSelectors =
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
		this.focusableElements = Array.from(
			this.modal.querySelectorAll<HTMLElement>(focusableSelectors),
		).filter((el) => !el.hasAttribute("disabled") && !el.hidden);
	}

	private handleTabKey(e: KeyboardEvent): void {
		if (this.focusableElements.length === 0) return;

		const firstElement = this.focusableElements[0];
		const lastElement =
			this.focusableElements[this.focusableElements.length - 1];

		if (e.shiftKey) {
			// Shift + Tab
			if (document.activeElement === firstElement) {
				e.preventDefault();
				lastElement?.focus();
			}
		} else {
			// Tab
			if (document.activeElement === lastElement) {
				e.preventDefault();
				firstElement?.focus();
			}
		}
	}
}

function initLightbox(): void {
	new PDPLightbox();
}

// ─── 2. Accordion ────────────────────────────────────────────────────────────

function initAccordion(): void {
	const accordion = document.querySelector<HTMLElement>("[data-accordion]");
	if (!accordion) return;

	const headers = accordion.querySelectorAll<HTMLButtonElement>(
		"[data-accordion-header]",
	);

	headers.forEach((header) => {
		header.addEventListener("click", () => {
			const isOpen = header.getAttribute("aria-expanded") === "true";
			const bodyId = header.getAttribute("aria-controls");
			const body = bodyId ? document.getElementById(bodyId) : null;
			const icon = header.querySelector<HTMLElement>(
				".pdp-accordion__icon",
			);

			if (!body) return;

			const willOpen = !isOpen;

			header.setAttribute("aria-expanded", String(willOpen));
			body.hidden = !willOpen;

			if (icon) {
				icon.textContent = willOpen ? "−" : "+";
			}
		});
	});
}

// ─── 3. Quantity stepper ─────────────────────────────────────────────────────

function initQtyStepper(): void {
	document.querySelectorAll<HTMLElement>("[data-qty]").forEach((wrapper) => {
		const form = wrapper.closest<HTMLFormElement>("form");
		const display = wrapper.querySelector<HTMLElement>(".pdp-qty__display");
		const btnMinus = wrapper.querySelector<HTMLButtonElement>(
			".pdp-qty__btn--minus",
		);
		const btnPlus = wrapper.querySelector<HTMLButtonElement>(
			".pdp-qty__btn--plus",
		);
		const hiddenQty =
			form?.querySelector<HTMLInputElement>(".pdp-qty__input");

		if (!display || !btnMinus || !btnPlus) return;

		let qty = 1;

		const update = (newQty: number): void => {
			qty = Math.max(1, newQty);
			display.textContent = String(qty);
			if (hiddenQty) {
				hiddenQty.value = String(qty);
			}
		};

		btnMinus.addEventListener("click", () => update(qty - 1));
		btnPlus.addEventListener("click", () => update(qty + 1));
	});
}

// ─── 4. Variant switching (variable products) ─────────────────────────────────

function initVariantSwitching(): void {
	const variationForm = document.querySelector<HTMLElement>(
		"[data-variation-form]",
	);
	if (
		!variationForm ||
		typeof EternalPDP === "undefined" ||
		!EternalPDP.variations.length
	)
		return;

	const selects = variationForm.querySelectorAll<HTMLSelectElement>(
		".pdp-buybox__select",
	);
	const priceBlock = document.querySelector<HTMLElement>(
		"[data-variation-price]",
	);
	const heroImg = document.querySelector<HTMLImageElement>(
		".pdp-gallery__hero-img",
	);
	const variationIdEl =
		document.querySelector<HTMLInputElement>(".pdp-variation-id");

	if (!selects.length) return;

	const getSelectedAttributes = (): Record<string, string> => {
		const attrs: Record<string, string> = {};
		selects.forEach((sel) => {
			if (sel.dataset.attribute_name) {
				attrs[sel.dataset.attribute_name] = sel.value;
			}
		});
		return attrs;
	};

	const findMatchingVariation = (attrs: Record<string, string>) => {
		return EternalPDP.variations.find((v) => {
			return Object.entries(v.attributes).every(([key, val]) => {
				// Empty attribute value in variation means "any".
				return val === "" || attrs[key] === val;
			});
		});
	};

	const updatePriceDisplay = (
		match: (typeof EternalPDP.variations)[0] | undefined,
	): void => {
		if (!priceBlock) return;

		const amountEl = priceBlock.querySelector<HTMLElement>(
			".pdp-buybox__price-amount",
		);
		if (!amountEl) return;

		if (match) {
			const symbol = EternalPDP.currencySymbol;
			const formatted =
				symbol + new Intl.NumberFormat("en-IN").format(match.price);
			amountEl.textContent = formatted;
			amountEl.classList.remove("pdp-buybox__price-range");

			if (variationIdEl) {
				variationIdEl.value = String(match.variation_id);
			}

			// Swap hero image.
			if (heroImg && match.image) {
				heroImg.style.opacity = "0";
				setTimeout(() => {
					heroImg.src = match.image;
					if (match.image_srcset) heroImg.srcset = match.image_srcset;
					heroImg.style.opacity = "1";
				}, 100);
			}
		} else {
			// No match — show price range placeholder.
			if (variationIdEl) variationIdEl.value = "";
		}
	};

	selects.forEach((sel) => {
		sel.addEventListener("change", () => {
			const attrs = getSelectedAttributes();
			const allSelected = Object.values(attrs).every((v) => v !== "");

			if (allSelected) {
				const match = findMatchingVariation(attrs);
				updatePriceDisplay(match);
			}
		});
	});
}

// ─── 5. Subscription purchase mode toggle ────────────────────────────────────

function initSubscriptionToggle(): void {
	const modeGroup = document.querySelector<HTMLElement>(
		"[data-purchase-mode]",
	);
	if (!modeGroup || typeof EternalPDP === "undefined") return;

	const radios = modeGroup.querySelectorAll<HTMLInputElement>(
		".pdp-buybox__plan-radio",
	);
	const oneTimeCard = modeGroup.querySelector<HTMLElement>(
		'[data-plan-card="one-time"]',
	);
	const subCard = modeGroup.querySelector<HTMLElement>(
		'[data-plan-card="subscription"]',
	);
	const planDropdown = modeGroup.querySelector<HTMLElement>(
		"[data-plan-dropdown]",
	);
	const planSelect =
		modeGroup.querySelector<HTMLSelectElement>("[data-plan-select]");
	const priceDisplay = document.querySelector<HTMLElement>(
		"[data-price-display]",
	);
	const supplyMonths =
		document.querySelector<HTMLInputElement>(".pdp-supply-months");
	const planNote = modeGroup.querySelector<HTMLElement>("[data-plan-note]");
	const unitDisplay = document.querySelector<HTMLElement>("[data-unit-display]");
	const baseUnitAmount = unitDisplay
		? parseInt(unitDisplay.dataset.unitAmount ?? "0", 10)
		: 0;
	const baseUnitText = unitDisplay?.dataset.unitText ?? "";

	const decimals =
		typeof EternalPDP !== "undefined" ? EternalPDP.priceDecimals : 2;
	const formatPrice = (symbol: string, amount: number): string =>
		symbol +
		new Intl.NumberFormat("en-IN", {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		}).format(amount);

	const applyPlanTier = (months: number): void => {
		const tier = EternalPDP.plans.find((p) => p.months === months);
		if (!tier || !priceDisplay) return;

		const formatted = formatPrice(tier.symbol, tier.finalPrice);
		priceDisplay.textContent = formatted;

		// Also update the inline price inside the subscription card.
		const cardPriceEl = document.querySelector<HTMLElement>(
			"[data-subscription-price]",
		);
		if (cardPriceEl) {
			cardPriceEl.textContent = formatted;
		}

		if (supplyMonths) supplyMonths.value = String(tier.months);

		if (planNote) {
			planNote.textContent = tier.contentsNote || "";
		}

		// Update unit quantity: base amount × months.
		if (unitDisplay && baseUnitAmount) {
			unitDisplay.textContent = `/ ${baseUnitAmount * months} ${baseUnitText}`;
		}
	};

	const setMode = (mode: "one-time" | "subscription"): void => {
		const isSubscription = mode === "subscription";

		// Toggle card border.
		oneTimeCard?.classList.toggle(
			"pdp-buybox__plan-card--expanded",
			!isSubscription,
		);
		subCard?.classList.toggle(
			"pdp-buybox__plan-card--expanded",
			isSubscription,
		);

		// Show / hide plan body.
		if (planDropdown) {
			planDropdown.style.display = isSubscription ? "flex" : "none";
		}

		if (isSubscription) {
			// Restore first plan price.
			const firstMonths = planSelect
				? parseInt(planSelect.value, 10)
				: EternalPDP.plans[0]?.months;
			if (firstMonths) applyPlanTier(firstMonths);
			if (supplyMonths) supplyMonths.value = String(firstMonths);
		} else {
			// One-time: show base product price.
			const oneTimeEl = document.querySelector<HTMLElement>(
				"[data-one-time-price]",
			);
			if (priceDisplay && oneTimeEl) {
				priceDisplay.textContent = oneTimeEl.textContent ?? "";
			}
			if (supplyMonths) supplyMonths.value = "0";

			// Reset unit to base amount.
			if (unitDisplay && baseUnitAmount) {
				unitDisplay.textContent = `/ ${baseUnitAmount} ${baseUnitText}`;
			}
		}
	};

	// Radio card clicks.
	radios.forEach((radio) => {
		radio.addEventListener("change", () => {
			setMode(radio.value as "one-time" | "subscription");
		});
	});

	// Clicking anywhere on a plan card selects it.
	modeGroup
		.querySelectorAll<HTMLElement>("[data-plan-card]")
		.forEach((card) => {
			card.addEventListener("click", (e) => {
				const radio = card.querySelector<HTMLInputElement>(
					".pdp-buybox__plan-radio",
				);
				if (!radio) return;
				// Avoid double-firing when clicking directly on the input.
				if (e.target === radio) return;
				radio.checked = true;
				radio.dispatchEvent(new Event("change", { bubbles: true }));
			});
		});

	// Plan dropdown change.
	planSelect?.addEventListener("change", () => {
		const months = parseInt(planSelect.value, 10);
		if (!isNaN(months)) applyPlanTier(months);
	});

	// Initialise: subscription is default.
	if (EternalPDP.plans.length) {
		const defaultMonths = EternalPDP.plans[0].months;
		applyPlanTier(defaultMonths);
	}
}

// ─── Ingredients slider (mobile only ≤700px) ────────────────────────────────

function initIngredientsSlider(): void {
	const track = document.querySelector<HTMLElement>("[data-ingredients-track]");
	if (!track) return;

	const cards = track.querySelectorAll<HTMLElement>(".pdp-ingredients__card");
	if (cards.length <= 1) return;

	const prevBtn = document.querySelector<HTMLButtonElement>(
		"[data-ingredients-prev]",
	);
	const nextBtn = document.querySelector<HTMLButtonElement>(
		"[data-ingredients-next]",
	);
	const fill = document.querySelector<HTMLElement>("[data-ingredients-fill]");

	const mq = window.matchMedia("(max-width: 700px)");
	let current = 0;
	const total = cards.length;

	const updateProgress = (index: number): void => {
		if (fill) fill.style.width = `${((index + 1) / total) * 100}%`;
	};

	const goTo = (index: number): void => {
		if (!mq.matches) return;
		current = ((index % total) + total) % total;
		track.style.transform = `translateX(${-current * 100}%)`;
		updateProgress(current);
	};

	// Reset when viewport leaves mobile
	mq.addEventListener("change", () => {
		if (!mq.matches) {
			track.style.transform = "";
			current = 0;
			updateProgress(0);
		}
	});

	prevBtn?.addEventListener("click", () => goTo(current - 1));
	nextBtn?.addEventListener("click", () => goTo(current + 1));
}
