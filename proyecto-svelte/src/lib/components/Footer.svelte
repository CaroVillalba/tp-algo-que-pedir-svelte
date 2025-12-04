<script lang="ts">
  import { CookingPot, ShoppingCart, ForkKnife, BowlFood, User } from 'phosphor-svelte'
</script>

<footer class="below-header">
  <nav class="below-header-items">
    <a href="#top">
      <CookingPot size={24} weight="bold" color="var(--color-logo)" />
    </a>
    <a href="../main/order"><ShoppingCart size={24} weight="bold" /></a>
    <a href="../main/menu"><ForkKnife size={24} weight="bold" /></a>
    <a href="../main/ingredients"><BowlFood size={24} weight="bold" /></a>
    <a href="../main/account"><User size={24} weight="bold" /></a>
  </nav>
</footer>

<style>
  .below-header {
    display: none;
    background-color: var(--color-section-bg);
    padding: 0.3rem;
    box-shadow: 0 2px 4px var(--shadow-light);
    position: sticky;
    bottom: 0;
    width: 100vw;
    z-index: 1000;
    box-sizing: border-box;
  }

  .below-header-items {
    display: flex;
    justify-content: space-around;
  }

  .below-header-items a {
    color: var(--color-dark);
    text-decoration: none;
    font-size: 1.5rem;
  }

  @media screen and (max-width: 400px) {
    .below-header {
      display: block;
    }
  }
</style>
