# Aldas Kšečkauskas — Portfolio

[![Website](https://img.shields.io/badge/Website-aldas--portfolio.site-blue?style=for-the-badge)](https://aldas-portfolio.site)

**🌐 Live site: [https://aldas-portfolio.site](https://aldas-portfolio.site)**

Source for [aldas-portfolio.site](https://aldas-portfolio.site).

## About this site
A single-page portfolio built with **no frameworks and no build step** — plain
HTML, CSS and JavaScript, served as static files.

| | |
| --- | --- |
| **Layout** | CSS Grid + Flexbox, fluid `clamp()` type, mobile-first breakpoints |
| **Theming** | CSS custom properties, dark default + light toggle saved to `localStorage` |
| **Motion** | `IntersectionObserver` scroll reveals, shimmer sweeps, animated aurora background |
| **A11y** | Skip link, focus-visible rings, ARIA state on the menu/toggle, `prefers-reduced-motion` support |
| **Perf** | Optimised WebP images, lazy loading, explicit dimensions, zero JS dependencies |

Run it locally with any static server, e.g. `python3 -m http.server`, then open
<http://localhost:8000>.

## Deploying
The site is served by GitHub Pages from `main`, so a push to `main` is the
deploy — there is nothing to upload. `CNAME` holds the custom domain and
`_config.yml` keeps `cv/`, `README.md` and `.htaccess` off the published site.

`.htaccess` is inert on Pages and is kept only for Apache hosting. To move the
site to Apache instead, upload `index.html`, `style.css`, `script.js`, `img/`,
`CV_Aldas.pdf`, `robots.txt`, `sitemap.xml` and `.htaccess`; leave `cv/` out.

```
index.html    markup and content
style.css     design tokens, layout, animations
script.js     theme, menu, scroll reveal, progress bar
img/          optimised project and profile images
```

---

**Email**: aldas.kse@gmail.com
**LinkedIn**: https://www.linkedin.com/in/aldas-kseckauskas

---

## Professional Summary
Full-stack web developer building production applications with TypeScript and Next.js — a four-language storefront with Stripe checkout and an admin panel, and a dependency-free PWA on Deno. Eighteen years of CNC programming before that, which is where the working habits came from: read the specification properly, debug patiently, ship on the date.

---

## Technical Skills
- **Front-End**: TypeScript, JavaScript, React, Next.js, Tailwind CSS, HTML, CSS
- **Back-End**: Node.js, Deno, Express, REST API, Auth.js
- **Databases**: PostgreSQL, Prisma, MongoDB, MySQL, Deno KV
- **Services**: Stripe, Resend, Vercel, Render, MongoDB Atlas
- **Practices**: Git, CI/CD, testing, i18n, SEO, accessibility
- **Industrial**: WoodWOP, CNC operation systems

---

## Education
**Code Academy** – Front-End and Back-End Programming  
**Dates Attended**: [Insert start and end dates]  
- Acquired skills in web technologies: HTML, CSS, JavaScript, React, Node.js, MySQL, and MongoDB.  
- Completed multiple projects, including a portfolio website and API integration applications.

---

## Professional Experience
### CNC Operator  
**Holzher PRO Master 7123K, Weeke Optimat BP85, Homag Venture 316L**  
**Dates of Employment**: [Insert dates]  
- Operated and maintained CNC machinery, ensuring smooth production processes.  
- Programmed and troubleshot using WoodWOP software.  
- Conducted product quality checks and resolved technical issues, achieving efficiency and production deadlines.

---

## Projects
1. **Personal Portfolio Website**  
   - Developed a responsive website showcasing projects and contact information using HTML, CSS, and JavaScript.

2. **To-Do Management App**  
   - Created a React-based task management app with add, edit, and delete functionalities.  
   - Technologies used: React, Node.js, MongoDB.

3. **API Integration Project**  
   - Built an application that fetches and displays real-time data from an external API.

---

## Languages
- **Lithuanian** – Native  
- **English** – Intermediate  
- **Russian** – Basic

---

## Additional Information
- Strong adaptability and problem-solving skills.  
- Keen interest in AI, emerging technologies, and software development.  
- Active learner committed to continuous skill development.



