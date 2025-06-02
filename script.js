// =======================================
// Fetch & Display GitHub Repos
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
