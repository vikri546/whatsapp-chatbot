import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchUrlContent = async (url: string): Promise<string | null> => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);
    $('script, style, nav, footer, header, aside, form').remove();
    const text = $('body').text().replace(/\s\s+/g, ' ').trim();
    return text.substring(0, 8000);

  } catch (error) {
    console.error(`Error fetching URL for analysis: ${url}`, error);
    return null;
  }
};
