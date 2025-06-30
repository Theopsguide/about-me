/**
 * Comprehensive Analytics and Conversion Tracking for Luke Thompson's Professional Profile
 * Tracks user engagement, conversions, and provides insights for optimization
 */

// Configuration
const ANALYTICS_CONFIG = {
    // Google Analytics 4 Configuration
    GA4_ID: 'G-XXXXXXXXXX', // Replace with actual GA4 tracking ID
    
    // Microsoft Clarity Configuration
    CLARITY_ID: 'XXXXXXXXX', // Replace with actual Clarity project ID
    
    // LinkedIn Insight Tag
    LINKEDIN_PARTNER_ID: 'XXXXXXX', // Replace with actual LinkedIn partner ID
    
    // Custom Events Configuration
    CUSTOM_EVENTS: {
        PAGE_VIEW: 'page_view',
        TOOL_USAGE: 'tool_usage',
        RESOURCE_DOWNLOAD: 'resource_download',
        CONSULTATION_REQUEST: 'consultation_request',
        EMAIL_SIGNUP: 'email_signup',
        CASE_STUDY_VIEW: 'case_study_view',
        VIDEO_PLAY: 'video_play',
        EXTERNAL_LINK_CLICK: 'external_link_click'
    }
};

/**
 * Initialize Google Analytics 4
 */
function initializeGA4() {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_ID}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.GA4_ID, {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Make gtag globally available
    window.gtag = gtag;
}

/**
 * Initialize Microsoft Clarity for heatmap analysis
 */
function initializeClarity() {
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", ANALYTICS_CONFIG.CLARITY_ID);
}

/**
 * Initialize LinkedIn Insight Tag
 */
function initializeLinkedIn() {
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(ANALYTICS_CONFIG.LINKEDIN_PARTNER_ID);
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    document.head.appendChild(script);
}

/**
 * Track custom events with detailed context
 */
function trackEvent(eventName, parameters = {}) {
    const eventData = {
        event_category: 'engagement',
        timestamp: new Date().toISOString(),
        page_title: document.title,
        page_location: window.location.href,
        user_agent: navigator.userAgent,
        ...parameters
    };
    
    // Send to Google Analytics
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
    
    // Send to custom analytics (if available)
    if (window.customAnalytics) {
        window.customAnalytics.track(eventName, eventData);
    }
    
    // Log for debugging (remove in production)
    console.log('Analytics Event:', eventName, eventData);
}

/**
 * Track page views with enhanced context
 */
function trackPageView() {
    const pageData = {
        page_title: document.title,
        page_location: window.location.href,
        referrer: document.referrer,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        screen_size: `${screen.width}x${screen.height}`,
        color_depth: screen.colorDepth,
        language: navigator.language,
        platform: navigator.platform,
        cookie_enabled: navigator.cookieEnabled
    };
    
    trackEvent(ANALYTICS_CONFIG.CUSTOM_EVENTS.PAGE_VIEW, pageData);
}

/**
 * Track tool usage (calculators, assessments)
 */
function trackToolUsage(toolName, toolData = {}) {
    trackEvent(ANALYTICS_CONFIG.CUSTOM_EVENTS.TOOL_USAGE, {
        tool_name: toolName,
        tool_completion: toolData.completed || false,
        tool_results: toolData.results || null,
        time_spent: toolData.timeSpent || null,
        ...toolData
    });
}

/**
 * Track resource downloads
 */
function trackResourceDownload(resourceName, resourceType = 'unknown') {
    trackEvent(ANALYTICS_CONFIG.CUSTOM_EVENTS.RESOURCE_DOWNLOAD, {
        resource_name: resourceName,
        resource_type: resourceType,
        download_method: 'direct_link'
    });
}

/**
 * Track consultation requests
 */
function trackConsultationRequest(source = 'unknown') {
    trackEvent(ANALYTICS_CONFIG.CUSTOM_EVENTS.CONSULTATION_REQUEST, {
        request_source: source,
        conversion_page: window.location.pathname,
        conversion_value: 500 // Estimated value of consultation lead
    });
}

