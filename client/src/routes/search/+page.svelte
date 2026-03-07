<script>
  import { api } from "$lib/service/api.service";
  import CardBook from "$lib/components/CardBook.svelte";
  import { page } from "$app/stores"; 

  let books = $state([]);
  let loading = $state(false);
  let query = $state("");

  const currentQuery = $derived($page.url.searchParams.get("q") || "");

  $effect(() => {
    query = currentQuery;
    if (query) {
      fetchBooks();
    } else {
      books = [];
    }
  });

  async function fetchBooks() {
    loading = true;
    try {
      const data = await api.search(query);
      books = data || [];
    } catch (err) {
      console.error("Erreur recherche:", err);
      books = [];
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>{query} Blablabook</title>
</svelte:head>
<section aria-labelledby="search-title">
  <div class="title-container">
    {#if !query}
      <h2 id="search-title">Recherche vide</h2>
    {:else}
      <h2 id="search-title">Résultats pour "{query}"</h2>
    {/if}
  </div>

  {#if loading}
    <div class="status-message">Recherche en cours...</div>
  {:else if !query}
    <div class="empty-state">
      <p>
        Entrez un mot-clé dans la barre de recherche pour trouver des livres.
      </p>
    </div>
  {:else if books.length === 0}
    <div class="empty-state">
      <p>Aucun résultat trouvé pour votre recherche.</p>
      <a href="/livres" class="browse-link">Explorer le catalogue</a>
    </div>
  {:else}
    <div class="grid">
      {#each books as book (book.id)}
        <article class="card-wrapper">
          <CardBook {book} />
        </article>
      {/each}
    </div>
  {/if}
</section>

<style>
  section {
    min-height: 80vh;
    padding-bottom: 4rem;
  }

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
    border: 1px solid rgba(233, 228, 219, 0.05);
    text-align: center;
  }

  /* --- Grille Harmonisante (Copie conforme de Collection) --- */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    max-width: 1200px;
    margin: 0 auto;
    gap: 2.5rem 1.2rem;
    padding: 0 20px;
    justify-items: center;
  }

  .card-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  /* --- États --- */
  .status-message,
  .empty-state {
    text-align: center;
    padding: 4rem 1rem;
    opacity: 0.8;
  }

  .browse-link {
    display: inline-block;
    margin-top: 1rem;
    color: var(--color-secondary);
    font-weight: 700;
    text-decoration: none;
    background-color: var(--color-white);
    padding: 1rem 2rem;
    border-radius: 50px;
    box-shadow: var(--shadow);
    transition: 0.3s;
    border: 2px solid transparent;
  }

  .browse-link:hover {
    border-color: var(--color-secondary);
  }

  /* --- Responsive (Copie conforme de Collection) --- */
  @media (max-width: 1500px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      max-width: 1100px;
    }
  }

  @media (max-width: 1000px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      max-width: 700px;
    }
    h2 {
      font-size: 1.8rem;
      padding: 0.8rem 2.5rem;
    }
  }

  @media (max-width: 700px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      max-width: 500px;
      gap: 1.5rem 1rem;
    }
    h2 {
      font-size: 1.6rem;
      padding: 0.6rem 2rem;
    }
  }

  @media (max-width: 480px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      max-width: 320px;
      gap: 1rem 0.8rem;
    }
    h2 {
      font-size: 1.4rem;
      padding: 0.5rem 1.5rem;
    }
  }
</style>
