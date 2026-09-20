import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

if (process.env.GITHUB_PAGES !== 'true') {
  process.exit(0)
}

const outDir = join(process.cwd(), 'out')
if (!existsSync(outDir)) {
  process.exit(0)
}

writeFileSync(
  join(outDir, 'index.html'),
  `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=./ar/" />
    <link rel="canonical" href="./ar/" />
    <script>location.replace('./ar/');</script>
    <title>بالخدمة</title>
  </head>
  <body>
    <p><a href="./ar/">بالخدمة</a></p>
  </body>
</html>
`
)
