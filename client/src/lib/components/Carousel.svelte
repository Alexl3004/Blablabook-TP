<script>
  import { onMount, onDestroy } from "svelte";
  import CardBook from "./CardBook.svelte";
  import { api } from "$lib/service/api.service.js";
  import { fly } from "svelte/transition";
  import { flip } from "svelte/animate";

  let books = $state([]);
  let index = $state(0);
  let visibleCount = $state(5);

  function getVisibleCount() {
    if (typeof window === "undefined") return 5;
    const w = window.innerWidth;
    if (w <= 400) return 2;
    if (w <= 540) return 3;
    if (w <= 650) return 4;
    if (w <= 1300) return 5;
    if (w <= 1550) return 6;
    if (w <= 1920) return 7;
    return 8;
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
  <section class="carousel-container">
    <div class="carousel-viewport">
      <button class="arrow prev" onclick={prev} aria-label="Précédent">
        <span>&#10094;</span>
      </button>
      <div class="slides-container">
        {#each visibleBooks as book, i (book.id || index + i)}
          <div
            class="slide-wrapper"
            animate:flip={{ duration: 800 }}
            in:fly={{ x: 30, duration: 800, delay: i * 30 }}
            out:fly={{ x: -30, duration: 800 }}
          >
            <CardBook {book} />
          </div>
        {/each}
      </div>
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
    padding: 10px 0;
  }

  .slide-wrapper {
    flex: 0 0 200px;
    width: 200px;
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

  /* ── Responsive ── */
  @media (max-width: 1650px) {
    .slide-wrapper {
      flex: 0 0 180px;
      width: 180px;
    }
  }
  @media (max-width: 1100px) {
    .slide-wrapper {
      flex: 0 0 160px;
      width: 160px;
    }
  }

  @media (max-width: 980px) {
    .arrow {
      font-size: 1.8rem;
      width: 35px;
    }

    .slides-container {
      gap: 10px;
    }

    .slide-wrapper {
      flex: 0 0 140px;
      width: 100%;
      max-width: 140px;
    }
  }
  @media (max-width: 820px) {
    .arrow {
      font-size: 1.4rem;
      width: 35px;
    }

    .slides-container {
      gap: 10px;
    }

    .slide-wrapper {
      flex: 0 0 120px;
      width: 100%;
      max-width: 120px;
    }
  }

  @media (max-width: 720px) {
    .arrow {
      font-size: 1.2rem;
    }

    .slides-container {
      gap: 8px;
    }

    .slide-wrapper {
      max-width: 100px;
    }
  }
  @media (max-width: 480px) {
    .arrow {
      font-size: 0.8rem;
    }
    .slide-wrapper {
      max-width: 100px;
    }
  }
  @media (max-width: 400px) {
    .arrow {
      font-size: 0.8rem;
    }
    .slide-wrapper {
      max-width: 120px;
    }
  }
</style>
