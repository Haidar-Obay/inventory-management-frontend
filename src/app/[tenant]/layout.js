export default function TenantLayout({ children }) {
  return (
    <>
      <header>Tenant Header</header>
      <main>{children}</main>
    </>
  );
}
