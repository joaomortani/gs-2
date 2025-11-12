export function trimString(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

export function validateName(name: string): void {
  if (name.length < 2 || name.length > 80) {
    throw new Error('Name must be between 2 and 80 characters');
  }
}

export function validateTitle(title: string): void {
  if (title.length < 2 || title.length > 120) {
    throw new Error('Title must be between 2 and 120 characters');
  }
}

export function validateDescription(description: string): void {
  if (description.length > 1000) {
    throw new Error('Description must be at most 1000 characters');
  }
}

export function validateOrderIndex(orderIndex: number): void {
  if (!Number.isInteger(orderIndex) || orderIndex < 1) {
    throw new Error('OrderIndex must be an integer >= 1');
  }
}