/**
 * Track email signups
 */
function trackEmailSignup(source = 'unknown', listType = 'general') {
    trackEvent(ANALYTICS_CONFIG.CUSTOM_EVENTS.EMAIL_SIGNUP, {
        signup_source: source,
        list_type: listType,
        conversion_value: 50 // Estimated value of email subscriber
    });
}

/**
 * Track case study views
 */
function trackCaseStudyView(caseStudyName) {
    trackEvent(ANALYTICS_CONFIG.CUSTOM_EVENTS.CASE_STUDY_VIEW, {
        case_study_name: caseStudyName,
        content_type: 'case_study'
    });
}

/**
 * Track video plays
 */
function trackVideoPlay(videoTitle, videoId = null) {
    trackEvent(ANALYTICS_CONFIG.CUSTOM_EVENTS.VIDEO_PLAY, {
        video_title: videoTitle,
        video_id: videoId,
        content_type: 'video'
    });
}

/**
 * Track external link clicks
 */
function trackExternalLinkClick(linkUrl, linkText = '') {
    trackEvent(ANALYTICS_CONFIG.CUSTOM_EVENTS.EXTERNAL_LINK_CLICK, {
        link_url: linkUrl,
        link_text: linkText,
        outbound: true
    });
}

/**
 * Track scroll depth
 */
function initializeScrollTracking() {
    let maxScroll = 0;
    const checkpoints = [25, 50, 75, 90, 100];
    const reached = new Set();
    
    function updateScrollDepth() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
        }
        
        checkpoints.forEach(checkpoint => {
            if (scrollPercent >= checkpoint && !reached.has(checkpoint)) {
                reached.add(checkpoint);
                trackEvent('scroll_depth', {
                    percent_scrolled: checkpoint,
                    page_title: document.title
                });
            }
        });
    }
    
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollDepth();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Track final scroll depth when user leaves
    window.addEventListener('beforeunload', () => {
        trackEvent('page_exit', {
            max_scroll_depth: maxScroll,
            time_on_page: Math.round((Date.now() - window.pageLoadTime) / 1000)
        });
    });
}

/**
 * Track form interactions
 */
function initializeFormTracking() {
    document.addEventListener('submit', (e) => {
        const form = e.target;
        const formId = form.id || form.className || 'unknown_form';
        
        trackEvent('form_submit', {
            form_id: formId,
            form_action: form.action || window.location.href
        });
    });
    
    // Track form field interactions
    const formFields = document.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            trackEvent('form_field_focus', {
                field_name: field.name || field.id || 'unknown_field',
                field_type: field.type || field.tagName.toLowerCase()
            });
        });
    });
}

/**
 * Track button clicks
 */
function initializeButtonTracking() {
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button, .btn, .cta-button, .download-btn');
        if (button) {
            const buttonText = button.textContent.trim();
            const buttonClass = button.className;
            
            trackEvent('button_click', {
                button_text: buttonText,
                button_class: buttonClass,
                button_location: window.location.pathname
            });
        }
        
        // Track external link clicks
        const link = e.target.closest('a');
        if (link && link.href) {
            const isExternal = !link.href.includes(window.location.hostname);
            const isConsultation = link.href.includes('tidycal.com') || link.href.includes('calendly.com');
            
            if (isExternal) {
                trackExternalLinkClick(link.href, link.textContent.trim());
                
                if (isConsultation) {
                    trackConsultationRequest('direct_link');
                }
            }
        }
    });
}

/**
 * Track time on page
 */
function initializeTimeTracking() {
    window.pageLoadTime = Date.now();
    
    // Track engagement milestones
    const milestones = [30, 60, 120, 300]; // seconds
    milestones.forEach(seconds => {
        setTimeout(() => {
            trackEvent('time_milestone', {
                seconds_on_page: seconds,
                engagement_level: seconds >= 120 ? 'high' : seconds >= 60 ? 'medium' : 'low'
            });
        }, seconds * 1000);
    });
}

