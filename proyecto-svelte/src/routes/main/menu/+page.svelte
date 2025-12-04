<script lang="ts">
  import type { Dish } from '../../../types/Dish.ts'
  import Button from '$lib/components/Button.svelte'
  import Loader from '$lib/components/Loader.svelte'
  import './menu.css'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { dishService } from '$lib/services/DishService.ts'
  import { showNotification } from '../../../stores/notificationStore.ts'

  let isLoading = $state(true)

  let dishes = $state<Dish[]>([])

  function addPlate() {
    goto('./edit-plate')
  }

  function editPlate(dishId: number) {
    goto(`./edit-plate?id=${dishId}`)
  }

  onMount(() => {
    const localId = sessionStorage.getItem('localId')
    if (!localId) {
      goto('./account')
      return
    }
  })

  onMount(async () => {
    isLoading = true
    try {
      const localId = Number(sessionStorage.getItem('localId'))

      if (!localId)
        showNotification('ID del local no encontrado. Por favor, configura tu cuenta.', 'error')

      const responseData = await dishService.getByLocal(localId)

      if (!responseData || responseData.length === 0) {
        dishes = []
        showNotification('Aún no agregaste platos a tu local.', 'info')
        return
      }

      dishes = responseData
    } catch (error: any) {
      const backendMessage = error.response?.data?.error || 'Error al cargar los platos'
      showNotification(backendMessage, 'error')
    } finally {
      isLoading = false
    }
  })
</script>

<Loader {isLoading} />

<section class="container-width">
  <section class="subheader">
    <h1>Gestión del menú</h1>
    <Button label="Agregar nuevo plato" variant="primary" onClick={addPlate} />
  </section>

  <h2 class="subtitle">Platos Disponibles</h2>

  <section class="container">
    <table class="section-table">
      <tbody>
        {#each dishes as dish}
          <tr class="dish-row" onclick={() => editPlate(dish.id)}>
            <td class="menu-item">
              <img class="icon-item" src={dish.imageUrl} alt="icon" />
              <span>
                {dish.name}
                <span class="description">{dish.description}</span>
              </span>
            </td>
            <td>${dish.price}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</section>
