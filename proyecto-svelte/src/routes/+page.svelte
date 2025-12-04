<script>
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  onMount(() => {
    // Lee el estado desde sessionStorage
    const isLoggedIn = sessionStorage.getItem('isLoggedIn')

    // Si el estado no existe o es "false", redirige
    if (isLoggedIn !== 'true') {
      goto('./auth/login')
    } else {
      goto('./main/menu')
    }
  })
</script>
