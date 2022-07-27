//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function formatNumber(number) {
  return number >= 10 ? number : `0${number}`;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  for (let e of episodeList) {
    const episode = document.createElement("div");
    episode.className = "episode";
    const head = document.createElement("p");
    head.className = "head";
    const a = document.createElement("a");
    const img = document.createElement("img");
    const summary = document.createElement("div");
    summary.className = "summary";

    head.innerHTML =
      `${e.name}` + ` S${formatNumber(e.season)}E${formatNumber(e.number)}`;
    img.src = `${e.image.medium}`;
    summary.innerHTML = `${e.summary}`;
    a.href = `${e.url}`;

    a.appendChild(img);
    episode.appendChild(head);
    episode.appendChild(a);
    episode.appendChild(summary);
    rootElem.appendChild(episode);
  }
}

window.onload = setup;
