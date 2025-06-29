-- Seed data for BrandSpace database (Version 2 - with conflict handling)

-- Insert User Types (with conflict handling)
INSERT INTO user_types (type_en_name, type_ar_name) VALUES
('Super Admin', 'مدير عام'),
('Mall Manager', 'مدير مول'),
('Finance Admin', 'مدير مالي'),
('Content Admin', 'مدير محتوى'),
('Developer', 'مطور'),
('Customer', 'عميل')
ON CONFLICT (type_en_name) DO NOTHING;

-- Insert User Positions (with conflict handling)
INSERT INTO user_positions (position_en_name, position_ar_name) VALUES
('CEO', 'الرئيس التنفيذي'),
('Manager', 'مدير'),
('Sales Executive', 'تنفيذي مبيعات'),
('Marketing Manager', 'مدير تسويق'),
('Operations Manager', 'مدير عمليات'),
('Finance Manager', 'مدير مالي')
ON CONFLICT DO NOTHING;

-- Insert Sample Users (with conflict handling)
INSERT INTO users (user_name, email, phone, password_hash, user_type, user_position, is_verified, is_active) VALUES
('Ahmed Al-Rashid', 'ahmed@brandspace.com', '+966501234567', 'hashed_password_1', 1, 1, true, true),
('Sarah Johnson', 'sarah@brandspace.com', '+966501234568', 'hashed_password_2', 2, 2, true, true),
('Mohammed Al-Fahad', 'mohammed@realestate.com', '+966501234569', 'hashed_password_3', 5, 3, true, true),
('Fatima Al-Zahra', 'fatima@customer.com', '+966501234570', 'hashed_password_4', 6, null, true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Developers (with conflict handling)
INSERT INTO developers (user_id, company_name, commercial_register, tax_number, company_description, website, established_year, is_verified) 
SELECT 
    u.id,
    'Al-Fahad Real Estate Development',
    'CR123456789',
    'TAX987654321',
    'Leading real estate developer in Saudi Arabia specializing in commercial and residential projects.',
    'https://alfahad-realestate.com',
    2010,
    true
FROM users u 
WHERE u.email = 'mohammed@realestate.com'
AND NOT EXISTS (SELECT 1 FROM developers d WHERE d.user_id = u.id);

-- Insert Shop Categories (with conflict handling)
INSERT INTO shop_categories (ar_name, en_name, description, is_active) VALUES
('رياضة', 'Sports', 'Sports and fitness related stores', true),
('أزياء', 'Fashion', 'Clothing and fashion stores', true),
('إلكترونيات', 'Electronics', 'Electronics and technology stores', true),
('طعام ومشروبات', 'Food & Beverage', 'Restaurants and food outlets', true),
('جمال وعناية', 'Beauty & Care', 'Beauty and personal care stores', true),
('منزل وديكور', 'Home & Decor', 'Home improvement and decoration stores', true)
ON CONFLICT (ar_name) DO NOTHING;

-- Insert Category Types (with conflict handling)
INSERT INTO category_types (category_id, type_en_name, type_ar_name, description) 
SELECT 
    sc.id,
    ct.type_en_name,
    ct.type_ar_name,
    ct.description
FROM shop_categories sc
CROSS JOIN (VALUES
    ('Sports Megastore', 'متجر رياضي كبير', 'Large sports equipment and apparel store'),
    ('Fitness Center', 'مركز لياقة بدنية', 'Gym and fitness facility')
) AS ct(type_en_name, type_ar_name, description)
WHERE sc.en_name = 'Sports'
AND NOT EXISTS (
    SELECT 1 FROM category_types ct2 
    WHERE ct2.category_id = sc.id 
    AND ct2.type_en_name = ct.type_en_name
);

-- Continue with other category types...
INSERT INTO category_types (category_id, type_en_name, type_ar_name, description) 
SELECT 
    sc.id,
    ct.type_en_name,
    ct.type_ar_name,
    ct.description
FROM shop_categories sc
CROSS JOIN (VALUES
    ('Clothing Store', 'متجر ملابس', 'General clothing and apparel store'),
    ('Luxury Boutique', 'بوتيك فاخر', 'High-end fashion boutique')
) AS ct(type_en_name, type_ar_name, description)
WHERE sc.en_name = 'Fashion'
AND NOT EXISTS (
    SELECT 1 FROM category_types ct2 
    WHERE ct2.category_id = sc.id 
    AND ct2.type_en_name = ct.type_en_name
);

-- Insert Sample Malls (with conflict handling)
INSERT INTO malls (developer_id, ar_name, en_name, description, address, city, district, total_area, total_floors, parking_spaces, construction_status, completion_date, is_active) 
SELECT 
    d.id,
    'مول الرياض الكبير',
    'Riyadh Grand Mall',
    'A premium shopping destination in the heart of Riyadh featuring international brands, dining, and entertainment.',
    'King Fahd Road, Al Olaya District',
    'Riyadh',
    'Al Olaya',
    150000.00,
    4,
    2000,
    'completed',
    '2023-06-15',
    true
FROM developers d
WHERE d.company_name = 'Al-Fahad Real Estate Development'
AND NOT EXISTS (SELECT 1 FROM malls m WHERE m.en_name = 'Riyadh Grand Mall');

-- Insert App Settings (with conflict handling)
INSERT INTO app_settings (setting_key, setting_value, description) VALUES
('site_name', 'BrandSpace', 'Application name'),
('site_description', 'Real Estate Marketplace for Mall Developers and Investors', 'Site description'),
('default_language', 'en', 'Default application language'),
('currency', 'SAR', 'Default currency'),
('timezone', 'Asia/Riyadh', 'Default timezone'),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('email_notifications_enabled', 'true', 'Enable email notifications'),
('sms_notifications_enabled', 'true', 'Enable SMS notifications'),
('maintenance_mode', 'false', 'Enable maintenance mode')
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = NOW();
