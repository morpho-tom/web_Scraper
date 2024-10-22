const puppeteer = require("puppeteer");
const { saveDistricts } = require("../controller/userController");

const url = "http://tnagriculture.in/mannvalam/soils/en";

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector('select[name="district"]');

  const districtOptions = await page.evaluate(() => {
    const selectElement = document.querySelector('select[name="district"]');
    const options = Array.from(selectElement.options);

    return options
      .filter((option) => option.value && option.value !== "")
      .map((option) => ({
        value: option.value.trim(),
        name: option.textContent.trim(),
      }));
  });
  await saveDistricts(districtOptions);

  await browser.close();
};

main();
