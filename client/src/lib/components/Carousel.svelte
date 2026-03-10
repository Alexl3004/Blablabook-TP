<script>
  import { onMount, onDestroy } from "svelte";
  import CardBook from "./CardBook.svelte";
  import { api } from "$lib/service/api.service.js";
  import { cubicOut } from "svelte/easing";
  import { flip } from "svelte/animate";

  let books = $state([]);
  let index = $state(0);
  let visibleCount = $state(5);
  let direction = $state(1); // 1 = droite, -1 = gauche

  function getVisibleCount() {
    if (typeof window === "undefined") return 5;
    const cardWidth = 150;
    const gap = 16;
    const padding = 32;
    const available = window.innerWidth - padding;
    return Math.max(2, Math.floor(available / (cardWidth + gap)));
  }

  function updateVisibleCount() {
    visibleCount = getVisibleCount();
  }

  let visibleBooks = $derived(
    books.length > 0
      ? Array.from(
          { length: Math.min(visibleCount, books.length) }, // ← ici
          (_, i) => ({ ...books[(index + i) % books.length], _slot: i }),
        )
      : [],
  );

  function prev() {
    if (books.length === 0) return;
    direction = -1;
    index = (index - 1 + books.length) % books.length;
  }

  function next() {
    if (books.length === 0) return;
    direction = 1;
    index = (index + 1) % books.length;
  }

  function slideIn(node, { delay = 0 } = {}) {
    return {
      delay,
      duration: 500,
      easing: cubicOut,
      css: (t) => `
        opacity: ${t};
        transform: translateX(${(1 - t) * 40 * direction}px);
      `,
    };
  }

  function slideOut(node) {
    return {
      duration: 400,
      easing: cubicOut,
      css: (t) => `
        opacity: ${t};
        transform: translateX(${(1 - t) * -40 * direction}px);
      `,
    };
  }

  let interval;

  function startInterval() {
    interval = setInterval(next, 7000);
  }

  function stopInterval() {
    clearInterval(interval);
  }

  let touchStartX = 0;
  let touchEndX = 0;

  function onTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function onTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
  }

  onMount(async () => {
    try {
      const res = await api.randomBook();
      books = res || [];
    } catch (err) {
      console.error("ERREUR API =", err);
    }
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    interval = setInterval(next, 7000);
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", updateVisibleCount);
    }
    clearInterval(interval);
  });
</script>

{#if books.length > 0}
  <section
    class="carousel-container"
    aria-label="Carousel de livres"
    onmouseenter={stopInterval}
    onmouseleave={startInterval}
    ontouchstart={onTouchStart}
    ontouchend={onTouchEnd}
  >
    <div class="carousel-viewport">
      <div class="slides-container">
        {#each visibleBooks as book, i (book._slot)}
          <div
            class="slide-wrapper"
            animate:flip={{ duration: 500, easing: cubicOut }}
            in:slideIn={{ delay: i * 40 }}
            out:slideOut
          >
            <CardBook {book} />
          </div>
        {/each}
      </div>
      <button class="arrow prev" onclick={prev} aria-label="Précédent">
        <span>&#10094;</span>
      </button>
      <button class="arrow next" onclick={next} aria-label="Suivant">
        <span>&#10095;</span>
      </button>
    </div>
  </section>
{/if}

<style>
  .carousel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 40px 0;
    padding: 0;
    box-sizing: border-box;
  }

  .carousel-viewport {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
  }

  .slides-container {
    display: flex;
    justify-content: center;
    gap: 16px;
    width: 100%;
    align-items: stretch;
    padding: 20px 16px;
    box-sizing: border-box;
  }

  .slide-wrapper {
    flex: 1 1 0;
    min-width: 100px;
    max-width: 200px;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform, opacity;
  }

  .slide-wrapper:hover {
    transform: translateY(-10px) scale(1.03);
  }

  /* ── Flèches ── */
  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(0, 0, 0, 0.25);
    border: none;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    color: white;
    transition:
      background 0.25s ease,
      transform 0.25s ease,
      opacity 0.25s ease;
    user-select: none;
    padding: 0;
    opacity: 0.8;
  }

  .arrow.prev {
    left: 4px;
  }
  .arrow.next {
    right: 4px;
  }

  .arrow:hover {
    background: rgba(0, 0, 0, 0.55);
    transform: translateY(-50%) scale(1.15);
    opacity: 1;
  }

  .arrow:active {
    transform: translateY(-50%) scale(0.9);
  }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .arrow {
      width: 28px;
      height: 28px;
      font-size: 0.85rem;
    }
    .slides-container {
      gap: 8px;
      padding: 12px 8px;
    }
  }

  @media (max-width: 400px) {
    .slides-container {
      gap: 6px;
      padding: 8px 6px;
    }
  }
</style>
