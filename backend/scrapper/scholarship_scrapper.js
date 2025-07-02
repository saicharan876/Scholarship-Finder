const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const GPA_PAGES = [
  "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-3-6-to-4-0",
  "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-3-1-to-3-5",
  "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-2-6-to-3-0",
  "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-2-1-to-2-5",
];

async function scholarshipscraper() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
  );

  const results = [];

  for (const url of GPA_PAGES) {
    console.log(`🔍 Scraping listing: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await autoScroll(page);

    const scholarships = await scrapeListingPage(page);

    for (const scholarship of scholarships) {
      const detailData = await scrapeDetailPage(browser, scholarship.url);
      Object.assign(scholarship, detailData, { source: "Scholarships.com" });
      results.push(scholarship);
    }
  }

  await browser.close();

  const validCount = results.filter((r) => !isNaN(r.gpa) && r.gpa > 2).length;
  console.log(`✅ Scholarships with GPA > 2: ${validCount}`);

  return results;
}

// Scroll down to load more items
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        const loaded = document.querySelectorAll(".award-box").length;
        if (loaded >= 25 || totalHeight > 3000) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

// Extract scholarships from listing page
async function scrapeListingPage(page) {
  return await page.evaluate(() => {
    const rows = Array.from(
      document.querySelectorAll("table#award-grid tbody tr")
    ).slice(0, 2);
    return rows.map((row) => {
      const linkEl = row.querySelector("a.blacklink");
      const title = linkEl?.innerText?.trim() || "";
      const url = linkEl
        ? "https://www.scholarships.com" + linkEl.getAttribute("href")
        : "";

      const amountText =
        row.querySelector("td:nth-child(3)")?.innerText?.trim() || "";
      const amountValue = amountText.startsWith("$")
        ? Number(amountText.replace(/[^0-9]/g, ""))
        : null;

      const deadline =
        row
          .querySelector("td:nth-child(4)")
          ?.innerText?.replace("Due Date:", "")
          .trim() || "";

      return { title, url, amount: amountText, amountValue, deadline };
    });
  });
}

// Extract scholarship details from individual page
async function scrapeDetailPage(browser, url) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const detail = await page.evaluate(() => {
      const description =
        document.querySelector("div > div > p")?.textContent?.trim() || "";

      const bodyText = document.body.innerText.toLowerCase();
      const gpaMatches = [];

      const regexNumBefore =
        /(\d+(\.\d+)?)(?=.{0,15}?(gpa|least a|minimum|maintain))/gi;
      const regexKeyBefore =
        /(gpa|least a|minimum|maintain)(?=.{0,15}?\s*(\d+(\.\d+)?))/gi;

      let match;
      while ((match = regexNumBefore.exec(bodyText)) !== null) {
        gpaMatches.push(parseFloat(match[1]));
      }
      while ((match = regexKeyBefore.exec(bodyText)) !== null) {
        if (match[2]) gpaMatches.push(parseFloat(match[2]));
      }

      const gpa = gpaMatches.length ? Math.min(...gpaMatches) : 0;

      return { description, gpa };
    });

    await page.close();
    return detail;
  } catch (error) {
    console.warn(`⚠️ Failed to scrape detail from: ${url}`, error);
    await page.close();
    return { description: "", gpa: 0 };
  }
}

module.exports = scholarshipscraper;
