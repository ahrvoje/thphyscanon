createDataEntry = (datatable, item, name, data) => {
    if (name != 'Link' && !data.length) {
        return
    }

    if (name == 'Link' && !data.length && !item.doi.length) {
        return
    }

    var attr = document.createElement('td')
    attr.setAttribute('class', 'attribute')
    attr.textContent = name

    var value = document.createElement('td')
    value.setAttribute('class', 'value')

    var entry = document.createElement('tr')
    entry.setAttribute('class', 'dataentry')
    entry.appendChild(attr)
    entry.appendChild(value)

    if (name === 'Author') {
        value.innerHTML = data.join('<br>')
    } else if (name === 'Editor') {
        value.innerHTML = data.join('<br>')
    } else if (name === 'Subtitle') {
        value.innerHTML = data.join('<br>')
    } else if (name === 'English subtitle') {
        value.textContent = data.join(' / ')
    } else if (name === 'Pages') {
        value.textContent = data.join(' / ')
    } else if (name === 'Publisher') {
        value.textContent = data.join(' / ')
    } else if (name === 'Contributor') {
        txt = ''
        separator = ' / '
        for (i in item.contributor) {
            contributor = item.contributor[i]
            txt += contributor[0] + ' (' + contributor[1] + ')'+ separator
        }
        value.textContent = txt.substring(0, txt.length - separator.length)  // delete trailing separator
    } else if (name === 'Language') {
        value.textContent = data.join(' / ')
    } else if (name === 'ISBN') {
        value.innerHTML = data.join('<br>')
    } else if (name === 'OCLC') {
        value.innerHTML = '<a href=\'https://search.worldcat.org/title/' + data + '\' target=\'_blank\'>' + data + '</a>'
    } else if (name === 'Link') {
        txt = ''

        if (item.doi) {
            txt += '<a href=\'https://doi.org/' + item.doi + '\' target=\'_blank\'>'+ item.doi + '</a><br>'
        }
    
        for (i in item.link) {
            link = item.link[i]
            txt += '<a href=\'' + link + '\' target=\'_blank\'>' + link + '</a><br>'
        }
        txt = txt.substring(0, txt.length - 5)  // delete trailing <br>
        value.innerHTML = txt
    } else if (name === 'Subject') {
        txt = ''
        for (i in item.subject) {
            subject = item.subject[i]
            window.tpc_subjects.add(subject)
            txt += '<div class=\'subject\'>' + subject + '</div>'
        }
        value.innerHTML = txt
    } else if (name === 'Tags') {
        txt = ''
        for (i in item.tags) {
            tag = item.tags[i]
            window.tpc_tags.add(tag)
            txt += '<div class=\'tag\'>' + tag + '</div>'
        }
        value.innerHTML = txt
    } else if (name == 'Notes') {
        value.innerHTML = data

        value.parentElement.classList.add('notesentry')
        value.parentElement.children[0].classList.add('notesattribute')
        value.classList.add('notesvalue')
    } else {
        value.textContent = data
    }

    datatable.appendChild(entry)
}

createImages = (images) => {
    if (!images.length) {
        return
    }

    var images_el = document.createElement('div')
    images_el.setAttribute('class', 'images')

    for (i in images[0][0]) {
        image_img = images[0][0][i]

        var image_el = document.createElement('img')
        image_el.setAttribute('class', 'image')
        image_el.setAttribute('src', 'resources/images/' + image_img)
        images_el.appendChild(image_el)
    }

    var images_caption = document.createElement('div')
    images_caption.setAttribute('class', 'imagescaption')
    images_caption.innerHTML = images[0][1]

    var images_form = document.createElement('div')
    images_form.setAttribute('class', 'imagesform')
    images_form.appendChild(images_el)
    images_form.appendChild(images_caption)

    return images_form
}

