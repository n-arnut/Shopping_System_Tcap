"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Flex,
  message,
  Layout,
  notification,
  FloatButton,
  Typography,
  Modal,
  Space,
} from "antd";
const { Title } = Typography;
import Loading from "./components/loading";
import { QuestionCircleOutlined } from "@ant-design/icons";
const { Header, Content, Footer } = Layout;

export default function Home() {
  const [itemList, setItemList] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemCart, setItemCart] = useState([]);
  const [sum, setSum] = useState(0);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      // setLoading(true);
      const response = await fetch("http://localhost:3001/product");
      const data = await response.json();
      // console.log(data);
      setItemList(data);
      // setLoading(false);
    } catch (error) {
      alert("fetchList :", error);
      console.log(error);
    }
  };
  const fetchCart = async () => {
    try {
      // setLoading(true);
      const response = await fetch("http://localhost:3001/cart");
      const data = await response.json();
      // console.log("Fetch", data);
      setItemCart(data);
      let getSum = data.map((sum) => Number(sum.price));
      getSum = getSum.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      );
      // console.log("getSum", getSum);

      setSum(getSum.toFixed(2));
      // setLoading(false);
    } catch (error) {
      alert("fetchList :", error);
      console.log(error);
    }
  };
  // const postCart = async (item) => {
  //   console.log("item.product_id :", item.product_id);
  //   try {
  //     const raw = JSON.stringify({
  //       product_id: item.product_id,
  //     });

  //     const requestOptions = {
  //       method: "POST",
  //       headers: {"Content-Type":"application/json"},
  //       body: raw,
  //       redirect: "follow",
  //     };

  //     const response = await fetch(
  //       "http://localhost:3001/cart",
  //       requestOptions
  //     );
  //     const result = await response.text();
  //     console.log(result);

  //   } catch (error) {
  //     alert("fetchList error:", error);
  //     console.log(error);
  //   }
  // };

  const postCart = async (item) => {
    console.log("item.product_id :", item.product_id);

    try {
      const raw = JSON.stringify({
        product_id: item.product_id,
      });

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:3001/cart",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // console.log(result);
    } catch (error) {
      alert(`fetchCart error: ${error.message}`);
      console.log("fetchCart error:", error);
    }
  };

  const deletedCart = async (item) => {
    console.log("item.product_id :", item.product_id);
    try {
      const raw = JSON.stringify({
        product_id: item.product_id,
      });

      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:3001/cart",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      alert(`fetchCart error: ${error.message}`);
      console.log("fetchCart error:", error);
    }
  };
  const clearCartFetch = async () => {
    try {

      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:3001/cart/clear",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      alert(`clearCartFetch error: ${error.message}`);
      console.log("clearCartFetch error:", error);
    }
  };

  const fetchListByID = async (item) => {
    const product_id = item.product_id;
    try {
      // setLoading(true);
      const response = await fetch(
        `http://localhost:3001/product/${product_id}`
      );
      const data = await response.json();
      console.log("fetchListByID :", data);
      // setLoading(false);
      return data;
    } catch (error) {
      alert("fetchList :", error);
      console.log(error);
    }
  };

  const updateItem = async (item) => {
    let value = item.stock_count - 1;
    // console.log("discount : ", value);
    const raw = JSON.stringify({
      product_id: item.product_id,
      product_name: item.product_name,
      stock_count: value,
    });

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Assuming `myHeaders` include the Content-Type
        // Add any other headers here if necessary
      },
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://localhost:3001/product",
        requestOptions
      );
      console.log("response :", response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      return result;
    } catch (error) {
      alert("Error in updateItem:", error);
      console.error("Error in updateItem:", error);
    }
  };

  const openCart = () => {
    setOpen(true);
    fetchCart();
  };

  const addCart = async (item) => {
    await postCart(item);
    fetchCart();
  };
  const deleteCart = async (item) => {
    await deletedCart(item);
    fetchCart();
  };
  const cartClear = async () => {
    await clearCartFetch();
    openCart()
  };
  const cartSubmit = async () => {
    await clearCartFetch();
    setOpen(false);
  };

  const onSelect = async (item) => {
    let itemData = await fetchListByID(item);
    console.log("itemData.stock_count :", itemData);
    if (itemData[0].stock_count <= 0) {
      alert(`สินค้า ${itemData[0].product_name} คงเหลือไม่พอ`);
    } else {
      postCart(item);
    }
  };

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          background: "#4fa4e4",
        }}
      >
        <div
          style={{ display: "flex", justifyItems: "end", alignItems: "center" }}
        >
          <Button
            onClick={() => {
              openCart();
            }}
          >
            ตะกร้าสินค้า
          </Button>
        </div>
      </Header>
      <Content
        style={{
          padding: "0 48px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100hv",
        }}
      >
        <div
          style={{
            background: "#4fa4e4",
            minHeight: 280,
            marginTop: 20,
            padding: 24,
            borderRadius: 5,
          }}
        >
          <Flex wrap gap="large">
            {itemList && itemList.length > 0 ? (
              itemList.map((item) => {
                return (
                  <Card
                    hoverable
                    style={{
                      width: 240,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <h1 style={{ marginBottom: 5 }}>{item.product_name}</h1>
                      <h3 style={{ marginBottom: 5 }}>
                        ราคา : {item.price} บาท
                      </h3>
                      <Button onClick={() => onSelect(item)}>
                        เลือกสินค้า
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Loading />
            )}
          </Flex>
        </div>
      </Content>

      <Footer
        style={{
          textAlign: "center",
        }}
      >
        TCAP Company ©{new Date().getFullYear()} Created by Nut
      </Footer>

      <Modal
        title={<p>ตะกร้าสินค้า</p>}
        footer={[
          <p>ยอดรวม {sum} บาท</p>,
          <Button type="primary" onClick={() => cartSubmit()}>
            ชำระเงิน
          </Button>,
          <Button type="primary" onClick={() => cartClear()}>
            ลบรายการทั้งหมด
          </Button>,
        ]}
        open={open}
        onCancel={() => setOpen(false)}
      >
        {itemCart.length > 0 ? (
          itemCart.map((item, index) => {
            console.log("item :", item);
            return (
              <div
                style={{ marginBottom: 5, margin: 15 }}
                key={item.product_id}
              >
                <h5>ลำดับสินค้า : {index + 1}</h5>
                <p>รหัสสินค้า : {item.product_code}</p>
                <p>ชื่อสินค้า : {item.product_name}</p>
                <p>จำนวนสินค้า : {item.product_qty} ชิ้น</p>
                <p>ราคาสินค้า : {item.price} บาท</p>
                <Flex gap="small">
                  <Button size="small" onClick={() => addCart(item)}>
                    เพิ่ม
                  </Button>
                  <Button size="small" onClick={() => deleteCart(item)}>
                    ลด
                  </Button>
                </Flex>
              </div>
            );
          })
        ) : (
          <div style={{justifyItems: "center"}}>
            {/* <Loading /> */}
            <h2>ยังไม่มีรายการสินค้า</h2>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
