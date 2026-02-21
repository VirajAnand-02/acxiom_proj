import { MermaidChart } from "@/components/MermaidChart";

const chart = `flowchart TD
  start(("START")) --> INDEX["INDEX"]
  INDEX --> LOGIN["LOGIN"]

  %% Top-level branches from LOGIN
  LOGIN --> VENDOR["VENDOR"]
  LOGIN --> ADMIN["ADMIN"]
  LOGIN --> USER["USER"]

  %% VENDOR column
  VENDOR --> V_MAIN["Main Page"]
  V_MAIN --> YOUR_ITEM["Your Item"]
  V_MAIN --> ADD_ITEM["Add New Item"]
  V_MAIN --> TRANSACTION["Transaction"]

  YOUR_ITEM --> INSERT["Insert"]
  YOUR_ITEM --> DELETE_ITEM["Delete"]

  ADD_ITEM --> PROD_STATUS["Product Status"]
  PROD_STATUS --> REQ_ITEM["Request Item"]
  REQ_ITEM --> VIEW_PRODUCT["View Product"]

  TRANSACTION --> USER_REQUEST["User Request"]

  %% ADMIN column
  ADMIN --> MAINT["Maintenance Menu\\n(Admin access only)"]
  MAINT --> ADMIN_ACTIONS["Add/Update Memberships\\nAdd/Update User, Vendor\\nUsers Management\\nVendor Management"]
  ADMIN_ACTIONS --> ADD_MEM["Add Membership for Vendor"]
  ADD_MEM --> UPDATE_MEM["Update Membership for Vendor"]

  %% USER column
  USER --> U_VENDOR["Vendor"]
  USER --> CART["Cart"]
  USER --> GUEST_LIST["Guest List"]
  USER --> ORDER_STATUS["Order Status"]

  CART --> PAYMENT["Payment"]
  PAYMENT --> TOTAL["Total Amount"]
  TOTAL --> CANCEL["Cancel"]

  GUEST_LIST --> G_UPDATE["Update"]
  G_UPDATE --> G_DELETE["Delete"]

  ORDER_STATUS --> CHECK_STATUS["Check Status"]`;

export default function ChartPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">System Flowchart</h1>
      <MermaidChart chart={chart} />
      <p className="text-sm text-slate-600">Reference views are available in <code>/public/views</code>.</p>
    </section>
  );
}
