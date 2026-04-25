let current = 0;

let albums = [
   {
    name: "Taylor Swift",
    cover: "images/taylor.jpg",
    songs: [
      { title: "Lover", artist: "Taylor Swift", src: "songs/lover.mp3" },
      { title: "Enchanted", artist: "Taylor Swift", src: "songs/enchanted.mp3" },
      { title: "Our Song", artist: "Taylor Swift", src: "songs/song.mp3" },
      { title: "Sparks Fly", artist: "Taylor Swift", src: "songs/fly.mp3" },
      { title: "Everything Has Changed ft. Ed Sheeran", artist: "Taylor Swift", src: "songs/has.mp3" }
    ]
  },
  {
    name: "Ariana Grande",
    cover: "images/ariana.jpg",
    songs: [
      { title: "pov", artist: "Ariana Grande", src: "songs/pov.mp3" },
      { title: "Daydreamin'", artist: "Ariana Grande", src: "songs/dream.mp3" },
      { title: "Santa Tell Me", artist: "Ariana Grande", src: "songs/santa.mp3" },
      { title: "we can't be friends", artist: "Ariana Grande", src: "songs/friends.mp3" },
      { title: "Stuck with U ft. Justin Bieber", artist: "Ariana Grande", src: "songs/U.mp3" }
    ]
  },
   {
    name: "Bruno Mars",
    cover: "images/bruno.jpg",
    songs: [
      { title: "Treasure", artist: "Bruno Mars", src: "songs/treasure.mp3" },
      { title: "Lazy Song", artist: "Bruno Mars", src: "songs/lazy.mp3" },
      { title: "Risk It All", artist: "Bruno Mars", src: "songs/risk.mp3" },
      { title: "I Just Might", artist: "Bruno Mars", src: "songs/might.mp3" },
      { title: "Just The Way You Are", artist: "Bruno Mars", src: "songs/just.mp3" }
    ]
  },
  {
    name: "Justin Bieber",
    cover: "images/justinb.jpg",
    songs: [
      { title: "Baby", artist: "Justin Bieber", src: "songs/baby.mp3" },
      { title: "Mistletoe", artist: "Justin Bieber", src: "songs/toe.mp3" },
      { title: "Confident", artist: "Justin Bieber", src: "songs/samok.mp3" },
      { title: "What Do You Mean?", artist: "Justin Bieber", src: "songs/do.mp3" },
      { title: "One Less Lonely Girl", artist: "Justin Bieber", src: "songs/girl.mp3" }
    ]
  },
  {
    name: "One Direction",
    cover: "images/oned.jpg",
    songs: [
      { title: "Perfect", artist: "One Direction", src: "songs/per.mp3" },
      { title: "History", artist: "One Direction", src: "songs/his.mp3" },
      { title: "One Thing", artist: "One Direction", src: "songs/thing.mp3" },
      { title: "Little Things", artist: "One Direction", src: "songs/little.mp3" },
      { title: "What Makes You Beautiful", artist: "One Direction", src: "songs/make.mp3" }
    ]
  }
];

let currentAlbum = 0;
let isAllSongsMode = false;
let allSongsList = [];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

audio.addEventListener("play", () => {
  playBtn.innerText = "⏸";
});

audio.addEventListener("pause", () => {
  playBtn.innerText = "▶";
});

function saveAlbums() {
  localStorage.setItem("albums", JSON.stringify(albums));
}

function playPause() {
  const mainBtn = document.querySelector(".info button");

  if (audio.paused) {
    audio.play();
    playBtn.innerText = "⏸";
    if (mainBtn) mainBtn.innerText = "⏸ Pause";
  } else {
    audio.pause();
    playBtn.innerText = "▶";
    if (mainBtn) mainBtn.innerText = "▶ Play";
  }
}

function next() {
  if (isAllSongsMode) {
    if (allSongsList.length === 0) return;

    current = (current + 1) % allSongsList.length;

    const song = allSongsList[current];
    audio.src = song.src;
    audio.play();

    updateNowPlaying(song);
  } else {
    const albumSongs = albums[currentAlbum]?.songs || [];
    if (albumSongs.length === 0) return;

    current = (current + 1) % albumSongs.length;

    const song = albumSongs[current];
    audio.src = song.src;
    audio.play();

    updateNowPlaying(song);
  }
}

