import { writable } from 'svelte/store'

interface Notification {
  id: number,
  message: string,
  type: 'error' | 'info' | 'success',
}

export const notifications = writable<Notification[]>([])

let nextId = 0

export function showNotification(
  message: string,
  type: 'error' | 'info' | 'success' = 'success',
  duration: number = 3000
) {
  const id = Date.now() + nextId++

  notifications.update(n => [...n, { id, message, type }])

  setTimeout(() => {
    notifications.update(n => n.filter(notif => notif.id !== id))
  }, duration)
}