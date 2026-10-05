const id = new URLSearchParams(location.search).get('id');
fetch('catalog.json').then(response => {
  if (!response.ok) throw new Error('Catalog unavailable');
  return response.json();
}).then(items => {
  const item = items.find(sketch => sketch.id === id);
  if (!item) throw new Error('Sketch not found');
  document.title = `${item.title} · Sketchbook`;
  document.querySelector('#title').textContent = item.title;
  document.querySelector('#description').textContent = item.description;
  document.querySelector('#detail-tags').textContent = `${item.kind === 'p5' ? 'p5.js' : 'Processing'} · ${item.tags.join(' · ')}`;
  const img = document.createElement('img');
  img.src = `previews/${item.id}.png`;
  img.alt = `Preview of ${item.title}`;
  document.querySelector('#preview').append(img);
  const source = document.createElement('a');
  source.href = `https://github.com/felipecustodio/sketchbook/tree/master/sketches/${item.kind}/${item.id}`;
  source.textContent = 'View source ↗';
  source.className = 'secondary-action';
  const actions = document.querySelector('#actions');
  if (item.kind === 'p5') {
    const demo = document.createElement('a');
    demo.href = `sketches/p5/${item.id}/${item.entry || 'index.html'}`;
    demo.textContent = 'Open interactive sketch ↗';
    demo.className = 'primary-action';
    actions.append(demo);
  }
  actions.append(source);
  for (const alternate of item.alternates || []) {
    const link = document.createElement('a');
    link.href = `sketches/p5/${item.id}/${alternate.path}`;
    link.textContent = `${alternate.title} ↗`;
    link.className = 'secondary-action';
    actions.append(link);
  }
}).catch(error => {
  document.querySelector('#title').textContent = error.message;
  document.querySelector('#description').textContent = 'Return to the gallery and choose a sketch.';
});
