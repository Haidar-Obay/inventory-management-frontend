export default function PublicLayout({ children }: { children: React.ReactNode }) {
    // No auth checks here – purely passthrough
    return children as any;
  }
  