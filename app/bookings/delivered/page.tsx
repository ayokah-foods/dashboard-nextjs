import BookingsTable from "../components/BookingsTable";

export default function DeliveredBookings() {
    return (
        <div>
             <h1 className="text-2xl font-bold text-gray-950">Delivered Bookings</h1>
            <p className="text-sm text-gray-500">Manage your delivered bookings here.</p>
            <div className="space-y-6 mt-6"> 

                <BookingsTable limit={10} status="delivered" />

            </div>
         </div>
    );
}