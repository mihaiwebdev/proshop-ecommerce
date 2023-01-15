import { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate'


const ProductListScreen = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, pages, page } = productList

    const productDelete = useSelector(state => state.productDelete)
    const { success: deleteSuccess, loading:loadingDelete, error:errorDelete } = productDelete
    
    const productCreate = useSelector(state => state.productCreate)
    const {success: successCreate, loading: loadingCreate,
        error: errorCreate, product: createdProduct} = productCreate
        
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    let keyword = location.search

    useEffect(() => {

        dispatch({type: 'PRODUCT_CREATE_RESET'})

        if (!userInfo.isAdmin) {
            navigate('/login')
        } 

        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`)

        } else {
            dispatch(listProducts(keyword))
        }

    }, [dispatch, navigate, keyword, userInfo, deleteSuccess, createdProduct, successCreate])

    const deleteHandler = (id) => {
        
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id))
        }

    }

    const createProductHandler = () => {
        dispatch(createProduct())
    }

    if (loading) {
        return <Loader/>
    }

    if (error) {
        return <Message variant='danger'>{error}</Message>
    }

    return (
        <div>
            <Row className='align-items-center'>
                <Col><h1>Products</h1></Col>

                <Col className='d-flex justify-content-end'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Product 
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            <div>
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {products && products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>

                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>

                                    <Button variant='danger' className='btn-sm mt-1 mt-lg-0 ms-lg-2'
                                        onClick={() => deleteHandler(product._id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Paginate pages={pages} page={page} isAdmin={true}/>
            </div>
        </div>
    )
}

export default ProductListScreen
