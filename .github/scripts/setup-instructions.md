# Google My Business Reviews Integration Setup

This automation fetches your Google My Business reviews and automatically updates your testimonials page.

## Setup Steps

### 1. Get Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Places API**
4. Create credentials (API Key)
5. Restrict the API key to Places API for security

### 2. Find Your Google Place ID
1. Go to [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your business: "The Operations Guide"
3. Copy the Place ID

### 3. Set Up GitHub Secrets
In your GitHub repository settings, add these secrets:
- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
- `GOOGLE_PLACE_ID`: Your business Place ID

### 4. Repository Settings
Ensure your repository has:
- Actions enabled
- Write permissions for GitHub Actions
- Pages enabled (if using GitHub Pages)

## How It Works

### Automated Process
1. **Daily Schedule**: Runs every day at 8 AM UTC
2. **Fetch Reviews**: Gets latest reviews from Google My Business
3. **Update Page**: Integrates reviews into testimonials page
4. **Auto Commit**: Commits changes with descriptive message

### Manual Trigger
You can manually trigger the workflow:
1. Go to Actions tab in your repository
2. Select "Update Google My Business Reviews"
3. Click "Run workflow"

## Fallback Method

If Google Places API is not available, the script will attempt to parse your Google My Business share link directly using web scraping.

## Files Created

- `.github/workflows/update-reviews.yml` - GitHub Action workflow
- `.github/scripts/fetch-reviews.js` - Review fetching script
- `.github/scripts/update-testimonials.js` - Page update script
- `reviews-data.json` - Temporary data file (auto-generated)

## Customization

### Review Display
Edit `update-testimonials.js` to customize:
- Number of reviews shown (currently 6)
- Review card styling
- Section placement

### Update Frequency
Edit `update-reviews.yml` cron schedule:
- Current: `0 8 * * *` (8 AM daily)
- Hourly: `0 * * * *`
- Weekly: `0 8 * * 1` (Mondays)

## Testing

### Local Testing
```bash
# Install dependencies
npm install puppeteer axios cheerio

# Set environment variables
export GOOGLE_PLACE_ID="your-place-id"
export GOOGLE_MAPS_API_KEY="your-api-key"

# Run scripts
node .github/scripts/fetch-reviews.js
node .github/scripts/update-testimonials.js
```

### Workflow Testing
1. Push changes to main branch
2. Check Actions tab for workflow execution
3. Review the updated testimonials page

## Security Notes

- Never commit API keys to the repository
- Use GitHub Secrets for sensitive data
- Consider IP restrictions on your Google API key
- Monitor API usage to avoid unexpected charges

## Troubleshooting

### Common Issues
1. **API Key Issues**: Check key validity and permissions
2. **Place ID Issues**: Verify Place ID is correct
3. **Rate Limits**: Google Places API has usage limits
4. **Share Link Changes**: Google may change share link format

### Debugging
- Check GitHub Actions logs for detailed error messages
- Test scripts locally with sample data
- Verify API responses using browser dev tools

## Next Steps

After setup:
1. Test the workflow manually
2. Monitor the first few automated runs
3. Customize the review display as needed
4. Consider adding email notifications for failures