(async () => {

  const fs = require('fs/promises')
  const papaparse = require('papaparse')

  try {
    
    const file = await fs.readFile('../data/property-transmissions.csv', 'utf-8')
    let data = papaparse.parse(file, { 
      header: true
    }).data

    data = data.reduce((acc, curr) => {

      const location = curr.poblacion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-').toLowerCase()
      acc[location] = []

      Object.entries(curr).forEach(([key, value]) => {
        if(key !== 'poblacion') {
          acc[location].push({
            date: key,
            value: value
          })
        }
      })

      return acc
    }, {})

    await fs.writeFile('../data/property-transmissions.json', JSON.stringify(data, null, 2))

  } catch (error) {
    console.log(error)
  }
})()