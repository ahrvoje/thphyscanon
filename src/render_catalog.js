joinValues = (values, separator=', ') => {
    txt = ""
    for (i in values) {
        txt += values[i] + separator
    }
    return txt.substring(0, txt.length - separator.length)  // delete trailing separator
}

createDataEntry = (datatable, item, name, data) => {
    if (!data.length) {
        return
    }

    var attr = document.createElement('td')
    attr.setAttribute('class', 'attribute')
    attr.textContent = name

    var value = document.createElement('td')
    value.setAttribute('class', 'value')

    var entry = document.createElement('tr')
    entry.setAttribute('class', 'entry')
    entry.appendChild(attr)
    entry.appendChild(value)

    if (name === "Author") {
        value.textContent = joinValues(data, separator=' / ')
    } else if (name === "Editor") {
        value.textContent = joinValues(data, separator=' / ')
    } else if (name === "Subtitle") {
        value.textContent = joinValues(data, separator=' / ')
    } else if (name === "English subtitle") {
        value.textContent = joinValues(data, separator=' / ')
    } else if (name === "Pages") {
        value.textContent = joinValues(data, separator=' / ')
    } else if (name === "Publisher") {
        value.textContent = joinValues(data, separator=' / ')
    } else if (name === "Contributor") {
        txt = ""
        separator = " / "
        for (i in item.contributor) {
            contributor = item.contributor[i]
            txt += contributor[0] + " (" + contributor[1] + ")"+ separator
        }
        value.textContent = txt.substring(0, txt.length - separator.length)  // delete trailing separator
    } else if (name === "Language") {
        value.textContent = joinValues(data)
    } else if (name === "ISBN") {
        value.textContent = joinValues(data, separator= " / ")
    } else if (name === "OCLC") {
        value.innerHTML = "<a href=\"https://search.worldcat.org/title/" + data + "\" target=\"_blank\">" + data + "</a>"
    } else if (name === "Link") {
        txt = ""
        for (i in item.link) {
            link = item.link[i]
            txt += "<a href=\"" + link + "\" target=\"_blank\">" + link + "</a><br/>"
        }
        txt = txt.substring(0, txt.length - 5)  // delete trailing <br/>
        value.innerHTML = txt
    } else if (name === "Subject") {
        txt = ""
        for (i in item.subject) {
            subject = item.subject[i]
            window.tpc_subjects.add(subject)
            txt += "<div class=\"subject\">" + subject + "</div>"
        }
        value.innerHTML = txt
    } else if (name === "Tags") {
        txt = ""
        for (i in item.tags) {
            tag = item.tags[i]
            window.tpc_tags.add(tag)
            txt += "<div class=\"tag\">" + tag + "</div>"
        }
        value.innerHTML = txt
    } else if (name == "Notes") {
        value.innerHTML = data

        value.parentElement.classList.add("notesentry")
        value.parentElement.firstChild.classList.add("notesattribute")
        value.classList.add("notesvalue")
    } else {
            value.textContent = data
    }

    datatable.appendChild(entry)
}

createImages = (images) => {
    if (!images.length) {
        return document.createElement('div')
    }

    var images_el = document.createElement('div')
    images_el.setAttribute('class', 'images')

    for (i in images[0][0]) {
        image_img = images[0][0][i]

        var image_el = document.createElement('img')
        image_el.setAttribute('class', 'image')
        image_el.setAttribute('src', "resources/images/" + image_img)
        images_el.appendChild(image_el)
    }

    return images_el
}

