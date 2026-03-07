<script>
  import { browser } from "$app/environment";
  import Carousel from "$lib/components/Carousel.svelte";

  $: isLoggedIn = browser && localStorage.getItem("token") !== null;
</script>

<svelte:head>
  <title>Accueil / Blablabook</title>
</svelte:head>
<div class="home-wrapper" class:is-connected={isLoggedIn}>
  {#if !isLoggedIn}
    <section class="welcome">
      <h1>Bienvenue sur <span>BlaBlaBook</span></h1>
      <div class="welcome-text">
        <p>Découvrez de nouveaux livres...</p>
        <p>Créez un compte ou connectez‑vous...</p>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <h3>Catalogue Immense</h3>
        <p>Accédez à des milliers de références pour tous les goûts.</p>
      </div>
      <div class="feature-card">
        <h3>Ma Collection</h3>
        <p>
          Suivez vos livres en cours, gérez vos piles à lire, et classez vos
          lectures en pause, lues ou abandonnées.
        </p>
      </div>
      <div class="feature-card">
        <h3>Suggestions</h3>
        <p>
          Laissez-vous surprendre par une sélection renouvelée à chaque visite.
        </p>
      </div>
    </section>
  {/if}

  <section class="suggestions">
    <div class="section-title"><h2>Suggestions de livres</h2></div>
    <Carousel />
  </section>
</div>

<style>
  .home-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .welcome {
    max-width: 800px;
    margin: 1rem;
    background-color: var(--color-white);
    border-radius: 24px;
    box-shadow: var(--shadow);
    border: 1px solid rgba(233, 228, 219, 0.1);
    padding: 2rem;
    text-align: center;
  }

  .welcome h1 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    color: var(--color-text);
  }

  .welcome h1 span {
    color: var(--color-secondary);
    font-weight: 800;
  }

  .welcome-text p {
    font-size: 1.1rem;
    line-height: 1.6;
    opacity: 0.9;
    margin: 0.5rem 0;
  }

  .suggestions {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .section-title {
    display: flex;
    justify-content: start;
    margin-left: 1rem;
  }
  .suggestions :global(.carousel-container) {
    margin-top: 0;
  }

  h2 {
    font-size: 1.8rem;
    background: var(--color-white);
    padding: 0.8rem 2rem;
    border-radius: 50px;
    box-shadow: var(--shadow);
    border: 1px solid rgba(233, 228, 219, 0.1);
  }
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    max-width: 1000px;
    margin: 1rem;
  }

  .feature-card {
    background: var(--color-white);
    padding: 1.5rem;
    border-radius: 20px;
    box-shadow: var(--shadow);
    text-align: center;
    border: 1px solid var(--color-border);
    transition: transform 0.3s ease;
  }

  .feature-card h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: var(--color-secondary);
  }

  .feature-card p {
    font-size: 0.9rem;
    opacity: 0.8;
    line-height: 1.4;
  }
  .is-connected {
    margin-top: 1.5rem;
  }
  @media (max-width: 900px) {
    .welcome {
      padding: 2rem 1.5rem;
    }
    h1 {
      font-size: 1.8rem !important;
    }
    h2 {
      font-size: 1.5rem !important;
    }
    .feature-card h3 {
      font-size: 1rem;
    }
    .feature-card p {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 600px) {
    .welcome {
      margin: 1rem;
      border-radius: 16px;
    }
    .welcome h1 {
      font-size: 1.5rem !important;
    }
    .welcome-text p {
      font-size: 1rem;
    }

    h2 {
      font-size: 1.3rem !important;
      padding: 0.6rem 1.5rem;
    }

    .features {
      grid-template-columns: repeat(2, 1fr);
      max-width: 600px;
      margin: 1rem;
    }
    .feature-card {
      padding: 0.5rem;
    }
    .feature-card h3 {
      font-size: 1rem;
    }
    .feature-card p {
      font-size: 0.8rem;
    }
  }
</style>
