const path = require('path');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        'crypto-browserify': require.resolve('crypto-browserify'),
      },
    },
  });
};

const allWpPageWhitelist = process.env.ALL_WP_PAGE_WHITELIST;

const blogQuery = `
  query blogQuery {
    allWpPost {
      edges {
        node {
          id
          databaseId
          title
          slug
          categories {
            nodes {
              name
              uri
              slug
            }
          }
          locale {
            locale
            id
          }
        }
      }
    }
    allWpArticle {
      edges {
        node {
          id
          databaseId
          title
          slug
          locale {
            locale
            id
          }
        }
      }
    }
    allWpFaq {
      edges {
        node {
          id
          databaseId
          title
          slug
          locale {
            locale
            id
          }
        }
      }
    }
    allWpPage(filter: {databaseId: {in: [${allWpPageWhitelist}]}}) {
      edges {
        node {
          id
          title
          databaseId
          parentDatabaseId
          slug
          date
        }
      }
    }
    allWp {
      nodes {
        seo {
          redirects {
            format
            origin
            target
            type
          }
        }
      }
    }
    knowledgebaseCategories: allWpArticleCategory {
      edges {
        node {
          name
          uri
        }
      }
    }
    totalPostsEN: allWpPost(filter: {locale: {locale: {eq: "en_US"}}, categories: {nodes: {elemMatch: {slug: {eq: "blog"}}}}}) {
      totalCount
    }
    totalPostsES: allWpPost(filter: {locale: {locale: {eq: "es_ES"}}}) {
      totalCount
    }
    totalPostsFR: allWpPost(filter: {locale: {locale: {eq: "fr_FR"}}}) {
      totalCount
    }
    totalPostsIT: allWpPost(filter: {locale: {locale: {eq: "it_IT"}}}) {
      totalCount
    }
    totalPostsDE: allWpPost(filter: {locale: {locale: {eq: "de_DE"}}}) {
      totalCount
    }
    totalPostsPT: allWpPost(filter: {locale: {locale: {eq: "pt_BR"}}}) {
      totalCount
    }
    newsEN: allWpPost(filter: {locale: {locale: {eq: "en_US"}}, categories: {nodes: {elemMatch: {slug: {eq: "news"}}}}}) {
      totalCount
    }
    caseEN: allWpPost(filter: {locale: {locale: {eq: "en_US"}}, categories: {nodes: {elemMatch: {slug: {eq: "case-studies"}}}}}) {
      totalCount
    }
  }
  `;

exports.createPages = async ({ actions, graphql }) => {
  const languageMapping = {
    en_US: undefined,
    es_ES: '/es',
    fr_FR: '/fr',
    it_IT: '/it',
    de_DE: '/de',
    pt_BR: '/pt',
  };
  const { data, errors } = await graphql(blogQuery);
  if (errors) return Promise.reject(errors);
  return [
    ...createAllWp(data, actions),
    ...createAllWpPage(data, actions, languageMapping),
    ...createAllWpPost(data, actions, languageMapping),
    ...createAllWpArticle(data, actions, languageMapping),
    ...createAllWpFaq(data, actions, languageMapping),
    ...createPaginationPages(
      data.totalPostsEN,
      data.totalPostsES,
      data.totalPostsFR,
      data.totalPostsPT,
      data.totalPostsDE,
      data.totalPostsIT,
      actions
    ),
    ...createPaginationPagesNewsEN(data.newsEN, actions),
    ...createPaginationPagesCaseStudiesEN(data.caseEN, actions),
    ...createKnowledgeBasePage(data, actions, languageMapping),
    ...createKnowledgeBaseCategoryPages(
      data.knowledgebaseCategories,
      actions,
      languageMapping
    ),
  ];
};

const createAllWp = (data, actions) => {
  return data.allWp.nodes[0].seo.redirects.map(redirect => {
    if (
      redirect.origin.includes(
        'floodin-pro-video-hosting' ||
        'best-obs-studio-settings-2' ||
        'best-obs-studio-settings-3' ||
        'best-obs-studio-settings-5'
      )
    ) {
      return false;
    }
    actions.createRedirect({
      fromPath: `${redirect.origin}`,
      toPath: `${redirect.target}`,
      isPermanent: true,
      statusCode: 301,
    });
  });
};

