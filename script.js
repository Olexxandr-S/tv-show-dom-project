//You can edit ALL of the code here
const rootElem = document.getElementById("root");
const search = document.getElementById("search");
const numOfEpisodes = document.querySelector(".display-number-of-episodes");
const selectEpisode = document.getElementById("selectEpisode");
let allEpisodesList = "";
let searchValue = "";
let allShows = "";
let sorted = [];
let result;

fetch("https://api.tvmaze.com/shows")
  .then((response) => response.json())
  .then((response) => {
    allShows = response;
  })
  .catch((err) => console.error(err));

fetch("https://api.tvmaze.com/shows/82/episodes")
  .then((response) => response.json())
  .then((response) => {
    allEpisodesList = response;
  })
  .catch((err) => console.error(err));

function setup() {
  makePageForEpisodes(allEpisodesList);
  dropdownMenuShows(allShows);
}

function formatNumber(number) {
  return number >= 10 ? number : `0${number}`;
}

function randomNum(max) {
  return Math.floor(Math.random() * max);
}

search.addEventListener("keyup", OnSearch);

const selectShow = document.getElementById("selectShow");

function dropdownMenuShows(showList) {
  showList.forEach((show) => {
    let names = `${show.name}`;
    sorted.push(names);
  });
  let sortedArr = sorted.sort();
  result = sortedArr.forEach((showName) => {
    const option = document.createElement("option");
    option.text = `${showName}`;
    let showId = 0;
    showList.forEach((show) => {
      if (show.name == showName) showId = show.id;
    });
    option.setAttribute("value", `${showId}`);
    selectShow.appendChild(option);
  });
}

function makePageForEpisodes(episodeList) {
  rootElem.replaceChildren([]);
  selectEpisode.replaceChildren([]);
  const allOption = document.createElement("option");
  allOption.text = "Show all episodes";
  allOption.setAttribute("value", "all");
  selectEpisode.appendChild(allOption);

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
    selectEpisode.appendChild(option);
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

selectEpisode.addEventListener("change", (event) => {
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

const makePageForNewEpisodes = async (id) => {
  id == "all"
    ? await fetch(
        `https://api.tvmaze.com/shows/${randomNum(
          allEpisodesList.length
        )}/episodes`
      )
        .then((response) => response.json())
        .then((response) => {
          makePageForEpisodes(response);
          allEpisodesList = response;
        })
        .catch((err) => console.error(err))
    : await fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
        .then((response) => response.json())
        .then((response) => {
          makePageForEpisodes(response);
          allEpisodesList = response;
        })
        .catch((err) => console.error(err));
};

selectShow.addEventListener("change", (event) => {
  let currentShow = `${event.target.value}`;
  makePageForNewEpisodes(currentShow);
});

window.onload = setup;
