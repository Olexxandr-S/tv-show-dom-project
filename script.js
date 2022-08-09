const rootElem = document.getElementById("root");
const search = document.getElementById("search");
const numOfEpisodes = document.querySelector(".display-number-of-episodes");
const selectEpisode = document.getElementById("selectEpisode");
let allEpisodesList = "";
let searchValue = "";
let allShows = "";
let sorted = [];
let result;

if (allEpisodesList.length == 0) {
  selectEpisode.setAttribute("disabled", "");
}

fetch("https://api.tvmaze.com/shows")
  .then((response) => response.json())
  .then((response) => {
    allShows = response;
  })
  .catch((err) => console.error(err));

function setup() {
  makePageForShows(allShows);
  dropdownMenuShows(allShows);
}

function Refresh() {
  window.parent.location = window.parent.location.href;
}

function formatNumber(number) {
  return number >= 10 ? number : `0${number}`;
}

function randomNum(max) {
  return Math.floor(Math.random() * max);
}

search.addEventListener("keyup", OnSearchShows);

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
  selectEpisode.removeAttribute("disabled");
  selectEpisode.replaceChildren([]);
  numOfEpisodes.innerHTML = `Displaying ${episodeList.length} episodes`;
  rootElem.replaceChildren([]);
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

  selectEpisode.addEventListener("change", (event) => {
    numOfEpisodes.replaceChildren([]);
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

  search.addEventListener("keyup", OnSearchEpisodes);

  function OnSearchEpisodes(event) {
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
}

function OnSearchShows(event) {
  const allShowsLst = [...allShows];
  searchValue = event.target.value.toLowerCase();
  let searchedShows = allShowsLst.filter(
    (show) =>
      show.name.toLowerCase().includes(searchValue) ||
      show.summary.toLowerCase().includes(searchValue) ||
      show.genres.includes(searchValue)
  );
  rootElem.innerHTML = "";

  makePageForShows(searchedShows);

  numOfEpisodes.innerHTML = `Displaying ${searchedShows.length}/ ${allShowsLst.length}episodes`;
}

const makePageForNewEpisodes = async (id) => {
  id == "random"
    ? await fetch(
        `https://api.tvmaze.com/shows/${randomNum(allShows.length)}/episodes`
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

function makePageForShows(showList) {
  numOfEpisodes.innerText = `Displaying ${showList.length} show(s)`;
  rootElem.textContent = "";

  showList.forEach((show) => {
    const { name, image, summary, rating, genres, status, runtime, url } = show;

    let showCardDiv = document.createElement("div");
    rootElem.appendChild(showCardDiv);
    showCardDiv.className = "showCard";

    let showTitleDiv = document.createElement("div");
    showCardDiv.appendChild(showTitleDiv);
    showTitleDiv.className = "show-title";
    let title = document.createElement("p");
    showTitleDiv.appendChild(title);
    title.setAttribute("id", "showCardName");
    title.innerText = `${name}`;
    title.addEventListener("click", () => {
      let value = (title.innerText = `${name}`);
      let result;
      allShows.forEach((item) => {
        const { name, id } = item;
        if (name === value) {
          result = id;
        }
      });
      makePageForNewEpisodes(result);
    });

    let contentDiv = document.createElement("div");
    showCardDiv.appendChild(contentDiv);
    contentDiv.className = "content-container";

    let imgDiv = document.createElement("div");
    contentDiv.appendChild(imgDiv);
    imgDiv.className = "img-container";
    let imgTag = document.createElement("img");
    imgDiv.appendChild(imgTag);
    imgTag.src = `${image != null ? image.medium : ""}`;

    let summaryDiv = document.createElement("div");
    contentDiv.appendChild(summaryDiv);
    summaryDiv.className = "summary";
    let summaryText = document.createElement("p");
    summaryDiv.appendChild(summaryText);
    summaryText.innerHTML = `${summary}`;

    let infoDiv = document.createElement("div");
    contentDiv.appendChild(infoDiv);
    infoDiv.className = "info";
    let ratingValue = document.createElement("p");
    let genresValue = document.createElement("p");
    let statusValue = document.createElement("p");
    let runtimeValue = document.createElement("p");
    ratingValue.innerHTML = `<strong>Rating:</strong> ${rating.average}`;
    genresValue.innerHTML = `<strong>Genres:</strong> ${genres.join(" | ")}`;
    statusValue.innerHTML = `<strong>Status:</strong> ${status}`;
    runtimeValue.innerHTML = `<strong>Runtime:</strong> ${runtime}`;
    infoDiv.appendChild(ratingValue);
    infoDiv.appendChild(genresValue);
    infoDiv.appendChild(statusValue);
    infoDiv.appendChild(runtimeValue);

    let link = document.createElement("a");
    infoDiv.appendChild(link);
    link.href = `${url}`;
    link.innerText = "For More Info Visit TvMaze";
  });
}

window.onload = setup;
