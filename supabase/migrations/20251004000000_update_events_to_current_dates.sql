-- Update events to have current/upcoming dates (October 2025)
-- This ensures the app has visible events for testing

-- Clear old events from January
DELETE FROM events WHERE date < '2025-10-01';

-- Add new events for October-November 2025
INSERT INTO events (title, description, date, time, location_name, lat, lng, category, price, eco_conscious, organizer_name, organizer_contact) VALUES
-- THIS WEEK (Oct 4-10)
('Morning Beach Yoga', 'Start your day with energizing yoga on the beach. All levels welcome!', '2025-10-05', '07:00', 'Rinconcito Beach', 15.6645, -96.7335, 'yoga', 'Free', true, 'Yoga Collective', '@yogamzt'),
('Cacao Ceremony', 'Heart-opening cacao ceremony with meditation and sharing circle.', '2025-10-06', '18:00', 'Casa Om', 15.6672, -96.7360, 'ceremony', '250 MXN', true, 'Luna', '@casaommazunte'),
('Organic Farmers Market', 'Fresh local produce, kombucha, bread, and honey. Bring your bags!', '2025-10-08', '08:00', 'Village Center', 15.6665, -96.7342, 'market', 'Free entry', true, 'Farm Network', 'farms.mzt@gmail.com'),
('Sunset Meditation', 'Guided meditation at the sacred Punta Cometa as the sun sets.', '2025-10-09', '17:30', 'Punta Cometa', 15.6632, -96.7312, 'ceremony', 'Donation', true, 'Meditation Circle', '@meditationmzt'),
('Spanish Conversation Circle', 'Practice Spanish in a relaxed setting with coffee and snacks.', '2025-10-10', '10:00', 'Cometa Café', 15.6677, -96.5545, 'workshop', '50 MXN', false, 'Language Exchange', '@spanishmzt'),

-- THIS WEEKEND (Oct 5-6)
('Full Moon Beach Party', 'Dance under the full moon with local DJs. Eco-conscious event!', '2025-10-05', '21:00', 'Hola Ola Beach', 15.6658, -96.7347, 'party', 'Donation', true, 'Mazunte Collective', '@mazuntevibes'),
('Ecstatic Dance', 'Free-form movement meditation. No talking, no phones, pure dance.', '2025-10-06', '19:00', 'Community Center', 15.6665, -96.7342, 'ceremony', '150 MXN', true, 'DJ Shakti', '@ecstaticdancemzt'),
('Artisan Market', 'Local crafts, jewelry, and art. Support Mazunte artists!', '2025-10-06', '10:00', 'Main Beach Road', 15.6658, -96.7347, 'market', 'Free entry', true, 'Artisan Collective', '@artisansmzt'),

-- NEXT WEEK (Oct 11-17)
('Vinyasa Flow Yoga', 'Dynamic yoga flow with ocean views. Intermediate level.', '2025-10-11', '08:00', 'Solstice Yoga Studio', 15.6662, -96.7350, 'yoga', '150 MXN', true, 'Raj', '@solsticeyogamzt'),
('Temazcal Ceremony', 'Traditional Mexica sweat lodge purification ceremony.', '2025-10-12', '16:00', 'Tierra Viva Retreat', 15.6685, -96.7375, 'ceremony', '500 MXN', true, 'Don Miguel', '@tierravivamazunte'),
('Plant-Based Cooking Class', 'Learn to cook traditional Mexican dishes with a vegan twist!', '2025-10-13', '11:00', 'Ícaro Café', 15.666608, -96.554847, 'workshop', '350 MXN', true, 'Chef Rosa', '@icarocafemazunte'),
('Breathwork Journey', 'Transformational breathwork session with live music.', '2025-10-14', '18:30', 'Hridaya Yoga Center', 15.6668, -96.7355, 'ceremony', '250 MXN', true, 'Alex', '@hridayamazunte'),
('Live Music Night', 'Acoustic reggae and folk music by local artists.', '2025-10-15', '20:00', 'Café Panchatantra', 15.6678703, -96.5535813, 'party', 'Free', false, 'Panchatantra', '@cafepanchatantra'),
('Yin Yoga & Sound Bath', 'Gentle yin yoga followed by crystal bowl sound healing.', '2025-10-16', '18:00', 'Sound Healing Temple', 15.6675, -96.7365, 'yoga', '200 MXN', true, 'Sound Temple', '@soundtemplemzt'),
('Salsa Night', 'Learn salsa basics then dance! All levels welcome.', '2025-10-17', '20:30', 'Community Center', 15.6665, -96.7342, 'party', '100 MXN', false, 'Salsa Mazunte', '@salsamzt'),

-- LATER IN OCTOBER
('Acro Yoga Workshop', 'Partner acrobatics and therapeutic flying. Beginners welcome!', '2025-10-19', '16:00', 'La Punta Beach', 15.6625, -96.7305, 'yoga', '150 MXN', true, 'Acro Team', '@acroyogamzt'),
('Women''s Circle', 'Sacred space for women to share and connect. Tea ceremony included.', '2025-10-20', '17:00', 'Casa Om', 15.6672, -96.7360, 'ceremony', '100 MXN', true, 'Sisters Circle', '@womensmzt'),
('Turtle Release', 'Witness baby turtles being released into the ocean. Educational!', '2025-10-22', '18:30', 'Ventanilla Beach', 15.6692, -96.7265, 'other', '150 MXN', true, 'Turtle Sanctuary', '@turtlesmzt'),
('Clothing Swap', 'Bring 3-5 items, swap for new pieces. Sustainable fashion!', '2025-10-24', '14:00', 'Community Center', 15.6665, -96.7342, 'market', 'Free', true, 'Eco Fashion', '@sustainablemzt'),
('Kirtan Night', 'Devotional chanting with harmonium and percussion. Open to all.', '2025-10-26', '19:30', 'Solstice Yoga Studio', 15.6662, -96.7350, 'ceremony', 'Donation', true, 'Bhakti Band', '@bhaktimzt'),
('Surf Lesson', 'Beginner-friendly surf instruction. Board rental included!', '2025-10-27', '06:00', 'La Punta Beach', 15.6625, -96.7305, 'other', '400 MXN', false, 'Surf School', '@surfscho olmzt'),

-- EARLY NOVEMBER
('New Moon Ceremony', 'Set intentions for the new lunar cycle with meditation and ritual.', '2025-11-01', '19:00', 'Punta Cometa', 15.6632, -96.7312, 'ceremony', 'Donation', true, 'Moon Circle', '@moonmzt'),
('Permaculture Workshop', 'Learn sustainable gardening for tropical climates.', '2025-11-03', '15:00', 'Tierra Viva Retreat', 15.6685, -96.7375, 'workshop', '250 MXN', true, 'Eco Team', '@tierravivamazunte'),
('Beach Cleanup', 'Community beach cleanup followed by refreshments. Make a difference!', '2025-11-05', '08:00', 'Rinconcito Beach', 15.6645, -96.7335, 'other', 'Free', true, 'Eco Warriors', '@ecowarriorsmzt');
