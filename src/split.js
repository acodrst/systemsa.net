import { model_to_dots } from "https://cdn.jsdelivr.net/npm/text-model-dot@1.0.12/text-model-dot.min.js";
let levs= model_to_dots(Deno.readTextFileSync("assets/model.txt"),false)
for (let level in levs){
  Deno.writeTextFileSync(`assets/split/${level}.txt`,`:: level\n${levs[level].level.join('\n')}\n${levs[level].lines.join('\n')}\n`)
}