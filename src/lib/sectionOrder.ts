export const CUSTOM_ORDER_PREFIX = 'custom:';

export type CustomOrderItem = `${typeof CUSTOM_ORDER_PREFIX}${string}`;

export function createCustomOrderItem(id: string): CustomOrderItem {
  return `${CUSTOM_ORDER_PREFIX}${id}` as CustomOrderItem;
}

export function isCustomOrderItem(item: string): item is CustomOrderItem {
  return item.startsWith(CUSTOM_ORDER_PREFIX);
}

export function getCustomOrderItemId(item: string): string {
  return item.slice(CUSTOM_ORDER_PREFIX.length);
}

export function resolveSectionOrder<TBuiltIn extends string>(
  storedOrder: readonly (TBuiltIn | CustomOrderItem)[],
  builtInItems: readonly TBuiltIn[],
  customIds: readonly string[],
): Array<TBuiltIn | CustomOrderItem> {
  const builtInSet = new Set<string>(builtInItems);
  const customSet = new Set(customIds);
  const resolved: Array<TBuiltIn | CustomOrderItem> = [];
  const seen = new Set<string>();

  for (const item of storedOrder) {
    if (builtInSet.has(item) && !seen.has(item)) {
      resolved.push(item);
      seen.add(item);
      continue;
    }

    if (isCustomOrderItem(item)) {
      const id = getCustomOrderItemId(item);
      if (customSet.has(id) && !seen.has(item)) {
        resolved.push(item);
        seen.add(item);
      }
    }
  }

  for (const item of builtInItems) {
    if (!seen.has(item)) {
      resolved.push(item);
      seen.add(item);
    }
  }

  for (const id of customIds) {
    const customItem = createCustomOrderItem(id);
    if (!seen.has(customItem)) {
      resolved.push(customItem);
      seen.add(customItem);
    }
  }

  return resolved;
}
