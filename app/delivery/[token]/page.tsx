import { getDeliveryByToken, markDeliveryComplete } from "@/app/actions/delivery";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function DeliveryTrackingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const assignment = await getDeliveryByToken(token);

  if (!assignment) {
    return notFound();
  }

  const { order, driver, items } = assignment;
  const isCompleted = assignment.status === "delivered";

  // Google Maps navigation link
  const mapsQuery = encodeURIComponent(`${order.delivery_address}, ${order.city}`);
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-[#E63946] font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">Abraham's Table</h1>
            <p className="text-xs text-gray-500">Delivery Tracking</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isCompleted ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
          {isCompleted ? "Completed" : "In Progress"}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full flex flex-col gap-4">
        
        {/* Driver Welcome */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Assigned Driver</p>
          <p className="font-bold text-gray-900 text-lg">{driver.name}</p>
        </div>

        {/* Customer Info */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Customer Details</p>
              <h2 className="font-bold text-gray-900 text-xl">{order.customer_name}</h2>
              <p className="text-gray-600 font-medium">{order.phone}</p>
            </div>
            <a 
              href={`tel:${order.phone.replace(/[^0-9+]/g, '')}`}
              className="bg-green-100 text-green-700 p-3 rounded-full hover:bg-green-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </a>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
            <p className="font-medium text-gray-900">{order.delivery_address}</p>
            <p className="font-medium text-gray-900">{order.city}</p>
          </div>

          <a 
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-bold py-3 px-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Open in Google Maps
          </a>
        </div>

        {/* Order Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">Order #{order.order_number}</p>
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded uppercase">
              {order.payment_method}
            </span>
          </div>
          
          <ul className="space-y-3 mb-4">
            {items.map((item: any) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">{item.quantity}x {item.item_name}</span>
                <span className="text-gray-600">Rs {item.price}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total to Collect</span>
            <span className="font-bold text-xl text-[#E63946]">Rs {order.grand_total}</span>
          </div>
        </div>

      </main>

      {/* Sticky Bottom Action */}
      {!isCompleted && (
        <div className="bg-white border-t border-gray-100 p-4 sticky bottom-0 z-10 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
          <form action={async () => {
            "use server";
            await markDeliveryComplete(token);
          }}>
            <button 
              type="submit"
              className="w-full bg-[#E63946] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Mark as Delivered
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
