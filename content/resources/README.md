# Resources Structure

Resources are now managed through a centralized JSON file (`resources.json`) instead of individual markdown files.

## Structure

The JSON file has the following main components:

1. **Categories**: Main topics organized hierarchically
   - Línea conductual
   - Línea cognitiva
   - Otros (Psi)
   - Otros (no-psi)

2. **Subcategories**: More specific topics under each category

3. **Resources**: The actual content items with metadata

4. **Filters**: Supporting properties for filtering
   - Language (español/inglés)
   - Type (artículo/libro/video)

## Adding a new resource

To add a new resource, add it to the appropriate subcategory in the resources.json file with all required metadata fields.

Required fields:
- id: Unique identifier
- title: Resource title
- type: libro, artículo, or video
- excerpt: Short description
- author: Author name
- language: español or inglés
- link: URL to the resource