function prev() {
  if (isAllSongsMode) {
    if (allSongsList.length === 0) return;

    current = (current - 1 + allSongsList.length) % allSongsList.length;

    const song = allSongsList[current];
    audio.src = song.src;
    audio.play();

    updateNowPlaying(song);
  } else {
    const albumSongs = albums[currentAlbum]?.songs || [];
    if (albumSongs.length === 0) return;

    current = (current - 1 + albumSongs.length) % albumSongs.length;

    const song = albumSongs[current];
    audio.src = song.src;
    audio.play();

    updateNowPlaying(song);
  }
}

function updateNowPlaying(song) {
  document.getElementById("title").innerText = song.title;

  if (isAllSongsMode) {
    document.getElementById("miniCover").src = song.albumCover;
    document.getElementById("artistName").innerText = song.albumName;
  } else {
    document.getElementById("miniCover").src =
      albums[currentAlbum].cover;

    document.getElementById("artistName").innerText =
      song.artist || albums[currentAlbum].name;
  }

  document.getElementById("currentTime").innerText = "0:00";
  progress.value = 0;

  playBtn.innerText = "⏸";

  const mainBtn = document.querySelector(".info button");
  if (mainBtn) mainBtn.innerText = "⏸ Pause";

  document.querySelectorAll(".song").forEach(s => s.classList.remove("active"));
  const rows = document.querySelectorAll(".song");
  if (rows[current]) rows[current].classList.add("active");
}

function renderAllSongs() {
  const container = document.getElementById("songs");
  container.innerHTML = "";

  allSongsList = [];
  isAllSongsMode = true;

  albums.forEach((album, albumIndex) => {
    album.songs.forEach((song, songIndex) => {
      allSongsList.push({
        ...song,
        albumIndex,
        songIndex,
        albumName: album.name,
        albumCover: album.cover
      });
    });
  });

  allSongsList.forEach((song, i) => {
    const row = document.createElement("div");
    row.classList.add("row", "song");

    row.innerHTML = `
      <span>${i + 1}</span>
      <span>${song.title} <small style="color:gray">(${song.albumName})</small></span>
      <span>${song.time}</span>
    `;

    row.onclick = () => {
      current = i;

      audio.src = song.src;
      audio.play();

      updateNowPlaying(song);
    };

    container.appendChild(row);
  });
}

function save() {
  localStorage.setItem("albums", JSON.stringify(albums));
}

function createAlbum() {
  const name = document.getElementById("albumName").value;
  const cover = document.getElementById("albumCover").value;

  if (!name || !cover) return;

  albums = loadAlbums();

  albums.push({
    name,
    cover,
    songs: []
  });

  saveAlbums();

  document.getElementById("albumName").value = "";
  document.getElementById("albumCover").value = "";

  renderAlbums();
  navigate("albums");
}

function addSong() {
  const title = document.getElementById("songTitle").value;
  const src = document.getElementById("songFile").value;

  if (!title || !src) return;

  const artist = prompt("Enter artist name:") || "Unknown Artist";

  const tempAudio = new Audio(src);

  tempAudio.addEventListener("loadedmetadata", () => {
    const minutes = Math.floor(tempAudio.duration / 60);
    const seconds = Math.floor(tempAudio.duration % 60)
      .toString()
      .padStart(2, "0");

    albums[currentAlbum].songs.push({
      title,
      artist,
      src,
      time: `${minutes}:${seconds}`
    });

    save();
    renderSongs();
  });
}

function removeSong(index, event) {
  event.stopPropagation();
  albums[currentAlbum].songs.splice(index, 1);
  save();
  renderSongs();
}

function renderSongs() {
  const container = document.getElementById("songs");
  container.innerHTML = "";

  if (!albums[currentAlbum]) return;

  albums[currentAlbum].songs.forEach((song, i) => {
    const row = document.createElement("div");
    row.classList.add("row", "song");

    row.innerHTML = `
  <span>${i + 1}</span>
  <span>${song.title}</span>

  <span class="song-actions">
    ${song.time}

    <div class="song-menu">
      <button onclick="toggleSongMenu(event, ${i})">⋮</button>

      <div class="menu" id="song-menu-${i}">
        <p onclick="renameSong(${i}, event)">Rename</p>
        <p onclick="removeSong(${i}, event)">Delete</p>
      </div>
    </div>
  </span>
`;

    row.onclick = (e) => {
  if (e.target.closest(".song-menu")) return;

  current = i;
  audio.src = song.src;
  audio.play();

  updateNowPlaying(song);
};

    container.appendChild(row);
  });
}

