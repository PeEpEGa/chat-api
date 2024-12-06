export function handleRepositoryError(action: string, error: unknown): never {
  if (error instanceof Error) {
    throw new Error(`Error ${action}: ${error.message}`);
  } else {
    throw new Error(`Error ${action}: Unknown error`);
  }
}
