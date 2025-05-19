const backup = Deno.env.get("CL_SYA_BACKUP");
import { create, web_deal } from "fpng-sign-serve";
const site={}
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
