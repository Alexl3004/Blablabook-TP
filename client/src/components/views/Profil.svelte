<script>
  import { onMount } from "svelte";
  import { api } from "../../service/api.service.js";

  let user = null, loading = true, message = "", messageType = "";
  let editingName = false, editingEmail = false;
  let newName = "", newEmail = "", confirmEmail = "";
  let emailTouched = false, confirmEmailTouched = false;
  let currentPassword = "", newPassword = "", confirmPassword = "";
  let showCurrent = false, showNew = false, showConfirm = false;
  let newPasswordTouched = false, confirmPasswordTouched = false;
  let savingName = false, savingEmail = false, savingPassword = false;
  let showDeleteModal = false, deletePassword = "", deleteConfirmText = "";
  let showDeletePassword = false, deletingAccount = false;
  let showCurrentPasswordField = false;
  let notAuthenticated = false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  $: emailValid = emailRegex.test(newEmail);
  $: emailsMatch = newEmail === confirmEmail && confirmEmail.length > 0;

  $: passwordRules = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    digit: /[0-9]/.test(newPassword),
  };
  $: passwordScore = Object.values(passwordRules).filter(Boolean).length;
  $: strengthLabel = ["Tres faible","Faible","Moyen","Bien","Fort"][passwordScore];
  $: strengthClass = ["very-weak","weak","medium","good","strong"][passwordScore];
  $: passwordValid = Object.values(passwordRules).every(Boolean);
  $: passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  onMount(async () => {
    await loadUserInfo();
    setTimeout(() => { showCurrentPasswordField = true; }, 300);
  });

  async function loadUserInfo() {
    try {
      loading = true;
      const token = localStorage.getItem("token");
      if (!token) { notAuthenticated = true; return; }
      user = await api.getUserInfo();
    } catch (err) {
      if (err.status === 401) { notAuthenticated = true; }
      else { showMessage("Erreur lors du chargement du profil", "error"); }
    } finally { loading = false; }
  }

  function showMessage(text, type) {
    message = text; messageType = type;
    setTimeout(() => { message = ""; }, 4000);
  }

  function getErrorMsg(err, msg401 = "Verification echouee. Veuillez reessayer.") {
    return err.status === 401 ? msg401 : err.message || "Erreur lors de la mise a jour";
  }

  function formatDate(raw) {
    if (!raw) return "-";
    const d = new Date(raw);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  }

  function startEditName() { newName = user.name; editingName = true; }
  function cancelEditName() { editingName = false; newName = ""; }
  function startEditEmail() { newEmail = ""; confirmEmail = ""; emailTouched = false; confirmEmailTouched = false; editingEmail = true; }
  function cancelEditEmail() { editingEmail = false; newEmail = ""; confirmEmail = ""; }

  async function handleUpdateName() {
    if (!newName.trim()) return showMessage("Veuillez saisir un nom", "error");
    try {
      savingName = true;
      await api.updateProfile({ name: newName.trim() });
      user.name = newName.trim(); editingName = false; newName = "";
      showMessage("Nom mis a jour avec succes", "success");
    } catch (err) { showMessage(err.message || "Erreur lors de la mise a jour", "error"); }
    finally { savingName = false; }
  }

  async function handleUpdateEmail() {
    emailTouched = true; confirmEmailTouched = true;
    if (!newEmail || !confirmEmail) return showMessage("Veuillez remplir tous les champs", "error");
    if (!emailValid) return showMessage("Format d'email invalide", "error");
    if (!emailsMatch) return showMessage("Les emails ne correspondent pas", "error");
    if (newEmail === user.email) return showMessage("Ce nouvel email est identique a l'actuel", "error");
    if (!currentPassword) return showMessage("Mot de passe requis pour modifier l'email", "error");
    try {
      savingEmail = true;
      await api.updateProfile({ email: newEmail, currentPassword });
      user.email = newEmail; editingEmail = false; newEmail = ""; confirmEmail = "";
      showMessage("Email mis a jour avec succes", "success");
    } catch (err) { showMessage(err.message || "Erreur lors de la mise a jour", "error"); }
    finally { savingEmail = false; }
  }

  async function handleUpdatePassword() {
    newPasswordTouched = true; confirmPasswordTouched = true;
    if (!currentPassword || !newPassword || !confirmPassword) return showMessage("Veuillez remplir tous les champs", "error");
    if (!passwordValid) return showMessage("Le mot de passe ne respecte pas les regles requises", "error");
    if (!passwordsMatch) return showMessage("Les mots de passe ne correspondent pas", "error");
    try {
      savingPassword = true;
      await api.updateProfile({ password: newPassword, currentPassword });
      currentPassword = ""; newPassword = ""; confirmPassword = "";
      newPasswordTouched = false; confirmPasswordTouched = false;
      showMessage("Mot de passe mis a jour avec succes", "success");
    } catch (err) { showMessage(getErrorMsg(err), "error"); }
    finally { savingPassword = false; }
  }

  function openDeleteModal() {
    deletePassword = ""; deleteConfirmText = "";
    showDeleteModal = true; document.body.style.overflow = "hidden";
  }
  function closeDeleteModal() {
    showDeleteModal = false; deletePassword = ""; deleteConfirmText = "";
    document.body.style.overflow = "";
  }

  async function handleDeleteAccount() {
    if (!deletePassword) return showMessage("Veuillez saisir votre mot de passe", "error");
    if (deleteConfirmText !== "SUPPRIMER") return showMessage('Tapez exactement "SUPPRIMER" pour confirmer', "error");
    try {
      deletingAccount = true;
      await api.deleteAccount({ password: deletePassword });
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      closeDeleteModal();
      showMessage(getErrorMsg(err, "Mot de passe incorrect."), "error");
    } finally { deletingAccount = false; }
  }

  function handleOverlayClick(e) { if (e.target === e.currentTarget) closeDeleteModal(); }
  function handleKeydown(e) { if (e.key === "Escape" && showDeleteModal) closeDeleteModal(); }
