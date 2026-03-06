<script>
  import { Router, Route } from "svelte-routing";
  import Header from "./components/Header.svelte";
  import ErrorBoundary from "./components/ErrorBoundary.svelte";
  import NotFound from "./components/views/NotFound.svelte";
  import Collection from "./components/views/Collection.svelte";
  import Profil from "./components/views/Profil.svelte";
  import BookList from "./components/views/BookList.svelte";
  import Carousel from "./components/Carousel.svelte";
  import BookDetail from "./components/views/BookDetail.svelte";
  import SearchResult from "./components/views/SearchResult.svelte";
  import Footer from "./components/Footer.svelte";

  export let url = "";

  // Svelte 5 : On peut transformer cela en $derived si nécessaire,
  // mais le réactif standard $: fonctionne très bien ici.
  $: isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("token") !== null;
</script>

<ErrorBoundary>
  <Router {url}>
    <Header />

    <main>
      <Route path="/">
        <div class="home-wrapper" class:is-connected={isLoggedIn}>
          {#if !isLoggedIn}
            <section class="welcome">
              <h1>Bienvenue sur <span>BlaBlaBook</span></h1>
              <div class="welcome-text">
                <p>
                  Découvrez de nouveaux livres, explorez des univers variés et
                  trouvez votre prochaine lecture en un instant.
                </p>
                <p>
                  Créez un compte ou connectez‑vous pour accéder à votre espace
                  personnel.
                </p>
              </div>
            </section>
          {/if}

          <section class="suggestions">
            <div class="section-title">
              <h2>Suggestions de livres</h2>
            </div>
            <Carousel />
          </section>
        </div>
      </Route>

      <Route path="/search"><SearchResult /></Route>
      <Route path="/profil"><Profil /></Route>
      <Route path="/collection"><Collection /></Route>
      <Route path="/livres"><BookList /></Route>
      <Route path="/livre/:id" let:params>
        <BookDetail {params} />
      </Route>

      <Route path="*"><NotFound /></Route>
    </main>

    <Footer />
  </Router>
</ErrorBoundary>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 80vh;
  }

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
    align-items: center;
  }

  .section-title {
    display: flex;
    justify-content: center;
  }

  h2 {
    font-size: 1.8rem;
    background: var(--color-white);
    padding: 0.8rem 2rem;
    border-radius: 50px;
    box-shadow: var(--shadow);
    border: 1px solid rgba(233, 228, 219, 0.1);
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
  }

  .is-connected {
    margin-top: 1.5rem;
  }
</style>
