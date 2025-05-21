import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { authService } from "../../services/auth"
import { orderService } from "../../services/orders"
import styles from "./page.module.css"

export default function Profile(){
    const { logout } = authService() 
    const { getUserOrders, orderLoading, refetchOrders, ordersList } = orderService()
    const navigate = useNavigate()
    const authData = JSON.parse(localStorage.getItem('auth'))


    useEffect(() => {
        if(!authData) {
           navigate('/auth')
        } else if(refetchOrders) {
            getUserOrders(authData?.user?._id)
        }
    }, [authData, refetchOrders])

    if(orderLoading){
        return( <h1>Loading...</h1>)
    }

    const handleLogout = () => {
        logout()
        return navigate('/')
    }

    console.log(ordersList)

    return(
        <div className={styles.pageContainer}>
            <div>
                <h1>{authData?.user?.fullname}</h1>
                <h3>{authData?.user?.email}</h3>
            </div>
            <button onClick={handleLogout}>Logout</button>

            {ordersList.length > 0 ?
                <div className={styles.ordersContainer}>
                    {ordersList.map((order) => (
                        <div key={order._id} className={styles.orderContainer}>
                            <p>{order.pickupStatus}</p>
                            <h3>{order.pickupTime}</h3>
                            {order.orderItems.map((item) => (
                                <div key={item._id}>
                                    <h4>{item.itemDetails[0].name}</h4>
                                    <p>Quantity: { item.quantity }</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                :
                <div>
                    You do not have orders yet
                </div>
            }
        </div>
        
    )
}