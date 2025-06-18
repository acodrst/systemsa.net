const backup = Deno.env.get("CL_SYA_BACKUP");
import { create, web_deal } from "fpng-sign-serve";
import { model_to_dots } from "text-model-dot";
Deno.copyFileSync("/home/divine/websites/site/ada/assets/std_template.tex","./assets/std_template.tex")
Deno.copyFileSync("/home/divine/websites/site/ada/assets/std_graph.tex","./assets/std_graph.tex")
Deno.copyFileSync("/home/divine/websites/site/ada/assets/inline_icons.tex","./assets/inline_icons.tex")
const site={}
let p_c = [
  "--highlight-style=tango",
  "--pdf-engine=lualatex",
  "--pdf-engine-opt=-shell-escape",
  "--embed-resources",
  "--filter",
  "pandoc-crossref",
  "--filter",
  "src/filt.js",
  "--citeproc",
  "-o",
  "assets/sya.pdf",
  "sya.md",
  "assets/metadata.yaml",
];
console.log(`running pandoc ${p_c.join(" ")}`);
new Deno.Command("pandoc", {
  args: p_c,
}).outputSync();
p_c = [
  "--highlight-style=tango",
  "--filter",
  "pandoc-crossref",
  "--filter",
  "src/filt.js",
  "--citeproc",
  "-s",
  "-o",
  "assets/sya_head.html",
  "--table-of-contents",
  "-t",
  "html5",
  "sya.md",
  "assets/metadata.yaml",
];
console.log(`running pandoc ${p_c.join(" ")}`);
new Deno.Command("pandoc", {
  args: p_c,
}).outputSync();

site.pdf = Array.from(Deno.readFileSync("assets/sya.pdf"));
site.page = Deno.readTextFileSync("assets/page.html");
let chompy=Deno.readTextFileSync("assets/sya_head.html").match(
  /<header id="title-block-header">.+?<h1 class="title">/s,
)
site.html = chompy.input.slice(chompy.index+32,-23)

site.page = Deno.readTextFileSync("assets/page.html");
site.css= Deno.readTextFileSync("assets/style.css");
async function refresh(){
let full_page=''
for await (const i of Deno.readDir("assets/split")) {
  if (i.name.slice(-4)=='.txt'){
  full_page+=Deno.readTextFileSync(`assets/split/${i.name}`).trim()+'\n'
 }
}
Deno.writeTextFileSync('assets/model.txt',full_page+'\n')
site.model= Deno.readTextFileSync("assets/model.txt");
const levs = model_to_dots(site.model, true,"todo");
await create(site,backup)
}
refresh()
//uncomment below if you want a local web server
//Deno.serve({
//  port: 3052,
//  hostname: "0.0.0.0",
//  handler: (req) => web_deal(req),
//});
const watcher = Deno.watchFs("assets/split/");
for await (const event of watcher) {
   console.log(">>>> event", event);
await refresh()
   // { kind: "create", paths: [ "/foo.txt" ] }
}
