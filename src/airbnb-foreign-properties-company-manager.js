(async () => {
  const fs = require('fs/promises')
  const foreignPropertiesFile = await fs.readFile('../data/airbnb-foreign-properties.json', 'utf8')
  const foreignPropertiesData = JSON.parse(foreignPropertiesFile)

  const foreignPropertiesCompanyManager = foreignPropertiesData.filter(element => {
    if(element.manager && (element.manager.includes('(B') || element.manager.includes('(E'))) {
      return true
    }
  })

  console.log(foreignPropertiesCompanyManager.length)
})()
