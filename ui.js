let subscription = null; // активна підписка

// --- Керування підписками ---
export function cleanup() {
  if (subscription) {
    subscription.unsubscribe();
    subscription = null;
  }
  clearLights('traffic-light');
  clearLights('cross-traffic');
}

export function setSubscription(sub) {
  cleanup();
  subscription = sub;
}

// --- Малювання світлофорів ---
export function setLight(containerId, color) {
  const lights = document.querySelectorAll(`#${containerId} .light`);
  lights.forEach(l => l.classList.remove('active'));
  if (color) {
    const el = document.querySelector(`#${containerId} .${color}`);
    if (el) el.classList.add('active');
  }
}

export function clearLights(containerId) {
  const lights = document.querySelectorAll(`#${containerId} .light`);
  lights.forEach(l => l.classList.remove('active'));
}

// --- UI панель ---
export function showLevel(title, { pedestrian = false, crossTraffic = false }) {
  document.getElementById('level-title').textContent = title;
  document.getElementById('pedestrian-btn').style.display = pedestrian ? 'inline-block' : 'none';
  document.getElementById('cross-traffic').style.display = crossTraffic ? 'block' : 'none';
}
