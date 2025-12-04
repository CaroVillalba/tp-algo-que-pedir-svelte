<script lang="ts">
  let {
    label = 'Button',
    variant = 'primary',
    disabled = false,
    type = 'button',
    fullWidth = false,
    onClick
  } = $props<{
    label?: string
    variant?: 'primary' | 'secondary' | 'outline'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    fullWidth?: boolean
    onClick?: (event: MouseEvent) => void
  }>()
</script>

<button
  class={`${variant}-button ${fullWidth ? 'full-width' : ''}`}
  {type}
  {disabled}
  onclick={onClick}
>
  {label}
</button>

<style>
  .primary-button,
  .secondary-button {
    border: none;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem 2rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .primary-button {
    background-color: var(--color-primary);
    color: var(--color-container);
  }

  .secondary-button {
    background-color: var(--color-background);
    color: var(--color-primary);
    border: 2px solid var(--color-secondary);
  }

  .primary-button:hover,
  .secondary-button:hover {
    box-shadow: 0 4px 8px var(--shadow-hover);
    transform: translateY(-2px);
  }

  .primary-button:active,
  .secondary-button:active {
    transform: translateY(2px);
    box-shadow: 0 2px 4px var(--shadow-hover);
  }

  .full-width {
    width: 100%;
  }

  @media screen and (min-width: 401px) and (max-width: 768px) {
    .primary-button,
    .secondary-button {
      width: 100%;
    }
  }

  @media screen and (max-width: 400px) {
    .primary-button,
    .secondary-button {
      width: 100%;
    }
  }
</style>
