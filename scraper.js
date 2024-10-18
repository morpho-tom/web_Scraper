// const puppeteer = require('puppeteer');

// async function scrapeBooks() {
//     // Launch the browser
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Go to the website (mock example)
//     await page.goto('https://books.toscrape.com/');

//     // Wait for the list of books to load
//     await page.waitForSelector('.product_pod');

//     // Extract the book titles and prices
//     const books = await page.evaluate(() => {
//         const booksArray = [];
//         const bookElements = document.querySelectorAll('.product_pod');

//         bookElements.forEach(book => {
//             const title = book.querySelector('h3 a').title;
//             const price = book.querySelector('.price_color').textContent;
//             booksArray.push({ title, price });
//         });

//         return booksArray;
//     });

//     // Log the extracted data
//     console.log(books);

//     // Close the browser
//     await browser.close();
// }

// // Execute the function
// scrapeBooks();



// ----------------------------------x----------------


// scraper.js
// const puppeteer = require('puppeteer');
// const cheerio = require('cheerio');
// const mongoose = require('mongoose');
// const Page = require('./models/page');

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/internetTimeMachine', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Function to scrape a website using Puppeteer and parse it with Cheerio
// const scrapeWebsite = async (url) => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         // Go to the URL
//         await page.goto(url, { waitUntil: 'networkidle2' });

//         // Get the HTML content
//         const html = await page.content();

//         // Load HTML into Cheerio for manipulation (if necessary)
//         const $ = cheerio.load(html);

//         // Optional: Manipulate the HTML or extract specific data
//         // Example: const title = $('title').text();

//         // Save HTML to MongoDB
//         const pageRecord = new Page({ url, html });
//         await pageRecord.save();

//         console.log(`Page saved: ${url}`);

//         await browser.close();
//     } catch (error) {
//         console.error(`Error scraping ${url}:`, error);
//     }
// };

// // List of URLs to scrape
// const urlsToScrape = [
//     'https://books.toscrape.com/', 
//     'https://news.sky.com',
//     // Add more URLs here
// ];

// // Scrape each URL
// urlsToScrape.forEach(url => {
//     scrapeWebsite(url);
// });
