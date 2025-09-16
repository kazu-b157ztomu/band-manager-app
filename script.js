let bands = JSON.parse(localStorage.getItem("bands")) || [];

function saveBands() {
    localStorage.setItem("bands", JSON.stringify(bands));
}

function addBand() {
    const input = document.getElementById("bandInput");
    const bandName = input.value.trim();
    const alert = document.getElementById("alert");

    if (bandName === "") {
        alert.textContent = "バンド名を入力してください。";
        return;
    }

    if (bands.some(b => b.name === bandName)) {
        alert.textContent = `「${bandName}」はすでに登録されています！`;
        return;
    }

    bands.push({ name: bandName, favorite: false });
    saveBands();
    alert.textContent = "";
    input.value = "";
    renderBands();
}

function toggleFavorite(index) {
    bands[index].favorite = !bands[index].favorite;
    saveBands();
    renderBands();
}

function deleteBand(index) {
    if (confirm(`「${bands[index].name}」を削除しますか？`)) {
        bands.splice(index, 1);
        saveBands();
        renderBands();
    }
}

function renderBands(filtered = bands) {
    const list = document.getElementById("bandList");
    list.innerHTML = "";

    // 元のインデックスを保持したまま逆順にする
    const displayList = filtered
        .map((band, i) => ({ band, index: i }))
        .slice()
        .reverse();

    displayList.forEach(({ band, index }) => {
        const li = document.createElement("li");
        const nameSpan = document.createElement("span");
        nameSpan.textContent = band.name;
        if (band.favorite) nameSpan.classList.add("favorite");

        const controls = document.createElement("span");
        controls.className = "controls";

        const favBtn = document.createElement("button");
        favBtn.textContent = band.favorite ? "★" : "☆";
        favBtn.onclick = () => toggleFavorite(index);

        const delBtn = document.createElement("button");
        delBtn.textContent = "削除";
        delBtn.onclick = () => deleteBand(index);

        controls.appendChild(favBtn);
        controls.appendChild(delBtn);

        li.appendChild(nameSpan);
        li.appendChild(controls);
        list.appendChild(li);
    });
}


function filterBands() {
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
    const filtered = bands.filter(b => b.name.toLowerCase().includes(keyword));
    renderBands(filtered);
}

//電光掲示板
function updateMarquee() {
    const marquee = document.getElementById("marqueeText");
    if (!marquee) return;

    const names = bands.map(b => b.name).join(" 🎵 ");
    marquee.textContent = names || "バンドが登録されていません";
}


renderBands();
updateMarquee(); 

document.getElementById("bandInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addBand();
    }
});

document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        filterBands();
    }
});

// サイドバー
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("hidden");
  renderFavorites();
}

function renderFavorites() {
  const list = document.getElementById("favoriteList");
  list.innerHTML = "";

  bands
    .filter(band => band.favorite)
    .forEach(band => {
      const li = document.createElement("li");
      li.textContent = band.name;
      list.appendChild(li);
    });
}