const createAllWpPage = (data, actions, languageMapping) => {
  return data.allWpPage.edges.map(page => {
    const slugMapping = {
      'pricing-gatsby': 'live-streaming-pricing-plans', // 67869
      'live-event-streaming-2': 'live-event-streaming', // 77056
      'stream-live-video-on-your-website-2':
        'stream-live-video-on-your-website', // 75555
      'live-streaming-platform-2': 'live-streaming-platform', // 77052
      'video-platform-for-agencies-2': 'video-platform-for-agencies', // 81507
      'video-analytics': 'video-analytics', // 81511
      'streaming-solutions-tv-radio': 'streaming-solutions-tv-radio', // 81514
      contact: 'contact', // 81568
      'ott-platform': 'ott-platform', // 81962
      'private-video-sharing': 'private-video-sharing', // 81966
      'secure-video-upload': 'secure-video-upload', // 81969
      'pay-per-view-streaming-5': 'pay-per-view-streaming', // 82390
      'why-dacast-to-broadcast-live': 'why-dacast-to-broadcast-live', // 82604
      'all-device-video-player-broadcast-software':
        'all-device-video-player-broadcast-software', // 82607
      'streaming-solutions': 'streaming-solutions', // 82610
      'ovp-online-video-platform': 'ovp-online-video-platform', // 82613
      'video-on-demand-vod': 'video-on-demand-vod', // 82617
      'online-video-hosting': 'online-video-hosting', // 82620
      'video-hosting-manager-2': 'video-hosting-manager', // 82623
      'expo-video-gallery': 'expo-video-gallery', //83411
      'html5-video-player-3': 'html5-video-player', //83415
      'video-hosting-china-2': 'video-hosting-china', //83418
      'video-monetization-2': 'video-monetization', //83421
      'video-marketing-2': 'video-marketing-tools', //83424
      'video-cms-2': 'video-cms', //83427
      'video-streaming-software-10': 'video-streaming-software', //83430
      'broadcast-sports-2': 'broadcast-sports', //83433
      'enterprise-video-platform-11': 'enterprise-video-platform', //83436
      'online-video-marketing-platform-2': 'online-video-marketing-platform', //83439
      'video-selling-software-2': 'video-selling-software', //83442
      'online-video-publishing-platform-2': 'online-video-publishing-platform', //83445
      'video-api-3': 'video-api', //84313
      'live-streaming-fitness-classes-2': 'live-streaming-fitness-classes', //84316
      'church-live-streaming-2': 'church-live-streaming', //84319
      'streaming-video-for-government-municipality':
        'streaming-video-for-government-municipality', //84322
      'online-video-education-platform': 'online-video-education-platform', //84325
      'live-streaming-for-musicians': 'live-streaming-for-musicians', //84328
      'video-transcoding': 'video-transcoding', //84331
      'developer-tools-2': 'developer-tools', //84334
      'professional-services-2': 'professional-services', //90810
      unsubscribe: 'unsubscribe', //112029
      'partners-gatsby': 'partners', //114020
      'careers-gatsby': 'careers', //114025
      'about-us-gatsby': 'about-us', //114141
      'phone-support-gatsby': 'support/phone-support', //114145
      'support-gatsby': 'support', //114148
      'player-api-documentation-gatsby': 'player-api-documentation', //114302
      'video-api-documentation-gatsby': 'video-api-documentation', //114309
      'privacy-policy-gatsby': 'privacy-policy', //114313
      'terms-of-service-gatsby': 'terms-of-service', //114316
      'gdpr-policy-gatsby': 'gdpr-policy', //114319
      'player-api-documentation': 'player-api-documentation', //114302
    };

    var language = '';
    if (page.node.locale) {
      if (page.node.locale.locale == 'fr_FR') {
        language = '/fr';
      } else if (page.node.locale.locale == 'es_ES') {
        language = '/es';
      } else if (page.node.locale.locale == 'pt_BR') {
        language = '/pt';
      } else if (page.node.locale.locale == 'de_DE') {
        language = '/de';
      } else if (page.node.locale.locale == 'it_IT') {
        language = '/it';
      }
    }

    const uri = slugMapping[page.node.slug] || page.node.slug;

    if (page.node.parentDatabaseId == 106621) {
      actions.createPage({
        path: `${language}/rio/${uri}/`,
        component: path.resolve('./src/components/Page/index.jsx'),
        context: {
          languageMapping,
          id: page.node.id,
          slug: page.node.slug,
          databaseId: page.node.databaseId,
          uri,
          title: page.node.title,
        },
      });
    } else {
      actions.createPage({
        path: `${language}/${uri}/`,
        component: path.resolve('./src/components/Page/index.jsx'),
        context: {
          languageMapping,
          id: page.node.id,
          slug: page.node.slug,
          databaseId: page.node.databaseId,
          uri,
          title: page.node.title,
        },
      });
    }
  });
};

