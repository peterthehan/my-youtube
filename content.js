const SUBSTRING_BLACKLIST = [
  "#short",
  "cm",
  "premiere",
  "preview",
  "pv",
  "teaser",
  "trailer",
];
const DEBOUNCE_DELAY = 2000;

function markAsAlreadySeen(thumbnail) {
  thumbnail.classList.add("already-seen");
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

function getThumbnail(video) {
  return video.getElementsByTagName("img")[0];
}

function applyDarken() {
  const videos = getVideos();
  if (videos.length === 0) {
    return;
  }

  console.log(`Loaded ${videos.length} video(s)`);

  const filteredVideos = videos.filter(
    (video) => hasBlacklistedSubstring(video) || hasProgressBar(video)
  );

  console.log(
    `Found ${filteredVideos.length} video(s) to darken`,
    filteredVideos.map((video) => ({ title: video.innerText, video }))
  );

  filteredVideos
    .map(getThumbnail)
    .forEach((thumbnail) => thumbnail.classList.add("darken"));
}

let timeout = null;
function debouncer() {
  clearTimeout(timeout);
  timeout = setTimeout(applyDarken, DEBOUNCE_DELAY);
}

const targetNode = document.body;
const config = { childList: true, subtree: true };
const observer = new MutationObserver(debouncer);
observer.observe(targetNode, config);
