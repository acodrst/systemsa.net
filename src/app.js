import { model_to_dots } from "text-model-dot";
import { gsdot_svg } from "gsdot-svg";
document.body.insertAdjacentHTML("beforeend", site.page);
const style = document.createElement("style");
style.textContent = site.css;
document.head.appendChild(style);
localStorage.clear();
localStorage.setItem("gs_level", globalThis.location.hash.substring(1));
localStorage.setItem("gs_map", site.model);
update_levels("map");
function update_levels(kind) {
  kind = kind || "map";
  const level = localStorage.getItem("gs_level") || "Top";
  localStorage.setItem("gs_level", level);
  globalThis.location = `#${level}`;
  const levs = model_to_dots(localStorage.getItem("gs_map"), true,"todo");
  document.getElementById("todo").innerHTML=''
  levs.obj_set.forEach(o=>{
    const atoms=o.split('.') 
    document.getElementById("todo").insertAdjacentHTML("beforeend", 
      `<a href="#${atoms.slice(0,-1).join('.')}">${atoms.join('.')}</a>:${levs[atoms.slice(0,-1).join('.')]?.aspects?.[atoms.slice(-1)].note}<br>`)
  })
  if (level=='todo') select("todo")
  else {
    select(kind)
    gsdot_svg(levs[level].dots, "default", kind, level, levs);
  }
}
function select(d){
  for (let i of ["map","key","legal_writing","todo"]){
    if (i==d) document.getElementById(i).style.display="block";
    else document.getElementById(i).style.display="none";
  }
}
globalThis.addEventListener("hashchange", () => {
  localStorage.setItem("gs_level", globalThis.location.hash.substring(1));
  update_levels("map");
});
document.getElementById("home").addEventListener("click", () => {
  localStorage.setItem("gs_level", "Top");
  select("map")
  update_levels("map");
});
document.getElementById("legal").addEventListener("click", () => {
  select("legal_writing")
});
document.getElementById("key_select").addEventListener("click", () => {
  select("key")
  update_levels("key");
});