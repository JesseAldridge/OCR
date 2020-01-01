const fs = require('fs');
const http = require('http');
const path = require('path');

const connect = require('connect');
const mustache = require('mustache');
const serveStatic = require('serve-static');
const glob = require("glob")

const PORT = (process.argv[2] ? parseInt(process.argv[2]) : 3012)


function load_results() {
  const png_paths = glob.sync("public/*.png")

  debugger

  const text_paths = glob.sync("public/*.txt")

  const reports = []
  for(let i = 0; i < png_paths.length; i++) {
    reports.push({
      text: fs.readFileSync(text_paths[i]),
      image_name: path.basename(png_paths[i]),
    })
  }

  return reports
}

const app = connect();

function render_page(req, res, page, page_data) {
  const template_html = fs.readFileSync(`page-templates/${page}.html`, 'utf8')
  const response_string = mustache.render(template_html, page_data)
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(response_string)
}

app.use(function(req, res, next) {
  const ip_address = req.connection.remoteAddress
  console.log(`${new Date().toUTCString()} request from: ${ip_address}, ${req.url}`)

  if(req.url == '/') {
    const results = load_results()
    render_page(req, res, 'index', {results})
  }
  else {
    // static file
    next()
    return
  }
});

const static_dir = `${__dirname}/public`
const static = serveStatic(static_dir)
app.use(function(req, res, next) {
  static(req, res, next)
});

console.log(`listening on port ${PORT}...`)
http.createServer(app).listen(PORT)
