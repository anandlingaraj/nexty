// app/help/layout.tsx
import { NavBar } from "@/components/layout/nav-bar";

export default function HelpLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">
            <div className="flex-1">
            <NavBar/>
            <div>{children}</div>
            </div>
        </div>

    );
}