import OrdersTable from "../components/OrdersTable";

export default function ReturnedOrders() {
    return (
        <div>
             <h1 className="text-2xl font-bold text-gray-950">Returned Orders</h1>
            <p className="text-sm text-gray-500">Manage your returned and refunded orders here.</p>
            <div className="space-y-6 mt-6"> 

                <OrdersTable limit={10} status="returned" />

            </div>
         </div>
    );
}