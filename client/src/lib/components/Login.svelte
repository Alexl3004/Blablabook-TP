<script>
  import { api } from "$lib/service/api.service";

  export let isLogin = true;
  export let onSuccess;

  let email = "";
  let password = "";
  let name = "";
  let confirm = "";
  let loading = false;
  let showPassword = false;
  let showConfirm = false;
  let toast = null;
  let toastTimeout = null;

  $: hasMinLength = password.length >= 8;
  $: hasUppercase = /[A-Z]/.test(password);
  $: hasLowercase = /[a-z]/.test(password);
  $: hasDigit = /[0-9]/.test(password);

  function showToast(message, type) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toast = { message, type };
    toastTimeout = setTimeout(() => {
      toast = null;
    }, 3000);
  }

  const errorMessages = {
    Conflict: "Les informations saisies sont invalides.",
    Unauthorized: "Email ou mot de passe incorrect.",
    "Not Found": "Email ou mot de passe incorrect.",
    "Bad Request": "Les informations saisies sont invalides.",
    "Failed to fetch":
      "Impossible de contacter le serveur. Vérifiez votre connexion.",
  };

  function parseError(message) {
    for (const [key, value] of Object.entries(errorMessages)) {
      if (message.includes(key)) return value;
    }
    return "Une erreur est survenue, veuillez réessayer.";
  }

  function validatePassword(pwd) {
    if (pwd.length < 8)
      return "Le mot de passe doit contenir au moins 8 caractères.";
    if (!/[A-Z]/.test(pwd))
      return "Le mot de passe doit contenir au moins une majuscule.";
    if (!/[a-z]/.test(pwd))
      return "Le mot de passe doit contenir au moins une minuscule.";
    if (!/[0-9]/.test(pwd))
      return "Le mot de passe doit contenir au moins un chiffre.";
    return null;
  }

  async function handleSubmit() {
    loading = true;
    try {
      let response;
      if (isLogin) {
        response = await api.login({ email, password });
        if (response?.token) {
          localStorage.setItem("token", response.token);
          if (onSuccess) onSuccess(response.token);
          showToast("Connecté !", "success");
          window.location.href = "/";
        }
      } else {
        const pwdError = validatePassword(password);
        if (pwdError) throw new Error(pwdError);
        if (password !== confirm)
          throw new Error("Les mots de passe ne correspondent pas.");
        response = await api.register({ name, email, password, confirm });
        if (response?.id) {
          showToast("Compte créé ! Vous pouvez vous connecter.", "success");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      }
    } catch (err) {
      showToast(parseError(err.message), "error");
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-container">
  <h2>{isLogin ? "Se connecter" : "Créer un compte"}</h2>

  <form
    onsubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}
  >
    {#if !isLogin}
      <div class="field">
        <label for="name">Pseudo</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          placeholder="Votre pseudo"
          required
        />
      </div>
    {/if}

    <div class="field">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        placeholder="nom@exemple.com"
        required
      />
    </div>

    <div class="field">
      <label for="password">Mot de passe</label>
      <div class="input-wrapper">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          bind:value={password}
          required
        />
        <button
          type="button"
          class="toggle-eye"
          onclick={() => (showPassword = !showPassword)}
        >
          {#if showPassword}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
              />
              <path
                d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
              />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          {/if}
        </button>
      </div>

      {#if !isLogin}
        <div class="password-rules">
          <span class:valid={hasMinLength}
            >{hasMinLength ? "✓" : "✗"} 8 caractères minimum</span
          >
          <span class:valid={hasUppercase}
            >{hasUppercase ? "✓" : "✗"} Une majuscule</span
          >
          <span class:valid={hasLowercase}
            >{hasLowercase ? "✓" : "✗"} Une minuscule</span
          >
          <span class:valid={hasDigit}>{hasDigit ? "✓" : "✗"} Un chiffre</span>
        </div>
      {/if}
    </div>

    {#if !isLogin}
      <div class="field">
        <label for="confirm">Confirmer le mot de passe</label>
        <div class="input-wrapper">
          <input
            id="confirm"
            type={showConfirm ? "text" : "password"}
            bind:value={confirm}
            required
          />
          <button
            type="button"
            class="toggle-eye"
            onclick={() => (showConfirm = !showConfirm)}
          >
            {#if showConfirm}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
                />
                <path
                  d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            {/if}
          </button>
        </div>
      </div>
    {/if}

    <button type="submit" disabled={loading}>
      {loading ? "Chargement..." : isLogin ? "Connexion" : "S'inscrire"}
    </button>
  </form>

  {#if toast}
    <div
      class="toast"
      class:success={toast.type === "success"}
      class:error={toast.type === "error"}
      role="alert"
      aria-live="polite"
    >
      {toast.message}
    </div>
  {/if}
</div>

<style>
  .auth-container h2 {
    margin-top: 0;
    text-align: center;
    font-size: var(--font-size-lg);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-size: var(--font-size-sm);
    font-weight: 600;
  }

  input {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    font-size: var(--font-size-base);
    background: var(--color-white);
    color: var(--color-text);
    width: 100%;
    box-sizing: border-box;
    transition:
      border-color var(--transition-base),
      box-shadow var(--transition-base);
  }

  input::placeholder {
    opacity: 0.8;
  }

  input:focus {
    outline: none;
    border-color: var(--color-secondary);
    box-shadow: var(--focus-ring);
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-wrapper input {
    padding-right: 2.5rem;
  }

  .toggle-eye {
    position: absolute;
    right: 0.6rem;
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
    cursor: pointer;
    color: var(--color-text);
    opacity: 0.45;
    display: flex;
    align-items: center;
    transition: opacity var(--transition-base);
  }

  .toggle-eye:hover {
    opacity: 1;
    transform: scale(1.1);
    background: none;
    box-shadow: none;
  }

  /* ── Règles mot de passe ── */
  .password-rules {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: var(--font-size-sm);
    margin-top: 0.25rem;
    padding: 0.5rem 0.75rem;
    background: var(--color-surface);
    border-radius: var(--radius);
  }

  .password-rules span {
    color: var(--color-error-text);
    transition: color var(--transition-base);
  }

  .password-rules span.valid {
    color: var(--color-success-text);
  }

  /* ── Bouton submit ── */
  button[type="submit"] {
    border: none;
    padding: 0.8rem;
    border-radius: var(--radius);
    font-weight: bold;
    font-size: var(--font-size-base);
    cursor: pointer;
    background: var(--color-secondary);
    color: var(--color-text);
    box-shadow: var(--shadow-btn);
    transition:
      box-shadow var(--transition-base),
      transform var(--transition-base);
  }

  button[type="submit"]:hover:not(:disabled) {
    box-shadow: var(--shadow-btn-hover);
    transform: translateY(-1px);
  }

  button[type="submit"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ── Toast ── */
  .toast {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius);
    font-size: var(--font-size-sm);
    text-align: center;
  }

  .toast.success {
    background: var(--color-success-bg);
    color: var(--color-success-text);
    border: 1px solid var(--color-success-border);
  }

  .toast.error {
    background: var(--color-error-bg);
    color: var(--color-error-text);
    border: 1px solid var(--color-error-border);
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .auth-container h2 {
      font-size: var(--font-size-base);
    }
    label {
      font-size: 0.8rem;
    }
    input {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
    button[type="submit"] {
      padding: 0.8rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 700px) {
    .auth-container h2 {
      font-size: var(--font-size-sm);
    }
    input {
      font-size: 0.8rem;
    }
    button[type="submit"] {
      padding: 0.7rem;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    input {
      padding: 0.5rem;
      font-size: 0.8rem;
    }
  }
</style>
