// k24-scrape-with-details-extended.mjs
import axios from "axios";
import * as cheerio from "cheerio";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import crypto from "crypto";

const targets = [
  {
    url: "https://www.k24klik.com/cariObat/susu?kategori=true",
    category: "Susu",
  },
  {
    url: "https://www.k24klik.com/cariObat/vitamin+mineral+suplemen+multivitamin+daya+tahan+tubuh+retinol+askorbat+d3+ipi+calviplex?kategori=true",
    category: "Vitamin",
  },
  {
    url: "https://www.k24klik.com/cariObat/kontrasepsi+alat+kontrasepsi+kondom+pil+kb+andalan+sensitif+durex+fiesta+sutra?kategori=true",
    category: "Kontrasepsi",
  },
  {
    url: "https://www.k24klik.com/cariObat/sesak+napas+obat+asma+alergi+nebulizer+inhaler?kategori=true",
    category: "ASMA & PERNAPASAN",
  },
  {
    url: "https://www.k24klik.com/cariObat/vitamin%20B+Vitamin%20C+vitamin%20E+vitamin%20K+vitamin%20D+suplemen+multivitamin+mineral+kalsium+kesehatan+daya%20tahan%20tubuh+imun+vitamin+suplemen%20makanan+terapi%20penunjang+pertumbuhan+vitamin%20anak+suplemen%20anak?kategori=true",
    category: "SUPLEMEN",
  },
  {
    url: "https://www.k24klik.com/cariObat/antiseptik+antikuman+handsanitizer+alkohol+dixol+carex+purekids?kategori=true",
    category: "ANTISEPTIC",
  },
  {
    url: "hhttps://www.k24klik.com/cariObat/batuk+flu+alergi+pilek+demam+decolgen+panadol+tolakangin+bodrexin?kategori=true",
    category: "FLU BATUK ALERGI",
  },
  {
    url: "https://www.k24klik.com/cariObat/pereda+nyeri+demam+pusing+sakit+perut+sakit+mens+analgesik+mefenamat?kategori=true",
    category: "PEREDA NYERI",
  },
  {
    url: "https://www.k24klik.com/cariObat/demam+panas+pusing+meriang+kepala+gigi+nyeri+biogesic+sanmol+panadol+decolgen+paracetamol+mefenamat+antipiretik?kategori=true",
    category: "DEMAM",
  },
  {
    url: "http://k24klik.com/cariObat/hipertensi+anti+hipertensi+tekanan+darah+tinggi+tensi+tinggi?kategori=true",
    category: "HIPERTENSI",
  },
  {
    url: "https://www.k24klik.com/cariObat/enc:degeneratif",
    category: "DEGENERATIF",
  },
  {
    url: "https://www.k24klik.com/cariObat/diare+dehidrasi+norit+diatab+diapet+entrostop?kategori=true",
    category: "DIARE",
  },
  {
    url: "https://www.k24klik.com/cariObat/jantung+sakit+jantung+serangan+jantung+stroke+kolestrol+aritmia+aliran+darah?kategori=true",
    category: "JANTUNG",
  },
  {
    url: "https://www.k24klik.com/cariObat/mual+muntah+kembung+masuk+angin+mabuk+perjalanan?kategori=true",
    category: "MUAL",
  },
  {
    url: "https://www.k24klik.com/cariObat/sakit+mata+tetes+mata+mata+merah+mata+berair+infeksi+iritasi+gatal+eyevit+insto+cendo?kategori=true",
    category: "MATA",
  },
  {
    url: "https://www.k24klik.com/cariObat/sakit+gula+diabetes+militus+kencing+manis+insulin?kategori=true",
    category: "DIABETES",
  },
  {
    url: "https://www.k24klik.com/cariObat/kolestrol+osteoporosis+jantung+koroner+entrasol+jati+belanda+simvastin?kategori=true",
    category: "KOLESTEROL",
  },
  {
    url: "https://www.k24klik.com/cariObat/anak+kids+bayi+balita+minyak+telon+bedak?kategori=true",
    category: "ANAK",
  },
  {
    url: "https://www.k24klik.com/cariObat/hamil+kehamilan+ibu+testpack+folat+kalsium+prenagen+sangobion+calcifar?kategori=true",
    category: "KEHAMILAN",
  },
  {
    url: "https://www.k24klik.com/cariObat/maag+mual+asam+lambung+tukak+nyeri+lambung+muntah+sebah+mylanta+promag?kategori=true",
    category: "LAMBUNG / MAAG",
  },
  {
    url: "https://www.k24klik.com/cariObat/menyusui+ibu+folat+kalsium+breastpad+prenagen+pigeon?kategori=true",
    category: "IBU MENYUSUI",
  },
  {
    url: "https://www.k24klik.com/cariObat/obat+herbal+masuk+angin+kembung+anak+tolakangin+prospan+sari+kurma?kategori=true",
    category: "OBAT HERBAL",
  },
  {
    url: "https://www.k24klik.com/cariObat/sendi+tulang+pegal+otot?kategori=true",
    category: "SENDI & TULANG",
  },
  {
    url: "https://www.k24klik.com/cariObat/kecantikan+bedak+kapas+jerawat+vitamin+kecantikan+nature+selection+melanox+cetaphil?kategori=true",
    category: "KECANTIKAN",
  },
  {
    url: "https://www.k24klik.com/cariObat/mens+menstruasi+pendarahan+haid+pembalut+wanita+ifree+feminax+avail+beauty+charm?kategori=true",
    category: "MENSTRUASI",
  },
  {
    url: "https://www.k24klik.com/cariObat/infeksi+antibiotik+infeksi+telinga+infeksi+hidung+infeksi+saluran+kemih+saluran+napas+huki+cotton+buds+tetes+telinga?kategori=true",
    category: "THT",
  },
  {
    url: "https://www.k24klik.com/cariObat/diet+naturslim+tropicana+thermolyte?kategori=true",
    category: "DIET",
  },
  {
    url: "https://www.k24klik.com/cariObat/kotak+p3k+luka+obat+merah+betadine+hansaplast+husada+kapas?kategori=true",
    category: "P3K",
  },
  {
    url: "https://www.k24klik.com/cariObat/makanan+minuman+permen+soy+joy+pocari+ultamilk+aqua+pagoda+fitbar+bearbrand?kategori=true",
    category: "MAKANAN & MINUMAN",
  },
];

