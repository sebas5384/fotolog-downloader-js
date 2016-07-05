import fs from 'fs'
import cheerio from 'cheerio'
import request from './lib/request'

export default function download(username) {

  const baseMosaicUrl = 'http://www.fotolog.com/' + username + '/mosaic/'

  return request
    .get(baseMosaicUrl)
    .set('User-agent', 'Mozilla/6.0')
    .set('Accept', 'application/json, text/javascript, */*; q=0.01')
    .set('X-Requested-With', 'XMLHttpRequest')
    .set('Referer', false)
    .set('Host', 'www.fotolog.com')
    .set('Content-Type', 'application/json; charset=UTF-8')
    .then(response => {
      let $ = cheerio.load(response.text)

      const total = $('ul#profile_bar > li > a > b').html()
      const totalPages = Math.round(parseInt(total) / 30)

      // Pager for mosaic pages.
      for (var pageNumber = 1; pageNumber <= totalPages; pageNumber++) {

        getImagesUrlsByPage(baseMosaicUrl, pageNumber)
          .then(urls => {

            urls.map((key, imagePageUrl) => {

              console.log('>>> Adding page to queue: ' + imagePageUrl)

              // Go to each Photo Page.
              request
                .get(imagePageUrl)
                .set('User-agent', 'Mozilla/6.0')
                .set('Accept', 'application/json, text/javascript, */*; q=0.01')
                .set('X-Requested-With', 'XMLHttpRequest')
                .set('Referer', false)
                .set('Host', 'www.fotolog.com')
                .set('Content-Type', 'application/json; charset=UTF-8')
                .then(resImage => {

                  const $image = cheerio.load(resImage.text)

                  // Download Photo.
                  $image('div#flog_img_holder > a').find('img')
                    .map((key, imageDom) => $(imageDom).attr('src'))
                    .map((key, imageUrl) => {
                      const fileName = imageUrl.split('/').pop()
                      const file = fs.createWriteStream('./download/' + fileName)

                      // Write on the image file.
                      request
                        .get(imageUrl)
                        .pipe(file)
                      
                      console.log('Photo: ' + imagePageUrl)
                    })
                  
                })
            })

          })
      }
    })
}

function getImagesUrlsByPage(baseMosaicUrl, pageNumber) {
  return request
    .get(baseMosaicUrl + (pageNumber * 30))
    .set('User-agent', 'Mozilla/6.0')
    .set('Accept', 'application/json, text/javascript, */*; q=0.01')
    .set('X-Requested-With', 'XMLHttpRequest')
    .set('Referer', false)
    .set('Host', 'www.fotolog.com')
    .set('Content-Type', 'application/json; charset=UTF-8')
    .then(resPage => {
      let $page = cheerio.load(resPage.text)

      return $page('ul#list_photos_mosaic')
        .find('a')
        .map((key, item) => {
          return $page(item).attr('href')
        })
    })
}