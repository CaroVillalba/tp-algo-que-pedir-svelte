<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Table from '$lib/components/Table.svelte'
  import Loader from '$lib/components/Loader.svelte'
  import type { Ingredient } from '../../../types/Ingredient'
  import './ingredients.css'
  import { goto } from '$app/navigation'
  import { onMount, tick } from 'svelte'
  import { ingredientService } from '$lib/services/IngredientsService'
  import { showNotification } from '../../../stores/notificationStore'

  let isLoading = $state(true)

  let ingredientsList = $state<Ingredient[]>([])

  onMount(async () => {
    isLoading = true
    try {
      await updateIngredients()
      await tick()
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudieron cargar los ingredientes.'
      showNotification(msg, 'error')
    } finally {
      isLoading = false
    }
  })

  function addIngredient() {
    goto('./edit-ingredients')
  }

  async function updateIngredients() {
    ingredientsList = await ingredientService.getAll()
  }

  async function handleDeleteItem(e: CustomEvent) {
    isLoading = true
    await tick()

    try {
      const id = e.detail.id
      await ingredientService.deleteItem(id)
      await updateIngredients()
      await tick()
      showNotification('Ingrediente eliminado', 'success')
    } catch (err: any) {
      const msg =
        err.response?.data?.error || err.error || err.message || 'Error al eliminar ingrediente'
      showNotification(msg, 'error')
    } finally {
      isLoading = false
    }
  }
</script>

<Loader {isLoading} />

<div class="title-buttons-flex">
  <h1>Ingredientes</h1>
  <Button label="Nuevo Ingrediente" variant="primary" onClick={addIngredient} />
</div>

<Table ingredients={ingredientsList} editable={true} on:deleteItem={handleDeleteItem} />
