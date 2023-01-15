import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails, createProductReview } from '../actions/productActions'
import Loader from '../components/Loader';
import Message from '../components/Message';


const ProductScreen = () => {
    // Get the product id from url
    const { id } = useParams()
    const navigate = useNavigate()

    // Set and save qty of the product
    const [qty, setQty] = useState(1)

    // Set rating and comments
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()
    
    // get product details state
    const productDetails = useSelector(state => state.productDetails)
    const { error, loading, product } = productDetails

    // get user details state
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    // get product review state
    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { loading:loadingProductReview, success:successProductReview,
            error:errorProductReview } = productReviewCreate


    // Get the product data
    useEffect(() => {

        if (successProductReview || errorProductReview) {
            setRating(0)
            setComment('')
            dispatch({type:'PRODUCT_CREATE_REVIEW_RESET'})
        }

        dispatch(listProductDetails(id))

    }, [dispatch, id, successProductReview, errorProductReview])

    const addToCart = () => {
        navigate(`/cart/${id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()

        dispatch(createProductReview(id, {
            rating,
            comment,
        }))
    }
    
    if (loading) {
        return <Loader />
    }
    
    if (error) {
        return <Message variant='danger'>{ error }</Message>
    }

    return (
        <div>
            <Link onClick={() => navigate(-1)} className='btn btn-light my-3'>Go Back</Link>
            <div>
                <Row>
                    <Col md={6} lg={5}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>

                    <Col md={6} lg={4}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Rating value={product.rating} color={'#f8e825'}
                                    text={`${product.numReviews} reviews`} />
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Price: ${product.price}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Description: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    <Col md={4} lg={3} className='mt-4'>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col><strong>${product.price}</strong></Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0 ? 'In stock' : 'Out of Stock'}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty:</Col>
                                            <Col xs='auto' className='my-1'>
                                                <select onChange={(e) => setQty(e.target.value)} 
                                                    value={qty}>
                                                        {
                                                            [...Array(product.countInStock).keys()]
                                                            .map(x => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))
                                                        }
                                                </select>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <Button className='btn-block w-100' onClick={addToCart}
                                        disabled={product.countInStock === 0 && true} 
                                        type='button'
                                        > Add to Cart
                                        </Button>
                                </ListGroup.Item>

                            </ListGroup>
                        </Card>
                    </Col>
                </Row>

                <Row className='mt-5'>
                    <Col md={6}>
                        <h4>Reviews</h4>
                        
                        {product.reviews.length === 0 && <Message variant='info'>
                            No Reviews</Message>}

                        <ListGroup variant='flush'>
                            {product.reviews.map((review) => (
                                <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} color='#f8e825'/>
                                    <small>{review.createdAt.substring(0,10)}</small>
                                    <p className='mt-2'>{review.comment}</p>
                                </ListGroup.Item>
                            ))}

                            <ListGroup.Item>
                                <h4>Write a review</h4>

                                {loadingProductReview && <Loader/>}
                                {successProductReview && <Message variant='success'>Review Submitted</Message>}
                                {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                                {userInfo ? (
                                    <Form onSubmit={submitHandler}>
                                        <Form.Group controlId='rating'>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control as='select' value={rating}
                                             onChange={(e) => setRating(e.target.value)}
                                            > 
                                                <option value=''>Select . . .</option>
                                                <option value='1'>1 - Poor</option>
                                                <option value='2'>2 - Fair</option>
                                                <option value='3'>3 - Good</option>
                                                <option value='4'>4 - Very Good</option>
                                                <option value='5'>5 - Excelent</option>

                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group className='mt-4' controlId='comment'>
                                            <Form.Label>Review</Form.Label>
                                            <Form.Control as='textarea' rows='5'
                                             value={comment} onChange={(e) => setComment(e.target.value)} />
                                        </Form.Group>

                                        <Button disabled={loadingProductReview} type='submit' variant='primary'
                                         className='mt-3'>
                                            Submit
                                        </Button>
                                    </Form>
                                ) : <Message variant='info'>Please <Link to='/login'>
                                        login</Link> to write a review
                                    </Message>
                                }
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ProductScreen
