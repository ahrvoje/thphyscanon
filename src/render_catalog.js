joinValues = (values, separator=', ') => {
    txt = ""
    for (i in values) {
        txt += values[i] + separator
    }
    return txt.substring(0, txt.length - separator.length)  // delete trailing separator
}

createDataEntry = (item, name, data) => {
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
        separator = ", "
        for (i in item.link) {
            link = item.link[i]
            txt += "<a href=\"" + link + "\" target=\"_blank\">" + link + "</a>" + separator
        }
        value.innerHTML = txt.substring(0, txt.length - separator.length)  // delete trailing separator
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

        var data = document.createElement('table')
        data.setAttribute('class', 'data')
        data.appendChild(createDataEntry(item, "Author", item.author))
        data.appendChild(createDataEntry(item, "Editor", item.editor))
        data.appendChild(createDataEntry(item, "Title", item.title))
        data.appendChild(createDataEntry(item, "Eng. title", item.engtitle))
        data.appendChild(createDataEntry(item, "Subtitle", item.subtitle))
        data.appendChild(createDataEntry(item, "Eng. subtitle", item.engsubtitle))
        data.appendChild(createDataEntry(item, "Publisher", item.publisher))
        data.appendChild(createDataEntry(item, "Date", item.date))
        data.appendChild(createDataEntry(item, "Place", item.place))
        data.appendChild(createDataEntry(item, "Reference", item.reference))
        data.appendChild(createDataEntry(item, "Contributor", item.contributor))
        data.appendChild(createDataEntry(item, "Language", item.language))
        data.appendChild(createDataEntry(item, "ISBN", item.isbn))
        data.appendChild(createDataEntry(item, "OCLC", item.oclc))
        data.appendChild(createDataEntry(item, "Link", item.link))
        data.appendChild(createDataEntry(item, "Category", item.category))
        data.appendChild(createDataEntry(item, "Subject", item.subject))
        data.appendChild(createDataEntry(item, "Canon", item.canon))
        data.appendChild(createDataEntry(item, "Tags", item.tags))
        card.appendChild(data)

        document.getElementById('catalog').appendChild(card);
    }
}
renderCatalog()