const createBookCard = async (item, id) => {
    var card = document.createElement('div')
    card.setAttribute('class', 'bookcard')
    card.setAttribute('id', id)

    var anchorlink = document.createElement('div')
    anchorlink.setAttribute('class', 'anchor')
    anchorlink.innerHTML = '<a href=\'#' + id + '\'>🔗</a>'
    card.appendChild(anchorlink)
    card.appendChild(createImages(item.image))

    var datatable = document.createElement('table')
    datatable.setAttribute('class', 'data')
    createDataEntry(datatable, item, 'Author', item.author)
    createDataEntry(datatable, item, 'Editor', item.editor)
    createDataEntry(datatable, item, 'Eng. title', item.engtitle)
    createDataEntry(datatable, item, 'Title', item.title)
    createDataEntry(datatable, item, 'Rom. title', item.romantitle)
    createDataEntry(datatable, item, 'Eng. subtitle', item.engsubtitle)
    createDataEntry(datatable, item, 'Subtitle', item.subtitle)
    createDataEntry(datatable, item, 'Rom. subtitle', item.romansubtitle)
    createDataEntry(datatable, item, 'Publisher', item.publisher)
    createDataEntry(datatable, item, 'Date', item.date)
    createDataEntry(datatable, item, 'Place', item.place)
    createDataEntry(datatable, item, 'Reference', item.reference)
    createDataEntry(datatable, item, 'Contributor', item.contributor)
    createDataEntry(datatable, item, 'Language', item.language)
    createDataEntry(datatable, item, 'ISBN', item.isbn)
    createDataEntry(datatable, item, 'OCLC', item.oclc)
    createDataEntry(datatable, item, 'Link', item.link)
    createDataEntry(datatable, item, 'Subject', item.subject)
    createDataEntry(datatable, item, 'Tags', item.tags)
    createDataEntry(datatable, item, 'Notes', item.notes)

    card.appendChild(datatable)
    return card
}

const renderBooks = async (catalog) => {
    var section = document.createElement('div')
    section.setAttribute('class', 'section')
    section.innerHTML = 'Books'
    document.getElementById('catalog').appendChild(section)

    for (i in catalog) {
        item = catalog[i][0]

        var card = await createBookCard(item)
        document.getElementById('catalog').appendChild(card);
    }
}

const chicagoNames = (names) => {
    txt = ''

    for (i in names) {
        name = names[i]

        internationalName = name.split('(')[0]
        lastfirstName = internationalName.split(',')

        lastName = lastfirstName[0]
        firstName = lastfirstName[1]

        if (!firstName) {
            txt += lastName
        } else {
            if (i == 0) {
                txt += lastName + ', ' + firstName
            } else {
                txt += firstName + ' ' + lastName
            }
        }

        if (i < names.length - 1) {
            txt += ', '
        }

        if (i == names.length - 2) {
            txt += 'and '
        }
    }

    if (txt[txt.length - 1] != '.') {
        txt += '.'
    }

    return txt
}

const createArticleCard = async (item, id) => {
    var card = document.createElement('div')
    card.setAttribute('class', 'articlecard')
    card.setAttribute('id', id)

    var anchorLink = document.createElement('div')
    anchorLink.setAttribute('class', 'anchor')
    anchorLink.innerHTML = '<a href=\'#' + id + '\'>🔗</a>'
    card.appendChild(anchorLink)

    var articleData = document.createElement('div')
    articleData.setAttribute('class', 'articledata')
    card.appendChild(articleData)

    var biblio = document.createElement('div')
    biblio.setAttribute('class', 'biblio')
    articleData.appendChild(biblio)

    biblio.innerHTML =  chicagoNames(item.author)
    biblio.innerHTML += '<span class=\'bibliospace\'/>'    + item.date.substring(0, 4) + '.'
    biblio.innerHTML += '<span class=\'bibliospace\'/>\'' + item.title + '\'.'
    biblio.innerHTML += '<span class=\'bibliospace\'/><i>' + item.reference.journal + '</i>'
    if (item.reference.volume) {
        biblio.innerHTML += '<span class=\'bibliospace\'/><i>' + item.reference.volume + '</i>'
    }
    if (item.reference.issue) {
        biblio.innerHTML += '<span class=\'bibliospace\'/>(' + item.reference.issue + ')'
    }
    if (item.reference.pagerange) {
        biblio.innerHTML += ':<span class=\'bibliospace\'/>' + item.reference.pagerange
    }
    biblio.innerHTML += '.'

    var data = document.createElement('div')
    data.setAttribute('class', 'data')
    createDataEntry(data, item, 'OCLC', item.oclc)
    createDataEntry(data, item, 'Link', item.link)
    createDataEntry(data, item, 'Subject', item.subject)
    createDataEntry(data, item, 'Tags', item.tags)
    createDataEntry(data, item, 'Notes', item.notes)

    articleData.appendChild(data)

    return card
}

const createCard = async (item, id) => {
    if (item.type == 'book')    return await createBookCard(item, id)
    if (item.type.includes('article')) return await createArticleCard(item, id)
}

