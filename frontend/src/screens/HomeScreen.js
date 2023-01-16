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
                <Row>
                    {products.map(product => (
                        <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                            <motion.div initial={{y: 150, opacity:0}} whileInView={{y: 0, opacity:1}}
                              whileHover={{ scale: 0.95}} whileTap={{ scale: 0.95 }}
                            >
                                <Product product={product} />
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            
                <Paginate page={page} pages={pages} keyword={keyword}/>
            </div>
            }
            
        </div>
    )
}

export default HomeScreen
