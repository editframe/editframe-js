const Editframe = require('@editframe/editframe-js')
const CLIENT_ID = 'YOUR-CLIENT-ID'
const TOKEN = 'YOUR-TOKEN'

const editframe = new Editframe({
  clientId: CLIENT_ID,
  token: TOKEN,
  host: 'HOST'
})

const run = async () => {
  try {
    // Create new video object
    const newVideo = await editframe.videos.build({
      duration: 50,
      resolution: '1080x1920',
      backgroundColor: '#2666CF',
      metadata: {
        id: 'Editframe SDK'
      }
    })

    // Add the images to the slider video
    newVideo.addImage(
      'https://images.unsplash.com/photo-1536602012356-86c345795580?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      {
        format: 'fill',
        y: 0,
        x: 0,
        start: 0,
        end: 10
      }
    )
    newVideo.addImage(
      'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      {
        format: 'fill',
        y: 0,
        x: 0,
        start: 10,
        end: 20
      }
    )

    newVideo.addImage(
      'https://images.unsplash.com/photo-1552529220-460eec1fd555?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      {
        format: 'fill',
        y: 0,
        x: 0,
        start: 20,
        end: 30
      }
    )

    newVideo.addImage(
      'https://images.unsplash.com/photo-1558427400-bc691467a8a9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1562&q=80',
      {
        format: 'fill',
        y: 0,
        x: 0,
        start: 30,
        end: 40
      }
    )
    newVideo.addImage(
      'https://images.unsplash.com/photo-1644169276891-235775ba3cad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
      {
        format: 'fill',
        y: 0,
        x: 0,
        start: 40,
        end: 50
      }
    )
    // Add the music audio file from remote url
    const audioFile =
      'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_2MG.mp3'
    newVideo.addAudio(audioFile)
    // send the data the API and you'll get a webhook response when it's ready
    const data = await newVideo.encode()
    console.log(JSON.stringify(data))
  } catch (err) {
    console.log(err)
  }
}

run()
