require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: 'Dacast',
    description:
      "Dacast's Video Streaming Software is the leading Online Video and Hosting Platform. Stream live and on demand video leveraging a video API and 24/7 support.",
    keywords: 'dacast, video, streaming',
    siteUrl: 'https://www.dacast.com/',
    author: '@DacastStreaming',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        failOnError: false,
      },
    },
    {
      resolve: 'gatsby-source-wordpress',
      options: {
        auth: {
          htaccess: {
            username: process.env.HTTPBASICAUTH_USERNAME,
            password: process.env.HTTPBASICAUTH_PASSWORD,
          },
        },
        url: `${process.env.WP_URL}/gatsby_feed`,
        type: {
          __all: {
            limit: process.env.WP_LIMIT || 0,
          },
          MediaItem: {
            localFile: {
              requestConcurrency: 100,
            },
          },
          Article: {
            limit: process.env.WP_ARTICLE_LIMIT || 5000,
            where: 'status: PUBLISH',
          },
          ArticleCategory: {
            limit: process.env.WP_ARTICLE_CAT_LIMIT || 100,
          },
          Faq: {
            limit: process.env.WP_FAQ_LIMIT || 5000,
            where: 'status: PUBLISH',
          },
          FaqCategory: {
            limit: process.env.WP_FAQ_CAT_LIMIT || 100,
          },
          Category: {
            limit: process.env.WP_CATEGORY_LIMIT || 100,
          },
          Page: {
            limit: process.env.WP_PAGE_LIMIT || 5000,
            where: 'status: PUBLISH',
          },
          Post: {
            limit: process.env.WP_POST_LIMIT || 5000,
            where: 'status: PUBLISH',
          },
          User: {
            limit: process.env.WP_USER_LIMIT || 100,
          },
        },
        debug: {
          graphql: {
            showQueryVarsOnError: true,
            showQueryOnError: true,
            copyQueryOnError: true,
          },
        },
        schema: {
          timeout: 3000000,
          perPage: 20,
          requestConcurrency: 5,
          previewRequestConcurrency: 2,
        },
        html: {
          useGatsbyImage: false,
          imageMaxWidth: 660,
          fallbackImageMaxWidth: 660,
          generateWebpImages: true,
        },
        gatsbyImageOptions: {
          formats: ['webp'],
          loading: 'auto',
        },
        develop: {
          hardCacheMediaFiles: true,
        },
        production: {
          allow404Images: true,
        },
      },
    },
    'gatsby-plugin-client-side-redirect',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'locale',
        path: `${__dirname}/locales`,
      },
    },
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        localeJsonSourceName: 'locale', // name given to `gatsby-source-filesystem` plugin.
        languages: ['fr', 'es', 'pt', 'de', 'it'],
        redirect: false,
        defaultLanguage: 'en',
        // if you are using Helmet, you must include siteUrl, and make sure you add http:https
        siteUrl: 'https://www.dacast.com/',
        // you can pass any i18next options
        // pass following options to allow message content as a key
        i18nextOptions: {
          interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
          },
          keySeparator: false,
          nsSeparator: false,
        },
        pages: [],
      },
    },
    {
      resolve: 'gatsby-plugin-webfonts',
      options: {
        fonts: {
          google: [
            {
              family: 'Roboto',
              variants: ['300', '400', '500', '700', '900'],
              //subsets: ['latin']
              //text: 'Hello'
              //fontDisplay: 'swap',
              //strategy: 'selfHosted' // 'base64' || 'cdn'
            },
          ],
        },
        // formatAgents: {
        //   eot: `Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)`,
        //   ttf: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.59.8 (KHTML, like Gecko) Version/5.1.9 Safari/534.59.8`,
        //   woff: `Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko`,
        //   woff2: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393`,
        // },
        //formats: ['woff2', 'woff'],
        //useMinify: true,
        //usePreload: true,
        //usePreconnect: false,
      },
    },
  ],
};
