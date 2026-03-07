<script>
  /* On garde ton script tel quel, il fonctionne parfaitement avec Svelte 5 */
  import { api } from "../../service/api.service.js";
  import CardBook from "../CardBook.svelte";

  let books = $state([]);
  let loading = $state(true);
  let currentFilter = $state("tous");
  let toast = $state(null);
  let toastTimeout = $state(null);
  let requestVersion = $state(0);
  let notAuthenticated = $state(false);

  const filters = [
    { value: "tous", label: "Tous" },
    { value: "à lire", label: "À lire" },
    { value: "en cours", label: "En cours" },
    { value: "en pause", label: "En pause" },
    { value: "lu", label: "Lu" },
    { value: "abandonné", label: "Abandonné" },
  ];

  $effect(() => {
    loadCollection();
  });

  async function loadCollection() {
    const currentVersion = requestVersion;
    try {
      loading = true;
      const token = localStorage.getItem("token");
      if (!token) {
        notAuthenticated = true;
        return;
      }
      const statusParam = currentFilter === "tous" ? null : currentFilter;
      const data = await api.getCollection(statusParam);
      if (requestVersion !== currentVersion) return;
      books = data.books || [];
    } catch (error) {
      if (requestVersion !== currentVersion) return;
      if (error.status === 401) notAuthenticated = true;
      else showToast("Erreur de chargement", "error");
    } finally {
      if (requestVersion !== currentVersion) return;
      loading = false;
    }
  }

  function handleFilterChange(filterValue) {
    requestVersion++;
    currentFilter = filterValue;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleStatusChange(bookId, newStatus) {
    try {
      await api.updateCollectionStatus(bookId, newStatus);
      const bookIndex = books.findIndex((b) => b.id === bookId);
      if (bookIndex !== -1) {
        books[bookIndex].collectStatus = newStatus;
        books = [...books];
      }
      showToast("Statut mis à jour", "success");
    } catch (error) {
      showToast("Erreur de mise à jour", "error");
    }
  }

  async function handleRemove(bookId) {
    try {
      await api.removeFromCollection(bookId);
      books = books.filter((b) => b.id !== bookId);
      showToast("Livre retiré", "success");
    } catch (error) {
      showToast("Erreur de suppression", "error");
    }
  }

  function showToast(message, type) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toast = { message, type };
    toastTimeout = setTimeout(() => {
      toast = null;
    }, 3000);
  }
</script>

<section aria-labelledby="collection-title">
  <div class="title-container">
    <h2 id="collection-title">Ma collection</h2>
  </div>

  {#if notAuthenticated}
    <div class="not-authenticated" role="alert">
      <div class="auth-icon">👤</div>
      <h3>Accès restreint</h3>
      <p>Connectez-vous pour gérer votre bibliothèque.</p>
    </div>
  {:else}
    <div class="filters">
      {#each filters as filter}
        <button
          class="filter-btn"
          class:active={currentFilter === filter.value}
          onclick={() => handleFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      {/each}
    </div>

    {#if loading}
      <div class="status-message">Chargement de vos livres...</div>
    {:else if books.length === 0}
      <div class="empty-state">
        <p>Aucun livre dans cette catégorie.</p>
        <a href="/livres" class="browse-link">Explorer le catalogue</a>
      </div>
    {:else}
      <div class="grid">
        {#each books as book (book.id)}
          <article class="card-wrapper">
            <CardBook {book} />
            <div class="card-actions">
              <select
                class="status-select"
                value={book.collectStatus}
                onchange={(e) =>
                  handleStatusChange(book.id, e.currentTarget.value)}
              >
                <option value="à lire">À lire</option>
                <option value="en cours">En cours</option>
                <option value="lu">Lu</option>
                <option value="en pause">En pause</option>
                <option value="abandonné">Abandonné</option>
              </select>
              <button class="remove-btn" onclick={() => handleRemove(book.id)}>
                Retirer
              </button>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  {/if}
</section>

{#if toast}
  <div class="toast {toast.type}" role="alert">
    {toast.message}
  </div>
{/if}

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
  }

  /* --- Filtres Style Glassmorphism --- */
  .filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 3rem;
    padding: 0 1rem;
  }

  .filter-btn {
    padding: 0.6rem 1.2rem;
    border-radius: 50px;
    border: 1px solid var(--color-border);
    background: var(--color-white);
    color: var(--color-text);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .filter-btn:hover {
    border-color: var(--color-secondary);
    transform: translateY(-2px);
  }

  .filter-btn.active {
    background: var(--color-secondary);
    border-color: var(--color-secondary);
    color: var(--color-text);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  /* --- Grille Harmonisante --- */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    max-width: 1200px;
    margin: 0 auto;
    gap: 2.5rem 1.2rem;
    padding: 0 20px;
  }

  .card-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.75rem;
  }

  /* Actions sous la carte */
  .card-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.8rem;
    background: var(--color-white);
    border-radius: 12px;
    border: 1px solid rgba(233, 228, 219, 0.1);
    box-shadow: var(--shadow);
  }

  .status-select {
    width: 100%;
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.85rem;
    cursor: pointer;
  }

  .remove-btn {
    width: 100%;
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid transparent;
    background: rgba(220, 53, 69, 0.1);
    color: #ff6b6b;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .remove-btn:hover {
    background: #dc3545;
    color: white;
  }

  /* --- États & Toasts --- */
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
    border: 2px solid transparent;
    transition: 0.3s;
    background-color: var(--color-white);
    padding: 1rem;
    border-radius: 50px;
    box-shadow: var(--shadow);
  }

  .browse-link:hover {
    border-color: var(--color-secondary);
  }

  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 2rem;
    border-radius: 50px;
    z-index: 1000;
    font-weight: 600;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .toast.success {
    background: #2ecc71;
    color: white;
  }
  .toast.error {
    background: #e74c3c;
    color: white;
  }

  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(40px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  /* --- Responsive --- */
  @media (max-width: 1500px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      max-width: 1100px;
    }
    .filter-btn {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
      min-height: 30px;
    }
  }

  @media (max-width: 1000px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      max-width: 700px;
    }
    .status-select {
      padding: 0.5rem;
      font-size: 0.8rem;
    }
    h2 {
      font-size: 1.8rem;
      padding: 0.8rem 2.5rem;
    }

    .browse-link {
      margin-top: 0.8rem;
      font-size: 1rem;
      padding: 0.8rem;
    }
  }

  @media (max-width: 700px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      max-width: 500px;
    }
    .filter-btn {
      padding: 0.5rem 1rem;
      font-size: 0.7rem;
      min-height: 30px;
    }
    .remove-btn {
      padding: 0.4rem 0.6rem;
      font-size: 0.75rem;
      min-height: 30px;
    }
    h2 {
      font-size: 1.6rem;
      padding: 0.6rem 2rem;
    }
    .browse-link {
      margin-top: 0.6rem;
      font-size: 0.9rem;
      font-weight: 700;
      padding: 0.6rem;
    }
  }
  @media (max-width: 480px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      max-width: 300px;
    }
    h2 {
      font-size: 1.6rem;
      padding: 0.5rem 1.8rem;
    }
  }
</style>
