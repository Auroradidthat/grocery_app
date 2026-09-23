# Wishlist

Ideas for `grocery_app` that aren't planned or committed to yet — just a place to jot things down before they're scoped into real work. Nothing here needs a "why" or a plan; move an idea to `DEVLOG.md` once you actually start building it.

- **Recipe mode:** Allows users to create reusable recipes from existing grocery item buttons.

  Proposed flow:
  1. User selects "Create Recipe."
  2. Display an overlay/modal asking the user to name the recipe.
  3. Enter Recipe mode after the name is confirmed. There has to be an indication saying that the app is in recipe mode — haven't figured out what this looks like yet.
  4. User selects grocery-item buttons to add ingredients to the recipe.
  5. User selects "Save Recipe."
  6. Save the recipe and its selected ingredients.
  7. Automatically exit recipe mode and return to normal mode.
  8. Generate a reusable button for the saved recipe.
  9. Selecting the recipe button adds its ingredients to the grocery list.
  10. Existing deduplication behavior should prevent duplicate grocery items.

  Possible future enhancements:
  - Edit existing recipes
  - Delete recipes
  - Rename recipes
  - Show selected ingredients while building a recipe
  - Cancel recipe creation to automatically return to normal mode
