<script lang="ts">
  import { Eye, PencilSimple, Trash, Avocado, Cow } from 'phosphor-svelte'
  import { goto } from '$app/navigation'
  import { createEventDispatcher } from 'svelte'
  import type { Ingredient } from '../../types/Ingredient'

  let { ingredient = $bindable(), editable = $bindable(false) } = $props()

  let groupDictionary: Record<string, string> = {
    FRUTAS_Y_VERDURAS: 'Frutas y Verduras',
    PROTEINAS: 'Proteínas',
    LACTEOS: 'Lácteos',
    CEREALES_Y_TUBERCULOS: 'Cereales y Tubérculos',
    AZUCARES_Y_DULCES: 'Azúcares y Dulces',
    GRASAS_Y_ACEITES: 'Grasas y Aceites'
  }

  let showDetails = $state(false)

  const dispatch = createEventDispatcher()

  function seeDetails() {
    showDetails = !showDetails
  }

  //puedo hacer un goto y listo
  function editItems(item: any): void {
    console.log('Editar:', item.id)
    goto(`../main/edit-ingredients?id=${item.id}`)
  }

  //middleman pero no quiero desordenar el codigo
  function deleteItems(id: number) {
    dispatch('deleteItem', { id })
  }
</script>

<tr>
  <td class="table-col-nombre table-col-hides">{ingredient.name}</td>
  <td class="table-col-precio"
    >${ingredient.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td
  >
  <td class="table-col-grupo table-col-hides">{groupDictionary[ingredient.group]}</td>
  <td class="table-items table-col-origen">
    {#if ingredient.animalOrigin === true}
      <Cow size={20} weight="bold" />
    {:else}
      <Avocado size={20} weight="bold" />
    {/if}
  </td>
  <td class="table-items">
    <div class="view-button">
      <Eye size={20} weight="bold" onclick={(event) => seeDetails()} />
    </div>
    {#if editable === true}
      <PencilSimple
        size={20}
        weight="bold"
        class="edit-button"
        onclick={() => editItems(ingredient)}
      />
    {/if}
    <Trash
      size={20}
      weight="bold"
      class="delete-button"
      onclick={() => deleteItems(ingredient.id)}
    />
  </td>
</tr>

<tr class={showDetails ? 'table-col-details-show' : 'table-col-details'}>
  <td class="table-col-nombre">Grupo Alimenticio:</td>
  <td class="table-col-price">{groupDictionary[ingredient.group]}</td>
  <td class="table-col-grupo table-col-hides"></td>
  <td class="table-items table-col-origen"></td>
  <td class="table-items"></td>
</tr>

<tr class={showDetails ? 'table-col-details-show' : 'table-col-details'}>
  <td class="table-col-nombre">Origen:</td>
  <td class="table-col-price">
    {#if ingredient.animalOrigin === true}
      <Cow size={20} weight="bold" />
    {:else}
      <Avocado size={20} weight="bold" />
    {/if}
  </td>
  <td class="table-col-grupo table-col-hides"></td>
  <td class="table-items table-col-origen"></td>
  <td class="table-items"></td>
</tr>

<style>
  .section-table {
    color: var(--color-dark);
    background-color: var(--color-section-bg);
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    box-shadow: inset 0 1px 2px var(--color-section-shadow);
  }

  .table-ingredients {
    width: 100%;
    border: var(--color-border) solid 1px;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th,
  td {
    border-top: var(--color-border) solid 1px;
    border-radius: 5%;
    padding: 1rem 0.5rem 1rem 0.5rem;
  }

  th {
    overflow: hidden;
    white-space: wrap;
    text-overflow: ellipsis;
  }

  .table-col-hides {
    overflow: hidden;
    white-space: wrap;
    text-overflow: ellipsis;
  }

  .table-col-grupo {
    width: 20%; /* Ajusta según necesidad */
    text-align: left;
  }
  td.table-items {
    text-align: center;
  }

  .view-button {
    display: none;
  }

  .table-col-details {
    display: none;
  }
  .table-col-details-show {
    display: none;
  }

  @media screen and (min-width: 769px) {
    .view-button {
      display: none;
    }
  }

  @media screen and (min-width: 401px) and (max-width: 768px) {
    .view-button {
      display: inline;
    }
    .table-col-grupo {
      display: none;
    }
    .table-col-origen {
      display: none;
    }
    .table-col-details-show {
      display: table-row;
    }
  }

  @media screen and (max-width: 400px) {
    .view-button {
      display: inline;
    }
    .table-col-grupo {
      display: none;
    }
    .table-col-origen {
      display: none;
    }
    .table-col-details-show {
      display: block;
    }
  }
</style>
