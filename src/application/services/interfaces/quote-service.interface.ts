export interface IQuoteService {
  getQuote(): Promise<string>;
}
