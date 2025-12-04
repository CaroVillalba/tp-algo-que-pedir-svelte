<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import { ChefHat } from 'phosphor-svelte'
  import '../auth.css'
  import { goto } from '$app/navigation'
  import { authService } from '$lib/services/AuthService'
  import { showNotification } from '../../../stores/notificationStore'
  import PasswordInput from '$lib/components/PasswordInput.svelte'
  import Loader from '$lib/components/Loader.svelte'
  import { tick } from 'svelte'

  let showPassword = $state(false)
  let user = $state('')
  let password = $state('')
  let isLoading = $state(false)

  async function handleLogin(e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
    e.preventDefault()

    if (validateUser() && validatePassword()) {
      let loginSuccess = false
      isLoading = true
      await tick()

      try {
        const res = await authService.login({ username: user, password: password })
        sessionStorage.setItem('userId', res.id.toString())
        sessionStorage.setItem('localId', res.localId?.toString() || '')
        loginSuccess = true
        goto('../../main/menu')
      } catch (error: any) {
        const backendMessage = error.response?.data?.error || 'Error desconocido'
        const finalMessage = `${backendMessage} Aún no implementamos recuperarlas.`
        showNotification(finalMessage, 'error')
      } finally {
        if (!loginSuccess) {
          isLoading = false
        }
      }
    }
  }

  function validateUser() {
    return user != ''
  }

  function validatePassword() {
    return password != ''
  }
</script>

<Loader {isLoading} />

<section class="container container-auto">
  <form class="form-column" onsubmit={handleLogin} action="#" method="post">
    <header class="form-row">
      <ChefHat size={32} weight="bold" />
      <h1>Algo que pedir</h1>
    </header>
    <div class="form-group">
      <label for="user">Usuario*</label>
      <input
        type="text"
        id="user"
        bind:value={user}
        placeholder="Nombre"
        maxlength="100"
        required
      />
    </div>
    <div class="form-group">
      <PasswordInput
        id="password"
        label="Contraseña*"
        placeholder="Contraseña"
        bind:value={password}
        maxlength={100}
        required={true}
      />
    </div>
    <Button label="Iniciar sesión" variant="primary" type="submit" fullWidth disabled={isLoading} />
    <p class="subtitle subtitle-center">
      <span>¿No tienes una cuenta? <a href="../auth/register">Regístrate</a></span>
    </p>
  </form>
</section>