const IMAGE_DIR = path.join(process.cwd(), "images");
if (!existsSync(IMAGE_DIR)) mkdirSync(IMAGE_DIR, { recursive: true });

function makeSlug(s = "") {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function makeIdFromUrl(urlOrValue) {
  // stable numeric-ish id derived from md5
  return Number(
    "0x" +
      crypto
        .createHash("md5")
        .update(String(urlOrValue))
        .digest("hex")
        .slice(0, 12)
  );
}
async function downloadImage(imageUrl, suggestedName = "") {
  if (!imageUrl) return null;
  try {
    const res = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    let ext = ".jpg";
    try {
      const u = new URL(imageUrl);
      const e = path.extname(u.pathname);
      if (e) ext = e;
    } catch {}
    const base =
      (suggestedName || "image")
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "image";
    const hash = crypto
      .createHash("md5")
      .update(imageUrl)
      .digest("hex")
      .slice(0, 8);
    const filename = `${base}-${hash}${ext}`;
    writeFileSync(path.join(IMAGE_DIR, filename), res.data);
    return filename;
  } catch (e) {
    console.error("  ✖ download failed:", imageUrl, e.message);
    return null;
  }
}

/**
 * Extract product meta from the product detail page.
 * Specifically target the two tables with class `list-table` and the paragraph below.
 * Returns an object with: descriptionHtml, descriptionText, komposisi, kemasan, indikasi, kategori, dosis,
 * penyajian, caraPenyimpanan, perhatian, efekSamping, namaStandar, nomorIzin, pabrik, golonganObat, keterangan, referensi, footerText
 */
async function fetchProductMeta(detailUrl) {
  if (!detailUrl) return null;
  try {
    const res = await axios.get(detailUrl, {
      timeout: 30000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const $ = cheerio.load(res.data);

    // Helper: normalize heading text to key name
    function normKey(text) {
      if (!text) return null;
      const t = text
        .replace(/[:\s]+$/g, "")
        .trim()
        .toLowerCase();
      // map common Indonesian headings to fixed keys
      if (/deskripsi/.test(t)) return "description";
      if (/komposisi/.test(t)) return "komposisi";
      if (/kemasan/.test(t)) return "kemasan";
      if (/indikasi|manfaat|kegunaan/.test(t)) return "indikasi";
      if (/kategori/.test(t)) return "kategori";
      if (/dosis/.test(t)) return "dosis";
      if (/penyajian/.test(t)) return "penyajian";
      if (/cara penyimpanan/.test(t)) return "caraPenyimpanan";
      if (/perhatian/.test(t)) return "perhatian";
      if (/efek samping/.test(t)) return "efekSamping";
      if (/nama standar|mims/i.test(t)) return "namaStandar";
      if (/nomor izin edar/i.test(t)) return "nomorIzin";
      if (/pabrik|manufacturer/i.test(t)) return "pabrik";
      if (/golongan obat/i.test(t)) return "golonganObat";
      if (/keterangan/i.test(t)) return "keterangan";
      if (/referensi/i.test(t)) return "referensi";
      return t.replace(/\s+/g, "_");
    }

    const meta = {
      descriptionHtml: null,
      descriptionText: null,
      komposisi: null,
      kemasan: null,
      indikasi: null,
      kategori: null,
      dosis: null,
      penyajian: null,
      caraPenyimpanan: null,
      perhatian: null,
      efekSamping: null,
      namaStandar: null,
      nomorIzin: null,
      pabrik: null,
      golonganObat: null,
      keterangan: null,
      referensi: null,
      footerText: null,
    };

    // Find all tables.list-table (there are two in the example)
    $("table.list-table").each((ti, table) => {
      const $table = $(table);
      // iterate rows
      $table.find("tr").each((ri, row) => {
        const $row = $(row);
        // Heading is inside h2.k24-text-product-price (or h2)
        const heading = $row.find("h2").first().text().trim();
        const key = normKey(heading);
        // value is usually inside <span> (may contain inner HTML)
        const span = $row.find("span").first();
        const html =
          span && span.length
            ? span.html().trim()
            : $row.find("td").text().trim();
        const text =
          span && span.length
            ? span.text().replace(/\s+/g, " ").trim()
            : $row.find("td").text().replace(/\s+/g, " ").trim();

        if (!key) return; // skip rows without heading

        switch (key) {
          case "description":
            // description may contain <p> etc.
            meta.descriptionHtml = html || null;
            meta.descriptionText = text || null;
            break;
          case "komposisi":
            meta.komposisi = text || null;
            break;
          case "kemasan":
            meta.kemasan = text || null;
            break;
          case "indikasi":
            meta.indikasi = text || null;
            break;
          case "kategori":
            meta.kategori = text || null;
            break;
          case "dosis":
            meta.dosis = text || null;
            break;
          case "penyajian":
            meta.penyajian = text || null;
            break;
          case "caraPenyimpanan":
            meta.caraPenyimpanan = text || null;
            break;
          case "perhatian":
            meta.perhatian = text || null;
            break;
          case "efekSamping":
            meta.efekSamping = text || null;
            break;
          case "namaStandar":
            meta.namaStandar = text || null;
            break;
          case "nomorIzin":
            meta.nomorIzin = text || null;
            break;
          case "pabrik":
            meta.pabrik = text || null;
            break;
          case "golonganObat":
            // golongan may contain <img> + text; keep text
            meta.golonganObat =
              $row.find(".golongan").text().replace(/\s+/g, " ").trim() ||
              text ||
              null;
            break;
          case "keterangan":
            // maybe contains <time datetime="..."> text
            meta.keterangan = text || null;
            break;
          case "referensi":
            meta.referensi = text || null;
            break;
          default:
            // put into meta under normalized key if unknown
            meta[key] = text || html || null;
        }
      });
    });

    // Paragraphs below tables: extract that block for footerText
    const footerBlock = $("div.k24-width-100.k24-pad-side-16").first();
    if (footerBlock && footerBlock.length) {
      meta.footerText = footerBlock.text().replace(/\s+/g, " ").trim() || null;
      // If description wasn't found above, try to find itemprop description inside footerBlock
      if (!meta.descriptionHtml) {
        const itemDesc = footerBlock.find("[itemprop='description']").first();
        if (itemDesc && itemDesc.length) {
          meta.descriptionHtml = itemDesc.html()?.trim() || null;
          meta.descriptionText =
            itemDesc.text()?.replace(/\s+/g, " ").trim() ||
            meta.descriptionText;
        }
      }
    }

    // Fallback: if description is still null, try to capture any span[itemprop="description"] on page
    if (!meta.descriptionHtml || !meta.descriptionText) {
      const sp = $("[itemprop='description']").first();
      if (sp && sp.length) {
        meta.descriptionHtml =
          meta.descriptionHtml || sp.html()?.trim() || null;
        meta.descriptionText =
          meta.descriptionText ||
          sp.text()?.replace(/\s+/g, " ").trim() ||
          null;
      }
    }

    return meta;
  } catch (err) {
    console.error("  ✖ fetchProductMeta failed:", detailUrl, err.message);
    return {
      descriptionHtml: null,
      descriptionText: null,
      komposisi: null,
      kemasan: null,
      indikasi: null,
      kategori: null,
      dosis: null,
      penyajian: null,
      caraPenyimpanan: null,
      perhatian: null,
      efekSamping: null,
      namaStandar: null,
      nomorIzin: null,
      pabrik: null,
      golonganObat: null,
      keterangan: null,
      referensi: null,
      footerText: null,
    };
  }
}

// Reuse previous category scraping logic (adapted)
async function scrapeCategory(url, categoryName) {
  console.log("Scrape category:", categoryName, url);
  try {
    const res = await axios.get(url, {
      timeout: 30000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const $ = cheerio.load(res.data);
    const nodes = $(
      "li.product, .product, .k24-thumb-md, .product-item"
    ).toArray();
    const products = [];

    nodes.forEach((el) => {
      const box = $(el);
      const name =
        box.find("h5 span[itemprop='name']").text().trim() ||
        box.find("h5").text().trim() ||
        box.find("h3").text().trim() ||
        box.find(".k24-nd-font").text().trim() ||
        box.find("a[title]").attr("title") ||
        "";

      const priceText =
        box.find("p.k24-sz-font-12.k24-fw-600").text().trim() ||
        box.find(".price, .k24-color-prim").text().trim() ||
        "";
      const price = priceText ? Number(priceText.replace(/[^\d]/g, "")) : null;
      const unit = box.find("p small").text().trim() || null;

      const imageUrl =
        box.find("img.lazy").attr("src") ||
        box.find("img.lazy").attr("data-src") ||
        box.find("img").attr("src") ||
        null;

      // product url
      let urlProduct = "";
      const onclick = box.find("a").attr("onclick") || "";
      const linkMatch = onclick.match(/'(https?:\/\/[^']+)'/);
      if (linkMatch) urlProduct = linkMatch[1];
      if (!urlProduct) {
        const ahref = box.find("a[href]").attr("href");
        if (ahref) {
          try {
            urlProduct = new URL(ahref, url).href;
          } catch {
            urlProduct = ahref;
          }
        }
      }

      let id = null;
      if (urlProduct) {
        const m = urlProduct.match(/-(\d+)(?!.*\d)/);
        if (m) id = Number(m[1]);
      }
      if (!id)
        id = makeIdFromUrl(
          name || urlProduct || Math.random().toString(36).slice(2, 8)
        );

      products.push({
        id,
        name,
        slug: makeSlug(name),
        price,
        unit,
        imageUrl,
        url: urlProduct,
      });
    });

    console.log("  → found:", products.length, "products");
    return { category: categoryName, slug: makeSlug(categoryName), products };
  } catch (e) {
    console.error("  ✖ scrapeCategory failed:", url, e.message);
    return {
      category: categoryName,
      slug: makeSlug(categoryName),
      products: [],
    };
  }
}

async function run() {
  const out = [];

  for (const t of targets) {
    const block = await scrapeCategory(t.url, t.category);

    for (const p of block.products) {
      // download main image
      let saved = null;
      if (p.imageUrl) saved = await downloadImage(p.imageUrl, p.name);
      p.localImage = saved ? `/assets/images/${saved}` : null;

      // fetch meta fields from detail page
      const meta = p.url
        ? await fetchProductMeta(p.url)
        : await fetchProductMeta(null);
      // attach descriptionHtml/text and all meta fields (only the ones we extracted)
      p.descriptionHtml = meta.descriptionHtml || null;
      p.descriptionText = meta.descriptionText || null;
      p.komposisi = meta.komposisi || null;
      p.kemasan = meta.kemasan || null;
      p.indikasi = meta.indikasi || null;
      p.kategori = meta.kategori || null;
      p.dosis = meta.dosis || null;
      p.penyajian = meta.penyajian || null;
      p.caraPenyimpanan = meta.caraPenyimpanan || null;
      p.perhatian = meta.perhatian || null;
      p.efekSamping = meta.efekSamping || null;
      p.namaStandar = meta.namaStandar || null;
      p.nomorIzin = meta.nomorIzin || null;
      p.pabrik = meta.pabrik || null;
      p.golonganObat = meta.golonganObat || null;
      p.keterangan = meta.keterangan || null;
      p.referensi = meta.referensi || null;
      p.footerText = meta.footerText || null;

      // remove intermediate fields
      delete p.imageUrl;
      delete p.url;
    }

    // Map to include only fields required plus the extracted meta
    block.products = block.products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      unit: p.unit,
      localImage: p.localImage,
      descriptionText: p.descriptionText,
      descriptionHtml: p.descriptionHtml,
      komposisi: p.komposisi,
      kemasan: p.kemasan,
      indikasi: p.indikasi,
      kategori: p.kategori,
      dosis: p.dosis,
      penyajian: p.penyajian,
      caraPenyimpanan: p.caraPenyimpanan,
      perhatian: p.perhatian,
      efekSamping: p.efekSamping,
      namaStandar: p.namaStandar,
      nomorIzin: p.nomorIzin,
      pabrik: p.pabrik,
      golonganObat: p.golonganObat,
      keterangan: p.keterangan,
      referensi: p.referensi,
      footerText: p.footerText,
    }));

    out.push(block);
  }

  writeFileSync(
    "k24-api-with-details-extended.json",
    JSON.stringify(out, null, 2),
    "utf-8"
  );
  console.log("✅ Done -> k24-api-with-details-extended.json");
  console.log("Images saved to ./images/ (JSON uses prefix /assets/images/)");
}

run();
