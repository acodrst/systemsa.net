import { model_to_dots } from "./node_modules/text-model-dot/text-model-dot.js";
let levs= model_to_dots(Deno.readTextFileSync("assets/model.txt"),false)
for (let level in levs){
  Deno.writeTextFileSync(`assets/split/${level}.txt`,`:: level\n${levs[level].level.join('\n')}\n${levs[level].lines.join('\n')}\n`)
}