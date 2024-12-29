joinValues = (values, separator=', ') => {
    txt = ""
    for (i in values) {
        txt += values[i] + separator
    }
    return txt.substring(0, txt.length - separator.length)  // delete trailing separator
}

createDataEntry = (name, data) => {
    if (!data.length) {
        return document.createElement('div')
    }

    var attr = document.createElement('td')
    attr.setAttribute('class', 'attribute')
    attr.textContent = name

    var value = document.createElement('td')
    value.setAttribute('class', 'value')

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
        for (i in book.contributor) {
            contributor = book.contributor[i]
            txt += contributor[0] + " (" + contributor[1] + ")"+ separator
        }
        value.textContent = txt.substring(0, txt.length - separator.length) // delete trailing separator
    } else if (name === "Language") {
        value.textContent = joinValues(data)
    } else if (name === "ISBN") {
        value.textContent = joinValues(data, separator= " / ")
    } else if (name === "OCLC") {
        value.innerHTML = "<a href=\"https://search.worldcat.org/title/" + data + "\" target=\"_blank\">" + data + "</a>"
    } else if (name === "Category") {
        value.textContent = joinValues(data)
    } else if (name === "Subject") {
        value.textContent = joinValues(data)
    } else if (name === "Canon") {
        value.textContent = joinValues(data)
    } else {
            value.textContent = data
    }

    var entry = document.createElement('tr')
    entry.setAttribute('class', 'entry')
    entry.appendChild(attr)
    entry.appendChild(value)

    return entry
}

createCovers = (covers) => {
    if (!covers.length) {
        return document.createElement('div')
    }

    var covers_el = document.createElement('div')
    covers_el.setAttribute('class', 'covers')

    for (i in covers[0][0]) {
        cover_img = covers[0][0][i]

        var cover_el = document.createElement('img')
        cover_el.setAttribute('class', 'cover')
        cover_el.setAttribute('src', "resources/covers/" + cover_img)
        covers_el.appendChild(cover_el)
    }

    return covers_el
}

const renderCatalog = async () => {
    catalog = await loadCatalog();

    for (i in catalog) {
        book = catalog[i][0]

        var card = document.createElement('div')
        card.setAttribute('class', 'card')
        card.setAttribute('id', i)
        card.appendChild(createCovers(book.cover))

        var data = document.createElement('table')
        data.setAttribute('class', 'data')
        data.appendChild(createDataEntry("Author", book.author))
        data.appendChild(createDataEntry("Editor", book.editor))
        data.appendChild(createDataEntry("Title", book.title))
        data.appendChild(createDataEntry("English title", book.engtitle))
        data.appendChild(createDataEntry("Subtitle", book.subtitle))
        data.appendChild(createDataEntry("English subtitle", book.engsubtitle))
        data.appendChild(createDataEntry("Publisher", book.publisher))
        data.appendChild(createDataEntry("Date", book.date))
        data.appendChild(createDataEntry("Place", book.place))
        data.appendChild(createDataEntry("Contributor", book.contributor))
        data.appendChild(createDataEntry("Language", book.language))
        data.appendChild(createDataEntry("ISBN", book.isbn))
        data.appendChild(createDataEntry("OCLC", book.oclc))
        data.appendChild(createDataEntry("Category", book.category))
        data.appendChild(createDataEntry("Subject", book.subject))
        data.appendChild(createDataEntry("Canon", book.canon))
        data.appendChild(createDataEntry("Tags", book.tags))
        card.appendChild(data)

        document.getElementById('catalog').appendChild(card);
    }
}
renderCatalog()
