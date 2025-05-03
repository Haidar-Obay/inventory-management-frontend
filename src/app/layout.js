// app/layout.js
import "./globals.css";

export default function RootLayout({ children }) {
    return (
      <html>
  <body>{children}</body>
</html>
    );
  }