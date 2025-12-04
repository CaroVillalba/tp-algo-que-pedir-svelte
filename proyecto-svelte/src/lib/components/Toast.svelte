<script lang="ts">
  import { notifications } from '../../stores/notificationStore'

  let {
    message,
    type = 'success',
    id
  } = $props<{
    message: string
    type?: 'success' | 'error' | 'info'
    id: number
  }>()

  const close = () => {
    notifications.update((n) => n.filter((notif) => notif.id !== id))
  }
</script>

<div
  class="toast-container"
  class:toast-success={type === 'success'}
  class:toast-error={type === 'error'}
  class:toast-info={type === 'info'}
>
  <span class="icon">{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
  <p class="message">{message}</p>
  <button class="close-btn" onclick={close}>X</button>
</div>

<style>
  .toast-container {
    margin: 0.25rem 0;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    box-shadow: 0 0.25rem 0.75rem var(--shadow-light);
    display: flex;
    align-items: center;
    width: clamp(20rem, 70vw, 30rem);
    background-color: var(--color-background);
    color: var(--color-dark);
    border-left: 0.3125rem solid var(--color-primary);
    pointer-events: auto;
  }

  .toast-success,
  .toast-error {
    background-color: var(--color-background);
    border-left-color: var(--color-primary);
    color: var(--color-dark);
    box-shadow: 0 0.25rem 0.75rem var(--shadow-light);
  }

  .icon {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }

  .message {
    font-size: 1rem;
    margin: 0;
    flex-grow: 1;
    text-align: left;
    margin-right: 1rem;
    white-space: pre-wrap;
  }

  .close-btn {
    font-size: 1rem;
    background: transparent;
    border: none;
    color: var(--color-primary);
    cursor: pointer;
    opacity: 0.7;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .close-btn:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  .close-btn:active {
    transform: scale(0.95);
  }

  @media screen and (min-width: 401px) and (max-width: 768px) {
    .toast-container {
      width: 50vw;
      max-width: none;
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
    }

    .icon {
      font-size: 1rem;
    }

    .message {
      font-size: 0.8rem;
    }

    .close-btn {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 400px) {
    .toast-container {
      width: 90vw;
      max-width: none;
      padding: 0.25rem 0.5rem;
      font-size: 0.9rem;
    }

    .icon {
      font-size: 0.8rem;
    }

    .message {
      font-size: 0.6rem;
    }

    .close-btn {
      font-size: 0.7rem;
    }
  }
</style>
