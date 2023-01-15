import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { listProducts } from '../actions/productActions'
import { motion } from 'framer-motion'
import ProductCarousel from '../components/ProductCarousel'
import Product from '../components/Product'
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate'


const HomeScreen = () => {

    // framer animation
    const productContainer = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.1
            }
        }
    };

    const animateProduct = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    }

    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)
    const { error, loading, products, page, pages } = productList

    const location = useLocation()
    let keyword = location.search
    
    useEffect(() => {

        dispatch(listProducts(keyword))

    }, [keyword, dispatch])

    return (
        <div>
            {!keyword && (
                <motion.div initial={{y: 50}}
                 animate={{y: 0}}
                 transition={{duration: 0.5}}
                >
                    <ProductCarousel />
                </motion.div>
            )}
           <motion.div initial={{x: -300}} animate={{x: 0}} transition={{duration: 0.5}}>
            <h1 className='mt-5'>Latest Products</h1> 
           </motion.div>
           {loading ? <Loader /> : error ? <Message variant='danger'>{ error }</Message>
            : 
            <div>
                <motion.div variants={ productContainer }
                initial="hidden" animate="visible">
                    
                    <Row>
                        {products.map(product => (
                            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                                <motion.div className=''  
                                    variants={ animateProduct } whileHover={{ scale: 1.1 }}
                                    whileTap={{scale: 1.1}}>
                                    <Product product={product} />
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </motion.div>
                <Paginate page={page} pages={pages} keyword={keyword}/>
            </div>
            }
            
        </div>
    )
}

export default HomeScreen
