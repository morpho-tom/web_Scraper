const puppeteer = require("puppeteer");
const tesseract = require("tesseract.js");
const db = require("../models"); // Import models
const { District, Block, Village, Survey, OwnerName } = db;
const { Op } = require('sequelize');

const url = "http://tnagriculture.in/mannvalam/soils/en";

const processPage = async (page) => {
    const captchaSelector = '.d-flex .me-3 img'; // Selector for the CAPTCHA image
    await page.waitForSelector(captchaSelector);

    const captchaImageUrl = await page.$eval(captchaSelector, (img) => img.src);

    const captchaText = await tesseract
        .recognize(captchaImageUrl, 'eng')
        .then(({ data: { text } }) => text.trim())
        .catch((err) => {
            console.error("OCR failed:", err.message);
            return null;
        });

    console.log("Recognized CAPTCHA Text:", captchaText);

    if (/^\d{4}$/.test(captchaText)) {
        console.log("Valid CAPTCHA detected:", captchaText);
        return captchaText;
    } else {
        console.log("Invalid CAPTCHA. Retrying...");
        return null;
    }
};

const scrapeData = async (page) => {
    console.log("Scraping data...");
    await page.waitForSelector('select[name="district"]');

    const districtIds = ['36'];
    const districts = await District.findAll({
        where: { id: { [Op.in]: districtIds } }
    });

    for (const district of districts) {
        console.log(`Processing district: ${district.name}`);
        await page.select('select[name="district"]', district.value);

        await page.waitForFunction(() => {
            const blockSelect = document.querySelector('select[name="block"]');
            return blockSelect && blockSelect.options.length > 0;
        });

        const blocks = await Block.findAll({ where: { District_code: district.value } });

        for (const block of blocks) {
            console.log(`Processing block: ${block.name}`);
            await page.select('select[name="block"]', block.value);

            await page.waitForFunction(() => {
                const villageSelect = document.querySelector('select[name="village"]');
                return villageSelect && villageSelect.options.length > 0;
            });

            const villages = await Village.findAll({
                where: { District_code: district.value, Block_code: block.value },
            });

            for (const village of villages) {
                console.log(`Processing village: ${village.name}`);
                await page.select('select[name="village"]', village.value);

                await page.waitForSelector('select[name="Survey_no"]');
                await page.waitForFunction(() => {
                    const surveySelect = document.querySelector('select[name="Survey_no"]');
                    return surveySelect && surveySelect.options.length > 0;
                });

                const surveys = await Survey.findAll({
                    where: {
                        District_code: district.value,
                        Block_code: block.value,
                        Village_code: village.value,
                    },
                });

                for (const survey of surveys) {
                    console.log(`Processing Survey Number: ${survey.survey_no}`);
                
                    // Select the survey number
                    await page.select('select[name="Survey_no"]', survey.survey_no.toString());
                
                    // Simulate a button click to fetch owners
                    console.log("Submitting to fetch owner names...");
                    const buttonSelector = "button[onclick='getOwners(this.value)']";
                
                    await page.waitForSelector(buttonSelector); // Ensure the button exists
                    await page.evaluate((selector) => {
                        const button = document.querySelector(selector);
                        if (button) {
                            button.click(); // Explicitly trigger the click event
                        } else {
                            throw new Error(`Button with selector ${selector} not found.`);
                        }
                    }, buttonSelector);
                
                    // Wait for the ownerName dropdown to populate
                    console.log("Waiting for owner names to load...");
                    await page.waitForFunction(() => {
                        const ownerNameSelect = document.querySelector('select[name="ownerName"]');
                        return ownerNameSelect && ownerNameSelect.options.length >= 1; // Wait until dropdown is populated
                    });
                
                    // Extract owner names
                    const ownerNames = await page.evaluate(() => {
                        const selectElement = document.querySelector("select[name='ownerName']");
                        return Array.from(selectElement.options)
                            .filter(option => option.value.trim())
                            .map(option => ({
                                value: option.value.trim(),
                                name: option.textContent.trim(),
                            }));
                    });
                
                    const validOwnerNames = ownerNames.filter(
                        owner => owner.value !== "Land Owner Name - Subdivision No"
                    );
                
                    console.log(`Found ${validOwnerNames.length} owner(s) for Survey Number: ${survey.survey_no}`);
                
                    // Save owner names to the database
                    for (const owner of validOwnerNames) {
                        const ownerData = {
                            OwnerName: owner.value,
                            survey_id: survey.id,
                            District_code: district.value,
                            Block_code: block.value,
                            Village_code: village.value,
                        };
                
                        try {
                            await OwnerName.upsert(ownerData);
                            console.log(`Upserted owner: ${owner.name}`);
                        } catch (error) {
                            console.error(`Error upserting owner: ${error.message}`);
                        }
                    }
                
                    console.log(`Completed processing for Survey Number: ${survey.survey_no}`);
                }
                
                
            }
        }
    }
};

const main = async () => {
    let browser;
    try {
        while (true) {
            browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(url);

            const captchaText = await processPage(page);
            if (captchaText) {
                await page.type("#captcha", captchaText);
                await scrapeData(page);
                break;
            } else {
                await browser.close();
            }
        }
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        if (browser) await browser.close();
    }
};

main();
