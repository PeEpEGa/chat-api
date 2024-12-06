import axios from "axios";
import { IQuoteService } from "./interfaces/quote-service.interface";

export class QuoteService implements IQuoteService {
  private readonly apiUrl: string;

  constructor(apiUrl: string = "https://zenquotes.io/api/random/[your_key]") {
    this.apiUrl = apiUrl;
  }

  async getQuote(): Promise<string> {
    try {
      const response = await axios.get(this.apiUrl);

      const data = response.data as { q: string; a: string }[];
      if (data.length === 0) {
        throw new Error("No quotes available");
      }

      return data[0].q;
    } catch (error) {
      console.error("Error fetching quote:", error);
      throw new Error("Failed to fetch quote");
    }
  }
}
