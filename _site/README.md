# HATS Lab Website

Website for the Human-inspired Adaptive Teaming Systems (HATS) Lab.

URL: [https://hats-ict.github.io](https://hats-ict.github.io)

## Local Development

```bash
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000`

## Adding People

Create `_people/name.md`:

```yaml
---
name: Full Name
title: Job Title
category: staff  # pi, staff, phd, masters, alumni
order: 10
photo: /assets/images/people/name.webp
email: email@usc.edu
google_scholar: https://scholar.google.com/...
website: https://...
github: https://github.com/...
linkedin: https://linkedin.com/in/...
hide: false
bio: >
  Research interests: ...
---
```

## Adding Publications

Create `_publications/YYYY-slug.md`:

```yaml
---
title: "Paper Title"
authors: "Author 1, Author 2"
venue: "Conference Name"
venueshort: "CONF"
year: 2025
date: 2025-01-01
thumbnail: /assets/images/work/slug.webp  # or /assets/images/empty-paper.webp
pdf: "https://..."
arxiv: "https://arxiv.org/abs/..."
code: "https://github.com/..."
dataset: "https://..."
website: "https://..."
slides: "https://..."
video: "https://..."
hide: false
---
```

## Adding News

Edit `_data/news.yml`:

```yaml
- date: 2025-01-15
  headline: "News headline here"
```

## Images

- People photos: `assets/images/people/`
- Publication thumbnails: `assets/images/work/`
- Default placeholder: `assets/images/empty-paper.webp`
