[English](README.md) · **Lietuvių**

# 👋 Aldas Kšečkauskas — Portfolio

Mano asmeninė portfolio svetainė: kas aš esu, ką kuriu ir kaip su manimi susisiekti.
Paprastas HTML, CSS ir JavaScript — be karkasų (frameworks) ir be „build“ žingsnio.

[![Svetainė](https://img.shields.io/badge/Svetain%C4%97-aldas--portfolio.site-blue?style=for-the-badge)](https://aldas-portfolio.site)

![Portfolio kompiuterio ekrane](docs/screenshot-desktop.png)

<p align="center">
  <img src="docs/screenshot-mobile.png" alt="Portfolio telefono ekrane" width="320">
</p>

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
