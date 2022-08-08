//You can edit ALL of the code here
const rootElem = document.getElementById("root");
const search = document.getElementById("search");
const numOfEpisodes = document.querySelector(".display-number-of-episodes");
const select = document.getElementById("select");
let allEpisodesList = "";

let searchValue = "";

search.addEventListener("keyup", OnSearch);

fetch("https://api.tvmaze.com/shows/5/episodes")
  .then((response) => response.json())
  .then((response) => {
    allEpisodesList = response;
  })
  .catch((err) => console.error(err));

function setup() {
  const allEpisodes = allEpisodesList;
  makePageForEpisodes(allEpisodes);
}

function formatNumber(number) {
  return number >= 10 ? number : `0${number}`;
}

function makePageForEpisodes(episodeList) {
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

    const option = document.createElement("option");
    option.text =
      `S${formatNumber(e.season)}E${formatNumber(e.number)}` + ` - ${e.name}`;
    option.setAttribute("value", `${e.season} ${e.number}`);
    select.appendChild(option);
  }
}

function OnSearch(event) {
  const allEpisodes = [...allEpisodesList];
  searchValue = event.target.value.toLowerCase();
  let searchedEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchValue) ||
      episode.summary.toLowerCase().includes(searchValue)
  );
  rootElem.innerHTML = "";

  makePageForEpisodes(searchedEpisodes);

  numOfEpisodes.innerHTML = `Displaying ${searchedEpisodes.length}/ ${allEpisodes.length}episodes`;
}

select.addEventListener("change", (event) => {
  rootElem.replaceChildren([]);
  let currentEpisode = `${event.target.value}`;

  for (let e of allEpisodesList) {
    if (
      `${e.season} ${e.number}` == currentEpisode ||
      currentEpisode == "all"
    ) {
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
});

window.onload = setup;
