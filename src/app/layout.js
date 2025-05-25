export const metadata = {
  title: "Live Football Match Tracker",
  description: "Track live football matches and scores",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
