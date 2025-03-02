// app/api/analyze/patterns.ts
// Wappalyzer的な判定を参考にした独自ルール集。
// 実際にはもっと多数の条件を追加できます。

export interface PatternDefinition {
    name: string;
    category: string; // e.g. 'CMS', 'Framework', 'Frontend', 'Language', 'Hosting'
    match: {
      html?: string[];
      generator?: string[];
      headers?: string[];
      cookies?: string[];
      script?: string[]; // scriptタグのsrcに含まれる文字列
    };
  }
  
  export const PATTERNS: PatternDefinition[] = [
    {
      name: 'WordPress',
      category: 'CMS',
      match: {
        generator: ['WordPress'],
        html: ['wp-content', 'wp-includes'],
        headers: ['wordpress'],
        cookies: ['wordpress_logged_in', 'wp-settings-'],
      },
    },
    {
      name: 'Drupal',
      category: 'CMS',
      match: {
        generator: ['Drupal'],
        html: ['drupal.js'],
      },
    },
    {
      name: 'Joomla',
      category: 'CMS',
      match: {
        generator: ['Joomla'],
        html: ['joomla.js'],
      },
    },
    {
      name: 'Shopify',
      category: 'CMS',
      match: {
        html: ['cdn.shopify.com', 'shopify_templates'],
        cookies: ['cart_sig', 'cart_ts'],
      },
    },
    {
      name: 'Ruby on Rails',
      category: 'Framework',
      match: {
        headers: ['ruby', 'rails'],
        cookies: ['_rails_session'],
      },
    },
    {
      name: 'Django',
      category: 'Framework',
      match: {
        headers: ['python', 'django'],
        cookies: ['csrftoken', 'sessionid'],
      },
    },
    {
      name: 'Laravel',
      category: 'Framework',
      match: {
        headers: ['php', 'laravel'],
        cookies: ['laravel_session'],
      },
    },
    {
      name: 'ASP.NET',
      category: 'Framework',
      match: {
        headers: ['asp.net'],
        cookies: ['asp.net_sessionid'],
      },
    },
    {
      name: 'Flask',
      category: 'Framework',
      match: {
        headers: ['werkzeug', 'python'],
      },
    },
    {
      name: 'React',
      category: 'Frontend',
      match: {
        html: ['reactroot', '__react_devtools_global_hook__'],
        script: ['react.', 'react-dom.'],
      },
    },
    {
      name: 'Vue',
      category: 'Frontend',
      match: {
        html: ['vue.config', 'data-v-app', 'ngp-vue'],
        script: ['vue.', 'vue-router.'],
      },
    },
    {
      name: 'Angular',
      category: 'Frontend',
      match: {
        html: ['ng-version', 'angular.js'],
        script: ['@angular', 'angular-'],
      },
    },
    {
      name: 'Gatsby',
      category: 'Frontend',
      match: {
        html: ['static/gatsby-'],
      },
    },
    {
      name: 'Nuxt.js',
      category: 'Frontend',
      match: {
        html: ['window.__NUXT__'],
      },
    },
    {
      name: 'Svelte',
      category: 'Frontend',
      match: {
        html: ['svelte.dev'],
        script: ['svelte'],
      },
    },
    {
      name: 'TypeScript',
      category: 'Language',
      match: {
        html: ['typescript'],
        headers: ['ts-node'],
      },
    },
    {
      name: 'Node.js',
      category: 'Language',
      match: {
        headers: ['x-powered-by: node.js'],
      },
    },
    {
      name: 'Netlify',
      category: 'Hosting',
      match: {
        headers: ['netlify'],
      },
    },
    {
      name: 'GitHub Pages',
      category: 'Hosting',
      match: {
        html: ['github.io'],
      },
    },
    {
      name: 'Heroku',
      category: 'Hosting',
      match: {
        headers: ['heroku'],
      },
    },
    {
      name: 'Vercel',
      category: 'Hosting',
      match: {
        headers: ['vercel'],
      },
    },
    {
      name: 'Cloudflare Pages',
      category: 'Hosting',
      match: {
        headers: ['cloudflare'],
      },
    },
  ];
  