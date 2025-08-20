const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2Mbay1-b4cCmb6dMT8yVAPEI8HApC25epWiqQIk1_43FcSlOfvucowCkVfS_wxX0PWtBgETb17Pk0/pub?output=csv";

let data = [];
let map;
let markers = [];

const cardView = document.getElementById("cardView");
const mapView = document.getElementById("mapView");
const cardViewBtn = document.getElementById("cardViewBtn");
const mapViewBtn = document.getElementById("mapViewBtn");
const regionFilter = document.getElementById("regionFilter");
const countyFilter = document.getElementById("countyFilter");

//const filterToggle = document.getElementById("filterToggle");
const sidebar = document.querySelector(".sidebar");

//filterToggle.onclick = () => {
  //sidebar.classList.toggle("show");
  
//};

cardViewBtn.onclick = () => {
  cardView.classList.remove("hidden");
  mapView.classList.add("hidden");
};

mapViewBtn.onclick = () => {
  mapView.classList.remove("hidden");
  cardView.classList.add("hidden");
  if (!map) {
    initMap();
  }
  addMarkers(data);
};

function initMap() {
  map = L.map("map").setView([44.5, -89.5], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);
}

function addMarkers(filteredData) {
  // Remove old markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const bounds = [];

  filteredData.forEach(org => {
    if (org.latitude && org.longitude) {
      const lat = parseFloat(org.latitude);
      const lng = parseFloat(org.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng])
          .bindPopup(`
            <strong>${org.Organization}</strong><br>
            ${org.County}, ${org.Region}
          `);
        marker.addTo(map);
        markers.push(marker);
        bounds.push([lat, lng]);
      }
    }
  });

  // Zoom to fit all markers
  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
}

function renderCards(filteredData) {
  cardView.innerHTML = "";
  filteredData.forEach(org => {
    const card = document.createElement("div");
    card.className = "card";

     // If org.image exists, include an <img> tag
    const regionImageHTML = org.image
  ? `<img src="${org.image}" alt="${org.Region}" style="width:50px; height:auto; display:block; margin-bottom:8px; border-radius:4px;">`
  : org.Region;

      
    card.innerHTML = `
      <div class="col1"><h3>${org.Organization} </h3>
      ${regionImageHTML}
      <small><p>${org.City} / ${org.County}</p>
      <p><a href="${org.OrgURL}" target="_blank">website</a>
      <p><a href="${org.VolunteerListing}" target="_blank">volunteer Opportunities</a></div></small>
      <div class="col2"><p><strong>About: </strong> ${org.About}</p></div>
    `;
    cardView.appendChild(card);
  });
}

function populateFilters() {
  const regions = [...new Set(data.map(d => d.Region).filter(Boolean))];
  const counties = [...new Set(data.map(d => d.County).filter(Boolean))];

  regions.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    regionFilter.appendChild(opt);
  });

  counties.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    countyFilter.appendChild(opt);
  });
}

function applyFilters() {
  const region = regionFilter.value;
  const county = countyFilter.value;

  const filtered = data.filter(d => {
    return (region === "all" || d.Region === region) &&
           (county === "all" || d.County === county);
  });

  renderCards(filtered);

  if (map && !mapView.classList.contains("hidden")) {
    addMarkers(filtered);
  }
}

regionFilter.onchange = applyFilters;
countyFilter.onchange = applyFilters;

const regionImages = {
  southeast: "images\SEWisc.png",
  southwest: "images\SWWisc.png",
  northeast: "images\NEWisc.png",
  northwest: "images\NWWisc.png",
  "east central": "images\ECWisc.png",
  "south central": "images\SCWisc.png",
  "central": "images\CWisc.png"
  // add more regions as needed
};

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: results => {
    data = results.data.map(row =>{
      row.image = regionImages[row.region.toLowerCase()] || "";
      return row;
  });

     console.log(data[0])
    populateFilters();
    renderCards(data);
  }
});

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2Mbay1-b4cCmb6dMT8yVAPEI8HApC25epWiqQIk1_43FcSlOfvucowCkVfS_wxX0PWtBgETb17Pk0/pub?output=csv";