</script>

<svelte:window on:keydown={handleKeydown} />

{#snippet eyeIcon(visible)}
  {#if visible}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  {:else}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  {/if}
{/snippet}

<section class="profil-container" aria-label="Page de profil">
  <h2>Mon profil</h2>

  {#if message}
    <div class="message" class:success={messageType === "success"} class:error={messageType === "error"} role="alert" aria-live="polite">
      {message}
    </div>
  {/if}

  {#if loading}
    <div class="loading" aria-busy="true">
      <span class="spinner" aria-hidden="true"></span>
      Chargement du profil...
    </div>
  {:else if notAuthenticated}
    <div class="not-authenticated" role="alert">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        <line x1="18" y1="6" x2="22" y2="10" stroke-width="2" />
        <line x1="22" y1="6" x2="18" y2="10" stroke-width="2" />
      </svg>
      <h3>Accès restreint</h3>
      <p>Vous devez être connecté pour accéder à votre profil.</p>
    </div>
  {:else if user}
    <div class="section fade-in" style="animation-delay:0.05s" aria-labelledby="recap-title">
      <h3 id="recap-title">Recapitulatif du compte</h3>

      <div class="info-row">
        <span class="label">Pseudo</span>
        {#if editingName}
          <form class="inline-form" on:submit|preventDefault={handleUpdateName}>
            <input type="text" bind:value={newName} placeholder="Prenom et nom" autocomplete="off" aria-label="Nouveau nom"/>
            <div class="inline-actions">
              <button type="submit" class="btn-validate" disabled={savingName}>
                {#if savingName}<span class="spinner-sm"></span>{:else}Valider{/if}
              </button>
              <button type="button" class="btn-cancel-soft" on:click={cancelEditName}>Annuler</button>
            </div>
          </form>
        {:else}
          <div class="value-row">
            <span class="value">{user.name}</span>
            <button class="btn-edit" on:click={startEditName} aria-label="Modifier le nom">Modifier</button>
          </div>
        {/if}
      </div>

      <div class="info-row">
        <span class="label">Email</span>
        {#if editingEmail}
          <form class="inline-form email-form" on:submit|preventDefault={handleUpdateEmail}>
            <div class="inline-fields">
              <div class="field" class:has-error={emailTouched && newEmail && !emailValid} class:has-success={emailTouched && emailValid}>
                <input type="email" bind:value={newEmail} on:blur={() => emailTouched = true} placeholder="Nouvel email" autocomplete="off" aria-label="Nouvel email"/>
                {#if emailTouched && newEmail}
                  <span class="field-icon {emailValid ? 'ok' : 'ko'}">{emailValid ? "v" : "x"}</span>
                {/if}
                {#if emailTouched && newEmail && !emailValid}
                  <span class="error-msg" role="alert">Format invalide</span>
                {/if}
              </div>
              <div class="field" class:has-error={confirmEmailTouched && confirmEmail && !emailsMatch} class:has-success={confirmEmailTouched && emailsMatch}>
                <input type="email" bind:value={confirmEmail} on:blur={() => confirmEmailTouched = true} placeholder="Confirmer l'email" autocomplete="off" aria-label="Confirmer l'email"/>
                {#if confirmEmailTouched && confirmEmail}
                  <span class="field-icon {emailsMatch ? 'ok' : 'ko'}">{emailsMatch ? "v" : "x"}</span>
                {/if}
                {#if confirmEmailTouched && confirmEmail && !emailsMatch}
                  <span class="error-msg" role="alert">Emails differents</span>
                {/if}
              </div>
            </div>
            <div class="field password-field">
              <div class="input-wrapper">
                <input type={showCurrent ? "text" : "password"} bind:value={currentPassword} placeholder="Mot de passe actuel" autocomplete="current-password" aria-label="Mot de passe actuel"/>
                <button type="button" class="toggle-pwd" on:click={() => showCurrent = !showCurrent} aria-label={showCurrent ? "Masquer" : "Afficher"}>
                  {@render eyeIcon(showCurrent)}
                </button>
              </div>
            </div>
            <div class="inline-actions">
              <button type="submit" class="btn-validate" disabled={savingEmail}>
                {#if savingEmail}<span class="spinner-sm"></span>{:else}Valider{/if}
              </button>
              <button type="button" class="btn-cancel-soft" on:click={cancelEditEmail}>Annuler</button>
            </div>
          </form>
        {:else}
          <div class="value-row">
            <span class="value">{user.email}</span>
            <button class="btn-edit" on:click={startEditEmail} aria-label="Modifier l'email">Modifier</button>
          </div>
        {/if}
      </div>

      <div class="info-row">
        <span class="label">Membre depuis</span>
        <span class="value">{formatDate(user.created_at)}</span>
      </div>
    </div>

    <div class="section fade-in" style="animation-delay:0.15s" aria-labelledby="pwd-title">
      <h3 id="pwd-title">Changer le mot de passe</h3>
      <form on:submit|preventDefault={handleUpdatePassword} novalidate autocomplete="off">
        <div class="field">
          <label for="currentPassword">Mot de passe actuel <span class="required">*</span></label>
          <div class="input-wrapper">
            {#if showCurrentPasswordField}
              <input id="currentPassword" type={showCurrent ? "text" : "password"} bind:value={currentPassword} placeholder="Votre mot de passe actuel" autocomplete="current-password" aria-required="true"/>
              <button type="button" class="toggle-pwd" on:click={() => showCurrent = !showCurrent} aria-label={showCurrent ? "Masquer" : "Afficher"}>
                {@render eyeIcon(showCurrent)}
              </button>
            {:else}
              <div class="field-placeholder" aria-hidden="true"></div>
            {/if}
          </div>
        </div>

        <div class="field" class:has-error={newPasswordTouched && newPassword && !passwordValid} class:has-success={newPasswordTouched && passwordValid}>
          <label for="newPassword">Nouveau mot de passe <span class="required">*</span></label>
          <div class="input-wrapper">
            <input id="newPassword" type={showNew ? "text" : "password"} bind:value={newPassword} on:input={() => newPasswordTouched = true} placeholder="Nouveau mot de passe" autocomplete="new-password" aria-describedby="pwd-rules-list"/>
            <button type="button" class="toggle-pwd" on:click={() => showNew = !showNew} aria-label={showNew ? "Masquer" : "Afficher"}>
              {@render eyeIcon(showNew)}
            </button>
          </div>
          {#if newPassword}
            <div class="strength-bar">
              <div class="strength-track">
                <div class="strength-fill {strengthClass}" style="width:{passwordScore * 25}%"></div>
              </div>
              <span class="strength-label {strengthClass}">{strengthLabel}</span>
            </div>
            <ul class="pwd-rules" id="pwd-rules-list" role="list">
              {#each [
                [passwordRules.length, "8 caracteres minimum"],
                [passwordRules.upper,  "Une majuscule"],
                [passwordRules.lower,  "Une minuscule"],
                [passwordRules.digit,  "Un chiffre"],
              ] as [ok, label]}
                <li class:ok>{ok ? "v" : "o"} {label}</li>
              {/each}
            </ul>
          {/if}
        </div>

        <div class="field" class:has-error={confirmPasswordTouched && confirmPassword && !passwordsMatch} class:has-success={confirmPasswordTouched && passwordsMatch}>
          <label for="confirmPassword">Confirmer le mot de passe <span class="required">*</span></label>
          <div class="input-wrapper">
            <input id="confirmPassword" type={showConfirm ? "text" : "password"} bind:value={confirmPassword} on:blur={() => confirmPasswordTouched = true} placeholder="Repetez le nouveau mot de passe" autocomplete="new-password"/>
            <button type="button" class="toggle-pwd" on:click={() => showConfirm = !showConfirm} aria-label={showConfirm ? "Masquer" : "Afficher"}>
              {@render eyeIcon(showConfirm)}
            </button>
          </div>
          {#if confirmPasswordTouched && confirmPassword && !passwordsMatch}
            <span class="error-msg" role="alert">Les mots de passe ne correspondent pas</span>
          {/if}
        </div>

        <button type="submit" disabled={savingPassword} class="btn-primary">
          {#if savingPassword}<span class="spinner-sm"></span> Enregistrement...{:else}Mettre a jour le mot de passe{/if}
        </button>
      </form>
    </div>

    <div class="section section-danger fade-in" style="animation-delay:0.25s" aria-labelledby="delete-title">
      <h3 id="delete-title">Supprimer mon compte</h3>
      <p class="delete-warning">Cette action est <strong>irreversible</strong>. Toutes vos donnees seront definitvement supprimees.</p>
      <button class="btn-danger" on:click={openDeleteModal}>Supprimer mon compte</button>
    </div>
  {/if}
</section>

{#if showDeleteModal}
  <div class="modal-overlay" on:click={handleOverlayClick} on:keydown={handleKeydown} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
    <div class="modal">
      <div class="modal-header">
        <h3 id="modal-title">Supprimer mon compte</h3>
        <button class="modal-close" on:click={closeDeleteModal} aria-label="Fermer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-warning">
          Vous etes sur le point de <strong>supprimer definitivement</strong> votre compte et toutes vos donnees. Cette action ne peut pas etre annulee.
        </p>
        <form on:submit|preventDefault={handleDeleteAccount} novalidate>
          <div class="field">
            <label for="deletePassword">Votre mot de passe <span class="required">*</span></label>
            <div class="input-wrapper">
              <input id="deletePassword" type={showDeletePassword ? "text" : "password"} bind:value={deletePassword} placeholder="Confirmez avec votre mot de passe" autocomplete="current-password" aria-required="true"/>
              <button type="button" class="toggle-pwd" on:click={() => showDeletePassword = !showDeletePassword} aria-label={showDeletePassword ? "Masquer" : "Afficher"}>
                {@render eyeIcon(showDeletePassword)}
              </button>
            </div>
          </div>
          <div class="field">
            <label for="deleteConfirm">Tapez <strong>SUPPRIMER</strong> pour confirmer <span class="required">*</span></label>
            <input id="deleteConfirm" type="text" bind:value={deleteConfirmText} placeholder="SUPPRIMER" autocomplete="off" aria-required="true"/>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-danger" disabled={deletingAccount || deleteConfirmText !== "SUPPRIMER" || !deletePassword}>
              {#if deletingAccount}<span class="spinner-sm"></span> Suppression...{:else}Confirmer la suppression{/if}
            </button>
            <button type="button" class="btn-cancel-soft" on:click={closeDeleteModal}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  .not-authenticated {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.75rem; padding: 3rem 1.5rem; border-radius: var(--radius);
    box-shadow: var(--shadow); text-align: center;
  }
  .not-authenticated svg { opacity: 0.4; }
  .not-authenticated h3  { margin: 0; font-size: 1.1rem; }
  .not-authenticated p   { margin: 0; opacity: 0.7; }

  .profil-container { width: 100%; max-width: 600px; margin: 0 auto; padding: 1rem; }

  h2 {
    text-align: center; margin-bottom: 1.5rem; font-size: 1.5rem;
    font-family: var(--font-primary); letter-spacing: 0.03em;
    animation: fadeDown 0.5s ease both;
  }

  /* ── Messages ── */
  .message {
    padding: 0.9rem 1.2rem; border-radius: var(--radius); margin-bottom: 1rem;
    text-align: center; font-weight: 600; font-size: var(--font-size-sm);
    animation: slideDown 0.35s ease;
  }
  .message.success { background: var(--color-success-bg); color: var(--color-success-text); border: 1px solid var(--color-success-border); }
  .message.error   { background: var(--color-error-bg);   color: var(--color-error-text);   border: 1px solid var(--color-error-border); }

  /* ── Spinners ── */
  .loading { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 2rem; }
  .spinner    { display: inline-block; width: 24px; height: 24px; border: 3px solid var(--color-secondary); border-top-color: transparent; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
  .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; }

  /* ── Sections ── */
  .section { background: var(--color-primary); border-radius: var(--radius); padding: 1.25rem; margin-bottom: 1rem; box-shadow: var(--shadow); transition: box-shadow 0.25s ease, transform 0.25s ease; }
  .section:hover { box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); transform: translateY(-2px); }
  .section-danger { border: 1.5px solid var(--color-danger); }
  .section h3 { margin: 0 0 1rem; font-size: 1rem; border-bottom: 2px solid var(--color-secondary); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }

  /* ── Rows ── */
  .info-row { display: flex; flex-direction: column; padding: 0.6rem 0; border-bottom: 1px solid var(--color-border-subtle); gap: 0.35rem; }
  .info-row:last-child { border-bottom: none; }
  .label { font-weight: 700; font-size: var(--font-size-sm); text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.65; }
  .value-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  .value { font-size: var(--font-size-base); font-weight: 500; word-break: break-word; flex: 1; }

  /* ── Boutons ── */
  .btn-edit, .btn-validate, .btn-cancel-soft, .btn-primary, .btn-danger {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 0.4rem; border-radius: var(--radius); font-weight: 700;
    cursor: pointer; font-family: var(--font-primary); white-space: nowrap;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s;
  }

  .btn-edit       { padding: 0.3rem 0.65rem; border: 1.5px solid var(--color-secondary); background: transparent; font-size: 0.78rem; box-shadow: none; }
  .btn-edit:hover { background: var(--color-secondary); transform: translateY(-1px); }

  .btn-validate                      { padding: 0.45rem 1.1rem; border: none; background: var(--color-secondary); font-size: 0.82rem; box-shadow: var(--shadow-btn); }
  .btn-validate:hover:not(:disabled) { box-shadow: var(--shadow-btn-hover); transform: translateY(-1px); }
  .btn-validate:disabled             { opacity: 0.55; cursor: not-allowed; }

  .btn-cancel-soft       { padding: 0.45rem 1.1rem; border: 1.5px solid var(--color-border-strong); background: var(--color-white); font-size: 0.82rem; box-shadow: none; }
  .btn-cancel-soft:hover { background: var(--color-bg); border-color: var(--color-border-strong); transform: translateY(-1px); }

  .btn-primary                      { padding: 0.7rem 1.4rem; border: none; background: var(--color-secondary); font-size: var(--font-size-sm); box-shadow: var(--shadow-btn); align-self: flex-start; min-height: 44px; }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-btn-hover); }
  .btn-primary:active:not(:disabled){ transform: translateY(0) scale(0.98); }
  .btn-primary:disabled             { opacity: 0.55; cursor: not-allowed; }

  .btn-danger                      { padding: 0.7rem 1.4rem; border: 1.5px solid var(--color-danger); background: var(--color-bg); font-size: var(--font-size-sm); box-shadow: var(--shadow-btn); min-height: 44px; }
  .btn-danger:hover:not(:disabled) { background: var(--color-danger-hover-bg); transform: translateY(-2px); box-shadow: var(--shadow-btn-hover); }
  .btn-danger:disabled             { opacity: 0.45; cursor: not-allowed; }

  /* ── Formulaires inline ── */
  .inline-form         { display: flex; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap; animation: fadeIn 0.25s ease; }
  .inline-form > input { flex: 1; min-width: 140px; padding: 0.5rem 0.7rem; border: 1.5px solid var(--color-secondary); border-radius: var(--radius); font-size: var(--font-size-sm); background: var(--color-white); transition: box-shadow 0.2s; box-sizing: border-box; }
  .inline-form > input:focus { outline: none; box-shadow: var(--focus-ring); }
  .email-form { flex-direction: column; }

  .inline-fields        { display: flex; flex-direction: column; gap: 0.4rem; width: 100%; }
  .inline-fields .field { position: relative; }
  .inline-fields input  { width: 100%; padding: 0.5rem 2rem 0.5rem 0.7rem; border: 1.5px solid var(--color-border); border-radius: var(--radius); font-size: var(--font-size-sm); background: var(--color-white); box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s; }
  .inline-fields input:focus { outline: none; border-color: var(--color-secondary); box-shadow: var(--focus-ring); }
  .inline-actions { display: flex; gap: 0.4rem; margin-top: 0.25rem; }

  /* ── Icônes validation ── */
  .field-icon    { position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%); font-size: 0.85rem; font-weight: 700; pointer-events: none; animation: popIn 0.2s ease; }
  .field-icon.ok { color: var(--color-success-text); }
  .field-icon.ko { color: var(--color-error-text); }
  .error-msg     { font-size: 0.75rem; color: var(--color-error-text); font-weight: 600; animation: fadeIn 0.2s ease; }
  .field.has-error input   { border-color: var(--color-error-text); box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.12); }
  .field.has-success input { border-color: var(--color-success-text); box-shadow: 0 0 0 3px rgba(111, 207, 138, 0.12); }

  /* ── Inputs ── */
  form   { display: flex; flex-direction: column; gap: 0.85rem; }
  .field { display: flex; flex-direction: column; gap: 0.3rem; }
  label  { font-size: var(--font-size-sm); font-weight: 700; }
  .required { color: var(--color-error-text); margin-left: 2px; }

  .input-wrapper       { position: relative; display: flex; align-items: center; }
  .input-wrapper input { flex: 1; padding-right: 2.8rem; }
  .field-placeholder   { height: 46px; border-radius: var(--radius); background: var(--color-placeholder); animation: pulse 1.2s ease infinite; }

  input             { padding: 0.7rem 0.75rem; border: 1.5px solid var(--color-border); border-radius: var(--radius); font-size: var(--font-size-base); background: var(--color-white); transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s; width: 100%; box-sizing: border-box; -webkit-appearance: none; appearance: none; }
  input::placeholder { opacity: 0.45; }
  input:focus        { outline: none; border-color: var(--color-secondary); box-shadow: var(--focus-ring); transform: translateY(-1px); }

  .toggle-pwd       { position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; padding: 0.25rem; box-shadow: none; opacity: 0.55; transition: opacity 0.2s, transform 0.2s; display: flex; align-items: center; min-height: 36px; }
  .toggle-pwd:hover { opacity: 1; transform: scale(1.15); box-shadow: none; background: none; }

  /* ── Jauge mot de passe ── */
  .strength-bar   { display: flex; align-items: center; gap: 0.6rem; margin-top: 0.3rem; }
  .strength-track { flex: 1; height: 6px; background: var(--color-border); border-radius: 99px; overflow: hidden; }
  .strength-fill  { height: 100%; border-radius: 99px; transition: width 0.4s ease; }
  .strength-fill.very-weak { background: #e74c3c; }
  .strength-fill.weak      { background: #e67e22; }
  .strength-fill.medium    { background: #f1c40f; }
  .strength-fill.good      { background: #a8b400; }
  .strength-fill.strong    { background: var(--color-secondary); }
  .strength-label          { font-size: 0.75rem; font-weight: 700; min-width: 70px; text-align: right; }
  .strength-label.very-weak{ color: #e74c3c; }
  .strength-label.weak     { color: #e67e22; }
  .strength-label.medium   { color: #c8960c; }
  .strength-label.good     { color: #a8b400; }
  .strength-label.strong   { color: var(--color-secondary); }

  /* ── Règles mot de passe ── */
  .pwd-rules    { list-style: none; padding: 0.5rem 0.75rem; margin: 0; background: var(--color-surface); border-radius: var(--radius); display: flex; flex-direction: column; gap: 0.25rem; }
  .pwd-rules li { font-size: 0.78rem; opacity: 0.55; transition: color 0.25s, opacity 0.25s, transform 0.2s; }
  .pwd-rules li.ok { color: var(--color-success-text); opacity: 1; font-weight: 600; transform: translateX(3px); }

  .delete-warning { font-size: var(--font-size-sm); margin: 0 0 1rem; line-height: 1.5; opacity: 0.85; }

  /* ── Modale ── */
  .modal-overlay { position: fixed; inset: 0; background: var(--color-overlay); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; animation: fadeIn 0.2s ease; }
  .modal         { background: var(--color-primary); border-radius: var(--radius-lg); width: 100%; max-width: 460px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); animation: slideUp 0.3s ease; overflow: hidden; }
  .modal-header  { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem 1rem; border-bottom: 2px solid var(--color-secondary); }
  .modal-header h3 { margin: 0; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem; border: none; padding: 0; }
  .modal-close   { background: none; border: none; box-shadow: none; cursor: pointer; padding: 0.25rem; opacity: 0.55; transition: opacity 0.2s, transform 0.2s; display: flex; }
  .modal-close:hover { opacity: 1; transform: scale(1.15); box-shadow: none; background: none; }
  .modal-body    { padding: 1.25rem 1.5rem 1.5rem; }
  .modal-warning { font-size: var(--font-size-sm); margin: 0 0 1.25rem; line-height: 1.6; padding: 0.75rem 1rem; background: var(--color-surface); border-radius: var(--radius); border-left: 3px solid var(--color-secondary); }
  .modal-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem; }

  /* ── Animations ── */
  @keyframes fadeIn   { from { opacity: 0; transform: translateY(-4px); }           to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-12px); }          to { opacity: 1; transform: translateY(0); } }
  @keyframes slideDown{ from { opacity: 0; transform: translateY(-10px); }          to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp  { from { opacity: 0; transform: translateY(20px) scale(0.97);} to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes popIn    { from { opacity: 0; transform: translateY(-50%) scale(0.5); } to { opacity: 1; transform: translateY(-50%) scale(1); } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes pulse    { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }

  .fade-in { animation: fadeIn 0.45s ease both; }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .profil-container { padding: 0.75rem; }
    h2 { font-size: 1.25rem; margin-bottom: 1rem; }
    .section { padding: 1rem; }
    .btn-primary, .btn-danger { width: 100%; align-self: stretch; }
    .value-row { flex-direction: column; align-items: flex-start; }
    .modal-actions { flex-direction: column; }
    .modal { border-radius: var(--radius); }
  }

  @media (min-width: 1024px) {
    .profil-container { max-width: 700px; padding: 2.5rem; }
    h2 { font-size: 2rem; margin-bottom: 2rem; }
    .section { padding: 2rem; margin-bottom: 1.5rem; border-radius: var(--radius-lg); }
    .section h3 { font-size: 1.2rem; }
    form { gap: 1.25rem; }
    input { padding: 0.85rem 1rem; }
    .btn-primary { padding: 0.85rem 2rem; font-size: var(--font-size-base); }
  }

  @media (prefers-reduced-motion: reduce) {
    .fade-in, .message, .error-msg, h2, .inline-form, .modal-overlay, .modal { animation: none; }
    .strength-fill { transition: none; }
    input:focus, .section:hover { transform: none; }
    .field-placeholder { animation: none; opacity: 0.5; }
  }
</style>