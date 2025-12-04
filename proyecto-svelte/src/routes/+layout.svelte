<script lang="ts">
  import favicon from '$lib/assets/favicon.svg'
  import 'phosphor-svelte'
  import '../app.css'
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import { notifications } from '../stores/notificationStore'
  import Toast from '$lib/components/Toast.svelte'
  import { page } from '$app/stores'

  let { children } = $props()

  function showLayoutElements(path: string) {
    return path !== '/auth/login' && path !== '/auth/register'
  }

  function isLoginPage(path: string) {
    return path === '/auth/login' || path === '/auth/register'
  }

  $effect(() => {
    if ($page.url.pathname.startsWith('/auth')) {
      document.body.classList.add('auth-page')
    } else {
      document.body.classList.remove('auth-page')
    }
  })
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="icon" href={favicon} />
  <link
    href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{#if showLayoutElements($page.url.pathname)}
  <Header />
{/if}

<main class={isLoginPage($page.url.pathname) ? 'content-auth' : 'content'}>
  <div class="notification-container">
    {#each $notifications as notif (notif.id)}
      <Toast message={notif.message} type={notif.type} id={notif.id} />
    {/each}
  </div>

  {@render children()}
</main>

{#if showLayoutElements($page.url.pathname)}
  <Footer />
{/if}
