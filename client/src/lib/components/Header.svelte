<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Login from "./Login.svelte";
  import Logo from "$lib/assets/Blablabook.svg?raw";

  let currentPath = $derived($page.url.pathname);
  let showLogoutConfirm = $state(false);
  let showAuth = $state(false);
  let authMode = $state("login");
  let token = $state(browser ? localStorage.getItem("token") : null);
  let isMenuOpen = $state(false);
  let searchQuery = $state("");

  function handleLoginSuccess(newToken) {
    token = newToken;
    showAuth = false;
    isMenuOpen = false;
  }

  function logout() {
    localStorage.removeItem("token");
    token = null;
    isMenuOpen = false;
    showLogoutConfirm = false;
    window.location.href = "/";
  }

  function search() {
    const q = searchQuery.trim();
    if (!q) return;
    isMenuOpen = false;
    const targetUrl = `/search?q=${encodeURIComponent(q)}`;
    searchQuery = "";
    goto(targetUrl, { invalidateAll: true });
  }

  function handleEnter(e) {
    if (e.key === "Enter") search();
  }
</script>

<header>
  <nav class="nav-container">
    <div class="nav-top">
      <a class="logo" href="/">
        {@html Logo}
      </a>

      <div class="desktop-nav">
        <div class="search">
          <input
            type="text"
            class="search-input"
            placeholder="Rechercher un livre..."
            bind:value={searchQuery}
            onkeydown={handleEnter}
          />
          <button class="search-btn" onclick={search} aria-label="Rechercher">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
              />
            </svg>
          </button>
        </div>

        {#if !token}
          <a href="/livres" class="link">Catalogue</a>
          <button
            class="auth-button"
            onclick={() => {
              authMode = "login";
              showAuth = true;
            }}>Connexion</button
          >
          <button
            class="auth-button"
            onclick={() => {
              authMode = "register";
              showAuth = true;
            }}>Inscription</button
          >
        {:else}
          <a
            href="/livres"
            class="link"
            class:active={currentPath === "/livres"}>Catalogue</a
          >
          <a
            href="/collection"
            class="link"
            class:active={currentPath === "/collection"}>Ma collection</a
          >
          <a
            href="/profil"
            class="link"
            class:active={currentPath === "/profil"}>Mon profil</a
          >
          <button class="auth-button" onclick={() => (showLogoutConfirm = true)}
            >Déconnexion</button
          >
        {/if}
      </div>

      <button
        class="burger-menu"
        class:is-open={isMenuOpen}
        onclick={() => (isMenuOpen = !isMenuOpen)}
        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <div
      id="mobile-menu"
      class="mobile-drawer"
      class:is-open={isMenuOpen}
      aria-hidden={!isMenuOpen}
    >
      <div class="search mobile-search">
        <input
          type="text"
          class="search-input"
          placeholder="Rechercher un livre..."
          bind:value={searchQuery}
          onkeydown={handleEnter}
          tabindex={isMenuOpen ? 0 : -1}
        />
        <button class="search-btn" onclick={search} aria-label="Rechercher">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {#if !token}
        <a
          href="/livres"
          class="mobile-link"
          onclick={() => (isMenuOpen = false)}>Catalogue</a
        >
        <button
          class="mobile-btn"
          onclick={() => {
            authMode = "login";
            showAuth = true;
            isMenuOpen = false;
          }}>Connexion</button
        >
        <button
          class="mobile-btn"
          onclick={() => {
            authMode = "register";
            showAuth = true;
            isMenuOpen = false;
          }}>Inscription</button
        >
      {:else}
        <a
          href="/livres"
          class="mobile-link"
          onclick={() => (isMenuOpen = false)}>Catalogue</a
        >
        <a
          href="/collection"
          class="mobile-link"
          onclick={() => (isMenuOpen = false)}>Ma collection</a
        >
        <a
          href="/profil"
          class="mobile-link"
          onclick={() => (isMenuOpen = false)}>Mon profil</a
        >
        <button class="mobile-btn" onclick={() => (showLogoutConfirm = true)}
          >Déconnexion</button
        >
      {/if}
    </div>
  </nav>
</header>

{#if showAuth}
  <div class="overlay" onclick={() => (showAuth = false)} role="none"></div>
  <div class="auth-modal">
    <Login isLogin={authMode === "login"} onSuccess={handleLoginSuccess} />
  </div>
{/if}

{#if showLogoutConfirm}
  <div
    class="overlay"
    onclick={() => (showLogoutConfirm = false)}
    role="none"
  ></div>
  <div class="confirm-modal">
    <p>Voulez-vous vraiment vous déconnecter ?</p>
    <div class="confirm-actions">
      <button class="confirm-cancel" onclick={() => (showLogoutConfirm = false)}
        >Annuler</button
      >
      <button class="confirm-logout" onclick={logout}>Déconnexion</button>
    </div>
  </div>
{/if}

<style>
  header {
    width: 100%;
    background: var(--color-primary);
    box-shadow: var(--shadow);
    border-bottom: 1px solid var(--color-border);
    padding: 1rem 0;
  }

  .nav-container {
    width: 100%;
    margin: 0 auto;
  }

  .nav-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
  }

  .logo :global(svg) {
    height: 38px;
    width: auto;
  }

  .logo :global(svg path) {
    fill: var(--color-secondary);
    transition: fill var(--transition-base);
  }

  .logo:hover :global(svg path) {
    fill: var(--color-danger);
  }
  /* ── Desktop nav ── */
  .desktop-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* ── Recherche ── */
  .search {
    display: flex;
    align-items: center;
    background: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: 50px;
    padding: 2px 6px 2px 18px;
    max-width: 350px;
    box-shadow: 0 0 0 2px var(--color-border);
    transition:
      box-shadow var(--transition-base),
      border-color var(--transition-base);
  }

  .search:hover {
    box-shadow: var(--shadow);
  }

  .search:focus-within {
    border-color: var(--color-secondary);
    box-shadow: var(--focus-ring);
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 10px 0;
    font-size: 0.95rem;
    background: transparent;
    color: var(--color-text);
  }

  .search-input::placeholder {
    color: var(--color-text);
    opacity: 0.4;
    transition: opacity var(--transition-base);
  }

  .search-input:focus::placeholder {
    opacity: 0.2;
  }

  .search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    box-shadow: none;
    margin-left: 8px;
  }

  .search-btn:hover {
    transform: scale(1.05);
    background: var(--color-secondary);
    box-shadow: none;
  }

  .search-btn:active {
    transform: scale(0.95);
  }

  .mobile-search {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  /* ── Liens desktop ── */
  .link {
    position: relative;
    font-family: var(--font-primary);
    color: var(--color-text);
    text-decoration: none;
    padding: 0.2rem 0.1rem;
    opacity: 0.75;
    transition: opacity var(--transition-base);
  }

  .link::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 1.5px;
    background: var(--color-secondary);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }

  .link:hover {
    opacity: 1;
  }
  .link:hover::after {
    transform: scaleX(1);
  }
  .link.active {
    opacity: 1;
  }
  .link.active::after {
    transform: scaleX(1);
  }
  .auth-button {
    background-color: var(--color-white);
    border: 2px solid transparent;
  }
  .auth-button:hover {
    border-color: var(--color-secondary);
  }

  /* ── Burger ── */
  .burger-menu {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 36px;
    height: 36px;
    padding: 6px;
    background: transparent;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    box-shadow: none;
    transition: background var(--transition-base);
  }

  .burger-menu:hover {
    background: var(--color-surface);
    transform: none;
    box-shadow: none;
  }

  .burger-menu span {
    display: block;
    width: 100%;
    height: 2.5px;
    background: var(--color-text);
    border-radius: 999px;
    transform-origin: center;
    transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.25s ease;
  }

  .burger-menu.is-open span:nth-child(1) {
    transform: translateY(7.5px) rotate(45deg);
  }
  .burger-menu.is-open span:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  .burger-menu.is-open span:nth-child(3) {
    transform: translateY(-7.5px) rotate(-45deg);
  }

  /* ── Tiroir mobile ── */
  .mobile-drawer {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    padding: 0 1rem;
    transition:
      max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.25s ease,
      padding 0.3s ease;
  }

  .mobile-drawer.is-open {
    max-height: 480px;
    opacity: 1;
    padding: 0.75rem 1rem 1.25rem;
    border-top: 1px solid var(--color-border);
  }

  .mobile-drawer .search-input {
    width: 100%;
    box-sizing: border-box;
  }

  .mobile-link {
    display: block;
    font-family: var(--font-primary);
    font-size: var(--font-size-base);
    color: var(--color-text);
    text-decoration: none;
    padding: 0.6rem 0.5rem;
    border-radius: var(--radius);
    opacity: 0.8;
    transition:
      opacity var(--transition-base),
      background var(--transition-base);
  }

  .mobile-link:hover {
    opacity: 1;
    background: var(--color-surface);
  }

  .mobile-btn {
    background: none;
    box-shadow: none;
    text-align: left;
    padding: 0.6rem 0.75rem;
    border-radius: var(--radius);
  }

  /* ── Overlay ── */
  .overlay {
    position: fixed;
    inset: 0;
    background: var(--color-overlay);
    backdrop-filter: blur(4px);
    z-index: 998;
  }

  /* ── Modales ── */
  .auth-modal,
  .confirm-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--color-primary);
    border-radius: var(--radius-lg);
    z-index: 999;
    box-shadow: var(--shadow-modal);
  }

  .auth-modal {
    padding: 2.5rem;
    width: 90%;
    max-width: 400px;
    border-radius: var(--radius-lg);
  }

  .confirm-modal {
    padding: 2rem;
    width: 90%;
    max-width: 340px;
    text-align: center;
  }

  .confirm-modal p {
    margin: 0 0 1.5rem;
  }

  .confirm-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .confirm-cancel {
    background: transparent;
    border: 1px solid var(--color-border);
  }

  .confirm-cancel:hover {
    background: var(--color-surface);
    transform: translateY(-1px);
  }

  .confirm-logout {
    background: var(--color-danger-hover-bg);
    border: 1px solid var(--color-danger);
  }

  .confirm-logout:hover {
    background: var(--color-danger);
    transform: translateY(-1px);
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .desktop-nav {
      display: none;
    }
    .burger-menu {
      display: flex;
    }
    .auth-modal {
      padding: 1.5rem;
      width: 95%;
    }
    .confirm-modal {
      padding: 1.5rem;
    }
    .confirm-modal p {
      font-size: var(--font-size-base);
    }
    .confirm-cancel,
    .confirm-logout {
      font-size: var(--font-size-sm);
      padding: 0.5rem;
    }
  }

  @media (max-width: 700px) {
    .auth-modal {
      padding: 1.2rem;
      width: 60%;
    }
    .confirm-modal {
      padding: 1rem;
    }
    .confirm-modal p {
      font-size: var(--font-size-sm);
    }
    .confirm-cancel,
    .confirm-logout {
      font-size: var(--font-size-sm);
      padding: 0.5rem;
    }
  }
</style>
