<script>
  import { api } from "../../service/api.service.js";
  import CardBook from "../CardBook.svelte";

  let books = $state([]);
  let currentPage = $state(1);
  let totalPages = $state(0);
  let limit = $state(30);
  let order = $state("A-Z");
  let loading = $state(true);

  // Re-fetch automatique
  $effect(() => {
    fetchBooks();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function fetchBooks() {
    loading = true;
    try {
      const data = await api.allBook({ page: currentPage, limit, order });
      books = data.books || [];
      totalPages = data.totalPages || 0;
    } catch (err) {
      console.error("Erreur Catalogue:", err);
    } finally {
      loading = false;
    }
  }

  function handleFilterChange() {
    currentPage = 1;
  }
</script>

<section aria-labelledby="catalogue-title">
  <div class="title-container">
    <h2 id="catalogue-title">Catalogue</h2>
  </div>

  <div class="controls-top">
    <div class="group">
      <label for="order">Trier :</label>
      <select id="order" bind:value={order} onchange={handleFilterChange}>
        <option value="A-Z">Titre (A-Z)</option>
        <option value="Z-A">Titre (Z-A)</option>
      </select>
    </div>

    <div class="group">
      <label for="pagination">Afficher :</label>
      <select id="pagination" bind:value={limit} onchange={handleFilterChange}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
        <option value={50}>50</option>
      </select>
    </div>
  </div>

  {#if loading}
    <p class="loading">Chargement du catalogue...</p>
  {:else if books.length === 0}
    <div class="empty">
      <p>Aucun livre trouvé dans le catalogue.</p>
    </div>
  {:else}
    <div class="grid">
      {#each books as book (book.id)}
        <div class="card-wrapper">
          <CardBook {book} />
        </div>
      {/each}
    </div>

    <div class="controls-bottom">
      <button
        class="pagination-btn"
        onclick={() => currentPage--}
        disabled={currentPage <= 1}
      >
        Précédent
      </button>

      <span class="page-indicator">
        Page <strong>{currentPage}</strong> sur {totalPages}
      </span>

      <button
        class="pagination-btn"
        onclick={() => currentPage++}
        disabled={currentPage >= totalPages}
      >
        Suivant
      </button>
    </div>
  {/if}
</section>

<style>
  section {
    min-height: 80vh;
    padding-bottom: 3rem;
  }

  /* --- TITRE --- */
  .title-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }

  h2 {
    font-size: 2rem;
    background: var(--color-white);
    padding: 0.8rem 2.5rem;
    border-radius: 20px;
    box-shadow: var(--shadow);
    width: fit-content;
    border: 1px solid rgba(233, 228, 219, 0.05);
  }

  /* --- FILTRES / SELECTS --- */
  .controls-top {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
  }

  .group {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .group label {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  select {
    color: var(--color-text);
    background: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 0.5rem 2rem 0.5rem 1rem;
    font-family: var(--font-primary);
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23e9e4db'%3E%3Cpath d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.8rem center;
    transition: border-color 0.2s;
  }

  select:focus {
    outline: none;
    border-color: var(--color-secondary);
  }

  /* --- LA GRILLE (Style Collection) --- */
  .grid {
    display: grid;
    /* Utilisation de la logique Collection */
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    max-width: 1200px; /* Largeur définie pour centrer le contenu */
    margin: 0 auto;
    gap: 1.5rem 1rem;
    padding: 0 20px;
  }

  .card-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  /* On force CardBook à remplir toute la hauteur de sa cellule */
  .card-wrapper :global(.book-card) {
    height: 100%;
  }

  /* --- PAGINATION --- */
  .controls-bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin-top: 4rem;
  }

  .pagination-btn {
    background: var(--color-secondary);
    color: var(--color-text);
    padding: 0.7rem 1.8rem;
    border-radius: 50px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition:
      transform 0.2s,
      opacity 0.2s;
  }

  .pagination-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  .pagination-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .page-indicator {
    background: var(--color-white);
    padding: 0.5rem 1.5rem;
    border-radius: 30px;
    border: 1px solid var(--color-border);
    font-size: 0.95rem;
  }

  .loading,
  .empty {
    text-align: center;
    padding: 4rem;
    font-size: 1.2rem;
    opacity: 0.7;
  }

  /* --- RESPONSIVE --- */
  @media (max-width: 1200px) {
    .grid {
      max-width: 900px;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .grid {
      max-width: 600px;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }
    .controls-top {
      gap: 1rem;
    }
    h2 {
      font-size: 1.6rem;
    }
  }

  @media (max-width: 480px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      max-width: 100%;
      padding: 0 10px;
    }
    .pagination-btn {
      padding: 0.6rem 1rem;
      font-size: 0.8rem;
    }
  }
</style>
