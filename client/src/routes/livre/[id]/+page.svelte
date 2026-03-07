<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { api } from "$lib/service/api.service";

  let token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  let id = $derived($page.params.id);

  let book = $state(null);
  let loading = $state(true);
  let collectionStatus = $state(null);
  let checkingCollection = $state(true);
  let toast = $state(null);
  let toastTimeout = $state(null);
  let selectedStatus = $state("à lire");

  const statuses = [
    { value: "à lire", label: "À lire" },
    { value: "en cours", label: "En cours" },
    { value: "lu", label: "Lu" },
    { value: "en pause", label: "En pause" },
    { value: "abandonné", label: "Abandonné" },
  ];

  onMount(async () => {
    await loadBook();
    if (token) {
      await checkCollection();
    } else {
      checkingCollection = false;
    }
  });

  async function loadBook() {
    try {
      loading = true;
      book = await api.getBook(id);
    } catch (error) {
      showToast("Erreur de chargement", "error");
    } finally {
      loading = false;
    }
  }

  async function checkCollection() {
    try {
      checkingCollection = true;
      const data = await api.getCollection();
      const found = data.books?.find((b) => String(b.id) === String(id));
      if (found) {
        collectionStatus = found.collectStatus;
        selectedStatus = found.collectStatus;
      }
    } catch (error) {
      console.error("Vérification collection échouée");
    } finally {
      checkingCollection = false;
    }
  }

  async function handleAddToCollection() {
    try {
      await api.addToCollection(book.id, selectedStatus);
      collectionStatus = selectedStatus;
      showToast("Livre ajouté !", "success");
    } catch (error) {
      showToast("Erreur lors de l'ajout", "error");
    }
  }

  async function handleUpdateStatus() {
    try {
      await api.updateCollectionStatus(book.id, selectedStatus);
      collectionStatus = selectedStatus;
      showToast("Statut mis à jour", "success");
    } catch (error) {
      showToast("Erreur de mise à jour", "error");
    }
  }

  async function handleRemoveFromCollection() {
    try {
      await api.removeFromCollection(book.id);
      collectionStatus = null;
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

  let pageTitle = $derived(
    book ? `${book.title} | Blablabook` : "Chargement... | Blablabook",
  );
</script>

<svelte:head>
  <title>{book?.title} / Blablabook</title>
</svelte:head>

<main>
  <section aria-busy={loading}>
    {#if loading || checkingCollection}
      <div class="status-msg">Chargement des détails...</div>
    {:else if book}
      <div class="col-left">
        <div class="cover-wrapper">
          <img src={book.cover} alt={`Couverture de ${book.title}`} />
        </div>

        {#if token}
          <div class="collection-box">
            <label for="status-control"
              >{collectionStatus ? "Mon statut" : "Ajouter au statut"}</label
            >
            <div class="control-group">
              <select id="status-control" bind:value={selectedStatus}>
                {#each statuses as status}
                  <option value={status.value}>{status.label}</option>
                {/each}
              </select>

              {#if collectionStatus === null}
                <button class="btn-primary" onclick={handleAddToCollection}
                  >Ajouter</button
                >
              {:else}
                <button class="btn-secondary" onclick={handleUpdateStatus}
                  >Modifier</button
                >
              {/if}
            </div>

            {#if collectionStatus}
              <button class="remove-link" onclick={handleRemoveFromCollection}>
                Retirer de ma collection
              </button>
            {/if}
          </div>
        {/if}
      </div>

      <div class="col-right">
        <header class="book-header">
          <h1>{book.title}</h1>
          <div class="meta-pills">
            <span class="pill author"
              ><strong>Auteur :</strong> {book.author}</span
            >
            <span class="pill year"
              ><strong>Année :</strong> {book.publish_year}</span
            >
          </div>
        </header>

        <article class="description">
          <h2>Résumé</h2>
          <div class="text-content">
            <p>{book.description}</p>
          </div>
        </article>
      </div>
    {:else}
      <div class="status-msg error">Livre introuvable</div>
    {/if}
  </section>
</main>

{#if toast}
  <div class="toast {toast.type}" role="alert">
    {toast.message}
  </div>
{/if}

<style>
  main {
    padding: 2rem 1rem;
  }

  section {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 3rem;
    max-width: 1100px;
    margin: 0 auto;
    align-items: start;
  }

  /* ── Colonne gauche (Cover & Actions) ── */
  .col-left {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .cover-wrapper {
    background: var(--color-white);
    padding: 1rem;
    border-radius: 20px;
    box-shadow: var(--shadow);
    border: 1px solid rgba(233, 228, 219, 0.1);
  }

  .cover-wrapper img {
    width: 100%;
    border-radius: 12px;
    display: block;
    object-fit: contain;
  }

  .collection-box {
    background: var(--color-white);
    padding: 1.5rem;
    border-radius: 20px;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .collection-box label {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    opacity: 0.6;
  }

  .control-group {
    display: flex;
    gap: 0.5rem;
  }

  select {
    flex: 1;
    padding: 0.6rem;
    border-radius: 12px;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    font-family: var(--font-primary);
    cursor: pointer;
  }

  button {
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .btn-primary {
    background: var(--color-danger);
    color: var(--color-text);
  }
  .btn-secondary {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
  }

  .remove-link {
    color: var(--color-text);
    padding: 1.2rem;
    font-size: 1rem;
  }

  /* ── Colonne droite (Contenu) ── */
  .col-right {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .book-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .meta-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .pill {
    background: var(--color-white);
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.9rem;
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .description {
    background: var(--color-white);
    padding: 2rem;
    border-radius: 24px;
    box-shadow: var(--shadow);
  }

  .description h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    border-left: 4px solid var(--color-secondary);
    padding-left: 1rem;
  }

  .text-content {
    line-height: 1.8;
    font-size: 1.05rem;
    opacity: 0.9;
  }

  /* ── Toasts & Status ── */
  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 2rem;
    border-radius: 50px;
    z-index: 1000;
    font-weight: 600;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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

  .status-msg {
    text-align: center;
    padding: 5rem;
    grid-column: 1/-1;
    font-size: 1.2rem;
  }

  /* ── Responsive ── */
  @media (max-width: 850px) {
    section {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .col-left {
      max-width: 400px;
      margin: 0 auto;
      width: 100%;
    }
    .book-header h1 {
      font-size: 1.8rem;
      text-align: center;
    }
    .meta-pills {
      justify-content: center;
    }
    .text-content {
      line-height: 1.6;
      font-size: 1.1rem;
    }
    .description h2 {
      font-size: 1.1rem;
    }
    .pill {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
    .collection-box {
      padding: 1rem;
    }

    .collection-box label {
      font-size: 0.8rem;
    }
    .control-group {
      gap: 0.4rem;
    }
    button {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      height: 36px;
    }

    select {
      flex: 1;
      padding: 0.4rem;
      font-size: 0.85rem;
      height: 36px;
    }
    option {
      font-size: 0.8rem;
    }
    .remove-link {
      color: var(--color-text);
      padding: 0.5rem;
      font-size: 0.8rem;
      text-align: center;
    }
  }
</style>
