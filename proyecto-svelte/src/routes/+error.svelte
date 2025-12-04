<script lang="ts">
  let notFoundError = '/images/not-found-img.png'
  let genericErrorImage = '/images/generic-error-img.png'
  import { page } from '$app/state'
  import './error.css'
</script>

<section class="error">
  <img
    src={page.status === 404 ? notFoundError : genericErrorImage}
    alt={`${page.status} error: ${page.error?.message ?? 'Algo salió mal.'}`}
  />

  <p class="error-info">
    <span class="status">{`Error ${page.status}:`}</span>
    <span>{page.error?.message ?? 'Algo salió mal.'}</span>
  </p>

 <a href="/">Ir al menú</a>
</section>