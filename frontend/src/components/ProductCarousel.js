import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { listTopProducts } from '../actions/productActions'
import { motion } from 'framer-motion';
import Loader from './Loader'
import Message from './Message'


const ProductCarousel = () => {


    const dispatch = useDispatch()

    const productTopRated = useSelector(state => state.productTopRated)
    const { products, loading, error} = productTopRated

    useEffect(() => {

        dispatch(listTopProducts())

    }, [dispatch])


    return ( loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
        : (
            <motion.div initial={{y: -200, opacity:0}}
                animate={{y: 0, opacity:1}}
                transition={{duration: 0.5}}
            >
                <Carousel pause='hover' className='bg-dark'>
                    {products.map(product => (
                        <Carousel.Item key={product._id}>
                            <Link to={`/product/${product._id}`}>
                                <Image id='carousel-img' src={product.image} fluid alt={product.name}></Image>
                                <Carousel.Caption className='carousel.caption'>
                                    <h4>{product.name} (${product.price})</h4>
                                </Carousel.Caption>
                            </Link>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </motion.div>
        )
    )
}

export default ProductCarousel
