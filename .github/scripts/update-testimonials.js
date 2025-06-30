const fs = require('fs');
const path = require('path');

/**
 * Update testimonials page with Google My Business reviews
 * This script reads the fetched reviews and integrates them into the testimonials page
 */

function updateTestimonialsPage() {
    try {
        // Read the fetched reviews data
        const reviewsData = JSON.parse(fs.readFileSync('reviews-data.json', 'utf8'));
        
        // Read the current testimonials page
        const testimonialsPath = 'testimonials/index.html';
        let testimonialsHtml = fs.readFileSync(testimonialsPath, 'utf8');
        
        // Generate Google My Business reviews section
        const googleReviewsSection = generateGoogleReviewsSection(reviewsData);
        
        // Find the insertion point (after Professional Testimonials section)
        const insertionPoint = testimonialsHtml.indexOf('<div class="section">');
        const secondSectionPoint = testimonialsHtml.indexOf('<div class="section">', insertionPoint + 1);
        
        if (secondSectionPoint === -1) {
            console.error('Could not find insertion point in testimonials page');
            return;
        }
        
        // Insert the Google reviews section
        const beforeSection = testimonialsHtml.substring(0, secondSectionPoint);
        const afterSection = testimonialsHtml.substring(secondSectionPoint);
        
        testimonialsHtml = beforeSection + googleReviewsSection + '\n\n    ' + afterSection;
        
        // Update the stats section with Google reviews data
        testimonialsHtml = updateStatsSection(testimonialsHtml, reviewsData);
        
        // Write the updated testimonials page
        fs.writeFileSync(testimonialsPath, testimonialsHtml);
        
        console.log(`✅ Updated testimonials page with ${reviewsData.reviews.length} Google My Business reviews`);
        console.log(`📈 Business rating: ${reviewsData.rating}/5.0 (${reviewsData.total_ratings} total reviews)`);
        
    } catch (error) {
        console.error('Error updating testimonials page:', error);
        process.exit(1);
    }
}

function generateGoogleReviewsSection(reviewsData) {
    const { name, rating, total_ratings, reviews, last_updated } = reviewsData;
    
    // Generate individual review cards
    const reviewCards = reviews.slice(0, 6).map(review => `
            <div class="testimonial-card">
                <div class="rating">${'⭐'.repeat(review.rating)}</div>
                <div class="testimonial-text">
                    "${review.text}"
                </div>
                <div class="testimonial-author">${review.author_name}</div>
                <div class="testimonial-role">Google My Business Review</div>
                <div class="testimonial-company">${review.relative_time_description}</div>
                <span class="verification-badge">✓ Google Verified</span>
            </div>`).join('');
    
    return `    <div class="section">
        <h2>🌟 Google My Business Reviews</h2>
        <div class="stats-section">
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${rating}</div>
                    <div class="stat-label">Google Rating</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${total_ratings || reviews.length}</div>
                    <div class="stat-label">Total Reviews</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">100%</div>
                    <div class="stat-label">5-Star Reviews</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">Auto</div>
                    <div class="stat-label">Updated Daily</div>
                </div>
            </div>
        </div>
        
        <div class="testimonials-grid">${reviewCards}
        </div>
        
        <div class="social-proof">
            <h4>🔗 View All Reviews</h4>
            <p>See all our Google My Business reviews and leave your own feedback:</p>
            <p><a href="https://share.google/ea2jKj03IL9GVlIqc" target="_blank" style="color: #27ae60; font-weight: bold;">View on Google My Business →</a></p>
            <p><small>Last updated: ${new Date(last_updated).toLocaleDateString()}</small></p>
        </div>
    </div>`;
}

function updateStatsSection(html, reviewsData) {
    // Update the client satisfaction stat if Google reviews are available
    if (reviewsData.reviews.length > 0) {
        const avgRating = reviewsData.rating;
        const satisfactionPercent = Math.round((avgRating / 5) * 100);
        
        html = html.replace(
            /<div class="stat-number">100%<\/div>\s*<div class="stat-label">Client Satisfaction<\/div>/,
            `<div class="stat-number">${satisfactionPercent}%</div>
                <div class="stat-label">Client Satisfaction</div>`
        );
    }
    
    return html;
}

// Main execution
updateTestimonialsPage();