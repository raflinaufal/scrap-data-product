import axios from "axios";
import * as cheerio from "cheerio";
import { writeFileSync } from "fs";

const urls = [
  "https://www.k24klik.com/cariObat/susu?kategori=true",
  "https://www.k24klik.com/cariObat/vitamin+mineral+suplemen+multivitamin+daya+tahan+tubuh+retinol+askorbat+d3+ipi+calviplex?kategori=true",
  "https://www.k24klik.com/cariObat/kontrasepsi+alat+kontrasepsi+kondom+pil+kb+andalan+sensitif+durex+fiesta+sutra?kategori=true",
];

async function scrapePage(url) {
  console.log("Scraping:", url);
  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(res.data);
  const products = [];

  $("li.product").each((i, el) => {
    const element = $(el);

    // Nama
    const name = element.find("h5 span[itemprop='name']").text().trim();

    // Harga (teks)
    const priceText = element.find("p.k24-sz-font-12.k24-fw-600").text().trim();

    // Harga numerik
    const price = Number(priceText.replace(/[^\d]/g, ""));

    // Unit
    const unit = element.find("p small").text().trim();

    // Gambar
    const image = element.find("img.lazy").attr("src") || "";

    // Link produk → ambil dari onclick
    const onclick = element.find("a").attr("onclick") || "";
    let link = "";

    const match = onclick.match(/'(https:\/\/[^']+)'/);
    if (match) link = match[1];

    // Push ke array
    products.push({
      name,
      priceText,
      price,
      unit,
      image,
      link,
      categorySource: url,
    });
  });

  console.log("  Found products:", products.length);
  return products;
}

async function run() {
  let all = [];

  for (const u of urls) {
    const items = await scrapePage(u);
    all.push(...items);
  }

  writeFileSync("k24-products.json", JSON.stringify(all, null, 2));
  console.log("Scraping selesai → k24-products.json");
}

run();
