<script>
  import { onMount } from "svelte";
  import Header from "./Header.svelte";

  let error = null;

  const handleError = (event) => {
    error = event.error;
  };

  onMount(() => {
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  });
</script>

{#if error}
  <Header />

  <main>
    <div class="error-container">
      <div class="error-code">500</div>
      <h1>Erreur interne du serveur</h1>
      <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>
      <button onclick={() => window.location.reload()}>Réessayer</button>
    </div>
  </main>
{:else}
  <slot />
{/if}

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

  button {
    margin-top: 0.5rem;
  }
</style>
