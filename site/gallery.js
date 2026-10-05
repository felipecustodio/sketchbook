const gallery = document.querySelector('#gallery');
const search = document.querySelector('#search');
const kind = document.querySelector('#kind');
const tags = document.querySelector('#tags');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty');
let selectedTag = '';

function card(item) {
  const link = document.createElement('a');
  link.className = 'card';
  link.href = `sketch.html?id=${encodeURIComponent(item.id)}`;
  const image = document.createElement('div');
  image.className = 'card-image';
  const img = document.createElement('img');
  img.src = `previews/${item.id}.png`;
  img.alt = `Preview of ${item.title}`;
  img.loading = 'lazy';
  img.onerror = () => { img.hidden = true; image.classList.add('missing-image'); };
  image.append(img);
  const meta = document.createElement('div');
  meta.className = 'card-meta';
  meta.textContent = item.kind === 'p5' ? 'p5.js · browser sketch' : 'Processing · source sketch';
  const title = document.createElement('h3');
  title.textContent = item.title;
  const description = document.createElement('p');
  description.textContent = item.description;
  const tagLine = document.createElement('span');
  tagLine.className = 'card-tags';
  tagLine.textContent = item.tags.join(' · ');
  link.append(image, meta, title, description, tagLine);
  return link;
}

fetch('catalog.json').then(response => {
  if (!response.ok) throw new Error('Catalog unavailable');
  return response.json();
}).then(items => {
  const allTags = [...new Set(items.flatMap(item => item.tags))].sort();
  for (const name of ['All subjects', ...allTags]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = name;
    button.dataset.tag = name === 'All subjects' ? '' : name;
    button.addEventListener('click', () => { selectedTag = button.dataset.tag; render(); });
    tags.append(button);
  }
  function render() {
    const query = search.value.trim().toLowerCase();
    const matches = items.filter(item =>
      (kind.value === 'all' || item.kind === kind.value) &&
      (!selectedTag || item.tags.includes(selectedTag)) &&
      (!query || `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase().includes(query))
    );
    for (const button of tags.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.tag === selectedTag));
    gallery.replaceChildren(...matches.map(card));
    count.textContent = `${matches.length} of ${items.length} sketches`;
    empty.hidden = matches.length !== 0;
  }
  search.addEventListener('input', render);
  kind.addEventListener('change', render);
  render();
}).catch(() => { count.textContent = 'The catalog could not be loaded. Refresh the page to try again.'; });
