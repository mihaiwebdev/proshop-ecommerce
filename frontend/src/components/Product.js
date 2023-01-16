import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'


const Product = ({ product }) => {

    let newName = ''

    if (product.name.length > 21) {

        const cuttedName = product.name.substring(0, 21).split(' ')

        newName = cuttedName.filter((word, idx, arr) =>  word !== arr[arr.length - 1]).join(' ')
        
    } else {
        newName = product.name
    }

    return (
        <Card className='my-3 rounded'>
            <Link to={`/product/${product._id}`}>
                    <Card.Img src={product.image} className='rounded-top'/>
            </Link>

            <Card.Body>
                <Link to={`/product/${product._id}`}>
                        <Card.Title as='div'>
                            <strong>{newName}</strong>
                        </Card.Title>
                </Link>

                <Card.Text as='div'>
                    <div className='my-3'>
                        <Rating value={product.rating} color={'#f8e825'}
                            text={`${product.numReviews} reviews`}/>
                    </div>
                </Card.Text>

                <Card.Text as='h3'>
                    ${product.price}
                </Card.Text>

            </Card.Body>
            
        </Card>
    )
}

export default Product
