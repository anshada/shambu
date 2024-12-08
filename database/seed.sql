-- Sample Profiles
INSERT INTO profiles (id, full_name, email, avatar_url, metadata) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'John Doe', 'john@example.com', 'https://example.com/avatar1.jpg', '{"title": "Software Engineer", "company": "Tech Corp"}'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Jane Smith', 'jane@example.com', 'https://example.com/avatar2.jpg', '{"title": "Product Manager", "company": "Innovation Inc"}'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Alice Johnson', 'alice@example.com', 'https://example.com/avatar3.jpg', '{"title": "Data Scientist", "company": "Data Co"}');

-- Sample Social Profiles
INSERT INTO social_profiles (profile_id, platform, username, url) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'twitter', 'johndoe', 'https://twitter.com/johndoe'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'linkedin', 'johndoe', 'https://linkedin.com/in/johndoe'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'twitter', 'janesmith', 'https://twitter.com/janesmith'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'linkedin', 'alicejohnson', 'https://linkedin.com/in/alicejohnson');

-- Sample Connections
INSERT INTO connections (source_id, target_id, connection_type, strength, metadata) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 'PROFESSIONAL', 0.8, '{"context": "Worked together at Tech Corp"}'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0853', 'SOCIAL', 0.6, '{"context": "College friends"}'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0853', 'PROFESSIONAL', 0.4, '{"context": "Met at conference"}'); 