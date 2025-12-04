<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Loader from '$lib/components/Loader.svelte'
  import './edit-ingredients.css'
  import { goto } from '$app/navigation'
  import { showNotification } from '../../../stores/notificationStore'
  import { ingredientService } from '$lib/services/IngredientsService'
  import { onMount, tick } from 'svelte'
  import { Ingredient } from '../../../types/Ingredient'

  let isLoading = $state(true)

  let id: number = $state(-1)
  let nombre: string = $state('')
  let costo: number = $state(0)
  let origenAnimal: boolean = $state(false)
  let grupoAlimenticio: string = $state('')

  onMount(async () => {
    isLoading = true
    try {
      let ingredienteId = new URL(window.location.href).searchParams.get('id')
      if (ingredienteId) {
        let ingredienteAEditar = await ingredientService.getById(Number(ingredienteId))
        id = ingredienteAEditar.id
        nombre = ingredienteAEditar.name
        costo = ingredienteAEditar.price
        grupoAlimenticio = ingredienteAEditar.group
        origenAnimal = ingredienteAEditar.animalOrigin
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudo cargar el ingrediente.'
      showNotification(msg, 'error')
      goBack()
    } finally {
      await tick()
      isLoading = false
    }
  })

  async function validateForm() {
    const validationChecks = [
      {
        check: () => nombre.length >= 5,
        message: 'El Nombre del ingrediente debe tener al menos 5 caracteres.'
      },
      {
        check: () => typeof costo === 'number' && !isNaN(costo) && costo > 0,
        message: 'El Costo debe ser un número válido mayor a cero.'
      },
      {
        check: () => grupoAlimenticio !== '',
        message: 'Debe seleccionar un Grupo alimenticio.'
      }
    ]

    const failedValidations: string[] = []

    for (const validation of validationChecks) {
      if (!validation.check()) {
        failedValidations.push(validation.message)
      }
    }

    if (failedValidations.length > 0) {
      const errorMessage =
        'Se encontraron los siguientes errores:\n\n' + '• ' + failedValidations.join('\n\n• ')

      showNotification(errorMessage, 'error')
      return
    }

    isLoading = true
    await tick()

    try {
      if (id == -1) {
        await ingredientService.create(new Ingredient(id, nombre, costo, grupoAlimenticio))
      } else {
        await ingredientService.update(new Ingredient(id, nombre, costo, grupoAlimenticio))
      }

      showNotification('Ingrediente guardado con éxito.', 'success')
      goBack()
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudo guardar el ingrediente.'
      showNotification(msg, 'error')
      isLoading = false
    }
  }

  function goBack() {
    goto('../main/ingredients')
  }
</script>

<Loader {isLoading} />

<h1>Editar ingrediente</h1>
<div class="section">
  <form class="edit-ingredient-form">
    <div class="form-row form-group">
      <label for="ingredient-name">Nombre del ingrediente:</label>
      <input
        type="text"
        maxlength="35"
        id="ingredient-name"
        bind:value={nombre}
        placeholder="Escribir"
        required
      />
    </div>

    <div class="form-row form-group">
      <label for="ingredient-cost">Costo:</label>
      <div class="currency-input">
        <input
          type="number"
          id="ingredient-cost"
          bind:value={costo}
          min="0"
          inputmode="decimal"
          placeholder="$"
          required
        />
      </div>
    </div>

    <div class="form-row form-group">
      <label for="food-group">Grupo alimenticio:</label>
      <select id="food-group" bind:value={grupoAlimenticio} required>
        <option value="AZUCARES_Y_DULCES">Azúcares y Dulces</option>
        <option value="CEREALES_Y_TUBERCULOS">Cereales y Tubérculos</option>
        <option value="FRUTAS_Y_VERDURAS">Frutas y Verduras</option>
        <option value="GRASAS_Y_ACEITES">Grasas y Aceites</option>
        <option value="LACTEOS">Lácteos</option>
        <option value="PROTEINAS">Proteínas</option>
      </select>
    </div>

    <div class="button-group">
      <Button label="Guardar" variant="primary" onClick={validateForm} />
      <Button label="Descartar" variant="secondary" onClick={goBack} />
    </div>
  </form>
</div>
