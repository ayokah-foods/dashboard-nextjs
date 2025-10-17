import OrdersTable from "../components/OrdersTable";

export default function CancelledOrders() {
    return (
        <div>
             <h1 className="text-2xl font-bold text-gray-950">Cancelled Orders</h1>
            <p className="text-sm text-gray-500">Manage your cancelled orders here.</p>
            <div className="space-y-6 mt-6"> 

                <OrdersTable limit={10} status="cancelled" />

            </div>
         </div>
    );
}