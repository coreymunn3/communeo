-- Insert Users
INSERT INTO app_user (id, username, avatar) VALUES
  ('1', 'alice', 'https://example.com/avatars/alice.png'),
  ('2', 'bob', 'https://example.com/avatars/bob.png'),
  ('3', 'charlie', 'https://example.com/avatars/charlie.png');

-- Insert Communities
INSERT INTO community (id, name, description, created_on, flairs, rules, icon, banner, founder_id, moderator_id) VALUES
  ('1', 'TechTalk', 'A community for tech enthusiasts', '2025-02-17 10:00:00', '["tech", "programming"]', '["Be respectful", "Stay on-topic"]', 'https://example.com/icons/techtalk.png', 'https://example.com/banners/techtalk.png', '1', '2'),
  ('2', 'Foodies', 'For people who love food and sharing recipes', '2025-02-16 14:30:00', '["cooking", "recipes"]', '["No spamming", "Be kind"]', 'https://example.com/icons/foodies.png', 'https://example.com/banners/foodies.png', '2', '3');

-- Insert Posts
INSERT INTO post (id, title, content, type, is_nsfw, is_spoiler, user_id, community_id) VALUES
  ('1', 'How to build a React app', 'This is a tutorial on how to build a React app...', 'text', false, false, '1', '1'),
  ('2', 'Best pizza recipe', 'Here’s a step-by-step guide for making delicious pizza...', 'text', false, false, '2', '2');

-- Insert Comments
INSERT INTO comment (id, text, user_id, post_id, parent_comment_id) VALUES
  ('1', 'Great tutorial! Thanks for sharing!', '2', '1', NULL),
  ('2', 'I had some issues with the setup, but this really helped!', '3', '1', '1'),
  ('3', 'This pizza recipe looks amazing!', '1', '2', NULL);

-- Insert Community Memberships
INSERT INTO community_member (id, user_id, community_id) VALUES
  ('1', '1', '1'),
  ('2', '2', '2'),
  ('3', '3', '1');

-- Insert Likes (for Posts and Comments)
INSERT INTO app_like (id, user_id, post_id, comment_id, type, created_on) VALUES
  ('1', '2', '1', NULL, 'upvote', '2025-02-17 10:05:00'),
  ('2', '3', '1', NULL, 'downvote', '2025-02-17 10:06:00'),
  ('3', '1', NULL, '2', 'upvote', '2025-02-16 14:40:00'),
  ('4', '2', NULL, '3', 'upvote', '2025-02-16 14:45:00');
