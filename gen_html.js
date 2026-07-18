const fs = require("fs");

const INPUT_JSON = "manifest.json";
const OUTPUT_HTML = "index.html";

const data = JSON.parse(
  fs.readFileSync(INPUT_JSON, "utf8")
);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>PMP Course</title>

<style>

body{
    font-family:-apple-system,BlinkMacSystemFont,sans-serif;
    background:#f5f5f5;
    margin:0;
    padding:20px;
}

.container{
    max-width:1200px;
    margin:auto;
}

h1{
    margin-bottom:20px;
}

details{
    background:white;
    border-radius:12px;
    margin-bottom:12px;
    overflow:hidden;
}

summary{
    cursor:pointer;
    padding:16px;
    font-weight:600;
    user-select:none;
}

.tema summary{
    padding-left:30px;
}

.video{
    border-top:1px solid #eee;
    padding:14px 20px 14px 50px;
}

.video-title{
    font-size:15px;
    margin-bottom:10px;
}

.actions{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
}

.button{
    display:inline-block;
    text-decoration:none;
    padding:8px 12px;
    border-radius:8px;
    background:#007aff;
    color:white;
    font-size:14px;
}

.button.download{
    background:#666;
}

video{
    display:block;
    width:100%;
    max-width:700px;
    margin-top:12px;
    border-radius:8px;
}

.stats{
    color:#666;
    font-size:14px;
    margin-left:8px;
}

</style>
</head>
<body>

<div class="container">

<h1>PMP Course</h1>

${data.map(category => `
<details open>

<summary>
${escapeHtml(category.category)}
<span class="stats">
(${(category.temas || []).length} temas)
</span>
</summary>

${(category.temas || []).map(tema => `

<details class="tema">

<summary>
${escapeHtml(tema.name)}
<span class="stats">
(${(tema.videos || []).length} videos)
</span>
</summary>

${(tema.videos || []).map(video => `

<div class="video">

<div class="video-title">
${escapeHtml(video.name)}
</div>

<div class="actions">

<a
    class="button"
    href="${video.url}"
    target="_blank"
>
▶ Ver
</a>

<a
    class="button download"
    href="${video.url}"
    download
>
⬇ Descargar
</a>

</div>

<video
    controls
    preload="none"
    playsinline
>
    <source
        src="${video.url}"
        type="video/mp4"
    >
</video>

</div>

`).join("")}

</details>

`).join("")}

</details>
`).join("")}

</div>

</body>
</html>`;

fs.writeFileSync(OUTPUT_HTML, html);

console.log("Generated:", OUTPUT_HTML);