export abstract class BaseUseCase<TInput, TOutput> {
  abstract execute(input: TInput): Promise<TOutput>;
  protected handleError(error: unknown, action: string): void {
    if (error instanceof Error) {
      throw new Error(`${action}: ${error.message}`);
    } else {
      throw new Error(`${action}: Unknown error`);
    }
  }
}
