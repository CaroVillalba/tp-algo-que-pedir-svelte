<script lang="ts">
  import Loader from '$lib/components/Loader.svelte'
  import Button from '$lib/components/Button.svelte'
  import { MapPin, CreditCard, QrCode, Money } from 'phosphor-svelte'
  import './order.css'
  import type { Order } from '../../../types/Order'
  import { onMount, tick } from 'svelte'
  import { orderService } from '$lib/services/OrderService.ts'
  import { showNotification } from '../../../stores/notificationStore'
  import { get } from 'svelte/store'

  const token = 'MOCK_VALID_TOKEN'

  let selectedTab = $state('Todos')
  let orders = $state<Order[]>([])

  let isLoading = $state(true)

  onMount(async () => {
    isLoading = true
    try {
      const responseData = await orderService.getAllOrder(token)
      orders = responseData
      await tick()
      await new Promise((r) => setTimeout(r, 150))
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudieron cargar los pedidos.'
      showNotification(`Error al cargar pedidos: ${msg}`, 'error')
    } finally {
      isLoading = false
    }
  })

  async function getOrders(state: string) {
    isLoading = true
    try {
      orders = await orderService.getByStateOrder(state)
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudieron filtrar los pedidos.'
      showNotification(`Error al filtrar pedidos: ${msg}`, 'error')
    } finally {
      isLoading = false
    }
  }

  async function getAll() {
    isLoading = true
    try {
      const responseData = await orderService.getAllOrder(token)
      orders = responseData
    } catch (err: any) {
      showNotification(`Error al cargar pedidos: ${err.message}`, 'error')
    } finally {
      isLoading = false
    }
  }

  async function updateOrder(order: Order) {
    try {
      const updatedOrder = await orderService.updateOrderState(order.id)
      orders = orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudo actualizar el pedido.'
      showNotification(`No se pudo actualizar el pedido: ${msg}`, 'error')
    } finally {
      //TODO ocultar loader
      isLoading = false
      getOrders(selectedTab)
    }
  }

  const pendingDeletions = new Set<number>()

  async function deleteOrder(order: Order) {
    if (!pendingDeletions.has(order.id)) {
      pendingDeletions.add(order.id)
      showNotification(
        `Vas a eliminar el pedido #${order.id}. Volvé a presionar el botón para confirmar.`,
        'info'
      )

      setTimeout(() => pendingDeletions.delete(order.id), 5000)
      return
    }

    try {
      await orderService.deleteOrder(order.id)
      orders = orders.filter((o) => o.id !== order.id)
      showNotification(`Pedido #${order.id} eliminado correctamente.`, 'success')
    } catch (err: any) {
      const msg = err.response?.data?.error || 'No se pudo eliminar el pedido.'
      showNotification(`No se pudo eliminar el pedido: ${msg}`, 'error')
    } finally {
      pendingDeletions.delete(order.id)
    }
  }
</script>

<Loader {isLoading} />

<h1>Pedidos actuales</h1>

<nav class="orders">
  <a
    href="?state={selectedTab}"
    class={selectedTab === 'Todos' ? 'activeOrders' : 'disabledOrders'}
    onclick={() => ((selectedTab = 'Todos'), getAll())}>Todos</a
  >
  <a
    href="?state={selectedTab}"
    class={selectedTab === 'Pendiente' ? 'activeOrders' : 'disabledOrders'}
    onclick={() => ((selectedTab = 'Pendiente'), getOrders('Pendiente'))}>Pendientes</a
  >
  <a
    href="?state={selectedTab}"
    class={selectedTab === 'Preparado' ? 'activeOrders' : 'disabledOrders'}
    onclick={() => ((selectedTab = 'Preparado'), getOrders('Preparado'))}>Preparados</a
  >
  <a
    href="?state={selectedTab}"
    class={selectedTab === 'Entregado' ? 'activeOrders' : 'disabledOrders'}
    onclick={() => ((selectedTab = 'Entregado'), getOrders('Entregado'))}>Entregados</a
  >
  <a
    href="?state={selectedTab}"
    class={selectedTab === 'Cancelado' ? 'activeOrders' : 'disabledOrders'}
    onclick={() => ((selectedTab = 'Cancelado'), getOrders('Cancelado'))}>Cancelados</a
  >
</nav>

<hr />

{#if orders.length === 0}
  {#if selectedTab === 'Cancelado' || selectedTab === 'Entregado'}
    <div class="no-orders-message">
      <strong>No hay nada que ver acá</strong>
    </div>
  {:else}
    <div class="no-orders-message">
      <strong>Ahora mismo no hay pedidos para mostrar</strong>
      <p class="no-orders-bottom-text">Espere, podrían llegar en cualquier momento.</p>
    </div>
  {/if}
{:else}
  <section class="card-container order-user">
    {#each orders as order}
      <a class="order-card" href={`./order-detail?id=${order.id}&prev=${selectedTab}`}>
        <header class="order-header">
          <h2 class="h2">Pedido #{order.id}</h2>
        </header>

        <section class="order-user">
          <img src="/images/foto-perfil-Pedidos.jpeg" alt="Avatar" class="order-avatar" />
          <div class="order-user-info">
            <span class="order-name">{order.user.name}</span>
            <p class="order-username">
              <strong>usuario</strong>
              {order.user.username}
            </p>
          </div>
        </section>

        <info>
          Hora: {order.time.slice(0, 5)} | Artículos: {order.quantity} | Total: ${order.total}
        </info>

        <section class="order-location">
          <div class="order-icon-container">
            <MapPin size={20} weight="fill" />
          </div>
          <address class="order-location-info">
            <span class="order-address">{order.direction.street} {order.direction.number}</span>
            <span>Lat: {order.direction.coordinates.x} Lon: {order.direction.coordinates.y}</span>
          </address>
        </section>

        <section class="order-payment">
          {#if order.paymentMethod === 'EFECTIVO'}
            <Money size={20} weight="fill" />
          {:else if order.paymentMethod === 'DEBITO'}
            <CreditCard size={20} weight="fill" />
          {:else}
            <QrCode size={20} weight="fill" />
          {/if}
          <span class="order-payment-info">Pago con {order.paymentMethod}</span>
        </section>
        {#if order.state === 'PENDIENTE'}
          <Button
            label="Preparar"
            variant="primary"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              updateOrder(order)
            }}
          />
        {:else if order.state === 'PREPARADO'}
          <Button
            label="Entregar"
            variant="primary"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              updateOrder(order)
            }}
          />
        {:else}
          <Button
            label="Descartar"
            variant="primary"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              deleteOrder(order)
            }}
          />
        {/if}
      </a>
    {/each}
  </section>
{/if}
