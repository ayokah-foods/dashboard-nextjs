import OrdersTable from "../components/OrdersTable";

export default function DeliveredOrders() {
    return (
        <div>
             <h1 className="text-2xl font-bold text-gray-950">Delivered Orders</h1>
            <p className="text-sm text-gray-500">Manage your delivered orders here.</p>
            <div className="space-y-6 mt-6"> 

                <OrdersTable limit={10} status="delivered" />

            </div>
         </div>
    );
}