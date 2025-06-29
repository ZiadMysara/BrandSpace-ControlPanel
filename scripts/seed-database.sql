-- Seed data for BrandSpace database

-- Insert User Types
INSERT INTO user_types (type_en_name, type_ar_name) VALUES
('Super Admin', 'مدير عام'),
('Mall Manager', 'مدير مول'),
('Finance Admin', 'مدير مالي'),
('Content Admin', 'مدير محتوى'),
('Developer', 'مطور'),
('Customer', 'عميل');

-- Insert User Positions
INSERT INTO user_positions (position_en_name, position_ar_name) VALUES
('CEO', 'الرئيس التنفيذي'),
('Manager', 'مدير'),
('Sales Executive', 'تنفيذي مبيعات'),
('Marketing Manager', 'مدير تسويق'),
('Operations Manager', 'مدير عمليات'),
('Finance Manager', 'مدير مالي');

-- Insert Sample Users
INSERT INTO users (user_name, email, phone, password_hash, user_type, user_position, is_verified, is_active) VALUES
('Ahmed Al-Rashid', 'ahmed@brandspace.com', '+966501234567', 'hashed_password_1', 1, 1, true, true),
('Sarah Johnson', 'sarah@brandspace.com', '+966501234568', 'hashed_password_2', 2, 2, true, true),
('Mohammed Al-Fahad', 'mohammed@realestate.com', '+966501234569', 'hashed_password_3', 5, 3, true, true),
('Fatima Al-Zahra', 'fatima@customer.com', '+966501234570', 'hashed_password_4', 6, null, true, true);

-- Insert Sample Developers
INSERT INTO developers (user_id, company_name, commercial_register, tax_number, company_description, website, established_year, is_verified) VALUES
(3, 'Al-Fahad Real Estate Development', 'CR123456789', 'TAX987654321', 'Leading real estate developer in Saudi Arabia specializing in commercial and residential projects.', 'https://alfahad-realestate.com', 2010, true);

-- Insert Shop Categories
INSERT INTO shop_categories (ar_name, en_name, description, is_active) VALUES
('رياضة', 'Sports', 'Sports and fitness related stores', true),
('أزياء', 'Fashion', 'Clothing and fashion stores', true),
('إلكترونيات', 'Electronics', 'Electronics and technology stores', true),
('طعام ومشروبات', 'Food & Beverage', 'Restaurants and food outlets', true),
('جمال وعناية', 'Beauty & Care', 'Beauty and personal care stores', true),
('منزل وديكور', 'Home & Decor', 'Home improvement and decoration stores', true);

-- Insert Category Types
INSERT INTO category_types (category_id, type_en_name, type_ar_name, description) VALUES
(1, 'Sports Megastore', 'متجر رياضي كبير', 'Large sports equipment and apparel store'),
(1, 'Fitness Center', 'مركز لياقة بدنية', 'Gym and fitness facility'),
(2, 'Clothing Store', 'متجر ملابس', 'General clothing and apparel store'),
(2, 'Luxury Boutique', 'بوتيك فاخر', 'High-end fashion boutique'),
(3, 'Electronics Store', 'متجر إلكترونيات', 'Consumer electronics retailer'),
(3, 'Mobile Shop', 'متجر هواتف', 'Mobile phones and accessories'),
(4, 'Restaurant', 'مطعم', 'Full-service restaurant'),
(4, 'Fast Food', 'وجبات سريعة', 'Quick service restaurant'),
(4, 'Cafe', 'مقهى', 'Coffee shop and light meals'),
(5, 'Beauty Salon', 'صالون تجميل', 'Hair and beauty services'),
(5, 'Cosmetics Store', 'متجر مستحضرات تجميل', 'Beauty products retailer');

-- Insert Sample Malls
INSERT INTO malls (developer_id, ar_name, en_name, description, address, city, district, total_area, total_floors, parking_spaces, construction_status, completion_date, is_active) VALUES
(1, 'مول الرياض الكبير', 'Riyadh Grand Mall', 'A premium shopping destination in the heart of Riyadh featuring international brands, dining, and entertainment.', 'King Fahd Road, Al Olaya District', 'Riyadh', 'Al Olaya', 150000.00, 4, 2000, 'completed', '2023-06-15', true),
(1, 'مجمع جدة التجاري', 'Jeddah Commercial Center', 'Modern commercial complex with diverse retail and office spaces in Jeddah.', 'Prince Sultan Road, Al Hamra District', 'Jeddah', 'Al Hamra', 120000.00, 3, 1500, 'under_construction', '2024-12-31', true),
(1, 'مول الدمام الجديد', 'Dammam New Mall', 'Contemporary shopping mall serving the Eastern Province with family-friendly amenities.', 'King Saud Road, Al Faisaliyah District', 'Dammam', 'Al Faisaliyah', 100000.00, 3, 1200, 'planning', '2025-08-15', true);

