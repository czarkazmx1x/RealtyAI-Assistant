-- Insert test users
INSERT INTO users (username, password_hash, email, role)
VALUES 
('admin', '$2b$10$XEJq1B1C0G5v0VvjXk6xk.4iPqsP6YCIxy/7YBWiAQlM/zrzD7j/C', 'admin@realestate.com', 'admin'), -- password: admin123
('agent1', '$2b$10$pVN9H7cQ9kEXGf9KcW.3AOPY.KFtHoADcPRTYcQxjG8PsN9JHcJFK', 'agent1@realestate.com', 'agent'); -- password: agent123

-- Insert test agents
INSERT INTO agents (user_id, first_name, last_name, email, phone_number, bio, profile_picture_url)
VALUES 
(2, 'John', 'Smith', 'john.smith@realestate.com', '555-123-4567', 'Experienced agent with 10+ years in residential properties', 'https://randomuser.me/api/portraits/men/1.jpg');

-- Insert test properties
INSERT INTO properties (address, price, description, property_type, bedrooms, bathrooms, image_urls, status)
VALUES 
('123 Main St, Atlanta, GA', 450000, 'Beautiful family home in the suburbs with a large backyard', 'House', 4, 2.5, ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be'], 'Published'),
('456 Park Ave, Atlanta, GA', 320000, 'Modern condo in the heart of downtown with amazing views', 'Condo', 2, 2.0, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'], 'Ready to Publish'),
('789 Oak St, Atlanta, GA', 650000, 'Luxury townhouse with premium finishes and a rooftop terrace', 'Townhouse', 3, 3.5, ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83'], 'Needs Description');

-- Link agent to properties
INSERT INTO agent_properties (agent_id, property_id)
VALUES 
(1, 1),
(1, 2),
(1, 3);