const renderCatalog = async () => {
    catalog = await loadCatalog();

    for (i in catalog) {
        item = catalog[i][0]

        var card = document.createElement('div')
        card.setAttribute('class', 'card')
        card.setAttribute('id', i)
        card.appendChild(createImages(item.image))

        var datatable = document.createElement('table')
        datatable.setAttribute('class', 'data')
        createDataEntry(datatable, item, "Author", item.author)
        createDataEntry(datatable, item, "Editor", item.editor)
        createDataEntry(datatable, item, "Eng. title", item.engtitle)
        createDataEntry(datatable, item, "Title", item.title)
        createDataEntry(datatable, item, "Rom. title", item.romantitle)
        createDataEntry(datatable, item, "Eng. subtitle", item.engsubtitle)
        createDataEntry(datatable, item, "Subtitle", item.subtitle)
        createDataEntry(datatable, item, "Rom. subtitle", item.romansubtitle)
        createDataEntry(datatable, item, "Publisher", item.publisher)
        createDataEntry(datatable, item, "Date", item.date)
        createDataEntry(datatable, item, "Place", item.place)
        createDataEntry(datatable, item, "Reference", item.reference)
        createDataEntry(datatable, item, "Contributor", item.contributor)
        createDataEntry(datatable, item, "Language", item.language)
        createDataEntry(datatable, item, "ISBN", item.isbn)
        createDataEntry(datatable, item, "OCLC", item.oclc)
        createDataEntry(datatable, item, "Link", item.link)
        createDataEntry(datatable, item, "Subject", item.subject)
        createDataEntry(datatable, item, "Tags", item.tags)
        createDataEntry(datatable, item, "Notes", item.notes)

        card.appendChild(datatable)
        document.getElementById('catalog').appendChild(card);
    }
}

const filterLabelClick = (el) => {
    filterrow = el.closest(".filterrow")
    filters = filterrow.getElementsByClassName("filters")[0].children

    if (filterrow.firstChild.firstChild.checked) {
        newState = true;
    } else {
        newState = false;
    }

    for (i in filters) {
        filter = filters[i]

        if (!filter.firstChild) {
            continue
        }

        if (!filter.firstChild.checked && newState) {
            filter.firstChild.click()
        } else if (filter.firstChild.checked && !newState) {
            filter.firstChild.click()
        }
    }
}

const mainFilterChange = (el) => {
    filterrow = el.closest(".filterrow")
    filters = filterrow.getElementsByClassName("filters")[0].children

    someTrue = false;
    someFalse = false
    for (i in filters) {
        filter = filters[i]

        if (!filter.firstChild) {
            continue
        }

        if (filter.firstChild.checked) {
            someTrue = true
        } else {
            someFalse = true
        }
    }

    mainCheck = filterrow.firstChild.firstChild;
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
    items = document.getElementsByClassName(el.parentElement.getAttribute("category"))
    for (i in items) {
        item = items[i]
        if (item.textContent == el.parentElement.textContent) {
            if (el.checked) {
                item.closest(".card").style.display = "flex";
            } else {
                item.closest(".card").style.display = "none";
            }
        }
    }

    mainFilterChange(el)
}

const renderFilters = async () => {
    txt = ""
    for (i in window.tpc_subjects) {
        subject = window.tpc_subjects[i]
        txt += "<div class=\"filter\" category=\"subject\"><input type=\"checkbox\" id=\"subject " + subject + "\" onchange=\"filterChange(this)\" checked/><label for=\"subject " + subject + "\">" + subject + "</label></div>"
    }
    document.getElementById('subjectsfilterrow').getElementsByClassName("filters")[0].innerHTML = txt

    txt = ""
    for (i in window.tpc_tags) {
        tag = window.tpc_tags[i]
        txt += "<div class=\"filter\" category=\"tag\"><input type=\"checkbox\" id=\"tag " + tag + "\" onchange=\"filterChange(this)\" checked/><label for=\"tag " + tag + "\">" + tag + "</label></div>"
    }
    document.getElementById('tagsfilterrow').getElementsByClassName("filters")[0].innerHTML = txt
}

renderPage = async () => {
    window.tpc_subjects = new Set();
    window.tpc_tags = new Set();

    await renderCatalog();

    window.tpc_subjects = Array.from(window.tpc_subjects).sort()
    window.tpc_tags = Array.from(window.tpc_tags).sort()

    await renderFilters();
}
renderPage()