-- Insert Sample Mall Images
INSERT INTO mall_images (mall_id, image_url, image_type, is_primary) VALUES
(1, '/images/malls/riyadh-grand-mall-exterior.jpg', 'exterior', true),
(1, '/images/malls/riyadh-grand-mall-interior.jpg', 'interior', false),
(1, '/images/malls/riyadh-grand-mall-floorplan.jpg', 'floor_plan', false),
(2, '/images/malls/jeddah-commercial-center-exterior.jpg', 'exterior', true),
(2, '/images/malls/jeddah-commercial-center-interior.jpg', 'interior', false),
(3, '/images/malls/dammam-new-mall-exterior.jpg', 'exterior', true);

-- Insert Sample Shops
INSERT INTO shops (title, mall_id, category_type_id, shop_number, floor_number, phone_number, whatsapp_number, email, unit_area, monthly_rent, sale_price, sale_type, finishing_type, delivery_date, status, description, view_type, is_corner_shop, has_storage, electricity_capacity, security_deposit, is_active) VALUES
('Nike Sports Store', 1, 1, 'G-101', 0, '+966112345678', '+966501234567', 'nike@riyadhgrand.com', 150.00, 25000.00, null, 'rent', 'fully_finished', '2024-01-15', 'rented', 'Premium Nike flagship store with latest sports equipment and apparel.', 'mall_entrance', true, true, 50, 75000.00, true),
('Zara Fashion Boutique', 1, 3, 'F1-205', 1, '+966112345679', '+966501234568', 'zara@riyadhgrand.com', 200.00, 35000.00, null, 'rent', 'fully_finished', '2024-02-01', 'rented', 'International fashion brand offering trendy clothing for men and women.', 'corridor', false, true, 40, 105000.00, true),
('Apple Store', 1, 5, 'F1-301', 1, '+966112345680', '+966501234569', 'apple@riyadhgrand.com', 180.00, 45000.00, null, 'rent', 'fully_finished', '2024-01-20', 'rented', 'Official Apple retail store with full range of products and services.', 'corner', true, false, 60, 135000.00, true),
('Starbucks Cafe', 1, 9, 'F2-401', 2, '+966112345681', '+966501234570', 'starbucks@riyadhgrand.com', 120.00, 20000.00, null, 'rent', 'fully_finished', '2024-03-01', 'rented', 'Premium coffee experience with comfortable seating area.', 'food_court', false, true, 35, 60000.00, true),
('Available Retail Space', 2, 3, 'G-102', 0, null, null, null, 100.00, 18000.00, 850000.00, 'both', 'semi_finished', '2024-06-15', 'available', 'Prime retail space suitable for fashion or electronics store.', 'mall_entrance', false, true, 30, 54000.00, true),
('Restaurant Space', 2, 7, 'F1-201', 1, null, null, null, 250.00, 40000.00, null, 'rent', 'not_finished', '2024-07-01', 'available', 'Large restaurant space with kitchen facilities and dining area.', 'food_court', true, true, 80, 120000.00, true);

-- Insert Sample Shop Images
INSERT INTO shop_images (shop_id, image_url, image_type, is_primary, alt_text) VALUES
(1, '/images/shops/nike-store-interior.jpg', 'interior', true, 'Nike store interior view'),
(1, '/images/shops/nike-store-exterior.jpg', 'exterior', false, 'Nike store front view'),
(2, '/images/shops/zara-boutique-interior.jpg', 'interior', true, 'Zara boutique interior'),
(3, '/images/shops/apple-store-interior.jpg', 'interior', true, 'Apple store interior'),
(4, '/images/shops/starbucks-cafe.jpg', 'interior', true, 'Starbucks cafe seating area'),
(5, '/images/shops/available-retail-space.jpg', 'interior', true, 'Available retail space'),
(6, '/images/shops/restaurant-space.jpg', 'interior', true, 'Restaurant space layout');

