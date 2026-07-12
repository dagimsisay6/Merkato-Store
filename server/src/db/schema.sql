CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  icon       TEXT,
  banner     TEXT,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brands (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  description TEXT,
  logo       TEXT,
  count      INT DEFAULT 0,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS countries (
  id         SERIAL PRIMARY KEY,
  code       TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  flag       TEXT,
  capital    TEXT,
  currency   TEXT,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'disabled')),
  avatar     TEXT,
  phone      TEXT,
  addresses  JSONB DEFAULT '[]',
  wishlist   INT[] DEFAULT '{}',
  cart                   JSONB DEFAULT '[]',
  reset_password_token   TEXT,
  reset_password_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  brand          TEXT NOT NULL,
  description    TEXT NOT NULL,
  price          NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  images         TEXT[] DEFAULT '{}',
  category_id    INT REFERENCES categories(id) ON DELETE SET NULL,
  stock          INT DEFAULT 0,
  rating         NUMERIC(3,2) DEFAULT 0,
  review_count   INT DEFAULT 0,
  features       TEXT[] DEFAULT '{}',
  tags           TEXT[] DEFAULT '{}',
  is_featured    BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating     INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT,
  subject        TEXT NOT NULL,
  message        TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread','read','replied','resolved','archived')),
  assigned_admin INT REFERENCES users(id) ON DELETE SET NULL,
  is_deleted     BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_replies (
  id         SERIAL PRIMARY KEY,
  message_id INT NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
  admin_id   INT REFERENCES users(id) ON DELETE SET NULL,
  reply      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_applications (
  id           SERIAL PRIMARY KEY,
  position     TEXT NOT NULL,
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  location     TEXT NOT NULL,
  linkedin     TEXT,
  portfolio    TEXT,
  experience   TEXT NOT NULL,
  cover_letter TEXT NOT NULL,
  resume_url   TEXT,
  status       TEXT NOT NULL DEFAULT 'new'
               CHECK (status IN ('new','reviewing','shortlisted','rejected','hired','archived')),
  is_deleted   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_replies (
  id             SERIAL PRIMARY KEY,
  application_id INT NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  admin_id       INT REFERENCES users(id) ON DELETE SET NULL,
  reply          TEXT NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

  id               SERIAL PRIMARY KEY,
  user_id          INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items            JSONB NOT NULL DEFAULT '[]',
  shipping_address JSONB,
  payment_method   TEXT DEFAULT 'card',
  subtotal         NUMERIC(10,2) NOT NULL,
  shipping_fee     NUMERIC(10,2) DEFAULT 0,
  total            NUMERIC(10,2) NOT NULL,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','in_transit','delivered','cancelled')),
  tracking_number  TEXT,
  paid_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
