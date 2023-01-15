import { Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'


const Paginate = ({pages, page, keyword = '', isAdmin = false}) => {

    
    if (keyword) {
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }

    
    useEffect(() => {
        
        const paginateBtn = document.querySelectorAll('#paginate-btn')

        if (paginateBtn) {
            paginateBtn.forEach(btn => {

                if (btn.dataset.active === 'true') {

                    btn.style.background = '#ddd'
                }          
            })
       }

    }, [])

    
    return (
        pages > 1 && (
            <Pagination>
                {
                    [...Array(pages).keys()].map(x => (

                        <Link key={x + 1} to={!isAdmin ? `/?keyword=${keyword}&page=${x + 1}` 
                                              : `/admin/productlist/?keyword=${keyword}&page=${x + 1}` }>
                            <button id='paginate-btn' data-active={(x + 1 === page).toString()}>
                                { x + 1 }
                            </button>
                        </Link>
                    ))
                }
            </Pagination>
        )
    )
}

export default Paginate
