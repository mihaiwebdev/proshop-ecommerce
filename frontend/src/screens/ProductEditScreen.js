import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, updateProduct } from '../actions/productActions'
import axios from 'axios'
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer'


const ProductEditScreen = () => {

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    
    const { id } = useParams()
    const dispatch = useDispatch()

    const navigate = useNavigate()

    // Get product data from redux state
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    // Get updated product data from redux state
    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: updateLoading, error: updateError , success: updateSuccess } = productUpdate


    useEffect(() => {

        if (updateSuccess) {
            dispatch({type: 'PRODUCT_UPDATE_RESET'})
            navigate('/admin/productlist')

        } else {

            if (!product.name || product._id !== Number(id)) {
                dispatch(listProductDetails(id))
    
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }

    }, [id, product, dispatch, navigate, updateSuccess])


    const uploadFileHandler = async (e) => {

        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        formData.append('product_id', id)

        setUploading(true)

        try {

            const config = {
                headers: {
                    'Content-type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post(
                `/api/products/upload/`,
                formData,
                config,
            )
            
            setImage(data)
            setUploading(false)

        } catch (error) {
            setUploading(false)
        }
    }


    const submitHandler = (e) => {
        e.preventDefault()
        
        dispatch(updateProduct({
            _id:id,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }))
        
    }

    return (
        <div>
            <Link to='/admin/productlist'>Go Back</Link>
            <FormContainer>
                <h1>Edit Product</h1>

               {updateLoading && <Loader/>}
               {updateError && <Message variant='danger'>{updateError}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='name' placeholder='Enter Name' value={name}
                                    onChange={(e) => setName(e.target.value)}/>
                            </Form.Group>

                            <Form.Group controlId='price'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control type='number' placeholder='Enter Price' value={price}
                                    onChange={(e) => setPrice(e.target.value)}/>
                            </Form.Group>

                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control type='text' placeholder='Enter Image' value={image}
                                    onChange={(e) => setImage(e.target.value)}/>

                                <Form.Control type='file' label='Choose File'
                                    custom='true' onChange={uploadFileHandler} />

                                {uploading && <Loader />}
                            </Form.Group>

                            <Form.Group controlId='brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control type='text' placeholder='Enter Brand' value={brand}
                                    onChange={(e) => setBrand(e.target.value)}/>
                            </Form.Group>

                            <Form.Group controlId='countinstock'>
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type='number' placeholder='Enter stock' value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}/>
                            </Form.Group>

                            <Form.Group controlId='category'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control type='text' placeholder='Enter category' value={category}
                                    onChange={(e) => setCategory(e.target.value)}/>
                            </Form.Group>

                            <Form.Group controlId='description'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control type='text' placeholder='Enter description' value={description}
                                    onChange={(e) => setDescription(e.target.value)}/>
                            </Form.Group>

                            <Button type='submit' variant='primary mt-4'>Update</Button>
                        </Form>
                    )
                }
                

            </FormContainer>
        </div>
    )
}

export default ProductEditScreen
