import { useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'


const CartScreen = () => {

    const navigate = useNavigate()
    const { id } = useParams()
    const qty = new URLSearchParams(useLocation().search).get('qty')
    
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const user = useSelector(state => state.userLogin)
    const { userInfo } = user

    const { cartItems } = cart

    useEffect(() => {

        if (id) {
            dispatch(addToCart(id, Number(qty)))
        }

    }, [id, qty, dispatch])

    const removeFromCartHandler = (id) => {

        dispatch(removeFromCart(id))        
    }

    const checkoutHandler = () => {

        if (userInfo) {
            navigate('/shipping')

        } else {
            navigate('/login')
        }

    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? ( 
                    <Message variant='info'>
                        Your Cart Is Empty <Link to='/'>Go Back</Link>
                    </Message> )
                    : (
                        <ListGroup variant='flush'>
                            {cartItems.map(item => (
                                <ListGroup.Item key={item.product}>
                                    <Row>
                                        <Col md={2} lg={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded/>
                                        </Col>
                                        <Col md={5} lg={4}>
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={2}>
                                            ${item.price}
                                        </Col>
                                        <Col md={2}>
                                            <select onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))} 
                                                value={item.qty}>
                                                    {
                                                        [...Array(item.countInStock).keys()]
                                                        .map(x => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))
                                                    }
                                            </select>
                                        </Col>
                                        <Col md={1}>
                                            <Button type='button' variant='light'
                                             onClick={() => removeFromCartHandler(item.product)}>
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )
                }
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Subtotal ({cartItems.reduce((acc, cur) => acc + cur.qty, 0)}) items</h2>
                            ${cartItems.reduce((acc, cur) => acc + cur.price * cur.qty, 0).toFixed(2)}
                        </ListGroup.Item>
                    </ListGroup>

                    <ListGroup.Item>
                        <Button type='button' className='btn-block w-100' disabled={cartItems.length === 0 && true}
                         onClick={checkoutHandler}
                         >Proceed To Checkout
                        </Button>
                    </ListGroup.Item>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
