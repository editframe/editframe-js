const Editframe = require('@editframe/editframe-js')
const fs = require('fs')
const CLIENT_ID = 'YOUR-CLIENT-ID'
const TOKEN = 'YOUR-TOKEN'
const path = require('path')
const { RGBA, newGradientImg } = require('jimp-gradient')

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
      new RGBA(38, 102, 207),
      new RGBA(0, 0, 0),
      'up'
    )
    // Create new video object with settings for IG story or reel
    const newVideo = await editframe.videos.build({
      aspectRatio: '9:16',
      duration: 60,
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
    // Add the video to fit the aspect ratio of IG and trim the video
    newVideo.addVideo(fs.createReadStream(path.join(__dirname, 'output.mp4')), {
      format: 'fit',
      trim: { start: 0, end: 60 }
    })

    // Add Main Text
    newVideo.addText('Mark Zuckerberg: NFTs', {
      fontFamily: 'Montserrat',
      fontSize: 40,
      color: '#fff',
      backgroundColor: 'transparent',
      height: 100,
      y: 250,
      x: 320,
      width: 900
    })
    // Read video subtitle as JSON
    // We use AWS transcription service and stringify the subtitle
    // And convert them as JSON with timestamps
    const jsonData = fs.readFileSync(path.join(__dirname, 'title.json'))
    for (const subtitle of JSON.parse(jsonData)) {
      // Add subtitle to the right video frames using the data from JSON file
      await newVideo.addText(subtitle.text, {
        fontFamily: 'Montserrat',
        fontSize: 32,
        color: '#fff',
        start: subtitle.start,
        end: subtitle.end,
        backgroundColor: 'transparent',
        height: 200,
        y: 1400,
        x: 'center',
        textAlignment: 'center',
        width: 900
      })
    }
    // Add video waveform sync with video audio waves
    newVideo.addWaveform({
      style: 'line',
      height: 100,
      color: '#fff',
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
