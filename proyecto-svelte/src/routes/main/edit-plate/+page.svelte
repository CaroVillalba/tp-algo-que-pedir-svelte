<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Table from '$lib/components/Table.svelte'
  import Loader from '$lib/components/Loader.svelte'
  import type { Ingredient } from '../../../types/Ingredient'
  import './edit-plate.css'
  import { goto } from '$app/navigation'
  import { showNotification } from '../../../stores/notificationStore'
  import { onMount, tick } from 'svelte'
  import { ingredientService } from '$lib/services/IngredientsService'
  import { dishService } from '$lib/services/DishService'
  import type { BackPlate } from '../../../types/BackPlate'

  let isLoading = $state(true)

  let plateData = $state<BackPlate>({
    imageURL: '',
    name: '',
    description: '',
    ingredients: [],
    local: 0,
    agreedPercentageWithLocal: 0.0,
    authorRoyalties: 0.0,
    baseValue: 0,
    discount: 0.0,
    productionCost: 0.0
  })

  let savedData = $state<BackPlate>({
    imageURL: '',
    name: '',
    description: '',
    ingredients: [],
    local: 0,
    agreedPercentageWithLocal: 0.0,
    authorRoyalties: 0.0,
    baseValue: 0,
    discount: 0.0,
    productionCost: 0.0
  })

  let ingredientsList = $state<Ingredient[]>([])
  let savedIngredients = $state<Ingredient[]>([])
  let isNewPlate = $state(false)

  let computedProductionCost = $derived(
    ingredientsList.reduce((total, ingredient) => total + (ingredient.price || 0), 0)
  )

  let authorActive = $state(false)
  let promoActive = $state(false)
  let idString: string | null = null
  let idActive: number = 0

  onMount(async () => {
    idString = new URL(window.location.href).searchParams.get('id')
    idActive = +(idString ?? '0')
    try {
      const allIngredients = await ingredientService.getAll()

      if (idString) {
        const response = await dishService.getByID(idString)

        plateData = { ...response }
        savedData = { ...response }
        ingredientsList = [...response.ingredients]
        savedIngredients = [...response.ingredients]
        authorActive = (response.authorRoyalties ?? 0) > 0
        promoActive = (response.discount ?? 0) > 0

        if (response.releaseDate) {
          const release = new Date(response.releaseDate)
          const now = new Date()
          const diffDays = Math.floor((now.getTime() - release.getTime()) / (1000 * 60 * 60 * 24))
          isNewPlate = diffDays <= 30
        } else {
          isNewPlate = false
        }
      } else {
        ingredientsList = [...allIngredients]
        savedIngredients = [...allIngredients]
        isNewPlate = true
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.error || err.message || 'Error al cargar datos'
      showNotification(msg, 'error')
    } finally {
      await tick()
      isLoading = false
      console.log(ingredientsList)
    }
  })

  function validateField(value: any, type: 'string' | 'number'): boolean {
    if (type === 'string') return value.trim().length > 0
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

  function handleReset() {
    plateData = { ...savedData }
    ingredientsList = [...savedIngredients]
    showNotification('Campos reseteados exitosamente.', 'success')
  }

  async function handleSubmit() {
    const validationChecks = [
      {
        check: () => validateField(plateData.name, 'string'),
        message: 'El Nombre del plato no puede estar vacío.'
      },
      {
        check: () => validateField(plateData.description, 'string'),
        message: 'La Descripción del plato no puede estar vacía.'
      },
      {
        check: () => validateUrl(plateData.imageURL),
        message: 'La URL de la imagen no es válida.'
      },
      {
        check: () => validateField(plateData.baseValue, 'number'),
        message: 'El Precio Base debe ser un número mayor o igual a cero.'
      },
      {
        check: () => validateField(plateData.discount, 'number'),
        message: 'El descuento debe ser un número mayor o igual a cero.'
      },
      {
        check: () => validateField(plateData.authorRoyalties, 'number'),
        message: 'Las regalías de autor deben ser un número mayor o igual a cero.'
      },
      {
        check: () => validateField(plateData.agreedPercentageWithLocal, 'number'),
        message: 'El porcentaje acordado con el local debe ser un número mayor o igual a cero.'
      },
      {
        check: () => validateField(plateData.ingredients.length, 'number'),
        message: 'Debe haber al menos un ingrediente.'
      }
    ]
    console.log(plateData.ingredients)

    const failedValidations = validationChecks.filter((v) => !v.check()).map((v) => v.message)
    if (failedValidations.length) {
      showNotification('Errores:\n• ' + failedValidations.join('\n• '), 'error')
      return
    }

    try {
      if (idString) {
        if (!authorActive) plateData.authorRoyalties = 0
        if (!promoActive || isNewPlate) plateData.discount = 0
        await dishService.updateDish({ ...plateData, ingredients: ingredientsList }, idActive)
      } else {
        await dishService.createDishes(ingredientsList, plateData)
      }
      showNotification('Datos guardados correctamente', 'success')
      goto('../main/menu')
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al guardar los datos'
      showNotification(msg, 'error')
    }
  }

  let showSelector = $state(false)
  let availableIngredients = $state<Ingredient[]>([])
  let selectedIngredientId = $state<number | ''>('')

  function handleDeleteIngredient(event: CustomEvent<{ id: number }>) {
    ingredientsList = ingredientsList.filter((i) => i.id !== event.detail.id)
  }

  async function openAddIngredient() {
    showSelector = true
    if (availableIngredients.length === 0) {
      availableIngredients = await ingredientService.getAll()
    }
  }

  function addSelectedIngredient() {
    const ingredientToAdd = availableIngredients.find((i) => i.id === +selectedIngredientId)
    console.log(ingredientToAdd)
    if (ingredientToAdd) {
      if (!ingredientsList.some((i) => i.id === ingredientToAdd.id)) {
        ingredientsList = [...ingredientsList, ingredientToAdd]
        console.log(ingredientsList)
        showNotification(`Ingrediente "${ingredientToAdd.name}" agregado.`, 'success')
      } else {
        showNotification('Ese ingrediente ya está agregado.', 'error')
      }
    }
    showSelector = false
    selectedIngredientId = ''
  }
</script>

<Loader {isLoading} />

<h1>Editar Plato</h1>
<form class="edit-plate-form">
  <fieldset class="section">
    <section class="form-row">
      <div class="form-column">
        <div class="form-group">
          <label for="plate-name">Nombre del plato*</label>
          <input
            type="text"
            id="plate-name"
            name="plate-name"
            placeholder="Escribir"
            maxlength="50"
            required
            bind:value={plateData.name}
          />
        </div>
        <div class="form-group">
          <label for="plate-description">Descripcion*</label>
          <textarea
            id="plate-description"
            name="plate-description"
            placeholder="Escribir"
            class="input-description"
            maxlength="250"
            required
            bind:value={plateData.description}
          ></textarea>
        </div>
        <div class="form-group">
          <label for="plate-img-url">URL de la imagen del plato*</label>
          <input
            type="text"
            id="plate-img-url"
            name="plate-img-url"
            placeholder="Escribir"
            required
            bind:value={plateData.imageURL}
          />
        </div>
      </div>
      <div class="form-group form-img">
        <div class="image-preview2">
          <img
            src={plateData.imageURL || '../images/katsukare.jpeg'}
            alt="Vista previa de la imagen"
          />
        </div>
      </div>
    </section>
  </fieldset>

  <fieldset class="section">
    <h2>Costos</h2>

    <section class="form-column">
      <div class="form-group">
        <label for="costo">Precio Base*</label>
        <div class="currency-input">
          <input
            type="number"
            id="costo"
            name="costo"
            placeholder="Escribir"
            min="0"
            inputmode="decimal"
            required
            bind:value={plateData.baseValue}
          />
        </div>
      </div>

      <div class="checkbox-form-group">
        <label for="author-plate" class="checkbox-label">
          Plato de autor
          <span class="checkbox-description">Aplica un porcentaje adicional al precio de venta</span
          >
        </label>

        <div class="switch-wrapper">
          <input
            class="switch"
            type="checkbox"
            id="author-plate"
            name="author-plate"
            value="author-plate"
            checked={plateData.authorRoyalties > 0}
            onchange={(e) => {
              const checked = (e.target as HTMLInputElement).checked
              if (!checked) plateData.authorRoyalties = 0
              else if (plateData.authorRoyalties === 0) plateData.authorRoyalties = 10
            }}
          />
        </div>
      </div>

      {#if plateData.authorRoyalties > 0}
        <div class="form-group field-slide" id="author-field">
          <label for="regaliasAutor">Regalías Autor*</label>
          <input
            type="number"
            id="regaliasAutor"
            placeholder="Escribir"
            min="0"
            inputmode="decimal"
            required
            bind:value={plateData.authorRoyalties}
          />
        </div>
      {/if}

      {#if !isNewPlate}
        <div class="checkbox-form-group promo-wrapper">
          <label for="discount-plate" class="checkbox-label" aria-describedby="promo-help">
            Plato en promoción
            <span class="checkbox-description">Aplica un descuento al precio de venta</span>
          </label>

          <div class="switch-wrapper">
            <input
              class="switch"
              type="checkbox"
              id="discount-plate"
              name="discount-plate"
              value="discount-plate"
              checked={plateData.discount > 0}
              onchange={(e) => {
                const checked = (e.target as HTMLInputElement).checked
                if (!checked) plateData.discount = 0
                else if (plateData.discount === 0) plateData.discount = 10
              }}
            />
          </div>
        </div>

        {#if plateData.discount > 0}
          <div class="form-group field-slide" id="discount-field">
            <label for="descuento">Descuento*</label>
            <input
              type="number"
              id="descuento"
              placeholder="Escribir"
              min="0"
              inputmode="decimal"
              required
              bind:value={plateData.discount}
            />
          </div>
        {/if}
      {:else}
        <span id="promo-help" class="tooltip" role="status" aria-live="polite">
          Los platos nuevos (lanzados hace 30 días o menos) no pueden estar en promoción.
        </span>
      {/if}

      <div class="form-group">
        <label for="costo">Regalias Local*</label>
        <input
          type="number"
          id="costo"
          name="costo"
          placeholder="Escribir"
          min="0"
          inputmode="decimal"
          required
          bind:value={plateData.agreedPercentageWithLocal}
        />
      </div>
    </section>
  </fieldset>
  <fieldset class="section">
    <h2>Ingredientes</h2>
    <span class="prod-cost">Costo de produccion ${computedProductionCost.toFixed(2)}</span>

    {#if ingredientsList.length === 0}
      <div class="empty-ingredients">
        <p>No hay ingredientes seleccionados.</p>
        <Button label="Agregar ingrediente" variant="secondary" onClick={openAddIngredient} />
      </div>
    {:else}
      <div class="add-more">
        <Button label="Agregar más ingredientes" variant="secondary" onClick={openAddIngredient} />
      </div>
    {/if}

    {#if showSelector}
      <div class="ingredient-selector">
        <label for="ingredient-select">Seleccionar ingrediente:</label>
        <select class="select" id="ingredient-select" bind:value={selectedIngredientId}>
          <option value="" disabled selected>Elegí un ingrediente</option>
          {#each availableIngredients as ing}
            <option value={ing.id}>{ing.name} (${ing.price.toFixed(2)})</option>
          {/each}
        </select>
        <Button label="Agregar" variant="primary" onClick={addSelectedIngredient} />
        <Button label="Cancelar" variant="secondary" onClick={() => (showSelector = false)} />
      </div>
    {/if}

    <section class="section-table">
      <Table ingredients={ingredientsList} on:deleteItem={handleDeleteIngredient} />
    </section>
  </fieldset>
  <section class="container-button">
    <Button label="Guardar" variant="primary" onClick={handleSubmit} />
    <Button label="Descartar" variant="secondary" onClick={handleReset} />
  </section>
</form>
