// import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Spinner from "@/components/ui/Spinner";
// import { api } from "@/lib/api";

// const PaymentCallback: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const reference = searchParams.get("reference") || searchParams.get("trxref");

//     if (!reference) {
//       navigate("/payment/failed");
//       return;
//     }

//     const verifyPayment = async () => {
//       try {
//         const data = await api.verifyPayment(reference);

//         if (data.success && data.status === "success") {
//           // ✅ redirect only after backend verifies + sends emails
//           navigate(`/payment/success?reference=${reference}`);
//         } else {
//           navigate(`/payment/failed?reference=${reference}`);
//         }
//       } catch (err) {
//         console.error("Verify error:", err);
//         navigate(`/payment/failed?reference=${reference}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyPayment();
//   }, [searchParams, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//         <Spinner size="w-12 h-12" />
//         <p className="mt-4 text-gray-700 font-medium">
//           Finalizing your payment, please wait...
//         </p>
//       </div>
//     );
//   }

//   return null; // nothing, since we redirect
// };

// export default PaymentCallback;
