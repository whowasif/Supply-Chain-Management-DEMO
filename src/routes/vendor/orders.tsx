import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vendor/orders")({
  component: () => <Navigate to="/vendor/deliveries" />,
});