const createAllWpPost = (data, actions, languageMapping) => {
  return data.allWpPost.edges.map(post => {
    var language = '';
    if (post.node.locale) {
      if (post.node.locale.locale == 'fr_FR') {
        language = '/fr';
      } else if (post.node.locale.locale == 'es_ES') {
        language = '/es';
      } else if (post.node.locale.locale == 'pt_BR') {
        language = '/pt';
      } else if (post.node.locale.locale == 'de_DE') {
        language = '/de';
      } else if (post.node.locale.locale == 'it_IT') {
        language = '/it';
      }
    }

    if (
      post.node.categories &&
      post.node.categories.nodes.length != 0 &&
      post.node.categories.nodes[0].slug == 'news'
    ) {
      actions.createPage({
        path: `${language}/news/${post.node.slug}/`,
        component: path.resolve('./src/components/Post/index.jsx'),
        context: {
          id: post.node.id,
          slug: post.node.slug,
          databaseId: post.node.databaseId,
          title: post.node.title,
          languageMapping,
        },
      });
    } else if (
      post.node.categories &&
      post.node.categories.nodes.length != 0 &&
      post.node.categories.nodes[0].slug == 'case-studies'
    ) {
      actions.createPage({
        path: `${language}/case-studies/${post.node.slug}/`,
        component: path.resolve('./src/components/Post/index.jsx'),
        context: {
          id: post.node.id,
          slug: post.node.slug,
          databaseId: post.node.databaseId,
          title: post.node.title,
          languageMapping,
        },
      });
    } else {
      actions.createPage({
        path: `${language}/blog/${post.node.slug}/`,
        component: path.resolve('./src/components/Post/index.jsx'),
        context: {
          id: post.node.id,
          slug: post.node.slug,
          databaseId: post.node.databaseId,
          title: post.node.title,
          languageMapping,
        },
      });
    }
  });
};

const createAllWpArticle = (data, actions, languageMapping) => {
  return data.allWpArticle.edges.map(post => {
    var language = '';
    if (post.node.locale) {
      if (post.node.locale.locale == 'fr_FR') {
        language = '/fr';
      } else if (post.node.locale.locale == 'es_ES') {
        language = '/es';
      } else if (post.node.locale.locale == 'pt_BR') {
        language = '/pt';
      } else if (post.node.locale.locale == 'de_DE') {
        language = '/de';
      } else if (post.node.locale.locale == 'it_IT') {
        language = '/it';
      }
    }

    var tempslug = post.node.slug;
    if (tempslug.slice(-2).search('-[1-9]') != -1) {
      tempslug = tempslug.slice(0, -2);
    }

    actions.createPage({
      path: `${language}/support/knowledgebase/${tempslug}/`,
      component: path.resolve('./src/components/Post/index.jsx'),
      context: {
        id: post.node.id,
        slug: post.node.slug,
        databaseId: post.node.databaseId,
        title: post.node.title,
        languageMapping,
      },
    });
  });
};

