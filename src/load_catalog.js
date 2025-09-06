const loadCatalog = async () => {
    let catalogData  = await fetch('catalog/thphyscanon_catalog.json')
    return await catalogData.json();
}
