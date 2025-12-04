<script lang="ts">
  import { Eye, PencilSimple, Trash, Avocado, Cow } from 'phosphor-svelte'
  import { goto } from '$app/navigation'
  import { createEventDispatcher } from 'svelte'
  import TableRow from './TableRow.svelte'

  import type { Ingredient } from '../../types/Ingredient'

  let { ingredients = $bindable(), editable = $bindable(false) } = $props()

  const dispatch = createEventDispatcher()

  let groupDictionary: Record<string, string> = {
    FRUTAS_Y_VERDURAS: 'Frutas y Verduras',
    PROTEINAS: 'Proteínas',
    LACTEOS: 'Lácteos',
    CEREALES_Y_TUBERCULOS: 'Cereales y Tubérculos',
    AZUCARES_Y_DULCES: 'Azúcares y Dulces',
    GRASAS_Y_ACEITES: 'Grasas y Aceites'
  }

  // Funciones para manejar las acciones (falta trabajarlo)
  function seeDetails(index: Number, event: MouseEvent): void {
    console.log('Ver detalles de la fila ', index)
  }

  function deleteItems(e: CustomEvent): void {
    let id = e.detail.id
    ingredients = ingredients.filter((item: any) => item.id !== id)
    dispatch('deleteItem', { id })
  }
</script>

<div class="section-table">
  <table class="table-ingredients">
    <thead>
      <tr>
        <th class="table-col-nombre">Nombre</th>
        <th class="table-col-precio">Costo</th>
        <th class="table-col-grupo">Grupo alimenticio</th>
        <th class="table-col-origen">Origen</th>
        <th class="table-col-acciones">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each ingredients as ingredient, index}
        <TableRow {ingredient} {editable} on:deleteItem={deleteItems}></TableRow>
      {/each}
    </tbody>
  </table>
</div>

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

  .table-ingredients th,
  .table-ingredients td {
    border-top: var(--color-border) solid 1px;
    border-radius: 5%;
    padding: 1rem 0.5rem 1rem 0.5rem;
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
