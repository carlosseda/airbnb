(async () => {
  const fs = require('fs/promises')
  const ownersFile = await fs.readFile('../data/airbnb-owner-ranking-last-year.json', 'utf8')
  const propertiesFile = await fs.readFile('../data/inside-airbnb.json', 'utf8')
  const caibFile = await fetch('https://catalegdades.caib.cat/api/views/3q3t-usfm/rows.json?accessType=DOWNLOAD')
  const ownersData = JSON.parse(ownersFile)
  const propertiesData = JSON.parse(propertiesFile)
  const caibData = await caibFile.json()

  const foreignOwners = ownersData.filter(element => element.hostLocation && !element.hostLocation.includes('Spain'))

  let foreignOwnersByCountry = foreignOwners.reduce((acc, owner) => {
    let country = owner.hostLocation.split(', ')[1]
    if (!acc[country]){
      acc[country] = parseFloat(owner.percentatgePlaces);
    } else {
      acc[country] += parseFloat(owner.percentatgePlaces);
    }
    return acc;
  }, {})

  const countries = Object.keys(foreignOwnersByCountry)

  let foreignProperties = propertiesData.filter(element => element.host_location && countries.includes(element.host_location.split(', ')[1]))

  console.log(foreignProperties.length)

  foreignProperties = foreignProperties.map(property => {
    return {
      hostName: property.host_name,
      hostCountry: property.host_location.split(', ')[1],
      license: property.license,
      latitude: property.latitude,  
      longitude: property.longitude,
      location: property.neighbourhood_cleansed
    }
  }) 

  foreignProperties = foreignProperties.filter((property) => {
    let matchingElement = caibData.data.find(element => element[8] == property.license);
    if (matchingElement) {
      property.manager = matchingElement[26];
      return true;
    }
    return false;
  });

  console.log(foreignProperties.length)
})()
