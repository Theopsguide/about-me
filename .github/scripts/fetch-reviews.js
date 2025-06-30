const fs = require('fs');
const https = require('https');

/**
 * Fetch Google My Business reviews using Google Places API
 * This script fetches reviews and saves them to a JSON file for processing
 */

async function fetchGoogleReviews() {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!placeId || !apiKey) {
        console.error('Missing required environment variables: GOOGLE_PLACE_ID and GOOGLE_MAPS_API_KEY');
        process.exit(1);
    }
    
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status !== 'OK') {
            console.error('Google Places API error:', data.status, data.error_message);
            process.exit(1);
        }
        
        const businessInfo = {
            name: data.result.name,
            rating: data.result.rating,
            total_ratings: data.result.user_ratings_total,
            reviews: data.result.reviews || [],
            last_updated: new Date().toISOString()
        };
        
        // Save to JSON file for processing
        fs.writeFileSync('reviews-data.json', JSON.stringify(businessInfo, null, 2));
        
        console.log(`✅ Fetched ${businessInfo.reviews.length} reviews for ${businessInfo.name}`);
        console.log(`⭐ Overall rating: ${businessInfo.rating} (${businessInfo.total_ratings} total reviews)`);
        
    } catch (error) {
        console.error('Error fetching reviews:', error);
        process.exit(1);
    }
}

/**
 * Alternative method: Parse Google My Business share link
 * This is a fallback method if the API approach doesn't work
 */
async function parseGoogleShareLink() {
    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Navigate to the Google My Business share link
        const shareUrl = 'https://share.google/ea2jKj03IL9GVlIqc';
        await page.goto(shareUrl, { waitUntil: 'networkidle2' });
        
        // Wait for reviews to load
        await page.waitForTimeout(3000);
        
        // Extract business information and reviews
        const businessData = await page.evaluate(() => {
            const businessName = document.querySelector('h1')?.textContent || 'The Operations Guide';
            const rating = document.querySelector('[data-value]')?.getAttribute('data-value') || '5.0';
            
            // Extract reviews
            const reviewElements = document.querySelectorAll('[data-review-id]');
            const reviews = Array.from(reviewElements).map(element => {
                const authorName = element.querySelector('[data-local-attribute="d3bn"]')?.textContent || 'Anonymous';
                const reviewText = element.querySelector('[data-local-attribute="review-text"]')?.textContent || '';
                const rating = element.querySelectorAll('[data-value="1"]').length || 5;
                const date = element.querySelector('[data-local-attribute="review-date"]')?.textContent || '';
                
                return {
                    author_name: authorName,
                    text: reviewText,
                    rating: rating,
                    time: date,
                    relative_time_description: date
                };
            });
            
            return {
                name: businessName,
                rating: parseFloat(rating),
                reviews: reviews,
                total_ratings: reviews.length,
                last_updated: new Date().toISOString()
            };
        });
        
        // Save the extracted data
        fs.writeFileSync('reviews-data.json', JSON.stringify(businessData, null, 2));
        
        console.log(`✅ Extracted ${businessData.reviews.length} reviews for ${businessData.name}`);
        console.log(`⭐ Overall rating: ${businessData.rating}`);
        
    } catch (error) {
        console.error('Error parsing Google share link:', error);
        
        // Fallback: Create sample data structure
        const fallbackData = {
            name: 'The Operations Guide',
            rating: 5.0,
            total_ratings: 0,
            reviews: [],
            last_updated: new Date().toISOString(),
            note: 'Unable to fetch reviews automatically. Please add reviews manually.'
        };
        
        fs.writeFileSync('reviews-data.json', JSON.stringify(fallbackData, null, 2));
        
    } finally {
        await browser.close();
    }
}

// Main execution
(async () => {
    console.log('🔄 Fetching Google My Business reviews...');
    
    // Try API method first, fallback to scraping
    if (process.env.GOOGLE_MAPS_API_KEY) {
        await fetchGoogleReviews();
    } else {
        console.log('📝 No Google Maps API key found, attempting to parse share link...');
        await parseGoogleShareLink();
    }
})();