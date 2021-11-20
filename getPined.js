const axios = require('axios');
const cheerio  = require('cheerio');
require('dotenv').config()
const url = process.env.BASE_URL
async function getPined () { return  axios.get("https://github.com/AZIZXlaouiti")
  .then(async(resp)=>{
    
    $ = cheerio.load(resp.data)
    const pinned = $('.pinned-item-list-item.public')
    if (!pinned || pinned.length === 0)return []
    const result = []
    for(const [index , item] of Object.entries(pinned)){
        if (!isNaN(index)){
          const repo = getRepo($ , item)
          const tech = await getTech(repo )
            
            result[index] = {
                repo : repo ,
                tech : tech
            }
        }
    }
    return result
  }
  )
  function getRepo($, item) {
    try {
      return $(item).find('.repo').text()
    } catch (error) {
      return undefined
    }
  }
  function getTech( repo){
    return axios.get(`https://github.com/AZIZXlaouiti/${repo}`)
    .then((resp)=>{
       $ = cheerio.load(resp.data)
       const row = $('#user-content-technologies')
       if (!row.html()){
        return 
       }else {
        return row.parent().next().text().trim().split('\n')
       }
    })
  
  }
}
module.exports = getPined