<script>
  let token = $state(localStorage.getItem("token"));
</script>

<footer>
  <div class="infomations">
    <div class="contact">
      <h3>Contact</h3>
      <p>
        Email: <a href="mailto:blablabook&#64;book.com">blablabook@book.com</a>
      </p>
    </div>

    <div class="social_media">
      <h3>Suivez-nous sur ...</h3>
      <nav class="icons">
        <a href="https://www.instagram.com/" aria-label="Instagram">
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/doodle/48/instagram-new.png"
            alt="instagram"
          />
        </a>
        <a href="https://www.facebook.com/?locale=fr_FR" aria-label="Facebook">
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/facebook--v1.png"
            alt="facebook"
          />
        </a>
        <a href="https://www.tiktok.com/fr/" aria-label="TikTok">
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/office/40/tiktok.png"
            alt="tiktok"
          />
        </a>
        <a href="https://x.com/?lang=fr" aria-label="X (Twitter)">
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/twitterx--v1.png"
            alt="twitterx"
          />
        </a>
      </nav>
    </div>

    <div class="info__legales">
      <h3>Plan de site</h3>
      <nav class="plan">
        <a href="/">Accueil</a>
        <a href="/livres">Catalogue</a>
        {#if token}
          <a href="/collection">Ma collection</a>
        {/if}
      </nav>

      <h3>Mentions légales</h3>
      <p>
        Site réalisé dans le cadre d'un projet pédagogique. Conformément au
        <a
          href="https://www.economie.gouv.fr/entreprises/gerer-son-entreprise-au-quotidien/assurer-sa-cybersecurite-et-la-protection-de-ses/le#:~:text=dit%20la%20loi-,Le%20RGPD%2C%20qu%27est%2Dce%20que%20c%27est,dans%20toute%20l%27Union%20europ%C3%A9enne."
          >RGPD</a
        >
        et aux recommandations de la <a href="https://www.cnil.fr/fr">CNIL</a>,
        ce site respecte les principes de protection des données et
        d'accessibilité numérique.
      </p>

      <h3>Droit applicable</h3>
      <p>
        Les présentes <a
          href="https://www.francenum.gouv.fr/guides-et-conseils/developpement-commercial/site-web/rediger-des-conditions-generales-dutilisation"
          >CGU</a
        >
        sont soumises au droit français.
      </p>
    </div>

    <div class="copyright">
      <p>&#169; 2026 Blablabook</p>
    </div>
  </div>
</footer>

<style>
  footer {
    margin-top: 5rem;
    width: 100%;
    font-size: var(--font-size-base);
    background: var(--color-primary);
    box-shadow: var(--shadow);
    border-top: 1px solid var(--color-border);
  }

  h3 {
    font-size: var(--font-size-lg);
    margin: 0 0 0.5rem;
  }

  a {
    color: var(--color-text);
    opacity: 0.8;
    transition: opacity var(--transition-base);
  }

  a:hover {
    opacity: 1;
  }

  .infomations {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: auto;
    column-gap: 2rem;
    row-gap: 1rem;
    padding: 1rem;
    margin-top: 2rem;
  }

  .contact {
    grid-area: 1 / 1 / 2 / 3;
  }
  .social_media {
    grid-area: 2 / 1 / 3 / 3;
  }
  .info__legales {
    grid-area: 1 / 3 / 3 / 6;
    width: 80%;
  }
  .copyright {
    grid-area: 3 / 1 / 4 / 6;
    text-align: center;
    margin-top: 1rem;
  }

  .copyright p {
    opacity: 0.7;
    font-size: var(--font-size-sm);
  }

  /* ── Plan de site ── */
  .plan {
    display: flex;
    justify-content: space-around;
  }

  .plan a {
    position: relative;
    opacity: 0.75;
  }

  .plan a::after {
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

  .plan a:hover::after {
    transform: scaleX(1);
  }

  /* ── Icônes réseaux ── */
  .icons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .icons a {
    opacity: 0.75;
    transition:
      opacity var(--transition-base),
      transform var(--transition-base);
  }

  .icons a:hover {
    opacity: 1;
    transform: translateY(-2px);
  }

  /* ── Responsive ── */
  @media screen and (max-width: 900px) {
    .infomations {
      grid-template-columns: repeat(auto-fit, minmax(1rem, 1fr));
      gap: 1rem;
    }
    .contact {
      grid-area: 1 / 1 / 2 / 2;
    }
    .social_media {
      grid-area: 2 / 1 / 3 / 2;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }
    .info__legales {
      grid-area: 1 / 3 / 3 / 6;
      margin: 1rem;
    }
    .copyright {
      grid-area: 3 / 1 / 4 / 6;
    }
  }

  @media screen and (max-width: 600px) {
    .infomations {
      display: flex;
      flex-direction: column;
    }
    .social_media {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