const renderSubArticles = async (catalog, subsectionText, subsectionType) => {
    var subsection = document.createElement('div')
    subsection.setAttribute('class', 'subsection')
    subsection.innerHTML = subsectionText
    document.getElementById('catalog').appendChild(subsection)

    for (i in catalog) {
        item = catalog[i][0]

        if (item.type != subsectionType) {
            continue
        }

        document.getElementById('catalog').appendChild(await renderArticle(item))
    }
}

const renderArticles = async (catalog) => {
    var section = document.createElement('div')
    section.setAttribute('class', 'section')
    section.innerHTML = 'Articles'
    document.getElementById('catalog').appendChild(section)

    await renderSubArticles(catalog, 'Discoveries', 'article-discovery')
    await renderSubArticles(catalog, 'Seminal reviews', 'article-review-seminal')
    await renderSubArticles(catalog, 'Living reviews', 'article-review-living')
}

const renderCatalog = async () => {
    catalog = await loadCatalog()
    await renderBooks(catalog)
    await renderArticles(catalog)
}

const filterLabelClick = (el) => {
    filterrow = el.closest('.filterrow')
    filters = filterrow.getElementsByClassName('filters')[0].children

    if (filterrow.children[0].children[0].checked) {
        newState = true;
    } else {
        newState = false;
    }

    for (i in filters) {
        filter = filters[i]

        if (!filter.children) {
            continue
        }

        if (!filter.children[0]) {
            continue
        }

        if (!filter.children[0].checked && newState) {
            filter.children[0].click()
        } else if (filter.children[0].checked && !newState) {
            filter.children[0].click()
        }
    }
}

const mainFilterChange = (el) => {
    filterrow = el.closest('.filterrow')
    filters = filterrow.getElementsByClassName('filters')[0].children

    someTrue = false;
    someFalse = false
    for (i in filters) {
        filter = filters[i]

        if (!filter.children) {
            continue
        }

        if (!filter.children[0]) {
            continue
        }

        if (filter.children[0].checked) {
            someTrue = true
        } else {
            someFalse = true
        }
    }

    mainCheck = filterrow.children[0].children[0];
    if (!someFalse) {
        mainCheck.indeterminate = false;
        mainCheck.checked = true;
    } else if (!someTrue) {
        mainCheck.indeterminate = false;
        mainCheck.checked = false;        
    } else {
        mainCheck.indeterminate = true;
        mainCheck.checked = false;
    }
}

const filterChange = (el) => {
    items = document.getElementsByClassName(el.parentElement.getAttribute('category'))

    for (i in items) {
        item = items[i]

        if (item.textContent != el.parentElement.textContent) {
            continue
        }

        card = item.closest('.bookcard') || item.closest('.articlecard')
        if (!card) {
            continue
        }
        
        if (el.checked) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    }

    mainFilterChange(el)
}

const renderFilters = async () => {
    txt = ''
    for (i in window.tpc_subjects) {
        subject = window.tpc_subjects[i]
        txt += '<div class=\'filter\' category=\'subject\'><input type=\'checkbox\' id=\'subject ' + subject + '\' onchange=\'filterChange(this)\' checked/><label for=\'subject ' + subject + '\'>' + subject + '</label></div>'
    }
    document.getElementById('subjectsfilterrow').getElementsByClassName('filters')[0].innerHTML = txt

    txt = ''
    for (i in window.tpc_tags) {
        tag = window.tpc_tags[i]
        txt += '<div class=\'filter\' category=\'tag\'><input type=\'checkbox\' id=\'tag ' + tag + '\' onchange=\'filterChange(this)\' checked/><label for=\'tag ' + tag + '\'>' + tag + '</label></div>'
    }
    document.getElementById('tagsfilterrow').getElementsByClassName('filters')[0].innerHTML = txt
}

const showFilter = (el) => {
    filterType = el.classList[1]

    if (el.checked) {
        displayState = 'flex'
    } else {
        displayState = 'none'
    }

    filterrow = document.getElementById(filterType + 'filterrow')
    filterrow.style.display = displayState
}

// Make tierToggle globally accessible for HTML onchange handlers
window.tierToggle = (tier, show) => {
    const entries = document.querySelectorAll('.entry[tier="' + tier + '"]')
    for (const entry of entries) {
        entry.style.display = show ? '' : 'none'
        // Also hide/show the adjacent card (bookcard or articlecard)
        const nextEl = entry.nextElementSibling
        if (nextEl && (nextEl.classList.contains('bookcard') || nextEl.classList.contains('articlecard'))) {
            nextEl.style.display = show ? '' : 'none'
        }
    }
}

