const MOVE_MENU = true;
const DARKEN_SHORTS = true;
const SUBSTRING_BLACKLIST = [
  "cm",
  "premiere",
  "preview",
  "pv",
  "teaser",
  "trailer",
];
const DEBOUNCE_DELAY = 1500;

function markAsAlreadySeen(element) {
  element.classList.add("already-seen");
}

function getVideos() {
  const thumbnails = [
    ...document.querySelectorAll("ytd-thumbnail:not(.already-seen)"),
  ];

  thumbnails.forEach(markAsAlreadySeen);

  return thumbnails.map((thumbnails) => thumbnails.parentElement);
}

function hasBlacklistedSubstring(video) {
  const innerText = video.innerText.toLowerCase();
  return SUBSTRING_BLACKLIST.some((substring) => innerText.includes(substring));
}

function hasProgressBar(video) {
  return Boolean(
    video.getElementsByTagName("ytd-thumbnail-overlay-resume-playback-renderer")
      .length
  );
}

function isShorts(video) {
  return video.innerHTML.includes('href="/shorts/');
}

function getThumbnail(video) {
  return video.getElementsByTagName("img")[0];
}

function applyDarken() {
  const videos = getVideos();
  if (videos.length === 0) {
    return;
  }

  // console.log(
  //   `Loaded ${videos.length} video(s)`,
  //   videos.map((video) => ({ title: video.innerText, video }))
  // );

  const filteredVideos = videos.filter(
    (video) =>
      hasBlacklistedSubstring(video) ||
      hasProgressBar(video) ||
      (DARKEN_SHORTS && isShorts(video))
  );

  // console.log(
  //   `Found ${filteredVideos.length} video(s) to darken`,
  //   filteredVideos.map((video) => ({ title: video.innerText, video }))
  // );

  filteredVideos
    .map(getThumbnail)
    .forEach((thumbnail) => thumbnail.classList.add("darken"));
}

function moveMenu() {
  if (!MOVE_MENU) {
    return;
  }

  const menu = document.querySelector(
    "ytd-menu-renderer.ytd-watch-metadata:not(.already-seen)"
  );
  if (!menu) {
    return;
  }

  const aboveTheFold = document.querySelector(
    "div#above-the-fold.ytd-watch-metadata"
  );
  if (!aboveTheFold) {
    return;
  }

  const actions = document.querySelector("div#actions.ytd-watch-metadata");
  if (!actions) {
    return;
  }

  menu.style["justify-content"] = "flex-start";
  aboveTheFold.prepend(actions);

  markAsAlreadySeen(menu);
  // console.log("Moved menu");
}

let timeout = null;
function debouncer(fns) {
  clearTimeout(timeout);
  timeout = setTimeout(() => fns.forEach((fn) => fn()), DEBOUNCE_DELAY);
}

const config = { childList: true, subtree: true };
const observer = new MutationObserver(() => debouncer([applyDarken, moveMenu]));
observer.observe(document.body, config);