-- Insert Sample Shop Amenities
INSERT INTO shop_amenities (shop_id, amenity, description, is_available) VALUES
(1, 'WiFi', 'High-speed internet connection', true),
(1, 'Air Conditioning', 'Central AC system', true),
(1, 'Security System', '24/7 CCTV monitoring', true),
(2, 'WiFi', 'High-speed internet connection', true),
(2, 'Air Conditioning', 'Central AC system', true),
(2, 'Fitting Rooms', 'Private changing areas', true),
(3, 'WiFi', 'High-speed internet connection', true),
(3, 'Air Conditioning', 'Central AC system', true),
(3, 'Display Systems', 'Product demonstration areas', true),
(4, 'WiFi', 'Free customer WiFi', true),
(4, 'Air Conditioning', 'Climate control system', true),
(4, 'Kitchen Equipment', 'Commercial grade equipment', true);

-- Insert Sample Inquiries
INSERT INTO inquiries (shop_id, user_id, developer_id, inquiry_type, message, contact_preference, preferred_contact_time, status, created_at) VALUES
(5, 4, 1, 'rent', 'I am interested in renting the available retail space on the ground floor. Could you please provide more details about the lease terms and conditions?', 'email', 'Morning (9 AM - 12 PM)', 'pending', NOW() - INTERVAL '2 days'),
(6, 4, 1, 'visit', 'I would like to schedule a visit to see the restaurant space. When would be a good time for a viewing?', 'phone', 'Afternoon (2 PM - 5 PM)', 'responded', NOW() - INTERVAL '5 days');

-- Insert Sample Bookings
INSERT INTO bookings (shop_id, user_id, developer_id, booking_type, start_date, monthly_amount, total_amount, security_deposit, commission_amount, contract_duration, status, payment_status, notes, created_at) VALUES
(1, 4, 1, 'rent', '2024-01-15', 25000.00, 300000.00, 75000.00, 15000.00, 12, 'confirmed', 'completed', 'Nike flagship store lease agreement for 12 months with option to renew.', NOW() - INTERVAL '30 days');

-- Insert Sample Payments
INSERT INTO payments (booking_id, user_id, amount, payment_type, payment_method, payment_status, transaction_id, due_date, paid_at, created_at) VALUES
(1, 4, 75000.00, 'security_deposit', 'bank_transfer', 'completed', 'TXN-2024-001', '2024-01-10', '2024-01-08 10:30:00', NOW() - INTERVAL '35 days'),
(1, 4, 25000.00, 'monthly_rent', 'bank_transfer', 'completed', 'TXN-2024-002', '2024-01-15', '2024-01-15 14:20:00', NOW() - INTERVAL '30 days'),
(1, 4, 25000.00, 'monthly_rent', 'bank_transfer', 'completed', 'TXN-2024-003', '2024-02-15', '2024-02-14 11:45:00', NOW() - INTERVAL '15 days');

-- Insert Sample Reviews
INSERT INTO reviews (user_id, mall_id, rating, review_text, is_verified, created_at) VALUES
(4, 1, 5, 'Excellent shopping experience at Riyadh Grand Mall. Great variety of stores, clean facilities, and ample parking. Highly recommended!', true, NOW() - INTERVAL '10 days'),
(4, 1, 4, 'Good mall with nice stores. The food court could use more variety, but overall a pleasant shopping destination.', true, NOW() - INTERVAL '20 days');

-- Insert Sample Notifications
INSERT INTO notifications (user_id, title, message, type, related_id, is_read, created_at) VALUES
(1, 'New Inquiry Received', 'A new inquiry has been received for the retail space in Jeddah Commercial Center.', 'inquiry', 1, false, NOW() - INTERVAL '1 hour'),
(1, 'Payment Received', 'Monthly rent payment has been received for Nike Sports Store.', 'payment', 3, false, NOW() - INTERVAL '2 hours'),
(4, 'Inquiry Response', 'Your inquiry about the restaurant space has been responded to by the developer.', 'inquiry', 2, false, NOW() - INTERVAL '3 days');

-- Insert App Settings
INSERT INTO app_settings (setting_key, setting_value, description) VALUES
('site_name', 'BrandSpace', 'Application name'),
('site_description', 'Real Estate Marketplace for Mall Developers and Investors', 'Site description'),
('default_language', 'en', 'Default application language'),
('currency', 'SAR', 'Default currency'),
('timezone', 'Asia/Riyadh', 'Default timezone'),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('email_notifications_enabled', 'true', 'Enable email notifications'),
('sms_notifications_enabled', 'true', 'Enable SMS notifications'),
('maintenance_mode', 'false', 'Enable maintenance mode');
