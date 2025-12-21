/**
 * Offline Action Queue
 * 
 * Queues actions (likes, comments, etc.) when offline
 * and syncs them when connection is restored
 */

import { getDB } from '../storage/db'

// ============================================
// Types
// ============================================

export type ActionType = 'like' | 'unlike' | 'save' | 'unsave' | 'comment' | 'report'

export interface QueuedAction {
  id: string
  type: ActionType
  payload: Record<string, unknown>
  createdAt: number
  retries: number
  lastError?: string
}

export interface SyncResult {
  success: boolean
  action: QueuedAction
  error?: string
}

// ============================================
// Queue Operations
// ============================================

/**
 * Generate unique action ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Add action to offline queue
 */
export async function queueAction(
  type: ActionType,
  payload: Record<string, unknown>
): Promise<string> {
  const db = await getDB()
  const id = generateId()
  
  const action: QueuedAction = {
    id,
    type,
    payload,
    createdAt: Date.now(),
    retries: 0,
  }
  
  await db.put('actionQueue', action)
  console.log('[OfflineQueue] Action queued:', type, id)
  
  // Try to trigger background sync if available
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    try {
      const reg = await navigator.serviceWorker.ready
      await (reg as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register('sync-actions')
    } catch {
      // Background sync not available, will sync on reconnect
    }
  }
  
  return id
}

/**
 * Get all pending actions
 */
export async function getPendingActions(): Promise<QueuedAction[]> {
  const db = await getDB()
  const tx = db.transaction('actionQueue', 'readonly')
  const index = tx.store.index('by-createdAt')
  
  const actions: QueuedAction[] = []
  let cursor = await index.openCursor()
  
  while (cursor) {
    actions.push(cursor.value)
    cursor = await cursor.continue()
  }
  
  return actions
}

/**
 * Get pending action count
 */
export async function getPendingActionCount(): Promise<number> {
  const db = await getDB()
  return db.count('actionQueue')
}

/**
 * Remove action from queue
 */
export async function removeAction(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('actionQueue', id)
}

/**
 * Update action retry count
 */
export async function updateActionRetry(
  id: string,
  error?: string
): Promise<void> {
  const db = await getDB()
  const action = await db.get('actionQueue', id)
  
  if (action) {
    action.retries += 1
    action.lastError = error
    await db.put('actionQueue', action)
  }
}

/**
 * Clear all pending actions
 */
export async function clearActionQueue(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('actionQueue', 'readwrite')
  await tx.store.clear()
  await tx.done
}

// ============================================
// Sync Operations
// ============================================

export interface ActionHandler {
  (action: QueuedAction): Promise<void>
}

const actionHandlers: Map<ActionType, ActionHandler> = new Map()

/**
 * Register handler for action type
 */
export function registerActionHandler(
  type: ActionType,
  handler: ActionHandler
): void {
  actionHandlers.set(type, handler)
}

/**
 * Sync a single action
 */
async function syncAction(action: QueuedAction): Promise<SyncResult> {
  const handler = actionHandlers.get(action.type)
  
  if (!handler) {
    console.warn('[OfflineQueue] No handler for action type:', action.type)
    return {
      success: false,
      action,
      error: `No handler for action type: ${action.type}`,
    }
  }
  
  try {
    await handler(action)
    await removeAction(action.id)
    console.log('[OfflineQueue] Action synced:', action.type, action.id)
    return { success: true, action }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await updateActionRetry(action.id, errorMessage)
    console.error('[OfflineQueue] Action sync failed:', action.type, errorMessage)
    return { success: false, action, error: errorMessage }
  }
}

/**
 * Sync all pending actions
 */
export async function syncAllActions(): Promise<SyncResult[]> {
  const actions = await getPendingActions()
  
  if (actions.length === 0) {
    console.log('[OfflineQueue] No pending actions to sync')
    return []
  }
  
  console.log('[OfflineQueue] Syncing', actions.length, 'actions')
  
  const results: SyncResult[] = []
  
  // Process actions sequentially to maintain order
  for (const action of actions) {
    // Skip actions with too many retries
    if (action.retries >= 5) {
      console.warn('[OfflineQueue] Skipping action with too many retries:', action.id)
      await removeAction(action.id) // Remove failed action
      results.push({
        success: false,
        action,
        error: 'Max retries exceeded',
      })
      continue
    }
    
    const result = await syncAction(action)
    results.push(result)
    
    // Small delay between actions to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return results
}

// ============================================
// Auto-sync on reconnect
// ============================================

let syncInProgress = false

/**
 * Handle online event - sync pending actions
 */
export function setupAutoSync(): () => void {
  const handleOnline = async () => {
    if (syncInProgress) return
    
    console.log('[OfflineQueue] Online - starting sync')
    syncInProgress = true
    
    try {
      await syncAllActions()
    } finally {
      syncInProgress = false
    }
  }
  
  // Listen for online event
  window.addEventListener('online', handleOnline)
  
  // Listen for custom sync event from SW
  window.addEventListener('sync-offline-actions', handleOnline)
  
  // Sync immediately if online
  if (navigator.onLine) {
    handleOnline()
  }
  
  // Cleanup
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('sync-offline-actions', handleOnline)
  }
}

