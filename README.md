**English** · [Lietuvių](README.lt.md)

# 👋 Aldas Kšečkauskas — Portfolio

My personal portfolio site: who I am, what I build and how to reach me.
Plain HTML, CSS and JavaScript — no frameworks and no build step.

[![Website](https://img.shields.io/badge/Website-aldas--portfolio.site-blue?style=for-the-badge)](https://aldas-portfolio.site)

![Portfolio on a desktop screen](docs/screenshot-desktop.png)

<p align="center">
  <img src="docs/screenshot-mobile.png" alt="Portfolio on a phone screen" width="320">
</p>

## About this site

| | |
| --- | --- |
| **Layout** | CSS Grid + Flexbox, fluid `clamp()` type, mobile-first breakpoints |
| **Theming** | CSS custom properties, dark default + light toggle saved to `localStorage` |
| **Motion** | `IntersectionObserver` scroll reveals, shimmer sweeps, animated aurora background |
| **A11y** | Skip link, focus-visible rings, ARIA state on the menu/toggle, `prefers-reduced-motion` support |
| **Perf** | Optimised WebP images, lazy loading, explicit dimensions, zero JS dependencies |

## Run it locally

Start any static server, e.g. `python3 -m http.server`, then open
<http://localhost:8000>.

```
index.html    markup and content
style.css     design tokens, layout, animations
script.js     theme, menu, scroll reveal, progress bar
img/          optimised project and profile images
docs/         README screenshots
```

## Deploying

GitHub Pages serves the site from `main`, so a push to `main` is the deploy.
`CNAME` holds the custom domain and `_config.yml` keeps `cv/`, `docs/`, the
READMEs and `.htaccess` off the published site. `.htaccess` is only for
Apache hosting.

## Contact

- **Email**: aldas.kse@gmail.com
- **LinkedIn**: [aldas-kseckauskas](https://www.linkedin.com/in/aldas-kseckauskas)

## License

[MIT](LICENSE) © Aldas Kšečkauskas