const load_elements = async () => {
    const catalog = await loadCatalog()

    const entries = document.querySelectorAll('.entry')
    for (const el of entries) {
        if (!el.id) continue
        const item = catalog[el.id]
        if (!item) continue

        const menu = document.createElement('div')
        menu.className = 'menu'
        menu.textContent = ''

        const text = document.createElement('div')
        text.className = 'text'
        text.innerHTML = el.innerHTML

        el.innerHTML = ''
        el.appendChild(menu)
        el.appendChild(text)
        el.classList.add('detailed')
        el.after(await createCard(item, el.id))
    }
}

const renderPage = async () => {
    window.tpc_subjects = new Set();
    window.tpc_tags = new Set();
    
    await load_elements()
    //await renderCatalog();
    
    // Add tier markers to all entries with tier attribute (after load_elements to preserve markers)
    const entriesWithTier = document.querySelectorAll('.entry[tier]')
    for (const entry of entriesWithTier) {
        const tier = entry.getAttribute('tier')
        const marker = document.createElement('div')
        marker.className = 'tier-marker tier-' + tier
        entry.insertBefore(marker, entry.firstChild)
    }

    // Add anchor links to group titles
    const groupTitles = document.querySelectorAll('.grouptitle[id]')
    for (const title of groupTitles) {
        const id = title.getAttribute('id')
        const anchorLink = document.createElement('a')
        anchorLink.href = '#' + id
        anchorLink.className = 'grouptitle-anchor'
        anchorLink.textContent = '🔗'
        title.appendChild(anchorLink)
    }

    window.tpc_subjects = Array.from(window.tpc_subjects).sort()
    window.tpc_tags = Array.from(window.tpc_tags).sort()

    //await renderFilters();
    
    // Initialize uFuzzy search
    initSearch()
    registerWebMCP()
}

// uFuzzy search used for page and WebMCP
let uf, haystack, haystackNormalized, entryMap

const initSearch = () => {
    const searchInput = document.getElementById('searchInput')
    const searchStatus = document.getElementById('searchStatus')

    if (!searchInput) {
        console.error('TPC Search: searchInput element not found')
        return
    }

    if (typeof uFuzzy === 'undefined') {
        console.error('TPC Search: uFuzzy library not loaded')
        return
    }

    // Get all entry elements and build haystack
    const entries = document.querySelectorAll('.entry')
    haystack = []
    haystackNormalized = []  // Latinized version for searching
    entryMap = []

    entries.forEach((entry) => {
        const text = entry.textContent || entry.innerText
        haystack.push(text)
        haystackNormalized.push(uFuzzy.latinize(text))
        entryMap.push(entry)
        entry.dataset.originalHtml = entry.innerHTML
    })

    // Configure uFuzzy with single error tolerance
    uf = new uFuzzy({
        intraMode: 1,
        intraIns: 1,
        intraSub: 1,
        intraTrn: 1,
        intraDel: 1,
    })
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim()
        const queryNormalized = uFuzzy.latinize(query)
        performSearch(queryNormalized, uf, haystackNormalized, haystack, entryMap, searchStatus)
    })
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = ''
            searchInput.blur()
            performSearch('', uf, haystackNormalized, haystack, entryMap, searchStatus)
        }
    })
    
    // Clear button handler
    const searchClear = document.getElementById('searchClear')
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = ''
            searchInput.blur()
            performSearch('', uf, haystackNormalized, haystack, entryMap, searchStatus)
        })
    }
}

