import { AsyncLocalStorage } from 'async_hooks';

export interface ExecutionContext {
  tenantId: string;
  storeId?: string;
  userId?: string;
  roles?: string[];
  permissions?: string[];
}

export const contextStorage = new AsyncLocalStorage<ExecutionContext>();

export function getContext(): ExecutionContext | undefined {
  return contextStorage.getStore();
}

export function runWithContext<T>(context: ExecutionContext, callback: () => T): T {
  return contextStorage.run(context, callback);
}
