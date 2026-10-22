import { Nav } from "@/components/nav/nav";

export function Header() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Nav />
    </>
  );
}

export default Header;
