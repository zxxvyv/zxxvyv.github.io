const USER_ID = "957071564300501042";

let startTime = null;

async function updateData() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`);
        const { data } = await response.json();

        const user = data.discord_user;
        document.getElementById('user-pfp').src = `https://cdn.discordapp.com/avatars/${USER_ID}/${user.avatar}.png`;
        document.getElementById('username').innerText = user.global_name || user.username;
        
        const statusColors = { online: '#23a559', idle: '#f0b232', dnd: '#f23f43', offline: '#747f8d' };
        document.getElementById('status-dot').style.background = statusColors[data.discord_status] || '#747f8d';

        const activity = data.activities.find(a => a.type !== 4);
        const nameEl = document.getElementById('activity-name');
        const iconEl = document.getElementById('game-icon');

        if (activity) {
            nameEl.innerText = activity.type === 2 && data.spotify ? data.spotify.song : activity.name;
            startTime = activity.timestamps?.start || (data.spotify?.timestamps?.start || null);

            let iconUrl = null;

            if (activity.assets?.large_image) {
                const imgId = activity.assets.large_image;

                if (imgId.startsWith("mp:external")) {
                    iconUrl = `https://media.discordapp.net/external/${imgId.split("mp:external/")[1]}`;
                } else if (imgId.startsWith("spotify:")) {
                    iconUrl = data.spotify?.album_art_url;
                } else {
                    iconUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${imgId}.png`;
                }
            }
            else if (data.spotify) {
                iconUrl = data.spotify.album_art_url;
            }

            if (iconUrl) {
                iconEl.src = iconUrl;
                iconEl.style.display = "block";
            } else {
                iconEl.style.display = "none";
            }
        } else {
            nameEl.innerText = "No activity";
            iconEl.style.display = "none";
            startTime = null;
            document.getElementById('activity-time').innerText = "";
        }
    } catch (e) { console.error(e); }
}

function updateTimer() {
    if (!startTime) return;
    const elapsed = Date.now() - startTime;
    const h = Math.floor(elapsed / 3600000);
    const m = Math.floor((elapsed % 3600000) / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    let timeStr = h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
    document.getElementById('activity-time').innerText = `elapsed: ${timeStr}`;
}

setInterval(updateData, 15000);
setInterval(updateTimer, 1000);
updateData();

// music player

const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const audio = document.getElementById("audio-player");

const progressContainer = document.querySelector(".progress-container");
const progressBar = document.getElementById("progress-bar");

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playIcon.classList.remove("fa-play");
    playIcon.classList.add("fa-pause");
  } else {
    audio.pause();
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
  }
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progressPercent}%`;
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

// GERMANYYYYY TIMEEEE

function updateGermanyTime() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  document.getElementById("germany-time").textContent =
    formatter.format(now);
}

setInterval(updateGermanyTime, 1000);
updateGermanyTime();
