async function fetchData() {
    try {
        const timestamp = new Date().getTime();
        const cacheBuster = Math.random().toString(36).substring(7);
        const options = {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '-1',
                'If-None-Match': cacheBuster
            }
        };

        const priceResponse = await fetch(`data/ethereum-prices.json?t=${timestamp}&n=${cacheBuster}`, options);
        const priceData = await priceResponse.json();

        const obituariesResponse = await fetch(`data/ethereum-obituaries.json?t=${timestamp}&n=${cacheBuster}`, options);
        const obituariesData = await obituariesResponse.json();

        if (!Array.isArray(priceData) || priceData.length === 0) {
            console.error('Invalid or empty price data');
            return null;
        }

        return { priceData, obituariesData };
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return null;
    }
}

async function init() {
    const data = await fetchData();
    if (!data) {
        console.error('Failed to initialize data');
        return;
    }
    const { priceData, obituariesData } = data;

    createChart(priceData, obituariesData);
    initTimelineFilter(obituariesData, priceData); // does the initial timeline render

    const countElement = document.querySelector('.obituaries-count');
    if (countElement) countElement.textContent = `${obituariesData.length} times`;
}

/* Keyboard- and pointer-accessible info tooltip, clamped to the viewport. */
document.addEventListener('DOMContentLoaded', function () {
    const infoIcon = document.querySelector('.info-icon');
    const infoTooltip = document.getElementById('info-tooltip');
    if (!infoIcon || !infoTooltip) return;

    function showTooltip() {
        infoTooltip.style.display = 'block';
        const iconRect = infoIcon.getBoundingClientRect();
        const ttRect = infoTooltip.getBoundingClientRect();
        const margin = 12;
        let left = iconRect.right + 10;
        // Flip/clamp so it never runs off the right edge.
        if (left + ttRect.width > window.innerWidth - margin) {
            left = Math.max(margin, window.innerWidth - ttRect.width - margin);
        }
        let top = iconRect.top - 5 + window.scrollY;
        infoTooltip.style.left = `${left}px`;
        infoTooltip.style.top = `${top}px`;
    }
    function hideTooltip() {
        infoTooltip.style.display = 'none';
    }

    infoIcon.addEventListener('mouseenter', showTooltip);
    infoIcon.addEventListener('mouseleave', hideTooltip);
    infoIcon.addEventListener('focus', showTooltip);
    infoIcon.addEventListener('blur', hideTooltip);
    infoIcon.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') hideTooltip();
    });
});

init();

// Periodic refresh: update ONLY the latest-price plot line — never rebuild
// the chart or timeline (obituary/price JSON is static per deploy).
setInterval(() => {
    if (window.__ethChart) {
        updateLatestPrice(window.__ethChart);
    }
}, 60000);
