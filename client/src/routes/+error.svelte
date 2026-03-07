<script>
</script>

<main>
  <div class="error-container">
    <div class="error-code">404</div>
    <h1>Page non trouvée</h1>
    <p>La page que vous recherchez n'existe pas.</p>
    <a href="/" class="home-link">Retour à l'accueil</a>
  </div>
</main>

<style>
  main {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .error-container {
    text-align: center;
    max-width: 500px;
    background: var(--color-white);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .error-code {
    font-size: 5rem;
    font-family: var(--font-primary);
    color: var(--color-secondary);
    line-height: 1;
    opacity: 0.8;
  }

  h1 {
    font-size: var(--font-size-lg);
    margin: 0;
  }

  p {
    font-size: var(--font-size-base);
    margin: 0;
    opacity: 0.75;
  }

  .home-link {
    display: inline-block;
    background: var(--color-secondary);
    color: var(--color-text);
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius);
    text-decoration: none;
    box-shadow: var(--shadow-btn);
    font-weight: 600;
    margin-top: 0.5rem;
    transition:
      box-shadow 0.15s ease,
      transform 0.15s ease;
  }

  .home-link:hover {
    box-shadow: var(--shadow-btn-hover);
    transform: translateY(-1px);
  }
</style>
