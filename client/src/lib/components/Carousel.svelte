<script>
  import { onMount, onDestroy } from "svelte";
  import CardBook from "./CardBook.svelte";
  import { api } from '$lib/service/api.service.js';

  let books = $state([]);
  let index = $state(0);
  let visibleCount = $state(5);

  function getVisibleCount() {
    if (typeof window === "undefined") return 5;
    const w = window.innerWidth;
    if (w <= 780) return 2;
    if (w <= 1300) return 3;
    if (w <= 1550) return 4;
    return 5;
  }

  function updateVisibleCount() {
    visibleCount = getVisibleCount();
  }

  let visibleBooks = $derived(
    books.length > 0
      ? Array.from(
          { length: visibleCount },
          (_, i) => books[(index + i) % books.length],
        )
      : [],
  );

  function prev() {
    if (books.length === 0) return;
    index = (index - 1 + books.length) % books.length;
  }

  function next() {
    if (books.length === 0) return;
    index = (index + 1) % books.length;
  }

  let interval;

  onMount(async () => {
    try {
      const res = await api.randomBook();
      books = res || [];
    } catch (err) {
      console.error("ERREUR API =", err);
    }
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    interval = setInterval(next, 5000);
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", updateVisibleCount);
    }
    clearInterval(interval);
  });
</script>

{#if books.length > 0}
  <section class="carousel-container">
    <div class="carousel-viewport">
      <button class="arrow prev" onclick={prev} aria-label="Précédent">
        <span>&#10094;</span>
      </button>
      <div class="slides-container">
        {#each visibleBooks as book, i (book.id || index + i)}
          <div class="slide-wrapper">
            <CardBook {book} />
          </div>
        {/each}
      </div>
      <button class="arrow next" onclick={next} aria-label="Suivant">
        <span>&#10095;</span>
      </button>
    </div>
    <div class="navigation-dots">
      {#each books as _, i}
        <button
          class="dot {i === index ? 'active' : ''}"
          onclick={() => (index = i)}
          aria-label="Aller au slide {i + 1}"
        ></button>
      {/each}
    </div>
  </section>
{/if}

<style>
  .carousel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 30px;
    margin: 40px 0;
    padding: 0 1rem;
    box-sizing: border-box;
  }

  .carousel-viewport {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1600px;
    gap: 15px;
  }

  .slides-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex: 1;
    min-width: 0;
    align-items: stretch;
  }

  .slide-wrapper {
    flex: 0 0 280px;
    width: 280px;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
  }

  .slide-wrapper:hover {
    transform: translateY(-10px);
  }

  /* ── Flèches ── */
  .arrow {
    background: none;
    box-shadow: none;
    border: none;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 2.5rem;
    color: var(--color-text);
    opacity: 0.5;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
    z-index: 10;
    flex-shrink: 0;
    user-select: none;
    padding: 0;
  }

  .arrow:hover {
    opacity: 1;
    color: var(--color-secondary);
    transform: scale(1.2);
    box-shadow: none;
    background: none;
  }

  .arrow:active {
    transform: scale(0.9);
  }

  /* ── Dots ── */
  .navigation-dots {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px 0;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: var(--color-border-strong);
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    box-shadow: none;
  }

  .dot:hover {
    background: var(--color-text);
    opacity: 0.5;
    transform: none;
    box-shadow: none;
  }

  .dot.active {
    background: var(--color-secondary);
    border-radius: 10px;
    box-shadow: none;
  }

  /* ── Responsive ── */
  @media (max-width: 1200px) {
    .slide-wrapper {
      flex: 0 0 240px;
      width: 240px;
    }
  }

  @media (max-width: 960px) {
    .arrow {
      font-size: 1.8rem;
      width: 35px;
    }

    .slides-container {
      gap: 10px;
    }

    .slide-wrapper {
      flex: 0 0 100%;
      width: 100%;
      max-width: 220px;
    }
  }
  @media (max-width: 780px) {
    .arrow {
      font-size: 1.4rem;
      width: 35px;
    }

    .slides-container {
      gap: 10px;
    }

    .slide-wrapper {
      flex: 0 0 100%;
      width: 100%;
      max-width: 200px;
    }
  }

  @media (max-width: 540px) {
    .arrow {
      font-size: 1.2rem;
    }

    .slides-container {
      gap: 8px;
    }

    .slide-wrapper {
      width: 100%;
      max-width: 140px;
    }
  }
  @media (max-width: 400px) {
    .arrow {
      font-size: 0.6rem;
    }

    .slides-container {
      gap: 8px;
    }

    .slide-wrapper {
      max-width: 130px;
    }
  }
</style>
