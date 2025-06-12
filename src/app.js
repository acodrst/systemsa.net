import { model_to_dots } from "text-model-dot";
import { gsdot_svg } from "gsdot-svg";
import { saveAs } from 'file-saver'
document.body.insertAdjacentHTML("beforeend", site.page);
document.getElementById("home").insertAdjacentHTML("beforeend", site.html);
const style = document.createElement("style");
style.textContent = site.css;
document.head.appendChild(style);
localStorage.clear();
localStorage.setItem('gs_map', site.model)
const levs = model_to_dots(localStorage.getItem("gs_map"), true,"todo");
// kind of hacky, but obj_set holds object links for todo
const levs_keys=new Set()
for (let i in levs) if (i!='obj_set') levs_keys.add(i)
// the page hash/id is only for the current map
function update_levels(kind) {
  kind = kind || "map";
  const level = localStorage.getItem("gs_level") || "Top";
  localStorage.setItem("gs_level", level);
  globalThis.location = `#${level}`;
  document.getElementById("todo").innerHTML='<a href="#Top">Top</a><br>'
  levs.obj_set.forEach(o=>{
    const atoms=o.split('.') 
    document.getElementById("todo").insertAdjacentHTML("beforeend", 
      `<a href="#${atoms.slice(0,-1).join('.')}">${atoms.join('.')}</a>:${levs[atoms.slice(0,-1).join('.')]?.aspects?.[atoms.slice(-1)].note}<br>`)
  })
  if (level=='todo') select("todo")
  else {
    select(kind)
    gsdot_svg(levs[level].dots, "default", kind, level, levs);
    gsdot_svg(levs[level].dots, 'default', kind,level,levs)
    .then(svg=>localStorage.setItem('svg_content',svg))
  }
}
function select(d){
  for (let i of ["map","home","key","legal_writing","todo"]){
    if (i==d) document.getElementById(i).style.display="block";
    else document.getElementById(i).style.display="none";
  }
}
globalThis.addEventListener("hashchange", () => {
  const hash=globalThis.location.hash.substring(1)
  if (levs_keys.has(hash)|| hash=="todo"){
    console.log('setting')
  localStorage.setItem("gs_level", globalThis.location.hash.substring(1));
  update_levels("map");
  }
});
document.getElementById("map_select").addEventListener("click", () => {
  select("map")
  update_levels("map");
});
document.getElementById("home_select").addEventListener("click", () => {
  select("home")
});
document.getElementById("pdf_select").addEventListener("click", () => {
  const save_name = prompt("Enter the file name for saving the map in SVG format. This will save to your browser's download folder.","Logical Map How-to Guide.pdf")
  const u8array=new Uint8Array(site.pdf)
  const blob_content = new Blob([u8array], {
    type: "application/pdf"
  })
  if (!(save_name===null)) saveAs(blob_content, save_name)
});
document.getElementById("legal").addEventListener("click", () => {
  select("legal_writing")
});
document.getElementById("key_select").addEventListener("click", () => {
  select("key")
  update_levels("key");
});

document.getElementById("save").addEventListener("click", (e) => {
  if (document.getElementById("map").style.display == 'block'|| document.getElementById("key").style.display == ''){
    const save_name = prompt("Enter the file name for saving the map in SVG format. This will save to your browser's download folder.","logical_map.svg")
    const blob_content = new Blob([localStorage.getItem('svg_content')], {
      type: "text/plain;charset=utf-8"
    })
    if (!(save_name===null)) saveAs(blob_content, save_name)
  }
  if (document.getElementById("key").style.display == 'block'){
    const head=`<!DOCTYPE html><html lang="en"><head><style>table{ border: 2px solid; border-collapse: collapse;}
td{border: 2px solid; padding:7px;font-family: monospace;font-size:20px;}</style><title>Logical Map Key</title></head>`
    const save_name = prompt("Enter the file name for saving the key in HTML format. This will save to your browser's download folder.","logical_map_key.html")
    const blob_content = new Blob([`${head}\n${document.getElementById("key").innerHTML}</html>`], {
      type: "text/plain;charset=utf-8"
    })
    if (!(save_name===null)) saveAs(blob_content, save_name)
  }
})
document.getElementById("file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    localStorage.clear();
    localStorage.setItem('gs_map', reader.result);
    localStorage.setItem('gs_level', 'Top');
    update_levels('map');
  };
  reader.readAsText(file);
})