let data = [];
let map;
let markers = [];

const cardView = document.getElementById("cardView");
const mapView = document.getElementById("mapView");
const cardViewBtn = document.getElementById("cardViewBtn");
const mapViewBtn = document.getElementById("mapViewBtn");
const regionFilter = document.getElementById("regionFilter");
const countyFilter = document.getElementById("countyFilter");

//const filterToggle = document.getElementById("filterToggle");
const sidebar = document.querySelector(".sidebar");

//filterToggle.onclick = () => {
  //sidebar.classList.toggle("show");
  
//};

cardViewBtn.onclick = () => {
  cardView.classList.remove("hidden");
  mapView.classList.add("hidden");
};

mapViewBtn.onclick = () => {
  mapView.classList.remove("hidden");
  cardView.classList.add("hidden");
  if (!map) {
    initMap();
  }
  addMarkers(data);
};

function initMap() {
  map = L.map("map").setView([44.5, -89.5], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);
}

function addMarkers(filteredData) {
  // Remove old markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const bounds = [];

  filteredData.forEach(org => {
    if (org.latitude && org.longitude) {
      const lat = parseFloat(org.latitude);
      const lng = parseFloat(org.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng])
          .bindPopup(`
            <strong>${org.Organization}</strong><br>
            ${org.County}, ${org.Region}
          `);
        marker.addTo(map);
        markers.push(marker);
        bounds.push([lat, lng]);
      }
    }
  });

  // Zoom to fit all markers
  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
}

function renderCards(filteredData) {
  cardView.innerHTML = "";
  filteredData.forEach(org => {
    const card = document.createElement("div");
    card.className = "card";

     // If org.image exists, include an <img> tag
    const regionImageHTML = org.image
  ? `<img src="${org.image}" alt="${org.Region}" style="width:50px; height:auto; display:block; margin-bottom:8px; border-radius:4px;">`
  : org.Region;

      
    card.innerHTML = `
      <div class="col1"><h3>${org.Organization} </h3>
      ${regionImageHTML}
      <small><p>${org.City} / ${org.County}</p>
      <p><a href="${org.OrgURL}" target="_blank">website</a>
      <p><a href="${org.VolunteerListing}" target="_blank">volunteer Opportunities</a></div></small>
      <div class="col2"><p><strong>About: </strong> ${org.About}</p></div>
    `;
    cardView.appendChild(card);
  });
}

function populateFilters() {
  const regions = [...new Set(data.map(d => d.Region).filter(Boolean))];
  const counties = [...new Set(data.map(d => d.County).filter(Boolean))];

  regions.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    regionFilter.appendChild(opt);
  });

  counties.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    countyFilter.appendChild(opt);
  });
}

function applyFilters() {
  const region = regionFilter.value;
  const county = countyFilter.value;

  const filtered = data.filter(d => {
    return (region === "all" || d.Region === region) &&
           (county === "all" || d.County === county);
  });

  renderCards(filtered);

  if (map && !mapView.classList.contains("hidden")) {
    addMarkers(filtered);
  }
}

regionFilter.onchange = applyFilters;
countyFilter.onchange = applyFilters;

const regionImages = {
  southeast: "images\SEWisc.png",
  southwest: "images\SWWisc.png",
  northeast: "images\NEWisc.png",
  northwest: "images\NWWisc.png",
  "east central": "images\ECWisc.png",
  "south central": "images\SCWisc.png",
  "central": "images\CWisc.png"
  // add more regions as needed
};

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: results => {
    data = results.data.map(row =>{
      row.image = regionImages[row.region.toLowerCase()] || "";
      return row;
  });

     console.log(data[0])
    populateFilters();
    renderCards(data);
  }
});
