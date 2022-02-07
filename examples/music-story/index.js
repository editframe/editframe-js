const Editframe = require('@editframe/editframe-js')
const fs = require('fs')
const CLIENT_ID = 'YOUR-CLIENT-ID'
const TOKEN = 'YOUR-TOKEN'
const { RGBA, newGradientImg } = require('jimp-gradient')
const path = require('path')

const editframe = new Editframe({
  clientId: CLIENT_ID,
  token: TOKEN,
  host: 'HOST'
})

const generateGradient = (height, width, color1, color2, direction) => {
  return new Promise((resolve, reject) => {
    newGradientImg(height, width, color1, color2, direction)
      .then(img => {
        img.write('./img.jpg')
        resolve('./img.jpg')
      })
      .catch(err => reject(err))
  })
}

const run = async () => {
  try {
    const gradientImage = await generateGradient(
      1080,
      1920,
      new RGBA(90, 55, 43, 1),
      new RGBA(250, 250, 250),
      'down'
    )
    // Create new video object with settings for IG story or reel
    const newVideo = await editframe.videos.build({
      aspectRatio: '9:16',
      duration: 50,
      resolution: '1080x1920',
      backgroundColor: '#2666CF',
      metadata: {
        id: 'Editframe SDK'
      }
    })
    // Add the gradient image as background image
    newVideo.addImage(fs.createReadStream(gradientImage), {
      format: 'fill',
      x: 0,
      y: 0
    })

    // Add music card image
    newVideo.addImage(
      'https://images.unsplash.com/photo-1536602012356-86c345795580?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=180&q=80',
      {
        width: 180,
        height: 180,
        format: 'fit',
        y: 1000,
        x: 'center'
      }
    )
    // Add Main Text
    newVideo.addText('Life is a Dream', {
      fontFamily: 'Montserrat',
      fontSize: 40,
      color: '#000',
      backgroundColor: 'transparent',
      height: 100,
      y: 1500,
      x: 320,
      width: 600
    })

    // Add Secondary Text
    newVideo.addText('by Michael Ramir C.', {
      fontFamily: 'Montserrat',
      fontSize: 30,
      color: '#000',
      backgroundColor: 'transparent',
      height: 100,
      y: 1580,
      x: 320,
      width: 600
    })
    const audio = fs.createReadStream(path.join(__dirname, 'music.mp3'))
    // add audio from local file
    newVideo.addAudio(audio, {
      trim: { start: 0, end: 50 }
    })
    // add audio wave width audio sync
    newVideo.addWaveform({
      style: 'line',
      height: 100,
      color: '#000',
      backgroundColor: 'transparent',
      y: 'b:50'
    })
    // send the data the API and you'll get a webhook response when it's ready
    const data = await newVideo.encode()
    console.log(JSON.stringify(data))
    fs.unlinkSync(gradientImage)
  } catch (err) {
    console.log(err)
  }
}

run()
