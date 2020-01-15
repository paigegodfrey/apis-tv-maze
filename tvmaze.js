/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

async function searchShows(query) {
  let $userSearchTerm = $("#search-query").val();

  let response = await axios.get(`http://api.tvmaze.com/search/shows`, {
    params: {
      q: $userSearchTerm
    }
  });

  const altImg = 'http://tinyurl.com/tv-missing';

  let showData = response.data;
  let showArr = [];

  for (let i = 0; i < showData.length; i++) {
    let currentShow = showData[i];

    showArr.push({
      id: currentShow.show.id,
      name: currentShow.show.name,
      summary: currentShow.show.summary,
      image: currentShow.show.image ? currentShow.show.image.original : altImg
    });
  }

  return showArr;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${show.image}">
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary episode-btn" type="submit">Episode List</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodeList = response.data;
  let episodeDetails = [];

  for (let i = 0; i < episodeList.length; i++) {
    let episode = episodeList[i];

    episodeDetails.push({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    });
  }
  return episodeDetails;
}

function populateEpisodes(episodes) {

  const $episodesList = $("#episodes-list");
  $episodesList.empty();
    
  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
  }

  $("#episodes-area").show();
}

$("#shows-list").on("click", ".episode-btn", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});