const createAllWpFaq = (data, actions, languageMapping) => {
  return data.allWpFaq.edges.map(post => {
    var language = '';
    if (post.node.locale) {
      if (post.node.locale.locale == 'fr_FR') {
        language = '/fr';
      } else if (post.node.locale.locale == 'es_ES') {
        language = '/es';
      } else if (post.node.locale.locale == 'pt_BR') {
        language = '/pt';
      } else if (post.node.locale.locale == 'de_DE') {
        language = '/de';
      } else if (post.node.locale.locale == 'it_IT') {
        language = '/it';
      }
    }

    actions.createPage({
      path: `${language}/ufaqs/${post.node.slug}/`,
      component: path.resolve('./src/components/Post/index.jsx'),
      context: {
        id: post.node.id,
        slug: post.node.slug,
        databaseId: post.node.databaseId,
        title: post.node.title,
        languageMapping,
      },
    });
  });
};

const pageSize = 17;
const createPaginationPages = (
  postsEN,
  postsES,
  postsFR,
  postsPT,
  postsDE,
  postsIT,
  actions
) => {
  const pageCountEN = Math.ceil(postsEN.totalCount / pageSize);
  const pageCountES = Math.ceil(postsES.totalCount / pageSize);
  const pageCountFR = Math.ceil(postsFR.totalCount / pageSize);
  const pageCountPT = Math.ceil(postsPT.totalCount / pageSize);
  const pageCountDE = Math.ceil(postsDE.totalCount / pageSize);
  const pageCountIT = Math.ceil(postsIT.totalCount / pageSize);
  const totalPages =
    pageCountEN +
    pageCountES +
    pageCountFR +
    pageCountPT +
    pageCountDE +
    pageCountIT;

  return Array.from({ length: totalPages }).map((_, index) => {
    actions.createPage({
      path: `/blog/${index > 0 ? index + 1 : ''}`,
      component: path.resolve('./src/components/BlogLandingPage/index.js'),
      context: {
        skip: index * pageSize,
        category: 'blog',
        limit: pageSize,
        pageCountEN,
        pageCountES,
        pageCountFR,
        pageCountPT,
        pageCountDE,
        pageCountIT,
        currentPage: index + 1,
      },
    });
  });
};

const createPaginationPagesNewsEN = (data, actions) => {
  const posts = data;
  const totalItemsInLang = data.totalCount;
  const pageCount = Math.ceil(totalItemsInLang / pageSize);

  return Array.from({ length: pageCount }).map((_, index) => {
    actions.createPage({
      path: `/news/${index > 0 ? index + 1 : ''}`,
      component: path.resolve('./src/components/BlogLandingPage/index.js'),
      context: {
        skip: index * pageSize,
        category: 'news',
        limit: pageSize,
        pageCount,
        currentPage: index + 1,
        posts,
      },
    });
  });
};

const createPaginationPagesCaseStudiesEN = (data, actions) => {
  const posts = data;
  const totalItemsInLang = data.totalCount;
  const pageCount = Math.ceil(totalItemsInLang / pageSize);

  return Array.from({ length: pageCount }).map((_, index) => {
    actions.createPage({
      path: `/case-studies/${index > 0 ? index + 1 : ''}`,
      component: path.resolve('./src/components/BlogLandingPage/index.js'),
      context: {
        skip: index * pageSize,
        category: 'case-studies',
        limit: pageSize,
        pageCount,
        currentPage: index + 1,
        posts,
      },
    });
  });
};

const createKnowledgeBasePage = (data, actions, languageMapping) => {
  return Object.values(languageMapping).map(locale => {
    const language = locale !== undefined ? locale : '';
    actions.createPage({
      path: `${language}/support/knowledgebase/`,
      component: path.resolve(
        './src/components/KnowledgeBase/KnowledgeBasePage.js'
      ),
      context: {
        data: data.allWpFaq,
        categories: data.knowledgebaseCategories,
      },
    });
  });
};

const createKnowledgeBaseCategoryPages = (data, actions, languageMapping) => {
  return Object.values(languageMapping).map(locale => {
    const language = locale !== undefined ? locale.replace('/', '') : '';
    return data.edges.map(({ node }) => {
      actions.createPage({
        path: `${language}${node.uri}`,
        component: path.resolve(
          './src/components/KnowledgeBase/KnowledgeBaseCategory.js'
        ),
        context: {
          data,
          category: node.name,
          uri: node.uri,
        },
      });
    });
  });
};
