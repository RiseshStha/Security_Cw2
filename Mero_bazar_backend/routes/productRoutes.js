const router = require('express').Router()
const productControllers = require('../controllers/productControllers');
const { authGuard } = require('../middleware/authGuard');

router.post('/create',authGuard, productControllers.createProduct);

//get all products
router.get("/get_all_products", productControllers.getAllProducts)

//get single product
router.get("/get_product/:id", productControllers.getProduct)

//get all product by user id
router.get('/get_all_product_by_userid/:id', productControllers.getAllProductsByUserId)

//get similar products
router.get('/get_similar_products/:category', authGuard, productControllers.getSimilarProducts)

//get similar product in profile
router.get('/get_similar_products_profile/:id', authGuard, productControllers.getSimilarProductsProfile)

//delete product
router.delete('/delete_product/:id', authGuard, productControllers.deleteProduct)

//update product
router.put('/update_product/:id', authGuard, productControllers.updateProduct)

//pagination
router.get('/pagination', productControllers.productPagination)

//searching
router.get('/search', productControllers.searchProducts)

module.exports = router;