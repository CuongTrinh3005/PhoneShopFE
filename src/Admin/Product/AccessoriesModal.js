import { useState, useEffect } from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { RiCloseCircleLine } from 'react-icons/ri'
import { Button, Modal, Form, ModalHeader, Input, FormGroup, Label, ModalBody, ModalFooter } from 'reactstrap';
import { formatter } from "../../components/Formatter";
import { get, endpointPublic } from "../../components/HttpUtils";

const AccessoriesModal = ({ phoneId, phoneName }) => {
    const [modal, setModal] = useState(false);
    const [errors, setErrors] = useState({})
    const [accessoriesOwning, setAccessoriesOwning] = useState([]);

    const toggle = () => setModal(!modal);

    const fetchAllAccessoriesOfProduct = () => {
        get(endpointPublic + "/products/" + phoneId + "list-accessories").then((response) => {
            if (response.status === 200) {
                setAccessoriesOwning(response.data);
            }
        })
    }

    useEffect(() => {
        fetchAllAccessoriesOfProduct();
    }, []);

    return (
        <div>
            <AiOutlineAppstoreAdd color="blue" onClick={toggle}></AiOutlineAppstoreAdd>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>DANH SÁCH PHỤ KIỆN</ModalHeader>
                <h5 style={{ marginLeft: "1rem" }}>Mã điện thoại: {phoneId}</h5>
                <h5 style={{ marginLeft: "1rem" }}>Tên điện thoại: {phoneName}</h5>
                <ModalBody>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Giảm giá</th>
                                <th>Loại sản phẩm</th>
                                <th>Nhà sản xuất</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessoriesOwning.map((product) => (
                                <tr key={product.productId} id={"row-" + product.productId}>
                                    <td>{product.productId}</td>
                                    <td>{product.productName}</td>
                                    <td>{formatter.format(product.unitPrice)}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.discount * 100}%</td>
                                    <td>{product.categoryName}</td>
                                    <td>{product.manufacturerName}</td>
                                    <td><RiCloseCircleLine color="red" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" >OK</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default AccessoriesModal;