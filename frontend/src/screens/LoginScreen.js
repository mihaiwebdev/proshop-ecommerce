import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/userActions'
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer'

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const redirect = new URLSearchParams(useLocation().search).get('redirect')

    // Get user data from redux state
    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin

    useEffect(() => {

        if (userInfo) {

            navigate(redirect ? redirect : '/')
        }

    }, [navigate, redirect, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()

        dispatch(login(email, password))
    }

    if (loading) {
        return <Loader/>
    }

    return (
        <FormContainer>
            <h1>Sign in</h1>   
            {error && <Message variant='danger'>{error}</Message>}         
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId='password' className='mt-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter Password' value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>

                <Button type='submit' variant='primary mt-4'>Sign in</Button>
            </Form>

            <Row className='py-3'>
                <Col>New Customer? <Link 
                    to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
