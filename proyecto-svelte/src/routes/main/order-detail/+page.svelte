<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Loader from '$lib/components/Loader.svelte'
  import type { Dish } from '../../../types/Dish.ts'
  import type { Order } from '../../../types/Order.ts'
  import { MapPin, CreditCard, QrCode, Money } from 'phosphor-svelte'
  import './order-detail.css'
  import { goto } from '$app/navigation'
  import { onMount, tick } from 'svelte'
  import { orderService } from '../../../lib/services/OrderService.ts'

  let idActive = $state(0)
  let hasError = $state(false)
  let errorMessage = $state('')
  let isLoading = $state(true)
  let prev = $state('')

  let order = $state<Order>({
    comission: 0,
    increment: 0,
    id: 0,
    user: { name: '', username: '', id: 0, password: '', surname: '', mail: '' },
    time: '',
    dishes: [],
    direction: { street: '', number: '', coordinates: { x: 0, y: 0 } },
    paymentMethod: 'EFECTIVO',
    quantity: 0,
    total: 0,
    subtotal: 0,
    state: ''
  })

  let dishes = $derived<Dish[]>(order ? (order.dishes as Dish[]) : [])

  function handleClick() {
    goto(`./order?state=${prev}`)
  }

  onMount(async () => {
    const param = new URL(window.location.href).searchParams.get('id')
    prev = new URL(window.location.href).searchParams.get('prev') ?? ''
    idActive = param ? +param : 0

    try {
      const result = await orderService.getByIdOrderDetail(idActive)
      Object.assign(order, result)
      hasError = false
      await tick()
    } catch (error: any) {
      hasError = true
      errorMessage =
        error?.response?.data?.message ||
        'No se pudo cargar el pedido. Puede que el servidor esté apagado o el ID sea incorrecto.'
      console.error('Error cargando pedido:', errorMessage)
    } finally {
      isLoading = false
    }
  })
</script>

<Loader {isLoading} />

{#if hasError}
  <div class="error-screen">
    <h2>{errorMessage}</h2>
    <p>Por favor, verificá el ID del pedido o volvé al listado.</p>
    <Button label="Volver" variant="primary" onClick={handleClick} />
  </div>
{:else}
  <section class="order">
    <h1>Pedido #{order.id}</h1>
    <div class="group">
      <span class="responsive-state">Estado del Pedido</span>
      <span class="pending">{order.state}</span>
    </div>
  </section>
  <section class="container-wrapper">
    <section class="container-table">
      <table class="responsive-table">
        <thead>
          <tr>
            <th class="container-order-title responsive-head">Cliente</th>
            <th class="container-order-title">Direccion entrega</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="responsive-head" data-label="Cliente">
              <div class="plate-detail">
                <img src="/images/foto-perfil-Pedidos.jpeg" alt="Avatar" class="order-avatar" />
                <div>
                  <span>{order.user.name}</span>
                  <span class="description responsive-description">{order.user.username}</span>
                </div>
              </div>
            </td>
            <td data-label="Direccion entrega">
              <div class="plate-detail">
                <MapPin size={20} weight="fill" />
                <div class="client-information">
                  <span>{order.direction.street}</span><br />
                  <span class="description responsive-description"
                    >Lat: {order.direction.coordinates.x}, Lon: {order.direction.coordinates
                      .y}</span
                  >
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <section class="container-table">
      <h3>Resumen del Pedido</h3>
      <section class="container-order-table">
        <table>
          <thead>
            <tr>
              <th class="container-order-title column">Plato</th>
              <th class="container-order-title column1 theader">Cant.</th>
              <th class="container-order-title column1">Precio</th>
            </tr>
          </thead>
          <tbody>
            {#each dishes as dish}
              <tr>
                <td class="menu-item">
                  <img class="icon-item" src={dish.imageUrl} alt="icon" />
                  <span>
                    {dish.name}
                    <span class="description">{dish.description}</span>
                  </span>
                </td>
                <td>
                  <span class="responsive-description cant-number">
                    {dish.quantity}
                  </span>
                </td>
                <td>
                  <span class="responsive-description cant-number">
                    ${dish.price.toFixed(2)}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
    </section>
    <section class="container-table">
      <h3 class="container-order-title">Pago</h3>

      <div class="pay">
        <span>Subtotal</span>
        <span>${order.subtotal}</span>
      </div>
      <div class="pay">
        <span>Comisión del delivery</span>
        <span>${order.comission}</span>
      </div>
      <div class="pay">
        <span>Incremento por tipo de pago</span>
        <span>${order.increment}</span>
      </div>
      <div class="pay">
        <span>Total</span>
        <span>${order.total}</span>
      </div>
      <div class="pay-method">
        <h3>Método de Pago</h3>
        <div class="method">
          {#if order.paymentMethod === 'EFECTIVO'}
            <Money size={20} weight="fill" />
          {:else if order.paymentMethod === 'DEBITO'}
            <CreditCard size={20} weight="fill" />
          {:else}
            <QrCode size={20} weight="fill" />
          {/if}
          <span>{order.paymentMethod}</span>
        </div>
      </div>
    </section>
    <div class="container-button">
      <Button label="Volver" variant="primary" onClick={handleClick} />
    </div>
  </section>
{/if}
