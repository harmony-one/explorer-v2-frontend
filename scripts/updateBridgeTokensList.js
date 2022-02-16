const fs = require('fs');
const fetch = require('node-fetch');
const outputFileName = 'src/config/bridgeTokensMap.json';

(async function updateTokens () {
  try {
    console.log('Getting tokens list using bridge API...')
    const response = await fetch('https://be4.bridge.hmny.io/tokens/?page=0&size=1000');
    const { content: tokensList } = await response.json();
    const tokensMap = {}
    tokensList.forEach(item => {
      tokensMap[item.hrc20Address.toLowerCase()] = item.symbol
    })
    await fs.writeFileSync(outputFileName, JSON.stringify(tokensMap))
    console.log(`${tokensList.length} bridge tokens successfully written to '${outputFileName}'`)
  } catch (err) {
    console.error(err)
  }
})()
