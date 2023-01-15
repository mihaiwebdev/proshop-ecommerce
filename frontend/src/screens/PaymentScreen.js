import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../actions/cartActions'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'


const PaymentScreen = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const [paymentMethod, setPaymentMethod] = useState('Paypal')

    if (!shippingAddress) {
        navigate('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault()

        dispatch(savePaymentMethod(paymentMethod))

        navigate('/placeorder')
        
    }


    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />

            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check type='radio' label='PayPal or Credit Card' 
                            id='paypal' name='paymentMethod' checked 
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary' className='mt-4'>Continue</Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
