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
    const [query, setQuery] = useState("");
    const [displayList, setDisplayList] = useState([]);
    const [listAccessoryIds, setListAccessoriesIds] = useState([]);

    var checkBoxManager = {};
    const fetchAllAccessoriesOfProduct = async () => {
        await get(endpointPublic + "/products/" + phoneId + "/list-accessories").then((response) => {
            if (response.status === 200) {
                setAccessoriesOwning(response.data);
                setDisplayList(response.data);
            }
        })
    }

    useEffect(() => {
        fetchAllAccessoriesOfProduct().then(() => { getListAccessoryIdOfProduct(); fetchAllAccessories(); });
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
        var tempList = [...displayList];
        var index = tempList.findIndex(function (o) {
            return o.productId === id;
        })
        if (index !== -1) tempList.splice(index, 1)
        setDisplayList(tempList);

        document.getElementById("checkbox-" + id).checked = false;
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

    const handleCheckBoxChange = (event, product) => {
        checkBoxManager[product.productId] = event.target.checked;
        // if(event)
        if (event.target.checked) {
            var tempList = [...displayList];
            var index = tempList.findIndex(function (o) {
                return o.productId === product.productId;
            })

            if (index < 0) {
                tempList.push(product);
            }
            setDisplayList(tempList);
        }
        else {
            deleteAccessoriesInTable(product.productId);
        }
    }

    const submit = (event) => {
        event.preventDefault();
        let arrAccessories = [];
        for (let index = 0; index < displayList.length; index++) {
            arrAccessories.push(displayList[index].productId);
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

    const checkIfAccessoryIsAlreadyHad = (id) => {
        var tempList = [...displayList];
        var index = tempList.findIndex(function (o) {
            return o.productId === id;
        })

        if (index >= 0) {
            return true;
        }
        return false;
    }

    const onSearch = (event) => {
        let query = event.target.value.toLowerCase().trim();
        setQuery(query);
    }

    var currentList = [...accessoriesList];
    if (query !== '') {
        currentList = accessoriesList.filter((product) => product['productId'].toLowerCase().includes(query)
            || product['productName'].toLowerCase().includes(query)
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
                    {accessoriesOwning.length === 0 && renderWhenNoAccessories()}
                    <div style={{
                        maxHeight: 'calc(100vh - 210px)',
                        overflowY: 'auto'
                    }}>
                        <h3 align="center">DANH SÁCH TẤT CẢ PHỤ KIỆN</h3>
                        <br />
                        <input type="search" placeholder="Nhập tên hoặc mã phụ kiện" onChange={onSearch}
                            style={{ width: "14rem" }} />
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
                                    {currentList.map((product) => (
                                        <tr key={product.productId} id={"row-accessory-" + product.productId}
                                            style={checkIfAccessoryIsAlreadyHad(product.productId) ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                                            <td>{product.productId}</td>
                                            <td>{product.productName}</td>
                                            <td>{formatter.format(product.unitPrice)}</td>
                                            <td>{product.quantity}</td>
                                            <td>{product.discount * 100}%</td>
                                            <td>{product.categoryName}</td>
                                            <td>{product.manufacturerName}</td>
                                            <td><CustomInput type="checkbox" id={"checkbox-" + product.productId} onChange={(e) => handleCheckBoxChange(e, product)}
                                                name="checkboxSelect" defaultChecked={checkBoxManager[product.productId]}
                                                checked={checkBoxManager[product.productId]}>
                                            </CustomInput>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <br />
                            <h3 align="center">DANH SÁCH PHỤ KIỆN ĐANG CÓ</h3>
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
                                    {displayList.map((product) => (
                                        <tr key={product.productId}>
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
                </div>
            </Popup>
        </div>
    );
}

export default PopupAccessories;