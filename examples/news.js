import { Editframe } from '@editframe/editframe-js'

const buildVideo = async ({ audio, pages }) => {
  const editframe = new Editframe({
    clientId: process.env['EDITFRAME_CLIENT_ID'],
    host: 'https://api.editframe.com',
    token: process.env['EDITFRAME_API_TOKEN'],
  })

  const composition = await editframe.videos.new({
    backgroundColor: '#000000',
    dimensions: {
      height: 1920,
      width: 1080,
    },
    duration: 36,
  })

  await composition.addAudio(audio)

  const FADE_DURATION = 0.25
  const BLACK_SPACE_DURATION = 0.5

  await composition.addImage(pages[0].image, {
    size: {
      height: composition.dimensions.height / 2,
    },
    timeline: {
      start: 0,
    },
    transitions: [
      {
        options: {
          duration: FADE_DURATION,
        },
        type: 'fadeIn',
      },
      {
        options: {
          scale1: 1.1,
          scale2: 1.3,
          start: 0,
          end: pages[1].start - BLACK_SPACE_DURATION,
          time: 0,
          x1: 0,
          x2: 20,
          y1: 0,
          y2: 20,
        },
        type: 'kenBurns',
      },
      {
        options: {
          duration: FADE_DURATION,
        },
        type: 'fadeOut',
      },
    ],
    trim: {
      end: pages[1].start - BLACK_SPACE_DURATION,
    },
  })

  await composition.addHtml(
    {
      page: {
        styles: `
          body {
            background: transparent;
            margin: 0;
            padding: 0;
          }
          .black-box {
            background-color: #000000;
            height: 50vh;
            position: absolute;
            top: 50%;
            width: 100%;
          }
          .headline {
            margin: 0 0 0 2rem;
            width: 90%;
            padding: 10px;
            position: absolute;
            top: 42%;
          }

          .headline h1 {
            color: #ffffff;
            font-family: ${pages[0].fontFamily ?? 'Helvetica'};
            font-size: 80px;
            font-style: italic;
            font-weight: 600;
            line-height: 1.25;
            margin: 0;
            padding: 0;
          }

          .headline h1 > span {
            background-color: #000000;
            color: #fff;
            box-shadow: -10px 0px 0 7px #000000, 10px 0px 0 7px #000000,
              0 0 0 7px #000000;
            box-decoration-break: clone;
          }
        `,
        body: `
          <div class="black-box"></div>
          <div class="headline">
            <h1>
              <span> ${pages[0].text} </span>
            </h1>
          </div>
        `,
      },
      withTransparentBackground: true,
    },
    {
      timeline: {
        start: FADE_DURATION,
      },
      transitions: [
        {
          options: {
            duration: FADE_DURATION,
          },
          type: 'fadeIn',
        },
        {
          options: {
            duration: FADE_DURATION,
          },
          type: 'fadeOut',
        },
      ],
      trim: {
        end: pages[1].start - BLACK_SPACE_DURATION,
      },
    }
  )

  await Promise.all(
    pages.map(async ({ fontFamily, highlightColor, image, start, text, video }, i) => {
      if (i === 0) {
        return
      }

      const nextPage = i < pages.length - 1 ? pages[i + 1] : undefined
      const nextPageStart = nextPage ? nextPage.start : composition.duration
      const isEvenPage = i % 2 === 0

      if (image) {
        await composition.addImage(image, {
          size: {
            format: 'fill',
          },
          timeline: {
            start,
          },
          transitions: [
            {
              options: {
                duration: FADE_DURATION,
              },
              type: 'fadeIn',
            },
            {
              options: {
                scale1: 1.7,
                scale2: 1.1,
                start: start,
                end: nextPageStart,
                time: 0,
                x1: 100,
                x2: 0,
                y1: 100,
                y2: 0,
              },
              type: 'kenBurns',
            },
            {
              options: {
                duration: FADE_DURATION,
              },
              type: 'fadeOut',
            },
          ],
          trim: {
            end: nextPageStart - start - BLACK_SPACE_DURATION,
          },
        })
      } else if (video) {
        await composition.addVideo(video, {
          audio: {
            volume: 0,
          },
          position: {
            x: 'center',
          },
          size: {
            format: 'fill',
          },
          timeline: {
            start,
          },
          transitions: [
            {
              options: {
                duration: FADE_DURATION,
              },
              type: 'fadeIn',
            },
            {
              options: {
                duration: FADE_DURATION,
              },
              type: 'fadeOut',
            },
          ],
          trim: {
            end: nextPageStart - start - BLACK_SPACE_DURATION,
          },
        })
      }

      await composition.addHtml(
        {
          page: {
            styles: `
              body {
                background: transparent;
                margin: 0;
                padding: 0;
              }

              .container {
                align-items: ${isEvenPage ? 'flex-start' : 'flex-end'};
                display: flex;
                flex-direction: row;
                height: 100vh;
              }

              .page {
                background: #000000;
                color: #ffffff;
                font-family: ${fontFamily ?? 'Helvetica'};
                font-size: 50px;
                font-weight: 300;
                line-height: 4rem;
                margin: 0;
                padding: 4rem;
              }

              .bold {
                font-weight: 400;
              }

              .highlight {
                font-weight: 400;
                color: ${highlightColor ?? '#ffffff'};
              }
            `,
            body: `
              <div class="container">
                <p class="page">${text}</p>
              </div>
            `,
          },
          withTransparentBackground: true,
        },
        {
          timeline: {
            start: start + FADE_DURATION,
          },
          transitions: [
            {
              options: { duration: FADE_DURATION },
              type: 'fadeIn',
            },
          ],
          trim: {
            end: nextPageStart - start - BLACK_SPACE_DURATION,
          },
        }
      )
    })
  )

  const result = await composition.encodeSync()

  console.log(result)
}

const audio = 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/news/loftid-audio.wav'

const pages = [
  {
    start: 0,
    text: 'Last week, NASA launched an inflatable re-entry module into space and landed it safely in the ocean.',
    image: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/news/loftid-2.jpeg',
  },
  {
    highlightColor: 'gold',
    image: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/news/loftid-1.jpeg',
    start: 5.5,
    text: "The LOFTID mission intends to <span class='highlight'>safely land payloads of 20 tons or more</span>. The <span class='bold'>20 foot wide landing device</span> is comprised of many layers of extremely durable fabric that maintains its integrity at <span class='highlight'>speeds of up to 18,000 miles per hour and a temperature of 3,000 degrees Fahrenheit</span>.",
  },
  {
    highlightColor: 'gold',
    start: 22,
    text: "Before it is inflated, it is folded up into a small cylinder, only <span class='bold'>four feet by one feet</span>, which gives it a huge advantage over traditional non-flexible heat shields. As it is inflated with nitrogen gas,<span class='highlight'> it has the added benefit of floating on water after landing</span>",
    video: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/news/loftid-launch.mp4',
  },
]

buildVideo({ audio, pages })
