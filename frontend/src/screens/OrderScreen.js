import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { PayPalButton } from 'react-paypal-button-v2'
import Message from '../components/Message'
import Loader from '../components/Loader'



const OrderScreen = () => {
    
    const [sdkReady, setSdkReady] = useState(false)
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    // get order details from redux
    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails

    // get order details from redux
    const orderPay = useSelector(state => state.orderPay)
    const {success:successPay, loading:loadingPay} = orderPay

    // get order deliver info from redux
    const orderDeliver = useSelector(state => state.orderDeliver)
    const {success:successDeliver, loading:loadingDeliver} = orderDeliver

    // get user details from redux
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin



    //  get order id from url
    const params = useParams()
    const { id } = params

    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    const addPayPalScript = () => {

        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AfaNDc8b02dji76eoQvUBDpdOmkErJi7jQQnNvhWJy2yIbS_7BfV_SFX4kmw3vaKo_tZRUmgccmHy-WS'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)

    }

    useEffect(() => {

        if (!userInfo) {
            navigate('/login')
        }

        if (!order || successPay || order._id !== Number(id) || successDeliver) {
            dispatch({type:'ORDER_PAY_RESET'})
            dispatch({type:'ORDER_DELIVER_RESET'})

            dispatch(getOrderDetails(id))

        } else if (!order.isPaid) {

            if(!window.paypal) {
                addPayPalScript()

            } else {
                setSdkReady(true)
            }
        }
        
    }, [order, id, successPay, successDeliver, userInfo, navigate, dispatch])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(id, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    if (loading) {
    return <Loader />
    }

    if (error) {
    return <Message variant='danger'>{error}</Message>
    }

    return (
        <div>
            <h1>Order: {id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong>{order.user.name}</p>
                            <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>Shipping: </strong>
                                {order.shippingAddress.address},
                                {order.shippingAddress.city}
                                {'  '}
                                {order.shippingAddress.postalCode},
                                {'  '}
                                {order.shippingAddress.country}    
                            </p>

                            {order.isDelivered ? (
                                    <Message variant='success'>Delivered on {order.deliveredAt.substring(0,10)}</Message>
                                ) : (
                                    <Message variant='warning'>Not Delivered</Message>
                                )
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>

                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                                
                            </p>

                            {order.isPaid ? (
                                    <Message variant='success'>Paid on {order.paidAt.substring(0,10)}</Message>
                                ) : (
                                    <Message variant='warning'>Not paid</Message>
                                )
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>

                            {order.orderItems.length === 0 ? <Message variant='info'>
                                Orderis empty
                                </Message>
                                : (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) => (
                                            <ListGroup.Item className='px-0' key={index}>
                                                <Row>
                                                    <Col md={2}>
                                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                                    </Col>

                                                    <Col>
                                                        <Link to={`product/${item.product}`}>{item.name}</Link>
                                                    </Col>

                                                    <Col md={4}>
                                                        {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ) )}
                                    </ListGroup>
                                )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items: </Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item className='d-flex justify-content-center'>
                                    {loadingPay && <Loader/>}

                                    {!sdkReady ? ( 
                                        <Loader /> ) : (
                                            <PayPalButton 
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}    
                                            />
                                        )
                                    }
                                </ListGroup.Item>
                            )}

                        </ListGroup>

                        {loadingDeliver && <Loader/>}

                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button type='button' className='btn-block w-100'
                                    onClick={deliverHandler}>
                                    Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen
