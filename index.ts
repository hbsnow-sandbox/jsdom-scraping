import { promises as fs } from "fs";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const targetUrl =
  "https://wiki.xn--rckteqa2e.com/wiki/%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E4%B8%80%E8%A6%A7";

const pick = (pokemons) => {
  return pokemons.map(pokemon => {
    // カントー
    if (1 <= pokemon.no && pokemon.no <= 151) {
      return {
        ...pokemon,
        area: 0
      }
    }

    // ジョウト
    if (152 <= pokemon.no && pokemon.no <= 251) {
      return {
        ...pokemon,
        area: 1
      }
    }

    // ホウエン
    if (252 <= pokemon.no && pokemon.no <= 386) {
      return {
        ...pokemon,
        area: 2
      }
    }

    // シンオウ
    if (387 <= pokemon.no && pokemon.no <= 491) {
      return {
        ...pokemon,
        area: 3
      }
    }

    // イッシュ
    if (494 <= pokemon.no && pokemon.no <= 649) {
      return {
        ...pokemon,
        area: 4
      }
    }

    // 未確認
    if (808 <= pokemon.no && pokemon.no <= 809) {
      return {
        ...pokemon,
        area: 7
      }
    }

    // ガラル
    if (862 <= pokemon.no && pokemon.no <= 863) {
      return {
        ...pokemon,
        area: 8
      }
    }

    return undefined
  }).filter(Boolean)
}

(async () => {
  const response = await fetch(targetUrl);
  if (!response.ok) {
    console.log("Error");
    return;
  }

  let result = [];
  const txt = await response.text();
  const { document } = new JSDOM(txt, { url: targetUrl }).window;

  const rowElems = document.querySelectorAll(".bluetable tr");

  rowElems.forEach((elem) => {
    const tdElems = elem.querySelectorAll("td");

    const no = parseInt(tdElems[0]?.textContent);

    if (!Number.isFinite(no)) {
      return;
    }

    const name = tdElems[1]?.textContent.trim();

    result.push({ no, name });
  });

  await fs.writeFile("./pokemons.json", JSON.stringify(pick(result)));
})();
