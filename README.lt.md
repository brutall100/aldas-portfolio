[English](README.md) · **Lietuvių**

# 👋 Aldas Kšečkauskas — Portfolio

Full-stack programuotojas, kuriantis su TypeScript, Next.js ir Node.
Ši repozitorija – mano portfolio svetainė: kas aš esu, ką kuriu ir kaip su manimi susisiekti.
Paprastas HTML, CSS ir JavaScript — be karkasų (frameworks) ir be „build“ žingsnio.

<p>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React">
<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js">
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Deno-000000?style=flat-square&logo=deno&logoColor=white" alt="Deno">
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
<img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma">
<img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="Stripe">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css&logoColor=white" alt="CSS">
</p>

[![Svetainė](https://img.shields.io/badge/Svetain%C4%97-aldas--portfolio.site-blue?style=for-the-badge)](https://aldas-portfolio.site)

![Portfolio kompiuterio ekrane](docs/screenshot-desktop.png)

<p align="center">
  <img src="docs/screenshot-mobile.png" alt="Portfolio telefono ekrane" width="320">
</p>

## 🚀 Išskirtiniai projektai

<table>
  <tr>
    <td width="50%" valign="top">
      <a href="https://github.com/brutall100/vinica-shop"><img src="img/vinica.webp" alt="Vinica"></a>
      <h3>Vinica</h3>
      <p>Keturių kalbų internetinė vynuogių sodinukų parduotuvė su Stripe apmokėjimu ir administravimo skydu.</p>
      <p><sub>Next.js · TypeScript · Prisma · PostgreSQL · Stripe</sub></p>
      <p><a href="https://github.com/brutall100/vinica-shop">Kodas</a></p>
    </td>
    <td width="50%" valign="top">
      <a href="https://nuogasiela.lt"><img src="img/nuoga-siela.webp" alt="Nuoga Siela"></a>
      <h3>Nuoga Siela</h3>
      <p>Anonimiška vieta išsirašyti jausmus – sudegink tekstą arba paleisk jį. PWA be jokių priklausomybių.</p>
      <p><sub>Deno · Deno KV · TypeScript · PWA</sub></p>
      <p><a href="https://nuogasiela.lt">Svetainė</a> · <a href="https://github.com/brutall100/nuoga-siela">Kodas</a></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <a href="https://www.viktorina.live"><img src="img/viktorina-cover.webp" alt="Viktorina.live"></a>
      <h3>Viktorina.live</h3>
      <p>Gyva viktorinų platforma: prisijunk prie žaidimo realiu laiku, kilk lyderių lentelėje, rink kreditus.</p>
      <p><sub>JavaScript · Node.js · Real-time</sub></p>
      <p><a href="https://www.viktorina.live">Svetainė</a></p>
    </td>
    <td width="50%" valign="top">
      <a href="https://weekmenu.brutall100.deno.net"><img src="img/weekmeniu-opt.webp" alt="Week Menu"></a>
      <h3>Week Menu</h3>
      <p>REST API ir klientas patiekalams, ingredientams ir kategorijoms planuoti.</p>
      <p><sub>Node.js · Express · MongoDB</sub></p>
      <p><a href="https://weekmenu.brutall100.deno.net">Svetainė</a> · <a href="https://github.com/brutall100/WeekMenu">Kodas</a></p>
    </td>
  </tr>
</table>

Daugiau projektų – [svetainėje](https://aldas-portfolio.site/#projects).

## Apie svetainę

| | |
| --- | --- |
| **Išdėstymas** | CSS Grid + Flexbox, lankstus `clamp()` šriftas, „mobile-first“ lūžio taškai |
| **Temos** | CSS kintamieji, tamsi tema pagal nutylėjimą + šviesios temos jungiklis, išsaugomas `localStorage` |
| **Animacijos** | `IntersectionObserver` atsiradimas slenkant, blizgesio efektai, judantis „aurora“ fonas |
| **Prieinamumas** | „Skip link“, matomi fokuso rėmeliai, ARIA būsenos meniu ir jungikliui, `prefers-reduced-motion` palaikymas |
| **Greitis** | Optimizuoti WebP paveikslėliai, „lazy loading“, nurodyti matmenys, jokių JS priklausomybių |

## Paleisti savo kompiuteryje

Paleisk bet kokį statinį serverį, pvz. `python3 -m http.server`, ir atidaryk
<http://localhost:8000>.

```
index.html    struktūra ir turinys
style.css     dizaino kintamieji, išdėstymas, animacijos
script.js     tema, meniu, atsiradimas slenkant, progreso juosta
img/          optimizuoti projektų ir profilio paveikslėliai
docs/         README ekrano nuotraukos
```

## Publikavimas

Svetainę rodo GitHub Pages iš `main` šakos, todėl `push` į `main` ir yra
publikavimas. `CNAME` saugo domeno vardą, o `_config.yml` neleidžia publikuoti
`cv/`, `docs/`, README failų ir `.htaccess`. `.htaccess` reikalingas tik Apache
serveriui.

## Kontaktai

- **El. paštas**: aldas.kse@gmail.com
- **LinkedIn**: [aldas-kseckauskas](https://www.linkedin.com/in/aldas-kseckauskas)

## Licencija

[MIT](LICENSE) © Aldas Kšečkauskas
