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
  const path = {};
  let levs = model_to_dots(localStorage.getItem("gs_map"), false);
  const level = localStorage.getItem("gs_level") || "Top";
  localStorage.setItem("gs_level", level);
  globalThis.location = `#${level}`;
  levs = model_to_dots(localStorage.getItem("gs_map"), true);
  //document.getElementById("level").innerHTML =
    //level.split('.').reduceRight((p, c, x, a) =>
    //[`<a href="#${a.slice(0, x + 1).join(".").replaceAll(' ', '')}">${c}</a>`, ...p], []).join(' 🔹 ')
    //gsdot_svg(model_to_dots(localStorage.getItem('gs_map'),true)[level].dots, 'default',
    //  kind,level,levs).then(svg=>localStorage.setItem('svg_content',svg))
    gsdot_svg(levs[level].dots, "default", kind, level, levs);
}
globalThis.addEventListener("hashchange", () => {
  localStorage.setItem("gs_level", globalThis.location.hash.substring(1));
  update_levels("map");
});
document.getElementById("home").addEventListener("click", () => {
  localStorage.setItem("gs_level", "Top");
  document.getElementById("map").style.display = "block";
  document.getElementById("key").style.display = "none";
  document.getElementById("legal_writing").style.display = "none";
  update_levels("map");
});
document.getElementById("legal").addEventListener("click", () => {
  document.getElementById("key").style.display = "none";
  document.getElementById("map").style.display = "none";
  document.getElementById("legal_writing").style.display = "block";
});
document.getElementById("key_select").addEventListener("click", () => {
  document.getElementById("key").style.display = "block";
  document.getElementById("map").style.display = "none";
  document.getElementById("legal_writing").style.display = "none";
  update_levels("key");
});
