import { Editframe } from '@editframe/editframe-js'

const buildVideo = async ({ audio, height, pages, swipeTransitionOffset, width }) => {
  const editframe = new Editframe({
    clientId: process.env['EDITFRAME_CLIENT_ID'],
    host: process.env['https://api.editframe.com'],
    token: process.env['EDITFRAME_API_TOKEN'],
  })

  let duration
  pages.forEach((page) => {
    page.pages.forEach((subPage) => {
      duration += subPage.duration
    })
  })

  const composition = await editframe.videos.new({
    backgroundColor: '#ffffff',
    dimensions: {
      height,
      width,
    },
    duration,
  })

  await composition.addAudio(audio)

  const getPageStart = (index) => {
    return pages.slice(0, index).reduce((acc, page) => {
      let duration = 0

      page.pages.forEach((subPage) => (duration += subPage.duration))

      return acc + duration
    }, 0)
  }

  const makeBackground = async ({ file, size = { width: composition.dimensions.width }, position, trim }) => {
    return await composition.addVideo(file, {
      position: {
        origin: position?.origin ?? 'center',
        x: position?.x ?? 0,
        y: position?.y ?? 0,
      },
      size,
      trim,
    })
  }

  const makePage = async ({ end, image, index, headline, html, subheading }) => {
    let htmlLayer
    let imageLayer
    let headlineLayer
    let subheadingLayer

    if (html) {
      const { body, size, styles, yStart, yEnd } = html

      htmlLayer = await composition.addHtml(
        {
          page: {
            body,
            styles,
          },
          withTransparentBackground: true,
        },
        {
          position: {
            x: 'center',
          },
          size,
          transitions: [
            {
              type: 'fadeIn',
              options: {
                duration: 0.25,
              },
            },
            {
              type: 'y',
              options: {
                time: getPageStart(index),
                value: yStart,
              },
            },
            {
              type: 'y',
              options: {
                time: getPageStart(index) + 0.25,
                value: yEnd,
              },
            },
            {
              type: 'fadeOut',
              options: {
                duration: 0.25,
              },
            },
          ],
        }
      )
    }

    if (image) {
      const { src, size, yStart, yEnd } = image

      imageLayer = await composition.addImage(src, {
        position: {
          x: 'center',
        },
        size,
        transitions: [
          {
            type: 'fadeIn',
            options: {
              duration: 0.5,
            },
          },
          {
            type: 'y',
            options: {
              time: getPageStart(index),
              value: yStart,
            },
          },
          {
            type: 'y',
            options: {
              time: getPageStart(index) + 0.25,
              value: yEnd,
            },
          },
          {
            type: 'fadeOut',
            options: {
              duration: 0.25,
            },
          },
        ],
      })
    }

    if (headline) {
      const {
        backgroundColor,
        backgroundTransform,
        color,
        end,
        size,
        textAlign = 'left',
        text,
        yStart,
        yEnd,
      } = headline

      headlineLayer = composition.addText(
        {
          backgroundColor,
          backgroundTransform,
          color,
          fontSize: 100,
          fontWeight: 'bold',
          textAlign,
          text,
        },
        {
          position: {
            x: 'center',
          },
          size,
          transitions: [
            {
              type: 'fadeIn',
              options: {
                duration: 0.25,
              },
            },
            {
              type: 'y',
              options: {
                time: getPageStart(index),
                value: yStart,
              },
            },
            {
              type: 'y',
              options: {
                time: getPageStart(index) + 0.25,
                value: yEnd,
              },
            },
            {
              type: 'fadeOut',
              options: {
                duration: 0.25,
              },
            },
          ],
          trim: {
            end,
          },
        }
      )
    }

    if (subheading) {
      const { backgroundColor, backgroundTransform, color, end, size, textAlign, text, yEnd, yStart } = subheading

      subheadingLayer = composition.addText(
        {
          backgroundColor,
          backgroundTransform,
          color,
          fontSize: 50,
          fontWeight: 'bold',
          textAlign,
          text,
        },
        {
          position: {
            x: 'center',
          },
          size,
          transitions: [
            {
              type: 'fadeIn',
              options: {
                duration: 0.25,
              },
            },
            {
              type: 'y',
              options: {
                time: getPageStart(index),
                value: yStart,
              },
            },
            {
              type: 'y',
              options: {
                time: getPageStart(index) + 0.25,
                value: yEnd,
              },
            },
            {
              type: 'fadeOut',
              options: {
                duration: 0.25,
              },
            },
          ],
          trim: {
            end,
          },
        }
      )
    }

    const foregroundLayers = [imageLayer, headlineLayer, htmlLayer, subheadingLayer].filter((layer) => layer)

    return composition.addGroup(foregroundLayers, {
      trim: { end: end - swipeTransitionOffset / 2 },
    })
  }

  const backgroundsAndPages = await Promise.all(
    pages.map(async (page, index) => {
      const duration = page.pages.reduce((acc, page) => acc + page.duration, 0)

      const background = await makeBackground({
        file: page.file,
        position: page.position,
        size: page.size,
        trim: {
          start: page.trim?.start ?? 0,
          end: (page.trim?.start ?? 0) + duration,
        },
      })

      const subpages = await Promise.all(
        page.pages.map(
          async (page) =>
            await makePage({
              end: page.duration,
              index,
              headline: page.headline && {
                backgroundColor: page.backgroundColor,
                color: page.color,
                end: page.duration,
                size: page.headline.size,
                textAlign: page.headline.textAlign,
                text: page.headline.text,
                yStart: page.headline.yStart,
                yEnd: page.headline.yEnd,
              },
              html: page.html && {
                body: page.html.body,
                size: page.html.size,
                styles: page.html.styles,
                yStart: page.html.yStart,
                yEnd: page.html.yEnd,
              },
              image: page.image && {
                size: page.image.size,
                src: page.image.src,
                yEnd: page.image.yEnd,
                yStart: page.image.yStart,
              },
              subheading: page.subheading && {
                backgroundColor: page.backgroundColor,
                color: page.color,
                end: page.duration,
                size: page.subheading.size,
                textAlign: page.subheading.textAlign,
                text: page.subheading.text,
                yStart: page.subheading.yStart,
                yEnd: page.subheading.yEnd,
              },
            })
        )
      )

      return { background, subpages }
    })
  )

  const backgrounds = backgroundsAndPages.map(({ background }) => background)

  await composition.addSequence(backgrounds)
  backgrounds.map((background, index) => {
    background.setStart(background.start - swipeTransitionOffset)
    background.setTrim(background.trim.start, background.trim.end + 2 * swipeTransitionOffset)
    if (index === 0) {
      background.addTransition({
        type: 'scale',
        options: {
          time: background.start + background.trim.end / 2,
          value: 3,
        },
      })
      background.addTransition({
        type: 'scale',
        options: {
          time: background.start + background.trim.end / 2 + swipeTransitionOffset,
          value: 1,
        },
      })
    }
  })

  await Promise.all(
    backgroundsAndPages.map(async ({ subpages }, i) => {
      await composition.addSequence(subpages, {
        timeline: {
          start: backgrounds[i].start + swipeTransitionOffset,
        },
      })
      composition.addGroup([backgrounds[i], ...subpages], {
        transitions: [
          {
            type: 'y',
            options: {
              time: backgrounds[i].start,
              value: composition.dimensions.height,
            },
          },
          {
            type: 'y',
            options: {
              time: backgrounds[i].start + swipeTransitionOffset,
              value: 0,
            },
          },
          {
            type: 'y',
            options: {
              time: backgrounds[i].start + backgrounds[i].trim.end - 2 * swipeTransitionOffset,
              value: 0,
            },
          },
          {
            type: 'y',
            options: {
              time: backgrounds[i].start + backgrounds[i].trim.end - swipeTransitionOffset,
              value: -1 * composition.dimensions.height,
            },
          },
        ],
      })
    })
  )

  const result = await composition.encodeSync()

  console.log(result)
}

