import React, { Component } from 'react';
import { endpointPublic, get } from '../HttpUtils';

var url = "/books/categoryId/";
class Aside extends Component {
    state = { categoryList: [] }

    componentWillMount() {
        this.fetchCategories();
    }

    fetchCategories() {
        get(endpointPublic + "/categories").then((response) => {
            if (response.status === 200) {
                this.setState({ categoryList: response.data })
            }
        })
    }

    fetchBookByCategoryId = (categoryId) => {
        get(endpointPublic + "/books/category/" + categoryId).then((response) => {
            if (response.status === 200) {
                this.setState({ categoryList: response.data });
            }
        })
    }

    render() {
        return (
            <div>
                {/* <div className="panel panel-default" style={{ marginTop: "5rem" }}>
                    <div className="panel-heading" align="center"><b>TÌM KIẾM</b></div>
                    <div className="panel-body">
                        <form action="product/search.htm" method="post">
                            <input value="Search" name="keywords" className="form-control" placeholder="Keywords" />
                        </form>
                    </div>
                </div> */}

                <div className="panel panel-default" style={{ marginTop: "6rem" }}>
                    <div className="panel-heading" align="center"><b>THỂ LOẠI</b></div>
                    <div className="list-group">
                        {this.state.categoryList.map((cate) =>
                            <a key={cate.categoryId} href={url + cate.categoryId}
                                className="list-group-item">{cate.categoryName}</a>
                        )}

                    </div>
                </div>

                <div className="panel panel-default" style={{ marginTop: "2rem" }}>
                    <div className="panel-heading" align="center"><b>ĐẶC BIỆT</b></div>
                    <div className="list-group">
                        <a href="/feature/new" className="list-group-item">Hàng mới</a>
                        <a href="/feature/best-selling" className="list-group-item">Bán chạy</a>
                        <a href="/feature/top-view" className="list-group-item">Xem nhiều</a>
                        <a href="/feature/discount" className="list-group-item">Giảm giá</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Aside;