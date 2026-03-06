<script>
  let { book } = $props();
  let isLoaded = $state(false);
</script>

<article class="book-card">
  <a href="/livre/{book.id}" class="card-link">
    <div class="image-wrapper">
      {#if !isLoaded}
        <div class="skeleton"></div>
      {/if}

      <img
        src={book.cover}
        alt={book.title}
        loading="lazy"
        decoding="async"
        class:loaded={isLoaded}
        onload={() => (isLoaded = true)}
        onerror={() => {
          isLoaded = false;
        }}
      />

      {#if book.publish_year}
        <span class="year-badge">{book.publish_year}</span>
      {/if}
    </div>

    <div class="card-content">
      <h3 title={book.title}>{book.title}</h3>
      <p class="author"><span>par</span> {book.author}</p>
    </div>
  </a>
</article>

<style>
  .book-card {
    background: var(--color-white);
    border-radius: 16px;
    border: 1px solid rgba(233, 228, 219, 0.08);
    overflow: hidden;
    height: 100%;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .book-card:hover {
    transform: translateY(-6px);
    border-color: var(--color-secondary);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }

  .card-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    background: var(--color-bg);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition:
      opacity 0.4s ease,
      transform 0.6s ease;
  }

  img.loaded {
    opacity: 1;
  }

  .book-card:hover img {
    transform: scale(1.05);
  }

  .year-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-text);
    z-index: 2;
  }

  /* --- CONTENU COMPACT --- */
  .card-content {
    padding: 0.8rem 0.75rem 0.6rem; /* Padding réduit en bas (0.6rem) */
    display: flex;
    flex-direction: column;
    gap: 2px; /* Espace minimal entre titre et auteur */
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text);
    /* Forcer une seule ligne avec points de suspension */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .author {
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-text);
    opacity: 0.7;
    /* Forcer une seule ligne */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .author span {
    font-size: 0.75rem;
    font-style: italic;
    opacity: 0.5;
  }

  .skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    100% {
      background-position: -200% 0;
    }
  }

  @media (max-width: 480px) {
    .card-content {
      padding: 0.5rem;
    }
    h3 {
      font-size: 0.9rem;
    }
    .author {
      font-size: 0.75rem;
    }
  }
</style>