/**
 * Initialize enhanced ecommerce tracking for tools/calculators
 */
function trackToolInteraction(toolName, action, details = {}) {
    trackEvent('tool_interaction', {
        tool_name: toolName,
        action: action, // 'start', 'complete', 'abandon'
        ...details
    });
}

/**
 * A/B Testing Framework
 */
const ABTesting = {
    tests: new Map(),
    
    defineTest(testName, variants) {
        this.tests.set(testName, {
            variants,
            userVariant: this.getUserVariant(testName, variants.length)
        });
        
        // Track test assignment
        trackEvent('ab_test_assigned', {
            test_name: testName,
            variant: this.tests.get(testName).userVariant
        });
    },
    
    getUserVariant(testName, variantCount) {
        // Simple hash-based assignment for consistent user experience
        const hash = this.simpleHash(testName + (localStorage.getItem('user_id') || 'anonymous'));
        return hash % variantCount;
    },
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    },
    
    getVariant(testName) {
        const test = this.tests.get(testName);
        return test ? test.userVariant : 0;
    },
    
    trackConversion(testName, conversionType = 'default') {
        const test = this.tests.get(testName);
        if (test) {
            trackEvent('ab_test_conversion', {
                test_name: testName,
                variant: test.userVariant,
                conversion_type: conversionType
            });
        }
    }
};

/**
 * Performance monitoring
 */
function initializePerformanceTracking() {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                trackEvent('core_web_vital', {
                    metric_name: 'LCP',
                    value: Math.round(entry.startTime),
                    rating: entry.startTime < 2500 ? 'good' : entry.startTime < 4000 ? 'needs_improvement' : 'poor'
                });
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                trackEvent('core_web_vital', {
                    metric_name: 'FID',
                    value: Math.round(entry.processingStart - entry.startTime),
                    rating: entry.processingStart - entry.startTime < 100 ? 'good' : 
                           entry.processingStart - entry.startTime < 300 ? 'needs_improvement' : 'poor'
                });
            }
        }).observe({ entryTypes: ['first-input'] });
    }
    
    // Track page load timing
    window.addEventListener('load', () => {
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                trackEvent('page_performance', {
                    load_time: Math.round(navigation.loadEventEnd - navigation.fetchStart),
                    dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
                    first_byte: Math.round(navigation.responseStart - navigation.fetchStart)
                });
            }
        }, 0);
    });
}

/**
 * Initialize all analytics
 */
function initializeAnalytics() {
    // Core analytics platforms
    initializeGA4();
    initializeClarity();
    initializeLinkedIn();
    
    // Enhanced tracking
    initializeScrollTracking();
    initializeFormTracking();
    initializeButtonTracking();
    initializeTimeTracking();
    initializePerformanceTracking();
    
    // Track initial page view
    trackPageView();
    
    // Example A/B test (uncomment to use)
    // ABTesting.defineTest('cta_button_color', ['blue', 'green', 'orange']);
}

/**
 * Conversion funnel tracking
 */
const ConversionFunnel = {
    steps: [
        'page_view',
        'content_engagement',
        'tool_usage',
        'consultation_request'
    ],
    
    trackStep(stepName, additionalData = {}) {
        const stepIndex = this.steps.indexOf(stepName);
        if (stepIndex !== -1) {
            trackEvent('funnel_step', {
                step_name: stepName,
                step_index: stepIndex,
                funnel_name: 'consultation_conversion',
                ...additionalData
            });
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
} else {
    initializeAnalytics();
}

// Export for global access
window.Analytics = {
    track: trackEvent,
    trackPageView,
    trackToolUsage,
    trackResourceDownload,
    trackConsultationRequest,
    trackEmailSignup,
    trackCaseStudyView,
    trackVideoPlay,
    trackExternalLinkClick,
    trackToolInteraction,
    ABTesting,
    ConversionFunnel
};