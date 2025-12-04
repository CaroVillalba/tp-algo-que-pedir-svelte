<script lang="ts">
  import { onMount, tick } from 'svelte'
  import Loader from '$lib/components/Loader.svelte'
  import { accountService } from '$lib/services/AccountService.ts'
  import type { LocalAccount } from '../../../types/Account.ts'
  import { showNotification } from '../../../stores/notificationStore.ts'
  import Button from '$lib/components/Button.svelte'
  import './account.css'
  import { goto } from '$app/navigation'

  let isLoading = $state(true)

  let localData = $state<LocalAccount>({
    name: '',
    imgURL: '',
    street: '',
    number: 0,
    latitude: 0,
    longitude: 0,
    appCommission: 0,
    authorCommission: 0,
    paymentMethods: []
  })

  let savedData = $state<LocalAccount>({
    name: '',
    imgURL: '',
    street: '',
    number: 0,
    latitude: 0,
    longitude: 0,
    appCommission: 0,
    authorCommission: 0,
    paymentMethods: []
  })

  let imagePlaceholder =
    'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'

  onMount(async () => {
    isLoading = true
    try {
      const data = await accountService.getLocalAccount()
      localData = { ...data }
      savedData = { ...data }
    } catch (err: any) {
      showNotification(`Error al cargar los datos: ${err.message}`, 'error')
    } finally {
      await tick()
      isLoading = false
    }
  })

  function validateField(value: any, type: 'string' | 'number', maxLen?: number) {
    if (type === 'string') return value.trim().length > 0 && (!maxLen || value.length <= maxLen)
    if (type === 'number') return typeof value === 'number' && !isNaN(value) && value >= 0
    return false
  }

  function validateUrl(url: string) {
    try {
      new URL(url)
      return url.startsWith('http://') || url.startsWith('https://')
    } catch {
      return false
    }
  }

  async function handleSubmit() {
    const validationChecks = [
      { check: () => validateField(localData.name, 'string', 30), message: 'Nombre inválido.' },
      { check: () => validateUrl(localData.imgURL), message: 'URL de la imagen inválida.' },
      {
        check: () => validateField(localData.street, 'string', 30),
        message: 'Dirección inválida.'
      },
      {
        check: () => validateField(localData.number, 'number') && localData.number > 0,
        message: 'Altura inválida.'
      },
      {
        check: () =>
          typeof localData.latitude === 'number' &&
          localData.latitude >= -90 &&
          localData.latitude <= 90,
        message: 'Latitud inválida.'
      },
      {
        check: () =>
          typeof localData.longitude === 'number' &&
          localData.longitude >= -180 &&
          localData.longitude <= 180,
        message: 'Longitud inválida.'
      },
      {
        check: () =>
          validateField(localData.appCommission, 'number') && localData.appCommission <= 100,
        message: 'Comisión App inválida.'
      },
      {
        check: () =>
          validateField(localData.authorCommission, 'number') && localData.authorCommission <= 100,
        message: 'Comisión autores inválida.'
      },
      {
        check: () => localData.paymentMethods.length > 0,
        message: 'Debe seleccionar al menos un método de pago.'
      }
    ]

    const failedValidations = validationChecks.filter((v) => !v.check()).map((v) => v.message)
    if (failedValidations.length > 0) {
      showNotification('Errores:\n• ' + failedValidations.join('\n• '), 'error')
      return
    }

    try {
      await accountService.saveLocalAccount(localData)
      showNotification('Local guardado correctamente', 'success')
      goto('/main/menu')
    } catch (err: any) {
      showNotification(`Error al guardar los datos: ${err.message}`, 'error')
    } finally {
      try {
        const updatedData = await accountService.getLocalAccount()
        localData = updatedData
        savedData = { ...updatedData }
      } catch (err: any) {
        showNotification(`Error al recargar los datos: ${err.message}`, 'error')
      }
      isLoading = false
    }
  }

  function handleReset() {
    localData = { ...savedData }
    showNotification('Campos reseteados exitosamente.', 'success')
  }
</script>

<Loader {isLoading} />

<h1>Información del local</h1>

<form class="account-form">
  <section class="section">
    <div class="form-row">
      <div class="form-group">
        <span>Nombre del local*</span>
        <input type="text" maxlength="30" placeholder="Escribir" bind:value={localData.name} />
      </div>
      <div class="form-group">
        <span>URL de la imagen*</span>
        <input type="text" placeholder="Escribir" bind:value={localData.imgURL} />
      </div>
      <div class="image-preview">
        <img src={localData.imgURL || imagePlaceholder} alt="Vista previa de la imagen" />
      </div>
    </div>
  </section>

  <section class="section">
    <h2>Dirección</h2>
    <div class="form-row">
      <div class="form-group">
        <span>Dirección*</span>
        <input type="text" maxlength="30" placeholder="Escribir" bind:value={localData.street} />
      </div>
      <div class="form-group">
        <span>Altura*</span>
        <input type="number" min="0" bind:value={localData.number} />
      </div>
      <div class="form-group">
        <span>Latitud*</span>
        <input type="number" bind:value={localData.latitude} />
      </div>
      <div class="form-group">
        <span>Longitud*</span>
        <input type="number" bind:value={localData.longitude} />
      </div>
    </div>
  </section>

  <section class="section">
    <h2>Porcentajes</h2>
    <div class="form-row">
      <div class="form-group">
        <span>Porcentaje de comisión con la app*</span>
        <input type="number" min="0" inputmode="decimal" bind:value={localData.appCommission} />
      </div>
      <div class="form-group">
        <span>Porcentaje de comisión con autores de platos*</span>
        <input type="number" min="0" inputmode="decimal" bind:value={localData.authorCommission} />
      </div>
    </div>

    <h2>Métodos de pago</h2>
    <div class="checkbox-group">
      <span
        ><input type="checkbox" value="efectivo" bind:group={localData.paymentMethods} /> Efectivo</span
      >
      <span><input type="checkbox" value="qr" bind:group={localData.paymentMethods} /> QR</span>
      <span
        ><input type="checkbox" value="transferencia" bind:group={localData.paymentMethods} /> Transferencia</span
      >
    </div>
  </section>

  <div class="button-group">
    <Button
      label={isLoading ? 'Guardando...' : 'Guardar'}
      variant="primary"
      onClick={handleSubmit}
      disabled={isLoading}
    />
    <Button label="Descartar" variant="secondary" onClick={handleReset} disabled={isLoading} />
  </div>
</form>
