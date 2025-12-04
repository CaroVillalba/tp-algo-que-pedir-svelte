<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import { ChefHat, Eye, EyeSlash, User } from 'phosphor-svelte'
  import { goto } from '$app/navigation'
  import '../auth.css'
  import { authService } from '$lib/services/AuthService'
  import type { UserCredentialRegister } from '../../../types/UserCredentialRegister'
  import { showNotification } from '../../../stores/notificationStore'
  import PasswordInput from '$lib/components/PasswordInput.svelte'
  import Loader from '$lib/components/Loader.svelte'
  import { tick } from 'svelte'

  let password2 = $state('')
  let isLoading = $state(false)
  let credentials = $state<UserCredentialRegister>({
    name: '',
    surname: '',
    username: '',
    password: '',
    birthDate: new Date(),
    registerDate: new Date(),
    email: ''
  })

  async function handleRegister(e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
    e.preventDefault()
    if (!validateUser()) {
      showNotification('El usuario debe tener al menos 4 caracteres.', 'error')
      return
    }
    if (!validatePassword()) {
      showNotification('Las contraseñas no coinciden', 'error')
      return
    }
    if (!validatePasswordLength()) {
      return
    }
    if (!validateEmail()) {
      showNotification('El email ingresado no es valido', 'error')
      return
    }
    let registrationSuccess = false
    isLoading = true
    await tick()

    try {
      await authService.register(credentials)
      showNotification('Usuario registrado con éxito.', 'success')
      registrationSuccess = true
      goto('../auth/login')
    } catch (error: any) {
      showNotification('Error al registrar el usuario.', 'error')
    } finally {
      if (!registrationSuccess) {
        isLoading = false
      }
    }
  }

  function validateEmail(): boolean {
    const email = credentials.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
  }

  function validateUser() {
    return credentials.username != '' && credentials.username.length > 3
  }

  function validatePassword() {
    return credentials.password != '' && credentials.password == password2
  }

  function validatePasswordLength(): boolean {
    if (credentials.password.length < 6) {
      showNotification('La contraseña debe tener mas de 6 caracteres', 'error')
      return false
    }
    return true
  }
</script>

<Loader {isLoading} />

<section class="container container-auto">
  <form class="form-column" onsubmit={handleRegister} action="#" method="post">
    <header class="form-row">
      <div class="icon-item">
        <ChefHat size={32} weight="bold" />
      </div>
      <h1>Crea tu cuenta</h1>
    </header>

    <div class="form-group">
      <label for="email">Nombre*</label>
      <input
        type="text"
        id="name"
        bind:value={credentials.name}
        placeholder="Nombre"
        maxlength="30"
        required
      />
    </div>
    <div class="form-group">
      <label for="email">Apellido*</label>
      <input
        type="text"
        id="surname"
        bind:value={credentials.surname}
        placeholder="Apellido"
        maxlength="40"
        required
      />
    </div>
    <div class="form-group">
      <label for="user">Usuario*</label>
      <input
        type="text"
        id="user"
        bind:value={credentials.username}
        placeholder="Nombre"
        maxlength="100"
        required
      />
    </div>
    <div class="form-group">
      <label for="email">E-mail*</label>
      <input
        type="mail"
        id="mail"
        bind:value={credentials.email}
        placeholder="E-mail"
        maxlength="100"
        required
      />
    </div>
    <div class="form-group">
      <label for="email">Fecha de nacimiento*</label>
      <input
        type="date"
        id="fecha-nacimiento"
        bind:value={credentials.birthDate}
        placeholder="Fecha de nacimiento"
        required
      />
    </div>
    <div class="form-group">
      <PasswordInput
        id="password"
        label="Contraseña*"
        placeholder="Contraseña"
        bind:value={credentials.password}
        maxlength={100}
        required={true}
      />
    </div>
    <div class="form-group">
      <PasswordInput
        id="re-password"
        label="Reingrese la contraseña*"
        placeholder="Reingrese la contraseña"
        bind:value={password2}
        maxlength={100}
        required={true}
      />
    </div>

    <Button label="Registrarse" variant="primary" fullWidth type="submit" disabled={isLoading} />

    <p class="subtitle subtitle-center">
      <span>¿Ya tienes una cuenta? <a href="../auth/login">Inicia Sesión</a></span>
    </p>
  </form>
</section>
