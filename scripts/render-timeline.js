/* Resolve the display date + year for an obituary, honoring the two
   hard-coded 2014 entries that predate reliable dating. */
function resolveObituary(obituary) {
    let displayDate = obituary.date;
    let year = new Date(obituary.date).getFullYear();

    if (obituary.statement === "Sidechains: the coming death of altcoins and ethereum.") {
        displayDate = "2014-04-09";
        year = 2014;
    }
    if (obituary.statement === "Why Ethereum is dead in the water.") {
        displayDate = "2014-10-15";
        year = 2014;
    }
    return { displayDate, year };
}

/* Render a (possibly filtered) list of obituaries into the timeline.
   Year headers and their counts reflect exactly the list passed in. */
function renderTimeline(obituariesData, priceData) {
    const timelineContainer = document.getElementById('timeline');

    // Work on a copy so we never mutate the caller's array (the filter
    // module holds the canonical unsorted list).
    const list = obituariesData.slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Clear previous content.
    while (timelineContainer.firstChild) {
        timelineContainer.removeChild(timelineContainer.firstChild);
    }

    // The glowing vertical rail.
    const backgroundLine = document.createElement('div');
    backgroundLine.className = 'timeline-background-line';
    backgroundLine.style.height = '100%';
    timelineContainer.appendChild(backgroundLine);

    if (list.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'timeline-no-results';
        empty.textContent = 'No obituaries match your search.';
        timelineContainer.appendChild(empty);
        return;
    }

    // Count per year for this list.
    const yearCounts = {};
    list.forEach(obituary => {
        const { year } = resolveObituary(obituary);
        yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    let currentYear = null;

    list.forEach(obituary => {
        const { displayDate, year } = resolveObituary(obituary);

        // Year header on the first entry of each year.
        if (year !== currentYear) {
            currentYear = year;
            const yearTitle = document.createElement('div');
            yearTitle.className = 'timeline-year';
            const deathCount = yearCounts[year];
            const deathText = deathCount === 1 ? 'time' : 'times';
            yearTitle.innerHTML = `${year} <span class="year-count">(ETH died ${deathCount} ${deathText})</span>`;
            yearTitle.id = `year-${year}`;
            timelineContainer.appendChild(yearTitle);
        }

        // The whole card is a link to the source.
        const entry = document.createElement('a');
        entry.className = 'timeline-entry';
        entry.href = obituary.link;
        entry.target = '_blank';
        entry.rel = 'noopener noreferrer';
        entry.title = 'View source';
        entry.setAttribute('aria-label',
            `${obituary.statement} — ${obituary.author} (${obituary.source}), ${displayDate}`);

        const date = document.createElement('div');
        date.className = 'timeline-date';
        date.textContent = new Date(displayDate).toISOString().split('T')[0];

        const statement = document.createElement('div');
        statement.className = 'timeline-statement';
        const statementText = document.createElement('span');
        statementText.textContent = obituary.statement;
        statement.appendChild(statementText);
        if (!obituary.isWebpageUp) {
            const skullEmoji = document.createElement('span');
            skullEmoji.textContent = ' 💀';
            skullEmoji.title = "The website died or the author deleted the post before we could archive it.\nEthereum: 1 / Doomsayer: 0.";
            skullEmoji.className = 'skull-emoji';
            statement.appendChild(skullEmoji);
        }

        const authorSourceContainer = document.createElement('div');
        authorSourceContainer.className = 'author-source-container';
        const author = document.createElement('span');
        author.className = 'timeline-author';
        author.textContent = `— ${obituary.author}`;
        const source = document.createElement('span');
        source.className = 'timeline-source';
        source.textContent = ` (${obituary.source})`;
        authorSourceContainer.appendChild(author);
        authorSourceContainer.appendChild(source);

        const priceEntry = priceData.find(p => p.date === obituary.date);
        const price = document.createElement('div');
        price.className = 'timeline-price';
        price.textContent = priceEntry ? `$${priceEntry.price.toFixed(2)} ETH` : 'N/A';

        entry.appendChild(date);
        entry.appendChild(statement);
        entry.appendChild(authorSourceContainer);
        entry.appendChild(price);

        timelineContainer.appendChild(entry);
    });
}
