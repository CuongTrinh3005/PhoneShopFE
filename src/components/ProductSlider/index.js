import Carousel from 'react-elastic-carousel';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';
import { formatter } from '../Formatter';
import { useHistory } from 'react-router-dom';
import "./style.css"

const ProductSlider = ({ title, productList, reload }) => {
    const history = useHistory();

    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 2, itemsToScroll: 2 },
        { width: 768, itemsToShow: 3 },
        { width: 1200, itemsToShow: 4 }
    ];

    const onClickToProductDetail = (product) => {
        history.push(`/detail/` + product.productId);
        if (reload)
            window.location.reload();
    }

    return (
        <div>
            <h5>{title}</h5>
            <Carousel breakPoints={breakPoints}>
                {productList.map((product) => (
                    <Card key={product.productId} className="product-item item" onClick={() => onClickToProductDetail(product)}>
                        {(product.image === null || product.image === '')
                            ? <div><CardImg style={{ width: "100%" }, { height: "200px" }} src={window.location.origin + '/product-default.png'} /></div>
                            : <div><CardImg style={{ width: "100%" }, { height: "200px" }} src={`data:image/jpeg;base64,${product.image}`}></CardImg></div>}
                        <CardBody>
                            <CardTitle className="title" tag="h5">{product.productName}</CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">{formatter.format(product.unitPrice)}</CardSubtitle>
                            <CardText></CardText>
                        </CardBody>
                    </Card>
                ))}
            </Carousel>
        </div>
    );
}

export default ProductSlider;