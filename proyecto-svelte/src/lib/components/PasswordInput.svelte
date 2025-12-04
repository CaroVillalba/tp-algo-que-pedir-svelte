<script lang="ts">
  import { Eye, EyeSlash } from 'phosphor-svelte'; 

  let { id, label, placeholder, value = $bindable() , maxlength, required } = $props<{
    id: string;
    label: string;
    placeholder: string;
    value: string;
    maxlength: number;
    required: boolean;
  }>();

  let showPassword = $state(false);

  function toggleShowPassword() {
    showPassword = !showPassword;
  }
</script>

<div class="form-group">
  <label for={id}>{label}</label>
  <div class="input-eye">
    <input
      type={showPassword ? 'text' : 'password'}
      {id}
      bind:value
      {placeholder}
      {maxlength}
      {required}
    />
    {#if showPassword}
      <Eye
        size={24}
        weight="bold"
        class="icon-eye"
        onclick={toggleShowPassword}
        aria-label="Ocultar Contraseña"
      />
    {:else}
      <EyeSlash
        size={24}
        weight="bold"
        class="icon-eye"
        onclick={toggleShowPassword}
        aria-label="Mostrar Contraseña"
      />
    {/if}
  </div>
</div>