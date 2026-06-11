import logger from "../../utils/logger";

export interface SearchInput {
  query: string;

  limit?: number;
}

export interface SearchResult {
  title: string;

  snippet: string;

  url: string;
}

export async function searchTool(
  input: SearchInput
): Promise<SearchResult[]> {
  try {
    logger.info(`Search tool called: ${input.query}`);

    const limit = input.limit || 3;

    // MOCK RESULTS (replace with real API later)
    const results: SearchResult[] = Array.from(
      { length: limit }
    ).map((_, i) => ({
      title: `Result ${i + 1} for "${input.query}"`,

      snippet: `This is a simulated result about ${input.query}.`,

      url: `https://example.com/search?q=${encodeURIComponent(
        input.query
      )}&r=${i + 1}`,
    }));

    return results;
  } catch (err) {
    logger.error("Search tool error:", err);
    return [];
  }
}
