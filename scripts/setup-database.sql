-- BrandSpace Database Schema for Supabase
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS app_settings CASCADE;
DROP TABLE IF EXISTS search_history CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS shop_meetings CASCADE;
DROP TABLE IF EXISTS shop_amenities CASCADE;
DROP TABLE IF EXISTS shop_images CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS category_types CASCADE;
DROP TABLE IF EXISTS shop_categories CASCADE;
DROP TABLE IF EXISTS mall_images CASCADE;
DROP TABLE IF EXISTS malls CASCADE;
DROP TABLE IF EXISTS developers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_positions CASCADE;
DROP TABLE IF EXISTS user_types CASCADE;

-- 1. User Types
CREATE TABLE user_types (
    id SERIAL PRIMARY KEY,
    type_en_name VARCHAR(50) UNIQUE NOT NULL,
    type_ar_name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Positions
CREATE TABLE user_positions (
    id SERIAL PRIMARY KEY,
    position_en_name VARCHAR(100) NOT NULL,
    position_ar_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    user_type INTEGER NOT NULL,
    user_position INTEGER,
    profile_image TEXT,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    nationality VARCHAR(50),
    location_on_map TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_type) REFERENCES user_types(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (user_position) REFERENCES user_positions(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 4. Developers Table
CREATE TABLE developers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    company_logo TEXT,
    commercial_register VARCHAR(50) UNIQUE,
    tax_number VARCHAR(50) UNIQUE,
    company_description TEXT,
    website VARCHAR(255),
    established_year SMALLINT,
    total_projects INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 5. Malls Table
CREATE TABLE malls (
    id SERIAL PRIMARY KEY,
    developer_id INTEGER NOT NULL,
    ar_name VARCHAR(100) NOT NULL,
    en_name VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    total_area DECIMAL(10,2),
    total_floors INTEGER,
    parking_spaces INTEGER,
    opening_hours JSONB,
    amenities JSONB,
    construction_status VARCHAR(20) CHECK (construction_status IN ('planning', 'under_construction', 'completed')),
    completion_date DATE,
    floor_plan TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 6. Mall Images Table
CREATE TABLE mall_images (
    id SERIAL PRIMARY KEY,
    mall_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    image_type VARCHAR(20) CHECK (image_type IN ('interior', 'exterior', 'floor_plan', 'view')),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (mall_id) REFERENCES malls(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. Shop Categories Table
CREATE TABLE shop_categories (
    id SERIAL PRIMARY KEY,
    ar_name VARCHAR(100) UNIQUE,
    en_name VARCHAR(100) UNIQUE,
    icon TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Category Types Table
CREATE TABLE category_types (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    type_en_name VARCHAR(100) NOT NULL,
    type_ar_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (category_id) REFERENCES shop_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 9. Shops Table
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    mall_id INTEGER NOT NULL,
    category_type_id INTEGER NOT NULL,
    shop_number VARCHAR(20),
    floor_number INTEGER,
    phone_number VARCHAR(20),
    whatsapp_number VARCHAR(20),
    email VARCHAR(100),
    unit_area DECIMAL(8,2),
    monthly_rent DECIMAL(10,2),
    sale_price DECIMAL(12,2),
    sale_type VARCHAR(10) NOT NULL CHECK (sale_type IN ('rent', 'sale', 'both')),
    finishing_type VARCHAR(50) CHECK (finishing_type IN ('not_finished', 'semi_finished', 'fully_finished')),
    delivery_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'reserved', 'sold', 'rented')),
    description TEXT,
    floor_plan_image_url TEXT,
    tenant_mix_image_url TEXT,
    view_type VARCHAR(50) CHECK (view_type IN ('mall_entrance', 'corridor', 'corner', 'food_court')),
    is_corner_shop BOOLEAN DEFAULT FALSE,
    has_storage BOOLEAN DEFAULT FALSE,
    electricity_capacity INTEGER,
    security_deposit DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (mall_id) REFERENCES malls(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (category_type_id) REFERENCES category_types(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Continue with remaining tables...
CREATE TABLE shop_images (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    image_type VARCHAR(20) CHECK (image_type IN ('interior', 'exterior', 'floor_plan', 'view')),
    is_primary BOOLEAN DEFAULT FALSE,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE shop_amenities (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL,
    amenity VARCHAR(100) NOT NULL,
    description TEXT,
    icon TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE shop_meetings (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (shop_id) REFERENCES shops(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    shop_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, shop_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE inquiries (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    developer_id INTEGER NOT NULL,
    inquiry_type VARCHAR(20) CHECK (inquiry_type IN ('rent', 'buy', 'visit', 'general')),
    message TEXT,
    contact_preference VARCHAR(20) CHECK (contact_preference IN ('phone', 'email', 'whatsapp')),
    preferred_contact_time VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('pending', 'responded', 'closed')),
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (shop_id) REFERENCES shops(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (developer_id) REFERENCES developers(id)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    developer_id INTEGER NOT NULL,
    booking_type VARCHAR(10) CHECK (booking_type IN ('rent', 'purchase')),
    start_date DATE,
    end_date DATE,
    monthly_amount DECIMAL(10,2),
    total_amount DECIMAL(12,2),
    security_deposit DECIMAL(10,2),
    commission_amount DECIMAL(10,2),
    contract_duration INTEGER,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'partial', 'completed')),
    contract_file TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (shop_id) REFERENCES shops(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (developer_id) REFERENCES developers(id)
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(20) CHECK (payment_type IN ('security_deposit', 'monthly_rent', 'commission', 'purchase')),
    payment_method VARCHAR(20) CHECK (payment_method IN ('credit_card', 'bank_transfer', 'cash')),
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(100) UNIQUE,
    payment_gateway_response JSONB,
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    developer_id INTEGER,
    mall_id INTEGER,
    shop_id INTEGER,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (developer_id) REFERENCES developers(id),
    FOREIGN KEY (mall_id) REFERENCES malls(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('inquiry', 'booking', 'payment', 'general', 'system')),
    related_id INTEGER,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    search_query VARCHAR(255) NOT NULL,
    filters JSONB,
    results_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE app_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_malls_developer ON malls(developer_id);
CREATE INDEX idx_shops_mall ON shops(mall_id);
CREATE INDEX idx_shops_category ON shops(category_type_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_status ON payments(payment_status);
