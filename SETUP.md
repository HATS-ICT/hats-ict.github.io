# HATS Lab Website Setup Guide

## Quick Start

Your HATS Lab website is ready to deploy! Here's what you need to do:

### 1. Push to GitHub

```bash
git add .
git commit -m "feat: create HATS lab academic homepage"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the `main` branch
4. Click Save
5. Your site will be live at `https://hats-ict.github.io` in a few minutes

### 3. Customize Content

#### Update Lab Information

Edit `_config.yml`:
```yaml
lab_name: HATS Lab
research_lead: Dr. Volkan Ustun
institution: Your Institution Name  # ← Change this
email: contact@hatslab.edu          # ← Change this
```

#### Add Team Members

1. Add profile photos to `assets/images/` (e.g., `volkan-ustun.jpg`)
2. Edit `people.html` and replace placeholder entries with actual team member information
3. Update names, titles, bios, and links

#### Add Publications

Edit `publications.html`:
- Replace placeholder publications with actual papers
- Update titles, authors, venues, and links
- Organize by year

#### Add Research Images

1. Add simulation screenshots to `assets/images/`
2. Edit `research.html` and update image paths:
   ```html
   <img src="{{ '/assets/images/your-image.jpg' | relative_url }}" alt="Description">
   ```

#### Update News

Edit `index.html` and modify the news section with recent lab updates.

### 4. Test Locally (Optional)

If you have Ruby and Jekyll installed:

```bash
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000`

If you don't have Jekyll, you can:
1. Install Ruby: https://www.ruby-lang.org/en/downloads/
2. Install Bundler: `gem install bundler`
3. Run the commands above

## Design Features

✅ **Clean & Modern Design** - Professional academic aesthetic  
✅ **Responsive** - Works on desktop, tablet, and mobile  
✅ **Fast Loading** - Optimized for performance  
✅ **Easy Navigation** - Clear structure with dedicated pages  
✅ **GitHub Pages Ready** - No additional configuration needed

## Page Structure

- **Home** (`index.html`) - Lab overview, research areas, team preview, recent publications
- **Research** (`research.html`) - Detailed research information and current projects
- **People** (`people.html`) - Team members, students, and alumni
- **Publications** (`publications.html`) - Complete publication list organized by year
- **Contact** (`contact.html`) - Contact information and location

## Customization Tips

### Change Colors

Edit `assets/css/main.css` and modify the CSS variables:

```css
:root {
    --primary-color: #1a56db;      /* Main blue color */
    --primary-dark: #0f3b8a;       /* Darker blue for hover states */
    --accent-color: #059669;       /* Green accent color */
}
```

### Change Fonts

The site uses:
- **Space Grotesk** for headings
- **Inter** for body text

To change fonts, edit the Google Fonts link in `_layouts/default.html` and update the font-family in `assets/css/main.css`.

### Add New Pages

1. Create a new HTML file (e.g., `news.html`)
2. Add the front matter:
   ```yaml
   ---
   layout: default
   title: News
   ---
   ```
3. Add content using the same structure as other pages
4. Add navigation link in `_config.yml`

## Need Help?

- Jekyll documentation: https://jekyllrb.com/docs/
- GitHub Pages documentation: https://docs.github.com/en/pages
- Liquid template language: https://shopify.github.io/liquid/

## Image Guidelines

### Profile Photos
- Recommended size: 400x400 pixels
- Format: JPG or PNG
- Keep file sizes under 200KB for fast loading

### Simulation Screenshots
- Recommended size: 1200x800 pixels
- Format: JPG
- Keep file sizes under 500KB

### Where to Place Images
All images go in `assets/images/`:
```
assets/images/
  ├── profile-volkan-ustun.jpg
  ├── profile-student1.jpg
  ├── sim-unity-environment.jpg
  └── sim-agent-coordination.jpg
```

## What's Next?

1. ✅ Replace placeholder images with actual photos
2. ✅ Update team member information
3. ✅ Add real publications with links
4. ✅ Customize institution and contact info
5. ✅ Add lab news and updates
6. ✅ Consider adding a blog section for research updates
7. ✅ Add Google Analytics (optional) for visitor tracking

## Deployment Checklist

- [ ] Updated `_config.yml` with correct information
- [ ] Added real profile photos
- [ ] Updated team member information
- [ ] Added actual publications
- [ ] Updated research descriptions
- [ ] Added contact information
- [ ] Tested all links
- [ ] Committed and pushed to GitHub
- [ ] Enabled GitHub Pages in repository settings

Your website is now ready to showcase the HATS Lab to the world! 🎉

