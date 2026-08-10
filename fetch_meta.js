const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/studio',
  'http://localhost:3000/archive',
  'http://localhost:3000/collections',
  'http://localhost:3000/about',
  'http://localhost:3000/saved'
];

async function getMeta() {
  for (const url of urls) {
    const res = await fetch(url);
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/);
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/);
    console.log(`\nURL: ${url}`);
    console.log(`Title: ${titleMatch ? titleMatch[1] : 'None'}`);
    console.log(`Description: ${descMatch ? descMatch[1] : 'None'}`);
  }
}

getMeta();
