/**
 * @swagger
 * components:
 *   schemas:
 *     Community:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The community's unique identifier
 *         name:
 *           type: string
 *           description: The name of the community
 *         description:
 *           type: string
 *           description: The community description
 *         slug:
 *           type: string
 *           description: URL-friendly identifier for the community
 *         icon:
 *           type: string
 *           description: URL to the community's icon image
 *         founder_id:
 *           type: string
 *           description: ID of the user who created the community
 *         moderator_id:
 *           type: string
 *           description: ID of the user who moderates the community
 *         created_on:
 *           type: string
 *           format: date-time
 *           description: When the community was created
 *
 *     CommunityMembership:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The community's unique identifier
 *         name:
 *           type: string
 *           description: The name of the community
 *         description:
 *           type: string
 *           description: The community description
 *         slug:
 *           type: string
 *           description: URL-friendly identifier
 *         icon:
 *           type: string
 *           description: URL to the community's icon image
 *         isFounder:
 *           type: boolean
 *           description: Whether the current user is the founder of this community
 *         isModerator:
 *           type: boolean
 *           description: Whether the current user is a moderator of this community
 *         members:
 *           type: integer
 *           description: Number of members in the community
 *
 *     MembershipResponse:
 *       type: object
 *       properties:
 *         isMember:
 *           type: boolean
 *           description: Whether the user is a member of the community
 *         isModerator:
 *           type: boolean
 *           description: Whether the user is a moderator of the community
 *         isFounder:
 *           type: boolean
 *           description: Whether the user is the founder of the community
 *
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The post's unique identifier
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         type:
 *           type: string
 *           enum: [text, image, link]
 *           description: The type of post
 *         user_id:
 *           type: string
 *           description: ID of the user who created the post
 *         community_id:
 *           type: string
 *           description: ID of the community the post belongs to
 *         created_on:
 *           type: string
 *           format: date-time
 *           description: When the post was created
 *         link_url:
 *           type: string
 *           description: URL for link-type posts
 *         image_url:
 *           type: string
 *           description: URL for image-type posts
 *
 *     PostsResponse:
 *       type: object
 *       properties:
 *         posts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Post'
 *           description: Array of posts
 *         nextCursor:
 *           type: string
 *           description: Cursor for pagination to get the next set of results
 *
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The comment's unique identifier
 *         content:
 *           type: string
 *           description: The content of the comment
 *         user_id:
 *           type: string
 *           description: ID of the user who created the comment
 *         post_id:
 *           type: string
 *           description: ID of the post the comment belongs to
 *         parent_id:
 *           type: string
 *           description: ID of the parent comment (for nested comments)
 *         created_on:
 *           type: string
 *           format: date-time
 *           description: When the comment was created
 *         canEdit:
 *           type: boolean
 *           description: Whether the current user can edit this comment (true if they are the author)
 *
 *     CommentTree:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *           content:
 *             type: string
 *           user_id:
 *             type: string
 *           post_id:
 *             type: string
 *           parent_id:
 *             type: string
 *           created_on:
 *             type: string
 *             format: date-time
 *           user:
 *             $ref: '#/components/schemas/User'
 *           author:
 *             $ref: '#/components/schemas/User'
 *           canEdit:
 *             type: boolean
 *             description: Whether the current user can edit this comment (true if they are the author)
 *           replies:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CommentTree'
 *
 *     CommentCount:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           description: Number of comments on a post
 *
 *     Score:
 *       type: object
 *       properties:
 *         score:
 *           type: integer
 *           description: Total score (upvotes minus downvotes)
 *
 *     UserVote:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           description: ID of the user
 *         post_id:
 *           type: string
 *           description: ID of the post (if voting on a post)
 *         comment_id:
 *           type: string
 *           description: ID of the comment (if voting on a comment)
 *         value:
 *           type: integer
 *           enum: [-1, 0, 1]
 *           description: Vote value (1 for upvote, -1 for downvote, 0 for no vote)
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user's unique identifier
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email address
 *         first_name:
 *           type: string
 *           description: The user's first name
 *         last_name:
 *           type: string
 *           description: The user's last name
 *         avatar_url:
 *           type: string
 *           description: URL to the user's avatar image
 *         clerk_id:
 *           type: string
 *           description: The user's Clerk ID
 *         created_on:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *
 *     UserDashboardCommunities:
 *       type: object
 *       properties:
 *         memberships:
 *           type: array
 *           description: An array of communities that the user is a member of
 *           items:
 *             $ref: '#/components/schemas/CommunityMembership'
 *         scores:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               communityName:
 *                 type: string
 *               communitySlug:
 *                 type: string
 *               postScore:
 *                 type: integer
 *               commentScore:
 *                 type: integer
 *               totalScore:
 *                 type: integer
 *
 *     UserDashboardPosts:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total number of posts created by the user
 *         thisMonth:
 *           type: integer
 *           description: Number of posts created this month
 *         thisWeek:
 *           type: integer
 *           description: Number of posts created this week
 *
 *     UserDashboardComments:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total number of comments created by the user
 *         thisMonth:
 *           type: integer
 *           description: Number of comments created this month
 *         thisWeek:
 *           type: integer
 *           description: Number of comments created this week
 *
 *     UserDashboardScores:
 *       type: object
 *       properties:
 *         totalScore:
 *           type: integer
 *           description: Total score across all posts and comments
 *         postScore:
 *           type: integer
 *           description: Total score for posts
 *         commentScore:
 *           type: integer
 *           description: Total score for comments
 *
 *     LinkPreview:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the linked content
 *         description:
 *           type: string
 *           description: Description of the linked content
 *         image:
 *           type: string
 *           description: URL to an image representing the linked content
 *         author_name:
 *           type: string
 *           description: Name of the author of the linked content
 *         author_url:
 *           type: string
 *           description: URL to the author's profile
 *         url:
 *           type: string
 *           description: The original URL
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 */

// This file contains Swagger schema definitions for the Communeo API
// The schemas are used by the Swagger UI to generate documentation
// No actual TypeScript code is needed in this file
