/* Client-side search + filter for the timeline. Re-renders only the timeline
   list (never the chart). Depends on renderTimeline() and resolveObituary()
   from render-timeline.js. */
function initTimelineFilter(obituariesData, priceData) {
    const searchInput = document.getElementById('timeline-search');
    const yearSelect = document.getElementById('timeline-year');
    const sourceSelect = document.getElementById('timeline-source');
    const countEl = document.getElementById('timeline-result-count');

    const total = obituariesData.length;

    // Populate the year dropdown (respecting the hard-coded 2014 entries).
    const years = [...new Set(obituariesData.map(o => resolveObituary(o).year))]
        .sort((a, b) => b - a);
    years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = String(y);
        opt.textContent = y;
        yearSelect.appendChild(opt);
    });

    // Populate the source dropdown.
    const sources = [...new Set(obituariesData.map(o => o.source).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b));
    sources.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        sourceSelect.appendChild(opt);
    });

    function applyFilters() {
        const q = (searchInput.value || '').trim().toLowerCase();
        const year = yearSelect.value;
        const source = sourceSelect.value;

        const filtered = obituariesData.filter(o => {
            if (year && String(resolveObituary(o).year) !== year) return false;
            if (source && o.source !== source) return false;
            if (q) {
                const hay = `${o.statement} ${o.author} ${o.source}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });

        renderTimeline(filtered, priceData);

        if (countEl) {
            countEl.textContent = filtered.length === total
                ? `${total} obituaries`
                : `Showing ${filtered.length} of ${total} obituaries`;
        }
    }

    // Debounce the text input; selects apply immediately.
    let debounceId;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceId);
        debounceId = setTimeout(applyFilters, 150);
    });
    yearSelect.addEventListener('change', applyFilters);
    sourceSelect.addEventListener('change', applyFilters);

    // Initial render.
    applyFilters();
}
