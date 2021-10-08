import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useState, useEffect } from "react";
import { RiCloseCircleLine } from 'react-icons/ri'
import { Button, CustomInput, Form } from 'reactstrap';
import { formatter } from "../../components/Formatter";
import { get, endpointPublic, endpointAdmin, putWithAuth } from "../../components/HttpUtils";
import { toast } from 'react-toastify';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { messages } from '../../components/message';

toast.configure();
const PopupAccessories = ({ phoneId, phoneName, disabled }) => {
    const [accessoriesOwning, setAccessoriesOwning] = useState([]);
    const [accessoriesList, setAccessoriesList] = useState([]);
    const [checkboxSelect, setCheckboxSelect] = useState(false);
    const [listAccessoryIds, setListAccessoriesIds] = useState([]);

    const fetchAllAccessoriesOfProduct = async () => {
        await get(endpointPublic + "/products/" + phoneId + "/list-accessories").then((response) => {
            if (response.status === 200) {
                setAccessoriesOwning(response.data);
            }
        })
    }

    useEffect(() => {
        fetchAllAccessories();
        fetchAllAccessoriesOfProduct().then(() => getListAccessoryIdOfProduct());
    }, []);

    const getListAccessoryIdOfProduct = () => {
        let tempList = [];
        for (let index = 0; index < accessoriesOwning.length; index++) {
            var foundIndex = listAccessoryIds.findIndex(function (o) {
                return o.productId === accessoriesOwning[index].productId;
            })
            if (foundIndex < 0) {
                tempList.push(accessoriesOwning[index].productId);
                console.log("Index id: " + accessoriesOwning[index].productId);
            }
        }

        setListAccessoriesIds(tempList);
    }

    const deleteAccessoriesInTable = (id) => {
        var tempList = [...accessoriesOwning];
        var index = tempList.findIndex(function (o) {
            return o.productId === id;
        })

        if (index !== -1) tempList.splice(index, 1)
        setAccessoriesOwning(tempList);

        var tempListIds = [...listAccessoryIds];
        var indexInListIds = tempList.findIndex(function (o) {
            return o.productId === id;
        })
        if (indexInListIds !== -1) tempListIds.splice(index, 1)
        setListAccessoriesIds(tempListIds);
    }

    const renderWhenNoAccessories = () => {
        return (
            <p>Sản phẩm chưa có phụ kiện</p>
        )
    }

    const fetchAllAccessories = () => {
        get(endpointPublic + "/products/accessories").then((response) => {
            if (response.status === 200) {
                setAccessoriesList(response.data);
                console.log("Get all accessories")
            }
        })
    }

    // const handleCheckBoxChange = (event, id) => {
    //     let addNew = event.target.checked;

    //     // var tempListAll = [...accessoriesList];
    //     var tempList = [...listAccessoryIds];
    //     var index = tempList.findIndex(function (o) {
    //         return o.productId === id;
    //     })

    //     if (addNew === true && index < 0) {
    //         tempList.push(id);
    //     }
    //     else if (addNew === false) {
    //         var index = tempList.findIndex(function (o) {
    //             return o.productId === id;
    //         })
    //         if (index >= 0) {
    //             tempList.splice(index, 1);
    //         }
    //     }
    //     setListAccessoriesIds(tempList);
    //     console.log("HANDLE - Id = " + id)
    // }

    const handleCheckBoxChange = (event, product) => {
        let addNew = event.target.checked;
        var tempList = [...accessoriesOwning];
        var index = tempList.findIndex(function (o) {
            return o.productId === product.productId;
        })

        if (index < 0) {
            tempList.push(product);
        }
        setAccessoriesOwning(tempList);
    }

    const submit = (event) => {
        event.preventDefault();
        let arrAccessories = [];
        for (let index = 0; index < accessoriesOwning.length; index++) {
            arrAccessories.push(accessoriesOwning[index].productId);
        }
        const body = { "accessoriesIdList": arrAccessories }
        console.log("Submit list ids: " + JSON.stringify(body));

        putWithAuth(endpointAdmin + "/products/phones/" + phoneId + "/add-accessories", body).then((response) => {
            if (response.status === 200 || response.status === 201) {
                console.log(messages.updateSuccess);
                toast.success(messages.updateSuccess, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });

                fetchAllAccessoriesOfProduct();
            }
        }).catch(error => {
            toast.error(messages.insertFailed, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            console.log("error updating product: " + error);
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        })
    }

    const renderWhenHaveAccessories = () => {
        return (
            <div style={{
                maxHeight: 'calc(100vh - 210px)',
                overflowY: 'auto'
            }}>
                <h3 align="center">DANH SACH TAT CA PHU KIEN</h3>
                {/* <Button color="warning" style={{ float: "right" }} onChange={addAccessories}>THÊM PHỤ KIỆN</Button> */}
                <br />
                <Form onSubmit={(e) => submit(e)}>
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
                            {accessoriesList.map((product) => (
                                <tr key={product.productId} id={"row-accessory-" + product.productId}>
                                    <td>{product.productId}</td>
                                    <td>{product.productName}</td>
                                    <td>{formatter.format(product.unitPrice)}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.discount * 100}%</td>
                                    <td>{product.categoryName}</td>
                                    <td>{product.manufacturerName}</td>
                                    <td><CustomInput type="checkbox" id="checkboxSelect" onChange={(e) => handleCheckBoxChange(e, product)}
                                        name="checkboxSelect" defaultChecked={checkboxSelect}>
                                    </CustomInput>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />
                    <h3 align="center">DANH SACH PHU KIEN DANG CO</h3>
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
                                <tr key={product.productId} id={"row-accessory-" + product.productId}>
                                    <td>{product.productId}</td>
                                    <td>{product.productName}</td>
                                    <td>{formatter.format(product.unitPrice)}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.discount * 100}%</td>
                                    <td>{product.categoryName}</td>
                                    <td>{product.manufacturerName}</td>
                                    <td><RiCloseCircleLine color="red" onClick={() => deleteAccessoriesInTable(product.productId)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button color="primary" type="submit" style={{ float: "right" }}>CẬP NHẬT</Button>
                </Form>
            </div>
        );
    }

    return (
        <div style={disabled ? { pointerEvents: "none", opacity: "0.4" } : {}}>
            <Popup trigger={<AiOutlineAppstoreAdd color="blue"></AiOutlineAppstoreAdd>}
                position="right center" modal nested>
                <div>
                    <h5>Mã điện thoại: {phoneId}</h5>
                    <h5>Tên điện thoại: {phoneName}</h5>
                    <br />
                    {accessoriesOwning.length === 0 ? renderWhenNoAccessories() : renderWhenHaveAccessories()}
                </div>
            </Popup>
        </div>
    );
}

export default PopupAccessories;