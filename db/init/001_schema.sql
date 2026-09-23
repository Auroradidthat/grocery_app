CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_category_name (user_id, name)
) ENGINE=InnoDB;

CREATE TABLE items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_item_name (user_id, name)
) ENGINE=InnoDB;

CREATE TABLE recipes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_recipe_name (user_id, name)
) ENGINE=InnoDB;

CREATE TABLE recipe_items (
  recipe_id INT UNSIGNED NOT NULL,
  item_id INT UNSIGNED NOT NULL,
  quantity VARCHAR(50) NULL,
  notes VARCHAR(255) NULL,
  PRIMARY KEY (recipe_id, item_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE grocery_list_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  item_id INT UNSIGNED NULL,
  free_text_name VARCHAR(150) NULL,
  is_checked TINYINT(1) NOT NULL DEFAULT 0,
  added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL
) ENGINE=InnoDB;
-- Note: MySQL rejects a CHECK constraint on a column that also has an
-- ON DELETE SET NULL foreign key action, so "item_id or free_text_name
-- must be set" is enforced in the API layer instead of at the DB level.

-- Placeholder dev user until real auth exists (login is a future session).
-- password_hash below is password_hash('devpassword', PASSWORD_DEFAULT),
-- generated via: docker compose exec web php -r "echo password_hash('devpassword', PASSWORD_DEFAULT), PHP_EOL;"
INSERT INTO users (id, email, password_hash) VALUES
  (1, 'dev@example.com', '$2y$10$/9gpjXfurWEBltKUOSePW.mxouhLrIsLgy2c8ybqWGEKw5B/lW/t6');
