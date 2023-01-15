import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../actions/userActions'
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer'

const RegisterScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const redirect = new URLSearchParams(useLocation().search).get('redirect')

    // Get user data from redux state
    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister

    useEffect(() => {

        if (userInfo) {

            navigate(redirect ? redirect : '/')
        }

    }, [navigate, redirect, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')   

        } else {
            dispatch(register(name, email, password))
        }
    }

    if (loading) {
        return <Loader/>
    }

    return (
        <FormContainer>
            <h1>Sign in</h1>   
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}         
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control required type='name' placeholder='Enter Name' value={name}
                        onChange={(e) => setName(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control required type='email' placeholder='Enter Email' value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId='password' className='mt-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type='password' placeholder='Enter Password' value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId='password-confirm' className='mt-3'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control required type='password' placeholder='Confirm Password' value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
                </Form.Group>

                <Button type='submit' variant='primary mt-4'>Register</Button>
            </Form>

            <Row className='py-3'>
                <Col>Have an Account? <Link 
                    to={redirect ? `/login?redirect=${redirect}` : '/login'}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen
