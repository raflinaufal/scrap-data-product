import axios from "axios";
import * as cheerio from "cheerio";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import crypto from "crypto";

// Daftar kategori yang mau di-scrape
const targets = [
  {
    url: "https://www.k24klik.com/cariObat/susu?kategori=true",
    category: "Susu",
  },
  {
    url: "https://www.k24klik.com/cariObat/vitamin+mineral+suplemen+multivitamin+daya+tahan+tubuh+retinol+askorbat+d3+ipi+calviplex?kategori=true",
    category: "Vitamin & Mineral & Suplemen",
  },
  {
    url: "https://www.k24klik.com/cariObat/kontrasepsi+alat+kontrasepsi+kondom+pil+kb+andalan+sensitif+durex+fiesta+sutra?kategori=true",
    category: "Kontrasepsi & Kondom & Pil KB",
  },
];

// Folder tempat simpan gambar lokal
const IMAGE_DIR = path.join(process.cwd(), "images");
if (!existsSync(IMAGE_DIR)) {
  mkdirSync(IMAGE_DIR);
  console.log('📂 Folder "images" dibuat');
}

function makeSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function downloadImage(imageUrl, suggestedName = "") {
  if (!imageUrl) return null;

  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const urlObj = new URL(imageUrl);
    const extFromUrl = path.extname(urlObj.pathname) || ".jpg";

    const base =
      suggestedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "image";

    const hash = crypto
      .createHash("md5")
      .update(imageUrl)
      .digest("hex")
      .slice(0, 8);

    const fileName = `${base}-${hash}${extFromUrl}`;
    const filePath = path.join(IMAGE_DIR, fileName);

    writeFileSync(filePath, response.data);
    console.log("   ✔ Gambar disimpan:", fileName);

    return fileName;
  } catch (err) {
    console.error("   ✖ Gagal download gambar:", imageUrl, "-", err.message);
    return null;
  }
}

async function scrapeCategory(url, categoryName) {
  console.log("🔎 Scraping kategori:", categoryName);
  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(res.data);
  const products = [];

  // selector utama card produk
  $("li.product").each((i, el) => {
    const box = $(el);

    const name = box.find("h5 span[itemprop='name']").text().trim();
    const slug = makeSlug(name);

    const priceText = box.find("p.k24-sz-font-12.k24-fw-600").text().trim();
    const price = Number(priceText.replace(/[^\d]/g, ""));

    const unit = box.find("p small").text().trim();

    const imageUrl = box.find("img.lazy").attr("src") || "";

    const onclick = box.find("a").attr("onclick") || "";
    const linkMatch = onclick.match(/'(https:\/\/[^']+)'/);
    const urlProduct = linkMatch ? linkMatch[1] : "";

    let id = null;
    const idMatch = urlProduct.match(/-(\d+)(?!.*\d)/);
    if (idMatch) id = Number(idMatch[1]);

    products.push({
      id,
      name,
      slug,
      price,
      unit,
      imageUrl,
      url: urlProduct,
    });
  });

  console.log("  ➜ Produk ditemukan:", products.length);
  return {
    category: categoryName,
    slug: makeSlug(categoryName),
    products,
  };
}

async function run() {
  const output = [];

  // 1. Scrape tiap kategori
  for (const { url, category } of targets) {
    const block = await scrapeCategory(url, category);

    // 2. Download gambar untuk produk di kategori ini
    for (const product of block.products) {
      if (!product.imageUrl) continue;
      const local = await downloadImage(product.imageUrl, product.name);
      product.localImage = local; // tambahkan nama file lokal ke JSON
    }

    output.push(block);
  }

  // 3. Simpan ke file JSON
  writeFileSync(
    "k24-api-with-local-images.json",
    JSON.stringify(output, null, 2),
    "utf-8"
  );
  console.log('✅ Selesai → "k24-api-with-local-images.json" dibuat');
  console.log('   Gambar lokal ada di folder "images/"');
}

run();
