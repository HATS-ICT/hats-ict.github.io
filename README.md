# HATS Lab Website

Official website for the Human-inspired Adaptive Teaming Systems (HATS) Lab.

## About

The HATS Lab focuses on building autonomous synthetic characters and Non-Player Characters (NPCs) for military training simulations using Multi-agent Reinforcement Learning (MARL), Graph Neural Networks (GNNs), and cognitive architectures.

## Website Structure

- `index.html` - Homepage with lab intro, people preview, news, and recent publications
- `people.html` - Team members, students, and alumni
- `publications.html` - Complete list of lab publications with feature images
- `contact.html` - Contact information and location

## Setup

This site uses Jekyll and GitHub Pages. To run locally:

```bash
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000` to view the site.

## Configuration

Edit `_config.yml` to update:
- Lab information
- Institution name
- Contact email
- Navigation items

## Adding Content

### Adding Team Members

#### Homepage (index.html)
Add to the people grid with profile photos.

#### People Page (people.html)
Add detailed person cards with bios and links.

### Adding Publications

Edit `publications.html` and add a new publication item with:
- Feature image (left side, 200x150px display size)
- Title, authors, venue
- Abstract
- Links (PDF, arXiv, code, etc.)

### Adding News

Edit the news section in `index.html` to add lab updates.

## Images

Place images in `assets/images/`:

### Logo
- `logo.png` - Lab logo (recommended: 200x200px PNG with transparent background)

### Profile Photos
- `volkan-ustun.jpg` - Dr. Volkan Ustun
- `researcher1.jpg`, `researcher2.jpg`, etc.
- Recommended size: 400x400px

### Publication Feature Images
- `paper1.jpg`, `paper2.jpg`, etc.
- Recommended size: 600x400px
- These appear on the left side of each publication

## Customization

The site uses a clean, modern design appropriate for an academic lab. To customize:

- **Colors**: Edit CSS variables in `assets/css/main.css`
- **Fonts**: Currently using Inter from Google Fonts
- **Layout**: Modify `_layouts/default.html`

## License

© 2024 HATS Lab. All rights reserved.