const audio = 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/wrapped/arlae.mp3'
const height = 1920
const width = 1080

const pages = [
  {
    file: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/wrapped/glitter-dog.mp4',
    pages: [
      {
        backgroundColor: '#222222',
        backgroundId: 0,
        color: '#ffdbf4',
        duration: 3,
        headline: {
          text: '2022 Wrapped',
          textAlign: 'center',
          yEnd: 150,
          yStart: 200,
        },
        image: {
          size: {
            width: width / 2,
          },
          src: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/wrapped/slack-logo.png',
          yEnd: 300,
          yStart: 350,
        },
        subheading: {
          text: '#SLACKWRAPPED',
          textAlign: 'center',
          yEnd: 550,
          yStart: 600,
        },
      },
      {
        backgroundColor: '#222222',
        backgroundId: 0,
        color: '#ffffff',
        duration: 3,
        headline: {
          size: {
            width: width - 100,
          },
          text: 'This was a fabulous year...',
          yEnd: 350,
          yStart: 400,
        },
      },
    ],
    position: {
      origin: 'top',
    },
    scaleStart: 3,
    scaleEnd: 1,
    size: {
      height,
    },
  },
  {
    file: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/wrapped/rollercoaster.mp4',
    pages: [
      {
        backgroundColor: 'gold',
        backgroundId: 1,
        color: '#000000',
        duration: 3,
        headline: {
          size: {
            width: width - 100,
          },
          text: "It's been a pretty wild ride",
          yEnd: 1500,
          yStart: 1450,
        },
      },
      {
        backgroundColor: 'gold',
        backgroundId: 1,
        color: '#000000',
        duration: 3,
        headline: {
          size: {
            width: width - 100,
          },
          text: "Let's take a look at some of your stats!",
          yEnd: 1500,
          yStart: 1550,
        },
      },
    ],
  },
  {
    file: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/wrapped/typewriter.mp4',
    pages: [
      {
        backgroundColor: '#6b5b95',
        backgroundId: 2,
        color: '#feb236',
        duration: 6,
        headline: {
          size: {
            width: width - 100,
          },
          text: 'You sent  6,949 messages',
          yEnd: 700,
          yStart: 750,
        },
        subheading: {
          size: {
            width: width - 100,
          },
          text: "That's almost 7,000 messages! You're a chatterbox!",
          yEnd: 1000,
          yStart: 1050,
        },
      },
    ],
  },
  {
    file: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/wrapped/smiley-balloons.mp4',
    pages: [
      {
        backgroundColor: '#034f84',
        backgroundId: 3,
        color: '#f7786b',
        duration: 6,
        headline: {
          size: {
            width: width - 100,
          },
          text: 'Favorite emoji?',
          yEnd: 1300,
          yStart: 1250,
        },
        subheading: {
          size: {
            width: width - 100,
          },
          text: 'Yes, you really reacted to over 300 messages with the 💩 emoji...',
          yEnd: 1450,
          yStart: 1400,
        },
      },
    ],
    size: {
      height,
    },
  },
  {
    file: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/wrapped/book.mp4',
    pages: [
      {
        backgroundColor: '#fefbd8',
        backgroundId: 4,
        color: 'teal',
        duration: 6,
        headline: {
          size: {
            width: width - 100,
          },
          text: 'Favorite word?',
          yEnd: 300,
          yStart: 350,
        },
        subheading: {
          size: {
            width: width - 100,
          },
          text: "You said 'v0' 180 times... I'm not sure what that means, but it's your favorite word!",
          yEnd: 450,
          yStart: 500,
        },
      },
    ],
  },
  {
    file: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/wrapped/heart-balloons.mp4',
    pages: [
      {
        backgroundColor: 'hotpink',
        backgroundId: 5,
        color: 'white',
        duration: 6,
        headline: {
          size: {
            width: width - 100,
          },
          text: 'Who is your secret work crush?',
          yEnd: 1300,
          yStart: 1350,
        },
        html: {
          body: `<img src="https://efapisplat.nyc3.digitaloceanspaces.com/templates/wrapped/ilias.jpeg" />`,
          size: {
            height: width / 2,
            width: width / 2,
          },
          styles: `
            img {
              width: ${width / 2}px;
              aspect-ratio: 1;
              object-fit: cover;
              --_m: radial-gradient(#000 69%,#0000 70%) 84.5% fill/100%;
              -webkit-mask-box-image: var(--_m);
              mask-border: var(--_m);
              clip-path: polygon(-41% 0,50% 91%, 141% 0);
            }

            /* fallback until better support for mask-border */
                @supports not (-webkit-mask-box-image: var(--_m)) {
              img {
                --_m:
                  radial-gradient(circle at 60% 63%,#000 64%,#0000 65%) top left /50% 50% no-repeat,
                radial-gradient(circle at 40% 63%,#000 64%,#0000 65%) top right/50% 50% no-repeat,
                linear-gradient(#000 0 0) bottom/100% 50% no-repeat;
                -webkit-mask: var(--_m);
                mask: var(--_m);
              }
            }
          `,
          yEnd: 250,
          yStart: 300,
        },
        subheading: {
          size: {
            width: width - 100,
          },
          text: `You and @iliashaddad sure spend a lot of time chatting! What's that all about?`,
          yEnd: 1600,
          yStart: 1650,
        },
      },
    ],
  },
  {
    file: 'https://efapisplat.nyc3.digitaloceanspaces.com/templates/wrapped/2022.mp4',
    pages: [
      {
        backgroundColor: 'white',
        backgroundId: 6,
        color: '#222222',
        duration: 6,
        headline: {
          size: {
            width: width - 100,
          },
          text: "Thanks for slackin' off all year!",
          yEnd: 1300,
          yStart: 1350,
        },
        subheading: {
          size: {
            width: width - 100,
          },
          text: "Keep up the good work in 2023 and we'll see you next year!",
          yEnd: 1600,
          yStart: 1650,
        },
      },
    ],
    position: {
      x: -500,
    },
    size: {
      height,
    },
    trim: {
      start: 2.5,
    },
  },
]

buildVideo({ audio, height, pages, swipeTransitionOffset: 0.5, width })