const performSearch = (query, uf, haystackNormalized, haystackOriginal, entryMap, searchStatus) => {
    const groups = document.querySelectorAll('.group')
    
    // If query is empty, show all entries and reset
    if (!query) {
        entryMap.forEach((entry) => {
            entry.classList.remove('search-hidden', 'search-visible')
            if (entry.dataset.originalHtml) {
                entry.innerHTML = entry.dataset.originalHtml
            }
            // Also reset adjacent card
            const nextEl = entry.nextElementSibling
            if (nextEl && (nextEl.classList.contains('bookcard') || nextEl.classList.contains('articlecard'))) {
                nextEl.classList.remove('search-hidden')
            }
        })
        groups.forEach((group) => {
            group.classList.remove('search-hidden')
        })
        searchStatus.textContent = ''
        return
    }
    
    // Perform fuzzy search with order-agnostic matching (on normalized text)
    const [idxs, info, order] = uf.search(haystackNormalized, query, true)
    
    if (!idxs || idxs.length === 0) {
        // No matches - hide all entries
        entryMap.forEach((entry) => {
            entry.classList.add('search-hidden')
            entry.classList.remove('search-visible')
        })
        groups.forEach((group) => {
            group.classList.add('search-hidden')
        })
        searchStatus.textContent = '0'
        return
    }
    
    // Create a set of matching indices for fast lookup
    const matchingIndices = new Set(idxs)
    
    // Apply visibility and highlighting
    entryMap.forEach((entry, index) => {
        const nextEl = entry.nextElementSibling
        const hasCard = nextEl && (nextEl.classList.contains('bookcard') || nextEl.classList.contains('articlecard'))
        
        if (matchingIndices.has(index)) {
            entry.classList.remove('search-hidden')
            entry.classList.add('search-visible')
            
            // Also show the adjacent card
            if (hasCard) {
                nextEl.classList.remove('search-hidden')
            }
            
            // Find the position in idxs array for highlighting
            const idxPos = idxs.indexOf(index)
            if (idxPos !== -1 && info && info.ranges && info.ranges[idxPos]) {
                highlightEntry(entry, haystackOriginal[index], info.ranges[idxPos])
            }
        } else {
            entry.classList.add('search-hidden')
            entry.classList.remove('search-visible')
            
            // Also hide the adjacent card
            if (hasCard) {
                nextEl.classList.add('search-hidden')
            }
            
            // Restore original HTML for hidden entries
            if (entry.dataset.originalHtml) {
                entry.innerHTML = entry.dataset.originalHtml
            }
        }
    })
    
    // Show/hide groups based on whether they have visible entries
    groups.forEach((group) => {
        const visibleEntries = group.querySelectorAll('.entry.search-visible')
        if (visibleEntries.length === 0) {
            group.classList.add('search-hidden')
        } else {
            group.classList.remove('search-hidden')
        }
    })
    
    searchStatus.textContent = `${idxs.length}`
}

const highlightEntry = (entry, text, ranges) => {
    if (!ranges || ranges.length === 0) {
        return
    }
    
    // Use uFuzzy's built-in highlight function if available
    let highlighted
    try {
        highlighted = uFuzzy.highlight(text, ranges, (part, matched) => {
            return matched ? '<mark class="search-highlight">' + escapeHtml(part) + '</mark>' : escapeHtml(part)
        })
    } catch (e) {
        // Fallback: manual highlighting
        highlighted = ''
        let lastEnd = 0
        
        for (let i = 0; i < ranges.length; i += 2) {
            const start = ranges[i]
            const end = ranges[i + 1]
            
            highlighted += escapeHtml(text.slice(lastEnd, start))
            highlighted += '<mark class="search-highlight">' + escapeHtml(text.slice(start, end)) + '</mark>'
            lastEnd = end
        }
        highlighted += escapeHtml(text.slice(lastEnd))
    }
    
    // Update entry content while preserving tier marker
    const tierMarker = entry.querySelector('.tier-marker')
    if (tierMarker) {
        entry.innerHTML = ''
        entry.appendChild(tierMarker.cloneNode(true))
        const textSpan = document.createElement('span')
        textSpan.innerHTML = highlighted
        entry.appendChild(textSpan)
    } else {
        entry.innerHTML = highlighted
    }
}

const escapeHtml = (text) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}

const registerWebMCP = () => {
    if (!navigator.modelContext) return

    navigator.modelContext.registerTool({
        name: "find_books",
        description: "Fuzzy search the Theoretical Physics Canon — a curated catalog of books and articles in theoretical physics. Returns matching entry texts.",
        inputSchema: {
            type: "object",
            properties: {
                pattern: {
                    type: "string",
                    description: "Search query (author, title, subject, year, etc.)"
                }
            },
            required: ["pattern"]
        },
        async execute({ pattern }) {
            const query = uFuzzy.latinize(pattern.trim())
            if (!query) return { content: [{ type: "text", text: "[]" }] }

            const [idxs] = uf.search(haystackNormalized, query, true)
            if (!idxs || idxs.length === 0)
                return { content: [{ type: "text", text: "[]" }] }

            const results = idxs.map(idx => haystack[idx])
            return { content: [{ type: "text", text: JSON.stringify(results) }] }
        }
    })
}

renderPage()
