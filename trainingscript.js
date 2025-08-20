const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfRzvWLQ6Qz-Irb_cOY_5cDZkgY6LQYTVIfdo2tdGNqH50eNuhaFCcFZAZREipNLVSzrZFm6S-zILM/pub?output=csv"

let data = [];
let map;
let markers = [];

const cardView = document.getElementById("cardView");
const mapView = document.getElementById("mapView");
const calView = document.getElementById("calView");
const cardViewBtn = document.getElementById("cardViewBtn");
const mapViewBtn = document.getElementById("mapViewBtn");
const calViewBtn = document.getElementById("calViewBtn")
const regionFilter = document.getElementById("regionFilter");
const countyFilter = document.getElementById("countyFilter");
const filterBtn = document.getElementById("filterBtn");

const sidebar = document.querySelector(".sidebar");

document.addEventListener("DOMContentLoaded", () => {
   window.dispatchEvent(new Event('resize'));
});

filterBtn.onclick = () => {
  document.querySelector(".wrapper").classList.toggle("hide-filters");
};

calViewBtn.onclick = () => {
  cardView.classList.add("hidden");
  mapView.classList.add("hidden");
  calView.classList.remove("hidden");
  document.getElementById("calendar").updateSize()

};

cardViewBtn.onclick = () => {
  cardView.classList.remove("hidden");
  mapView.classList.add("hidden");
  calView.classList.add("hidden");
};

mapViewBtn.onclick = () => {
  mapView.classList.remove("hidden");
  cardView.classList.add("hidden");
  calView.classList.add("hidden");
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
            <strong>${org.Series}</strong><br>
            ${org.EventName}
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

/* old function
function renderCards(filteredData) {
  cardView.innerHTML = "";
  filteredData.forEach(org => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="col1"><h3>${org.Series}</h3>
      <p><strong>${org.EventName}</strong></p>
      <p><strong>Location:</strong> ${org.address}</p>
      <p><strong>Dates:</strong> ${org.Date} - ${org.Time}   </p>
      <p><strong>Format:</strong> ${org.Virtual}  <strong>Cost:</strong>  ${org.Cost} </p>
      <p><a href="${org.RegistrationLink}" target="_blank">Registration</a></div>
      <div class="col2"><p><small>${org.About}</small></p></div>
    `;
    cardView.appendChild(card);
  });
}
*/

function renderCalendar(filteredData) {
  calView.classList.remove("hidden");  // show container

  const events = filteredData.map(row => {
    const badValues = ["self-paced", "multiple", "sundays"];
    const dateText = (row.Date || "").toLowerCase();

    // Skip messy cases
    if (badValues.some(val => dateText.includes(val))) {
      return null;
    }

    // Parse valid dates
    const parseDate = (d) => {
      if (!d) return null;
      const parsed = dayjs(d, ["M/D/YYYY", "M/D/YY"], true);
      return parsed.isValid() ? parsed.toISOString() : null;
    };

    const start = parseDate(row.Date);
    

    if (!start) return null;

    return {
      title: row.EventName || "Untitled Event",
      start: start,
      description: row.Organization || ""
    };
  })
  .filter(evt => evt); // keep only valid

  // Render FullCalendar
  
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: events,
      eventClick: function(info) {
        alert(info.event.title + "\n" + info.event.extendedProps.description);
      }
    });

  calendar.render();
 
    // if already initialized, just resize
    calendar.updateSize();
   

}

function renderCards(filteredData) {
  cardView.innerHTML = "";

  // Group data by Series
  const groups = filteredData.reduce((acc, org) => {
    if (!acc[org.Series]) acc[org.Series] = [];
    acc[org.Series].push(org);
    return acc;
  }, {});

  // Render each group
  for (const [series, items] of Object.entries(groups)) {
    // Create a header for the series
    const header = document.createElement("h2");
    header.textContent = series;
    cardView.appendChild(header);

    // Create a grid container for the cards in this series
    const grid = document.createElement("div");
    grid.className = "grid-container";

    items.forEach(org => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="col1">
          
          <p><strong>${org.EventName}</strong></p>
          <small><p><strong>Location:</strong> ${org.address}</p>
          <p><strong>Dates:</strong> ${org.Date} - ${org.Time}</p>
          <p><strong>Format:</strong> ${org.Virtual}  <strong>Cost:</strong> ${org.Cost}</p>
          <p><a href="${org.RegistrationLink}" target="_blank">Registration</a></p></small>
        </div>
        <div class="col2"><p>${org.About}</p></div>
      `;
      grid.appendChild(card);
    });

    cardView.appendChild(grid);
  }
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
  renderCalendar(filtered);

  if (map && !mapView.classList.contains("hidden")) {
    addMarkers(filtered);
  }
}

regionFilter.onchange = applyFilters;
countyFilter.onchange = applyFilters;

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: results => {
    data = results.data;
     console.log(data[0])
    populateFilters();
    renderCards(data);
    renderCalendar(data); // new
    // force FullCalendar to recalc size
  
  }
});
