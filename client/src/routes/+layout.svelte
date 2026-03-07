<script>
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import ErrorBoundary from "$lib/components/ErrorBoundary.svelte";
  import "$lib/../app.css";
  import "$lib/../normalize.css";
</script>

<ErrorBoundary>
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</ErrorBoundary>