function navigate(page) {
  const header = document.querySelector(".header");
  const table = document.querySelector(".table");
  const albumsView = document.getElementById("albumsView");
  const createAlbum = document.getElementById("createAlbumSection");
  const addBtn = document.getElementById("addBtn");
  document.getElementById("backBtn").style.display = "none";

  header.style.display = "none";
  table.style.display = "none";
  albumsView.style.display = "none";
  createAlbum.style.display = "none";
  addBtn.style.display = "none";

  if (page === "albums") {
    albumsView.style.display = "grid";
    createAlbum.style.display = "flex";
  }

  if (page === "playlist") {
  header.style.display = "flex";
  table.style.display = "block";
  addBtn.style.display = "flex";

  document.getElementById("backBtn").style.display = "inline-block";
}

  if (page === "songs") {
  table.style.display = "block";
  renderAllSongs();
}
}

function renderAlbums() {
  const container = document.getElementById("albumsView");
  isAllSongsMode = false;

  container.innerHTML = "";

  if (albums.length === 0) {
    container.innerHTML = "<p>No albums yet</p>";
    return;
  }

  albums.forEach((album, index) => {
    const div = document.createElement("div");
    div.classList.add("album-card");

    div.innerHTML = `
      <div class="album-image">
        <img src="${album.cover}">
        <div class="album-menu">
          <button onclick="toggleMenu(event, ${index})">⋮</button>
          <div class="menu" id="menu-${index}">
            <p onclick="renameAlbum(${index}, event)">Rename</p>
            <p onclick="deleteAlbum(${index}, event)">Delete</p>
          </div>
        </div>
      </div>

      <div class="album-bottom">
        <h4>${album.name}</h4>
        <p>${album.songs.length} songs</p>
      </div>
    `;

    div.onclick = () => {
  currentAlbum = index;
  isAllSongsMode = false;

  document.getElementById("cover").src = album.cover;
  document.getElementById("artist").innerText = album.name;

  document.getElementById("albumInfo").innerText =
    `Album • ${album.songs.length} songs`;

  renderSongs();
  navigate("playlist");
};

    container.appendChild(div);
  });
}

function toggleMenu(event, index) {
  event.stopPropagation();

  const menu = document.getElementById(`menu-${index}`);

  document.querySelectorAll(".menu").forEach(m => {
    if (m !== menu) m.style.display = "none";
  });

  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function renameAlbum(index, event) {
  event.stopPropagation();

  const newName = prompt("Enter new album name:");
  if (!newName) return;

  albums[index].name = newName;
  save();
  renderAlbums();
}

function deleteAlbum(index, event) {
  event.stopPropagation();

  albums = loadAlbums();
  albums.splice(index, 1);

  saveAlbums();
  renderAlbums();
}

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;

    document.getElementById("currentTime").innerText =
      formatTime(audio.currentTime);

    document.getElementById("duration").innerText =
      formatTime(audio.duration);
  }
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function toggleSongMenu(event, index) {
  event.stopPropagation();

  const menu = document.getElementById(`song-menu-${index}`);

  document.querySelectorAll(".menu").forEach(m => {
    if (m !== menu) m.style.display = "none";
  });

  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function renameSong(index, event) {
  event.stopPropagation();

  const newName = prompt("Enter new song name:");
  if (!newName) return;

  albums[currentAlbum].songs[index].title = newName;

  save();
  renderSongs();
}

function goBackToAlbums() {
  navigate("albums");
}

function loadSongDurations() {
  let songsToLoad = 0;
  let songsLoaded = 0;

  albums.forEach((album, albumIndex) => {
    album.songs.forEach((song, songIndex) => {
      if (!song.time) {
        songsToLoad++;

        const audio = new Audio(song.src);

        audio.addEventListener("loadedmetadata", () => {
          const minutes = Math.floor(audio.duration / 60);
          const seconds = Math.floor(audio.duration % 60)
            .toString()
            .padStart(2, "0");

          albums[albumIndex].songs[songIndex].time = `${minutes}:${seconds}`;
          songsLoaded++;

          if (songsLoaded === songsToLoad) {
            saveAlbums();
            renderAlbums();
          }
        });

        audio.addEventListener("error", () => {
          console.error(`Failed to load: ${song.src}`);
          songsLoaded++;

          if (songsLoaded === songsToLoad) {
            saveAlbums();
            renderAlbums();
          }
        });
      }
    });
  });

  if (songsToLoad === 0) {
    renderAlbums();
  }
}

loadSongDurations();
navigate("albums");
