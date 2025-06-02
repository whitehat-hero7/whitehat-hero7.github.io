// =======================================
// 1. Binary-rain (“cyber code”) Animation
// =======================================

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

// Characters for the “rain” (0,1 only → binary feel)
const binaryChars = ['0', '1'];
const fontSize = 16;
const columns = Math.floor(width / fontSize);
const drops = Array(columns).fill(1);

// Resize handler
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  const newCols = Math.floor(width / fontSize);
  drops.length = newCols;
  for (let i = 0; i < newCols; i++) {
    drops[i] = drops[i] || 1;
  }
});

// Draw function
function drawBinaryRain() {
  // translucent background for “trail” effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#33ff33'; // bright green
  ctx.font = fontSize + 'px Share Tech Mono';

  for (let i = 0; i < drops.length; i++) {
    const text = binaryChars[Math.floor(Math.random() * binaryChars.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillText(text, x, y);

    // reset drop after reaching bottom or randomly to vary lengths
    if (y > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }

  requestAnimationFrame(drawBinaryRain);
}

// Kick off the animation
drawBinaryRain();


// =======================================
// 2. Live-Terminal Welcome Banner
// =======================================

const terminalTextEl = document.getElementById('terminal-text');
const terminalBanner = document.getElementById('terminal-banner');
const welcomeMessage = [
  '[INFO] Initializing GuardianRex SOC Portfolio...',
  '[INFO] Loading modules:',
  ' > Incident Response ✓',
  ' > Threat Hunting ✓',
  ' > Blue Team Toolkit ✓',
  '[INFO] Environment ready. Welcome, Analyst.',
];
let lineIndex = 0;
let charIndex = 0;

function typeLine() {
  if (lineIndex < welcomeMessage.length) {
    const currentLine = welcomeMessage[lineIndex];
    if (charIndex < currentLine.length) {
      terminalTextEl.textContent += currentLine.charAt(charIndex);
      charIndex++;
      setTimeout(typeLine, 50); // typing speed (50ms per character)
    } else {
      terminalTextEl.textContent += '\n';
      lineIndex++;
      charIndex = 0;
      setTimeout(typeLine, 200); // delay between lines
    }
  } else {
    // Once done typing all lines, keep the banner visible for 2 seconds, then slide up
    setTimeout(() => {
      terminalBanner.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
      terminalBanner.style.transform = 'translateY(-100%)';
      terminalBanner.style.opacity = '0';
      // Optionally, after it's hidden, remove from DOM to avoid tab stops
      setTimeout(() => {
        terminalBanner.remove();
      }, 600);
    }, 2000);
  }
}
// Start typing when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  typeLine();
});


// =======================================
// 3. Fetch & Display GitHub Repos
// =======================================

const projectsListEl = document.getElementById('projects-list');
const GITHUB_USERNAME = 'YOUR_GITHUB_USERNAME'; // ◀️ Replace this!

async function fetchAndDisplayRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
    );
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const repos = await response.json();

    if (repos.length === 0) {
      projectsListEl.innerHTML = '<p>No public repositories found.</p>';
      return;
    }

    // For each repo, create a “card” with name, description, and link
    repos.forEach((repo) => {
      const card = document.createElement('div');
      card.classList.add('repo-card');

      const nameLink = document.createElement('a');
      nameLink.href = repo.html_url;
      nameLink.target = '_blank';
      nameLink.textContent = repo.name;

      const desc = document.createElement('p');
      desc.classList.add('repo-info');
      desc.textContent = repo.description
        ? repo.description
        : 'No description provided.';

      card.appendChild(nameLink);
      card.appendChild(desc);

      projectsListEl.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    projectsListEl.innerHTML =
      '<p>Error fetching repositories. Check console for details.</p>';
  }
}

window.addEventListener('DOMContentLoaded', fetchAndDisplayRepos);
