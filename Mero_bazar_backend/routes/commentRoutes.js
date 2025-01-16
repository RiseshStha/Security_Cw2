const router = require('express').Router();
const commentController = require('../controllers/commentControllers');

router.post('/create_comment', commentController.createComment);
router.post('/reply_comment/:id', commentController.createReply);
router.get('/get_comments/:id', commentController.getAllComments);
router.post('/get_replies', commentController.getRepliesByIds);
router.post('/rating', commentController.rating);

module.exports = router;