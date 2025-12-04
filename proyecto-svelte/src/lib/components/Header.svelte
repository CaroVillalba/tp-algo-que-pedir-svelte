<script lang="ts">
  import { goto } from '$app/navigation'
  import { ChefHat, List } from 'phosphor-svelte'
  import { onMount } from 'svelte'

  let activeTab = $state('') //
  let userImage = '/images/foto-perfil.jpeg'

  let navMenu = $state(false)
  let userMenu = $state(false)

  function toggleNavMenu() {
    navMenu = !navMenu
    if (userMenu) {
      userMenu = false
    }
  }

  function toggleUserMenu() {
    userMenu = !userMenu
    if (navMenu) {
      navMenu = false
    }
  }

  function handleLogOut() {
    goto('../../auth/login')
    userMenu = false
  }

  onMount(async () => {
    activeTab = window.location.pathname.split('/').pop() ?? ''
  })
</script>

<header class="header">
  <div class="logo">
    <ChefHat size={32} weight="bold" />
    <span>Algo que Pedir</span>
  </div>
  <nav>
    <a
      href="../main/order"
      class={activeTab === 'order' ? 'active' : 'menu-item-inactive'}
      onclick={() => (activeTab = 'order')}>Pedidos</a
    >
    <a
      href="../main/menu"
      class={activeTab === 'menu' ? 'active' : 'menu-item-inactive'}
      onclick={() => (activeTab = 'menu')}>Menú</a
    >
    <a
      href="../main/ingredients"
      class={activeTab === 'ingredients' ? 'active' : 'menu-item-inactive'}
      onclick={() => (activeTab = 'ingredients')}>Ingredientes</a
    >
    <a
      href="../main/account"
      class={activeTab === 'account' ? 'active' : 'menu-item-inactive'}
      onclick={() => (activeTab = 'account')}>Cuenta</a
    >
    <button class="expandable-menu-button" type="button" aria-label="Menu" onclick={toggleNavMenu}>
      <List size={24} weight="bold" />
    </button>
  </nav>
  <div class = "user-menu-container">
    <div class="user-profile" onclick={toggleUserMenu}>
      <img src={userImage} alt="User Profile" />
    </div>
    <div class="user-dropdown-menu" class:open={userMenu}>
      <div class= "menu-header">Mi Cuenta</div>
      <button class= "logout-button" type="button" onclick={handleLogOut}>Cerrar sesión</button>
  </div>
  </div>
</header>

<div id="expandable-menu" class={navMenu ? 'unfolded-menu' : 'folded-menu'}>
  <a
    href="../main/order"
    class={'menu-item-inactive'}
    onclick={() => {
      activeTab = 'order'
      navMenu = false
    }}>Pedidos</a
  >

  <a
    href="../main/menu"
    class={'menu-item-inactive'}
    onclick={() => {
      activeTab = 'menu'
      navMenu = false
    }}>Menú</a
  >

  <a
    href="../main/ingredients"
    class={'menu-item-inactive'}
    onclick={() => {
      activeTab = 'ingredients'
      navMenu = false
    }}>Ingredientes</a
  >

  <a
    href="../main/account"
    class={'menu-item-inactive'}
    onclick={() => {
      activeTab = 'account'
      navMenu = false
    }}>Cuenta</a
  >
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 89vw;
    max-width: 62.5rem;
    background-color: var(--color-container);
    border-bottom: 1px solid var(--color-border-bottom);
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 8px var(--shadow-light);
    gap: 1rem;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .logo {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--color-logo);
    gap: 0.5rem;
  }

  nav {
    display: flex;
    font-size: 1rem;
    gap: 1.5rem;
    justify-content: flex-end;
    float: right;
    width: 100%;
  }

  nav a {
    text-decoration: none;
    color: var(--color-text-light);
    font-weight: 500;
    transition: color 0.2s ease-in-out;
  }

  nav a:hover {
    color: var(--color-primary);
  }

  nav a.active {
    color: var(--color-primary);
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: 0.25rem;
    font-weight: 700;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    cursor: pointer;
  }

  .user-profile img {
    height: 2rem;
    width: 2rem;
    border-radius: 9999px;
  }

  .user-profile:hover img {
    border-color: var(--color-primary);
  }

  .user-menu-container {
    position: relative;
    z-index: 1100;
  }
  

  .user-dropdown-menu {
    position: absolute;
    top: 200%;
    right: 0;
    width: 10rem;
    background-color: var(--color-container);
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px var(--color-primary-light);
    padding-top: 0.5rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: height 0.3s ease;
  }

  .user-dropdown-menu.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .menu-header {
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--color-border-bottom);
    color: var(--color-text-light);
  }
  

  .logout-button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-light);
    gap: 0.5rem;
    transition: height 0.3s ease;
  }

  .logout-button:hover {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
  }


  .expandable-menu-button {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-dark);
  }

  #expandable-menu {
    position: fixed;
    display: block;
    top: -11.5rem;
    width: 80%;
    height: 0rem;
    background-color: var(--color-container);
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px var(--shadow-light);
    transition: height 0.3s ease;
    overflow: hidden;
  }

  #expandable-menu a {
    display: block;
    text-decoration: none;
    color: var(--color-text-light);
    font-weight: 500;
    transition: color 0.2s ease-in-out;
    padding: 0.5rem;
  }

  #expandable-menu a:hover {
    color: var(--color-primary);
  }

  #expandable-menu a:active {
    color: var(--color-primary);
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: 0.25rem;
    font-weight: 700;
  }

  @media screen and (max-width: 400px) {
    .header {
      display: none;
    }

    #expandable-menu {
      display: none;
    }
  }

  @media screen and (min-width: 401px) and (max-width: 768px) {
    .expandable-menu-button {
      display: block;
    }

    .header {
      z-index: 1000;
      background-color: var(--color-container);
    }

    #expandable-menu.unfolded-menu {
      display: block;
      position: fixed;
      top: 8rem;
      height: 9rem;
    }
  }

  @media screen and (min-width: 768px) {
    #expandable-menu {
      display: none;
    }
  }
</style>
